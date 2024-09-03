import { FutureData } from "$/data/api-futures";
import { DataSet } from "$/domain/entities/DataSet";
import { Id } from "$/domain/entities/Ref";
import { DataSetRepository } from "$/domain/repositories/DataSetRepository";
import _c from "$/domain/entities/generic/Collection";

export class GetDataSetsByIdsUseCase {
    constructor(private dataSetRepository: DataSetRepository) {}

    public execute(ids: Id[]): FutureData<DataSet[]> {
        return this.dataSetRepository.getByIds(ids);
    }
}
