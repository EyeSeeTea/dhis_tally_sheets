import { Repositories } from "$/CompositionRoot";
import { FutureData } from "$/data/api-futures";
import { User } from "$/domain/entities/User";

export class GetCurrentUserUseCase {
    constructor(private repositories: Repositories) {}

    public execute(): FutureData<User> {
        return this.repositories.usersRepository.getCurrent();
    }
}
