import { FutureData } from "$/data/api-futures";
import { Config } from "$/domain/entities/Config";
import { Future } from "$/domain/entities/generic/Future";
import { ConfigRepository } from "$/domain/repositories/ConfigRepository";
import { D2Api } from "$/types/d2-api";

export class ConfigD2DataStoreRepository implements ConfigRepository {
    constructor(private api: D2Api) {}

    get(): FutureData<Config> {
        return Future.error(new Error("Not implemented"));
    }

    update(_config: Config): FutureData<void> {
        return Future.error(new Error("Not implemented"));
    }
}
