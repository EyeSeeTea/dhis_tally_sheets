import { StorageSource } from "$/app-config";
import { ConfigD2ConstantsRepository } from "$/data/repositories/ConfigD2ConstantsRepository";
import { ConfigD2DataStoreRepository } from "$/data/repositories/ConfigD2DataStoreRepository";
import { DataSetD2Repository } from "$/data/repositories/DataSetD2Repository";
import { DataSetSpreadsheetRepository } from "$/data/repositories/DataSetSpreadsheetRepository";
import { LocaleD2Repository } from "$/data/repositories/LocaleD2Repository";
import { OrgUnitD2Repository } from "$/data/repositories/OrgUnitD2Repository";
import { ConfigRepository } from "$/domain/repositories/ConfigRepository";
import { DataSetExportRepository } from "$/domain/repositories/DataSetExportRepository";
import { DataSetRepository } from "$/domain/repositories/DataSetRepository";
import { LocaleRepository } from "$/domain/repositories/LocaleRepository";
import { OrgUnitRepository } from "$/domain/repositories/OrgUnitRepository";
import { ExportDataSetsUseCase } from "$/domain/usecases/ExportDataSetsUseCase";
import { GetAllBasicDataSetsInfoUseCase } from "$/domain/usecases/GetAllBasicDataSetsInfoUseCase";
import { GetDataSetsByIdsUseCase } from "$/domain/usecases/GetDataSetsByIdsUseCase";
import { GetLocalesUseCase } from "$/domain/usecases/GetLocalesUseCase";
import { GetOrgUnitsWithChildrenUseCase } from "$/domain/usecases/GetOrgUnitsWithChildrenUseCase";
import { UserD2Repository } from "./data/repositories/UserD2Repository";
import { UserTestRepository } from "./data/repositories/UserTestRepository";
import { UserRepository } from "./domain/repositories/UserRepository";
import { GetCurrentUserUseCase } from "./domain/usecases/GetCurrentUserUseCase";
import { D2Api } from "./types/d2-api";

export type CompositionRoot = ReturnType<typeof getCompositionRoot>;

export type Repositories = {
    configRepository: ConfigRepository;
    usersRepository: UserRepository;
    dataSetRepository: DataSetRepository;
    dataSetExportRepository: DataSetExportRepository;
    orgUnitRepository: OrgUnitRepository;
    localeRepository: LocaleRepository;
};

function getCompositionRoot(repositories: Repositories) {
    return {
        config: {
            get: () => {},
            update: () => {},
        },
        users: {
            getCurrent: new GetCurrentUserUseCase(repositories),
        },
        dataSets: {
            getBasicList: new GetAllBasicDataSetsInfoUseCase(repositories),
            getByIds: new GetDataSetsByIdsUseCase(repositories),
            export: new ExportDataSetsUseCase(repositories),
        },
        locales: {
            get: new GetLocalesUseCase(repositories),
        },
        orgUnits: {
            getWithChildren: new GetOrgUnitsWithChildrenUseCase(repositories),
        },
    };
}

export function getWebappCompositionRoot(api: D2Api, storage: StorageSource) {
    const repositories: Repositories = {
        configRepository:
            storage === "constants"
                ? new ConfigD2ConstantsRepository(api)
                : new ConfigD2DataStoreRepository(api),
        usersRepository: new UserD2Repository(api),
        dataSetRepository: new DataSetD2Repository(api),
        localeRepository: new LocaleD2Repository(api),
        orgUnitRepository: new OrgUnitD2Repository(api),
        dataSetExportRepository: new DataSetSpreadsheetRepository(),
    };

    return getCompositionRoot(repositories);
}

export function getTestCompositionRoot() {
    const repositories: Repositories = {
        configRepository: {
            get: () => {
                throw new Error("Not implemented");
            },
            update: () => {
                throw new Error("Not implemented");
            },
        },
        usersRepository: new UserTestRepository(),
        orgUnitRepository: {
            getWithChildren: () => {
                throw new Error("Not implemented");
            },
        },
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
            save: () => {
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
