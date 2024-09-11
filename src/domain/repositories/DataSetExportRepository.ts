import { FutureData } from "$/data/api-futures";
import { DataSet } from "$/domain/entities/DataSet";

export interface DataSetExportRepository {
    exportDataSet(dataSet: DataSet): FutureData<ExportFile>;
}

export type ExportFile = {
    name: string;
    blob: Blob;
};
