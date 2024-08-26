import { FutureData } from "$/data/api-futures";
import { DataSet } from "$/domain/entities/DataSet";
import { DataSetRepository } from "$/domain/repositories/DataSetRepository";

export class ExportDataSetsUseCase {
    constructor(private _dataSetRepository: DataSetRepository) {}

    public execute(_dataSets: DataSet[]): FutureData<DataSet[]> {
        throw new Error("Not implemented");
    }
}
