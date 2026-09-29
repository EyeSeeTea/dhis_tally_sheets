import { FutureData } from "$/data/api-futures";
import { DataSet } from "$/domain/entities/DataSet";

export interface DataSetExportRepository {
    save(
        dataSet: DataSet,
        options?: Readonly<{
            sheetName: string;
            highlightSubSections: boolean;
        }>
    ): FutureData<ExportFile>;
}

export type ExportFile = {
    name: string;
    blob: Blob;
};
