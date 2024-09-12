import { FutureData } from "$/data/api-futures";
import { BasicDataSet } from "$/domain/entities/BasicDataSet";
import { DataSetRepository } from "$/domain/repositories/DataSetRepository";
import { OrgUnitRepository } from "$/domain/repositories/OrgUnitRepository";
import { Id } from "$/domain/entities/Ref";
import { Future } from "$/domain/entities/generic/Future";
import _c from "$/domain/entities/generic/Collection";

export class GetAllBasicDataSetsInfoUseCase {
    constructor(
        private dataSetRepository: DataSetRepository,
        private orgUnitRepository: OrgUnitRepository
    ) {}

    public execute(orgUnits: Id[]): FutureData<BasicDataSet[]> {
        if (_c(orgUnits).isEmpty()) return this.dataSetRepository.getBasic([]);

        const orgUnitsWithChildren$ = Future.parallel(
            orgUnits.map(id => this.orgUnitRepository.getWithChildren(id)),
            { concurrency: 10 }
        );

        const uniqOrgUnits$ = orgUnitsWithChildren$.map(orgUnits =>
            _c(orgUnits)
                .flatten()
                .uniqBy(ou => ou.id)
                .value()
        );

        return uniqOrgUnits$.flatMap(ous =>
            this.dataSetRepository.getBasic(ous.map(({ id }) => id))
        );
    }
}
