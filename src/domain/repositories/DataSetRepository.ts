import { FutureData } from "$/data/api-futures";
import { BasicDataSet } from "$/domain/entities/BasicDataSet";
import { DataSet } from "$/domain/entities/DataSet";
import { Id } from "$/domain/entities/Ref";

export interface DataSetRepository {
    getByIds(ids: Id[]): FutureData<DataSet[]>;
    get(): FutureData<DataSet[]>;
    getBasic(): FutureData<BasicDataSet[]>;
}
