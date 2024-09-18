import path from "path";
import XlsxPopulate from "@eyeseetea/xlsx-populate";
import { DataSetSpreadsheetRepository } from "$/data/repositories/DataSetSpreadsheetRepository";
import {
    expectWorkbooksToMatch,
    getWorkbookFromFilePath,
} from "$/data/repositories/__tests__/spreadsheet-fixtures/spreadsheetHelpers";
import {
    processedDataSet,
    translatedDataSets,
} from "$/data/repositories/__tests__/spreadsheet-fixtures/spreadsheetFixtures";
import _ from "$/domain/entities/generic/Collection";
import { DataSetExportRepository } from "$/domain/repositories/DataSetExportRepository";
import { DataSet } from "$/domain/entities/DataSet";

describe("DataSetSpreadsheetRepository", () => {
    const repository = new DataSetSpreadsheetRepository();

    it("should export a spreadsheet given a dataset", async () => {
        const exportFile = await repository.save(processedDataSet).toPromise();

        expect(exportFile.blob.type).toBe(
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
    });

    it("should export a spreadsheet that matches the referenced file", async () => {
        await expectDataSetToMatchFile(processedDataSet, processedDataSetPath, repository);
    });

    it("should export a translated workbook that matches the referenced file", async () => {
        await expectDataSetToMatchFile(translatedDataSets.es, translatedDataSet, repository);
    });

    /* TODO: Remaining tests*/
    it("should match specific styles", async () => {});

    it("should have greyed fields when present", async () => {});

    it("should have more than one table when there are more than one category combo", async () => {});

    it("should include headers when 'Include headers' option is truthy", async () => {}); // In usecase

    it("should not include headers when 'Include headers' option is falsy", async () => {}); // In usecase

    it("should not include sections that have been removed", async () => {}); // In entity / Also here

    it("should have headers translated", async () => {}); // In entity
});

async function expectDataSetToMatchFile(
    dataSet: DataSet,
    pathname: string,
    repository: DataSetExportRepository
) {
    const filePath = path.resolve(__dirname, pathname);
    const referenceWorkbook = await getWorkbookFromFilePath(filePath);
    const exportFile = await repository.save(dataSet).toPromise();

    const buffer = await exportFile.blob.arrayBuffer();
    const generatedWorkbook = await XlsxPopulate.fromDataAsync(buffer);

    expectWorkbooksToMatch(referenceWorkbook, generatedWorkbook);
}

const processedDataSetPath = "spreadsheet-fixtures/spreadsheets/processed-dataset.xlsx";
const translatedDataSet = "spreadsheet-fixtures/spreadsheets/translated-dataset-es.xlsx";
