import { FutureData } from "$/data/api-futures";
import { Config } from "$/domain/entities/Config";

export interface ConfigRepository {
    get(): FutureData<Config>;
    update(config: Config): FutureData<void>;
}
