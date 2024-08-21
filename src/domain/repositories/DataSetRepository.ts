import { FutureData } from "$/data/api-futures";
import { DataSet } from "$/domain/entities/DataSet";
import { Id } from "$/domain/entities/Ref";

export interface DataSetRepository {
    getByIds(ids: Id[]): FutureData<DataSet[]>;
}
