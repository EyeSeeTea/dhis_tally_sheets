import { FutureData } from "$/data/api-futures";
import { BasicDataSet } from "$/domain/entities/BasicDataSet";
import { OrgUnit } from "$/domain/entities/OrgUnit";
import { Repositories } from "$/CompositionRoot";
import _ from "$/domain/entities/generic/Collection";
import { getId } from "$/domain/entities/Ref";

export class GetAllBasicDataSetsInfoUseCase {
    constructor(private repositories: Repositories) {}

    public execute(orgUnits: OrgUnit[]): FutureData<BasicDataSet[]> {
        if (_(orgUnits).isEmpty()) {
            return this.repositories.dataSetRepository.getBasic([]);
        } else {
            return this.repositories.dataSetRepository.getBasic(orgUnits.map(getId));
        }
    }
}
