import { Repositories } from "$/CompositionRoot";
import { FutureData } from "$/data/api-futures";
import { Config } from "$/domain/entities/Config";
import { User } from "$/domain/entities/User";

export class GetCurrentUserUseCase {
    constructor(private repositories: Repositories) {}

    public execute(config: Config): FutureData<User> {
        return this.repositories.usersRepository.getCurrent({
            adminGroups: config.administratorGroups,
        });
    }
}
