import { FutureData } from "$/data/api-futures";
import { DataSet } from "$/domain/entities/DataSet";

export interface DataSetExportRepository {
    save(dataSet: DataSet, options?: DataSetExportOptions): FutureData<ExportFile>;
}

export type DataSetExportOptions = Readonly<{
    sheetName: string;
    highlightSubSections: boolean;
}>;

export type ExportFile = {
    name: string;
    blob: Blob;
};
