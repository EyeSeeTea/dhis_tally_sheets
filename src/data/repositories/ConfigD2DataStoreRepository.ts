import { DataStore } from "@eyeseetea/d2-api/api";
import { apiToFuture, FutureData } from "$/data/api-futures";
import { decodeConfig } from "$/data/config-codec";
import { Config, defaultConfig } from "$/domain/entities/Config";
import { Future } from "$/domain/entities/generic/Future";
import { ConfigRepository } from "$/domain/repositories/ConfigRepository";
import { D2Api } from "$/types/d2-api";
import { constants } from "$/data/repositories/d2-metadata";

export class ConfigD2DataStoreRepository implements ConfigRepository {
    private namespace = constants.datastoreNamespace;
    private configKey = constants.datastoreKey;
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

    private decodeConfig(config: unknown): FutureData<Config> {
        return Future.success(decodeConfig(config, this.namespace, this.configKey));
    }
}
