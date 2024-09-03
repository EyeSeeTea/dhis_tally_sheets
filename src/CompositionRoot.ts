import { DataSetD2Repository } from "$/data/repositories/DataSetD2Repository";
import { DataSetExportSpreadsheetRepository } from "$/data/repositories/DataSetExportSpreadsheetRepository";
import { LocaleD2Repository } from "$/data/repositories/LocaleD2Repository";
import { DataSetExportRepository } from "$/domain/repositories/DataSetExportRepository";
import { DataSetRepository } from "$/domain/repositories/DataSetRepository";
import { LocaleRepository } from "$/domain/repositories/LocaleRepository";
import { ExportDataSetsUseCase } from "$/domain/usecases/ExportDataSetsUseCase";
import { GetAllBasicDataSetsInfoUseCase } from "$/domain/usecases/GetAllBasicDataSetsInfoUseCase";
import { GetDataSetsByIdsUseCase } from "$/domain/usecases/GetDataSetsByIdsUseCase";
import { GetLocalesUseCase } from "$/domain/usecases/GetLocalesUseCase";
import { UserD2Repository } from "./data/repositories/UserD2Repository";
import { UserTestRepository } from "./data/repositories/UserTestRepository";
import { UserRepository } from "./domain/repositories/UserRepository";
import { GetCurrentUserUseCase } from "./domain/usecases/GetCurrentUserUseCase";
import { D2Api } from "./types/d2-api";

export type CompositionRoot = ReturnType<typeof getCompositionRoot>;

type Repositories = {
    usersRepository: UserRepository;
    dataSetRepository: DataSetRepository;
    dataSetExportRepository: DataSetExportRepository;
    localeRepository: LocaleRepository;
};

function getCompositionRoot(repositories: Repositories) {
    return {
        users: {
            getCurrent: new GetCurrentUserUseCase(repositories.usersRepository),
        },
        dataSets: {
            getBasicList: new GetAllBasicDataSetsInfoUseCase(repositories.dataSetRepository),
            getByIds: new GetDataSetsByIdsUseCase(repositories.dataSetRepository),
            export: new ExportDataSetsUseCase(repositories.dataSetExportRepository),
        },
        locales: {
            get: new GetLocalesUseCase(repositories.localeRepository),
        },
    };
}

export function getWebappCompositionRoot(api: D2Api) {
    const repositories: Repositories = {
        usersRepository: new UserD2Repository(api),
        dataSetRepository: new DataSetD2Repository(api),
        localeRepository: new LocaleD2Repository(api),
        dataSetExportRepository: new DataSetExportSpreadsheetRepository(),
    };

    return getCompositionRoot(repositories);
}

export function getTestCompositionRoot() {
    const repositories: Repositories = {
        usersRepository: new UserTestRepository(),
        dataSetRepository: {
            getByIds: () => {
                throw new Error("Not implemented");
            },
            get: () => {
                throw new Error("Not implemented");
            },
            getBasic: () => {
                throw new Error("Not implemented");
            },
        },
        dataSetExportRepository: {
            exportDataSet: () => {
                throw new Error("Not implemented");
            },
        },
        localeRepository: {
            get: () => {
                throw new Error("Not implemented");
            },
        },
    };

    return getCompositionRoot(repositories);
}
