import { FutureData } from "$/data/api-futures";
import { BasicDataSet } from "$/domain/entities/BasicDataSet";
import { DataSetRepository } from "$/domain/repositories/DataSetRepository";

export class GetAllBasicDataSetsInfoUseCase {
    constructor(private dataSetRepository: DataSetRepository) {}

    public execute(): FutureData<BasicDataSet[]> {
        return this.dataSetRepository.getBasic();
    }
}
