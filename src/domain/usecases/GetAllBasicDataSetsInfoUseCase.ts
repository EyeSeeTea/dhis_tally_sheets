import { FutureData } from "$/data/api-futures";
import { BasicDataSet } from "$/domain/entities/BasicDataSet";
import { OrgUnit } from "$/domain/entities/OrgUnit";
import { Repositories } from "$/CompositionRoot";
import _c from "$/domain/entities/generic/Collection";

export class GetAllBasicDataSetsInfoUseCase {
    constructor(private repositories: Repositories) {}

    public execute(orgUnits: OrgUnit[]): FutureData<BasicDataSet[]> {
        if (_c(orgUnits).isEmpty()) {
            return this.repositories.dataSetRepository.getBasic([]);
        } else {
            return this.repositories.dataSetRepository.getBasic(orgUnits.map(({ id }) => id));
        }
    }
}
