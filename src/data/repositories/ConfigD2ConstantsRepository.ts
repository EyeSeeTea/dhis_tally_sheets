import { apiToFuture, FutureData } from "$/data/api-futures";
import { configCodec } from "$/data/config-codec";
import { constants, errors } from "$/data/repositories/d2-metadata";
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
            if (!description) return this.create().map(() => defaultConfig);
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

        const config$ = this.decodeConfig(config);

        const req$ = Future.joinObj({
            constant: constant$,
            config: config$,
        });

        return req$.flatMap(({ constant, config }) => {
            if (!constant) return this.create();

            return this.create({
                ...constant,
                description: JSON.stringify(config),
            });
        });
    }

    private create(payload?: D2Constant): FutureData<void> {
        const defaultPayload = {
            code: constants.constantsStorageCode,
            name: constants.constantsStorageName,
            shortName: constants.constantsStorageName,
            description: JSON.stringify(defaultConfig),
            value: 1,
        };

        return apiToFuture(this.api.metadata.post({ constants: [payload ?? defaultPayload] })).map(
            _res => {}
        );
    }

    private decodeConfig(description: Config): FutureData<Config> {
        return configCodec.decode(description).caseOf({
            Left: (err): FutureData<Config> => {
                const errStr = errors.invalidJSON(constants.constantsStorageName, "description");
                console.error(new Error(errStr + err));
                return Future.error(new Error(errStr));
            },
            Right: (res): FutureData<Config> => {
                if ("sheetName" in res) return Future.success(res);
                return Future.success({
                    ...defaultConfig,
                    administratorGroups: res.administratorGroups,
                });
            },
        });
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
