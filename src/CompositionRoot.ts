import { DataSetD2Repository } from "$/data/repositories/DataSetD2Repository";
import { LocaleD2Repository } from "$/data/repositories/LocaleD2Repository";
import { Future } from "$/domain/entities/generic/Future";
import { DataSetRepository } from "$/domain/repositories/DataSetRepository";
import { LocaleRepository } from "$/domain/repositories/LocaleRepository";
import { TestUseCase } from "$/domain/usecases/TestUseCase";
import { UserD2Repository } from "./data/repositories/UserD2Repository";
import { UserTestRepository } from "./data/repositories/UserTestRepository";
import { UserRepository } from "./domain/repositories/UserRepository";
import { GetCurrentUserUseCase } from "./domain/usecases/GetCurrentUserUseCase";
import { D2Api } from "./types/d2-api";

export type CompositionRoot = ReturnType<typeof getCompositionRoot>;

type Repositories = {
    usersRepository: UserRepository;
    dataSetRepository: DataSetRepository;
    localeRepository: LocaleRepository;
};

function getCompositionRoot(repositories: Repositories) {
    return {
        users: {
            getCurrent: new GetCurrentUserUseCase(repositories.usersRepository),
        },
        test: new TestUseCase(repositories.localeRepository),
    };
}

export function getWebappCompositionRoot(api: D2Api) {
    const repositories: Repositories = {
        usersRepository: new UserD2Repository(api),
        dataSetRepository: new DataSetD2Repository(api),
        localeRepository: new LocaleD2Repository(api),
    };

    return getCompositionRoot(repositories);
}

export function getTestCompositionRoot() {
    const repositories: Repositories = {
        usersRepository: new UserTestRepository(),
        dataSetRepository: { getByIds: () => Future.success([]), get: () => Future.success([]) },
        localeRepository: { get: () => Future.success([]) },
    };

    return getCompositionRoot(repositories);
}
