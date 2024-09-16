import { apiToFuture, FutureData } from "$/data/api-futures";
import { configCodec } from "$/data/config-codec";
import { Config, defaultConfig } from "$/domain/entities/Config";
import { Future } from "$/domain/entities/generic/Future";
import { ConfigRepository } from "$/domain/repositories/ConfigRepository";
import { D2Api, MetadataPick } from "$/types/d2-api";
import i18n from "$/utils/i18n";

export class ConfigD2ConstantsRepository implements ConfigRepository {
    constructor(private api: D2Api) {}

    get(): FutureData<Config> {
        const constants$ = apiToFuture(
            this.api.models.constants.get({
                fields: constantFields,
                filter: { code: { eq: "TALLY_SHEETS_STORAGE" } },
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
                filter: { code: { eq: "TALLY_SHEETS_STORAGE" } },
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
            code: "TALLY_SHEETS_STORAGE",
            name: "Tally Sheets Storage",
            shortName: "Tally Sheets Storage",
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
                console.error(new Error(errorMessages.invalidJsonErrMsg + err));
                return Future.error(new Error(errorMessages.invalidJsonErrMsg));
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

const errorMessages = {
    constantsErrMsg: i18n.t("The TALLY_SHEETS_STORAGE constant is not defined."),
    invalidJsonErrMsg: i18n.t("The TALLY_SHEETS_STORAGE description is not a valid JSON object."),
} as const;

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
