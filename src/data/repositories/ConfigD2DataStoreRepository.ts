import { apiToFuture, FutureData } from "$/data/api-futures";
import { configCodec } from "$/data/config-codec";
import { Config, defaultConfig } from "$/domain/entities/Config";
import { Future } from "$/domain/entities/generic/Future";
import { ConfigRepository } from "$/domain/repositories/ConfigRepository";
import { D2Api } from "$/types/d2-api";
import i18n from "$/utils/i18n";
import { DataStore } from "@eyeseetea/d2-api/api";

export class ConfigD2DataStoreRepository implements ConfigRepository {
    private namespace = "HMIS_Tally_Sheets";
    private configKey = "config";
    private dataStore: DataStore;

    constructor(private api: D2Api) {
        this.dataStore = this.api.dataStore(this.namespace);
    }

    get(): FutureData<Config> {
        const config$ = apiToFuture(this.dataStore.get<Config>(this.configKey));

        return config$.flatMap((config): FutureData<Config> => {
            if (!config) return this.create().map(() => defaultConfig);
            else return this.decodeConfig(config);
        });
    }

    update(config: Config): FutureData<void> {
        return this.create(config);
    }

    private create(config?: Config): FutureData<void> {
        return apiToFuture(this.dataStore.save(this.configKey, config ?? defaultConfig));
    }

    private decodeConfig(config: Config): FutureData<Config> {
        return configCodec.decode(config).caseOf({
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
