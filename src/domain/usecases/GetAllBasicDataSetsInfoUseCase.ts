import { FutureData } from "$/data/api-futures";
import { BasicDataSet } from "$/domain/entities/BasicDataSet";
import { DataSetRepository } from "$/domain/repositories/DataSetRepository";
import { OrgUnit } from "$/domain/entities/OrgUnit";
import _c from "$/domain/entities/generic/Collection";

export class GetAllBasicDataSetsInfoUseCase {
    constructor(private dataSetRepository: DataSetRepository) {}

    public execute(orgUnits: OrgUnit[]): FutureData<BasicDataSet[]> {
        if (_c(orgUnits).isEmpty()) {
            return this.dataSetRepository.getBasic([]);
        } else {
            return this.dataSetRepository.getBasic(orgUnits.map(({ id }) => id));
        }
    }
}
