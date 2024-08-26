import { FutureData } from "$/data/api-futures";
import { DataSet } from "$/domain/entities/DataSet";
import { Future } from "$/domain/entities/generic/Future";
import { Id } from "$/domain/entities/Ref";
import { DataSetRepository } from "$/domain/repositories/DataSetRepository";
import _c from "$/domain/entities/generic/Collection";

export class GetDataSetUseCase {
    constructor(private dataSetRepository: DataSetRepository) {}

    public execute(id: Id): FutureData<DataSet> {
        return this.dataSetRepository.getByIds([id]).flatMap(dataSets => {
            const dataSet = _c(dataSets).first();
            return dataSet ? Future.success(dataSet) : Future.error(new Error("DataSet not found"));
        });
    }
}
