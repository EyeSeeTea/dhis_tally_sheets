import { Repositories } from "$/CompositionRoot";
import { FutureData } from "$/data/api-futures";
import { Config } from "$/domain/entities/Config";

export class UpdateConfigUseCase {
    constructor(private repositories: Repositories) {}

    public execute(config: Config): FutureData<Config> {
        // handle not being set already
        return this.repositories.configRepository.update(config);
    }
}
