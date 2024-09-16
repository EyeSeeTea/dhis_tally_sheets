import { Repositories } from "$/CompositionRoot";
import { FutureData } from "$/data/api-futures";
import { Config } from "$/domain/entities/Config";

export class GetConfigUseCase {
    constructor(private repositories: Repositories) {}

    public execute(): FutureData<Config> {
        return this.repositories.configRepository.get();
    }
}
