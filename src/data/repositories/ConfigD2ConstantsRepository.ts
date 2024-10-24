import { apiToFuture, FutureData } from "$/data/api-futures";
import { decodeConfig } from "$/data/config-codec";
import { constants } from "$/data/repositories/d2-metadata";
import { runMetadata } from "$/data/response";
import { Config, defaultConfig } from "$/domain/entities/Config";
import { Future } from "$/domain/entities/generic/Future";
import { ConfigRepository } from "$/domain/repositories/ConfigRepository";
import { D2Api, MetadataPick } from "$/types/d2-api";

export class ConfigD2ConstantsRepository implements ConfigRepository {
    constructor(private api: D2Api) {}

    get(): FutureData<Config> {
        const constants$ = apiToFuture(
            this.api.models.constants.get({
                fields: constantFields,
                filter: { code: { eq: constants.constantsStorageCode } },
                paging: false,
            })
        );

        const config$ = constants$.flatMap((res): FutureData<Config> => {
            const description = res.objects.at(0)?.description;
            if (!description) return this.createDefault();
            else return this.decodeConfig(JSON.parse(description));
        });

        return config$;
    }

    update(config: Config): FutureData<void> {
        const constant$ = apiToFuture(
            this.api.models.constants.get({
                fields: constantFields,
                filter: { code: { eq: constants.constantsStorageCode } },
                paging: false,
            })
        ).map(res => res.objects.at(0));

        return constant$
            .flatMap(constant => {
                if (!constant) return this.createDefault();

                return this.create({
                    ...constant,
                    description: JSON.stringify(config),
                });
            })
            .map(_config => {});
    }

    private create(payload: D2Constant): FutureData<Config> {
        return runMetadata(apiToFuture(this.api.metadata.post({ constants: [payload] }))).map(
            () => defaultConfig
        );
    }

    private createDefault(): FutureData<Config> {
        const defaultPayload = {
            code: constants.constantsStorageCode,
            name: constants.constantsStorageName,
            shortName: constants.constantsStorageName,
            description: JSON.stringify(defaultConfig),
            value: 1,
        };

        return runMetadata(
            apiToFuture(this.api.metadata.post({ constants: [defaultPayload] }))
        ).map(() => defaultConfig);
    }

    private decodeConfig(description: unknown): FutureData<Config> {
        return Future.success(
            decodeConfig(description, constants.constantsStorageName, "description")
        );
    }
}

const constantFields = {
    id: true,
    code: true,
    name: true,
    shortName: true,
    description: true,
    value: true,
} as const;

type D2Constant = MetadataPick<{
    constants: { fields: typeof constantFields };
}>["constants"][number];
