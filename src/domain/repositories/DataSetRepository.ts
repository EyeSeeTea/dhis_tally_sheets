import { FutureData } from "$/data/api-futures";
import { DataSet, PartialDataSet } from "$/domain/entities/DataSet";
import { Id } from "$/domain/entities/Ref";

export interface DataSetRepository {
    get(): FutureData<PartialDataSet[]>;
    getByIds(ids: Id[]): FutureData<DataSet[]>;
}
