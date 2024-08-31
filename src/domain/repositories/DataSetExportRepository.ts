import { ProcessedDataSet } from "$/domain/entities/DataSet";

export interface DataSetExportRepository {
    exportDataSet(dataSet: ProcessedDataSet): Promise<ExportFile>;
}

export type ExportFile = {
    name: string;
    blob: Blob;
};
