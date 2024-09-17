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
import _c from "$/domain/entities/generic/Collection";

describe("DataSetSpreadsheetRepository", () => {
    const repository = new DataSetSpreadsheetRepository();

    it("should export a spreadsheet given a dataset", async () => {
        const exportFile = await repository.save(processedDataSet).toPromise();

        expect(exportFile.blob.type).toBe(
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
    });

    it("should export a spreadsheet that matches the referenced file", async () => {
        const filePath = path.resolve(__dirname, processedDataSetPath);
        const referenceWorkbook = await getWorkbookFromFilePath(filePath);
        const exportFile = await repository.save(processedDataSet).toPromise();

        const buffer = await exportFile.blob.arrayBuffer();
        const generatedWorkbook = await XlsxPopulate.fromDataAsync(buffer);

        expectWorkbooksToMatch(referenceWorkbook, generatedWorkbook);
    });

    it("should export an array of spreadsheets that match the referenced files", async () => {
        const promises = translated
            .map(async dataSetPair => {
                const filePath = path.resolve(__dirname, dataSetPair.relativePath);
                const referenceWorkbook = await getWorkbookFromFilePath(filePath);
                const exportFile = await repository.save(dataSetPair.dataSet).toPromise();

                const buffer = await exportFile.blob.arrayBuffer();
                const generatedWorkbook = await XlsxPopulate.fromDataAsync(buffer);

                expectWorkbooksToMatch(referenceWorkbook, generatedWorkbook);
            })
            .value();

        await Promise.all(promises);
    });

    it("should match specific styles", async () => {});

    it("should have greyed fields when present", async () => {});

    it("should have more than one table when there are more than one category combo", async () => {});

    it("should include headers when 'Include headers' option is truthy", async () => {}); // In usecase

    it("should not include headers when 'Include headers' option is falsy", async () => {}); // In usecase

    it("should not include sections that have been removed", async () => {}); // In entity / Also here

    it("should have headers translated", async () => {}); // In entity
});

const processedDataSetPath = "spreadsheet-fixtures/spreadsheets/processed-dataset.xlsx";

const translated = _c([
    {
        dataSet: translatedDataSets.ar,
        relativePath: "spreadsheet-fixtures/spreadsheets/dataset-ar.xlsx",
    },
    {
        dataSet: translatedDataSets.en,
        relativePath: "spreadsheet-fixtures/spreadsheets/dataset-en.xlsx",
    },
    {
        dataSet: translatedDataSets.es,
        relativePath: "spreadsheet-fixtures/spreadsheets/dataset-es.xlsx",
    },
    {
        dataSet: translatedDataSets.fr,
        relativePath: "spreadsheet-fixtures/spreadsheets/dataset-fr.xlsx",
    },
    {
        dataSet: translatedDataSets.pt,
        relativePath: "spreadsheet-fixtures/spreadsheets/dataset-pt.xlsx",
    },
]);
