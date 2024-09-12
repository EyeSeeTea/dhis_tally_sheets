import { FutureData } from "$/data/api-futures";
import { BasicDataSet } from "$/domain/entities/BasicDataSet";
import { DataSetRepository } from "$/domain/repositories/DataSetRepository";
import { OrgUnitRepository } from "$/domain/repositories/OrgUnitRepository";
import { Id } from "$/domain/entities/Ref";
import _c from "$/domain/entities/generic/Collection";

export class GetAllBasicDataSetsInfoUseCase {
    constructor(
        private dataSetRepository: DataSetRepository,
        private orgUnitRepository: OrgUnitRepository
    ) {}

    public execute(orgUnits: Id[]): FutureData<BasicDataSet[]> {
        if (_c(orgUnits).isEmpty()) return this.dataSetRepository.getBasic([]);

        const uniqOrgUnits$ = this.orgUnitRepository.getWithChildren(orgUnits);

        return uniqOrgUnits$.flatMap(ous =>
            this.dataSetRepository.getBasic(ous.map(({ id }) => id))
        );
    }
}
