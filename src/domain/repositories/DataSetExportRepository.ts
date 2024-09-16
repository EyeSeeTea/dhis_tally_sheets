import { FutureData } from "$/data/api-futures";
import { DataSet } from "$/domain/entities/DataSet";

export interface DataSetExportRepository {
    save(
        dataSet: DataSet,
        options?: {
            sheetName: string;
        }
    ): FutureData<ExportFile>;
}

export type ExportFile = {
    name: string;
    blob: Blob;
};
