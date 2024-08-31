import { FutureData } from "$/data/api-futures";
import { ProcessedDataSet } from "$/domain/entities/DataSet";

export interface DataSetExportRepository {
    exportDataSet(dataSet: ProcessedDataSet): FutureData<ExportFile>;
}

export type ExportFile = {
    name: string;
    blob: Blob;
};
