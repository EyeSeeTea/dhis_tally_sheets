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
import { DataSet, GreyedField } from "$/domain/entities/DataSet";
import { DataSetExportOptions } from "$/domain/repositories/DataSetExportRepository";

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

    describe("category headers", () => {
        it("merges each option over the combinations it spans", async () => {
            const sheet = await exportSheet(repository, processedDataSet);

            const merges = sheet.merged().map(range => ({
                label: range.startCell().value(),
                width: range.endCell().columnNumber() - range.startCell().columnNumber() + 1,
            }));

            expect(merges).toEqual([
                { label: "Option A", width: 2 },
                { label: "Option B", width: 2 },
            ]);
        });
    });

    describe("sub-section data elements", () => {
        const subSectionStyle = { bold: true, fontSize: 14, fill: SUB_SECTION_FILL };
        const dataElementStyle = { bold: false, fontSize: 10, fill: undefined };

        it("highlights the name of a data element with every combo greyed", async () => {
            const styles = await getNameStyles(repository, { highlightSubSections: true });

            expect(styles).toEqual({ heading: subSectionStyle, value: dataElementStyle });
        });

        it("keeps the data element style when highlighting is off", async () => {
            const styles = await getNameStyles(repository, { highlightSubSections: false });

            expect(styles).toEqual({ heading: dataElementStyle, value: dataElementStyle });
        });

        it("fills the greyed cells of a highlighted row instead of marking them", async () => {
            const cells = await getHeadingCombinationCells(repository, {
                highlightSubSections: true,
            });

            expect(cells).toEqual([
                { value: undefined, fill: SUB_SECTION_GREYED_FILL },
                { value: undefined, fill: SUB_SECTION_GREYED_FILL },
            ]);
        });

        it("marks the greyed cells with an X when highlighting is off", async () => {
            const cells = await getHeadingCombinationCells(repository, {
                highlightSubSections: false,
            });

            expect(cells).toEqual([
                { value: "X", fill: undefined },
                { value: "X", fill: undefined },
            ]);
        });
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

const [HEADING_ID, HEADING_NAME] = ["de_heading", "----- Heading -----"];
const [VALUE_ID, VALUE_NAME] = ["de_value", "Value data element"];
const SUB_SECTION_FILL = { type: "solid", color: { rgb: "A0ADBA" } };
const SUB_SECTION_GREYED_FILL = {
    type: "pattern",
    pattern: "lightUp",
    foreground: { rgb: "A0ADBA" },
    background: { rgb: "D5DDE5" },
};

async function getNameStyles(
    repository: DataSetExportRepository,
    options: Pick<DataSetExportOptions, "highlightSubSections">
) {
    const sheet = await exportSheet(repository, subSectionDataSet, options);
    const getStyle = (name: string) => {
        const { bold, fontSize, fill } = getNameCell(sheet, name).style([
            "bold",
            "fontSize",
            "fill",
        ]);
        return { bold, fontSize, fill };
    };

    return { heading: getStyle(HEADING_NAME), value: getStyle(VALUE_NAME) };
}

async function getHeadingCombinationCells(
    repository: DataSetExportRepository,
    options: Pick<DataSetExportOptions, "highlightSubSections">
) {
    const sheet = await exportSheet(repository, subSectionDataSet, options);
    const row = getNameCell(sheet, HEADING_NAME).row();

    return [2, 3].map(column => ({
        value: row.cell(column).value(),
        fill: row.cell(column).style("fill"),
    }));
}

async function exportSheet(
    repository: DataSetExportRepository,
    dataSet: DataSet,
    options: Pick<DataSetExportOptions, "highlightSubSections"> = { highlightSubSections: false }
) {
    const exportFile = await repository
        .save(dataSet, { sheetName: "Sheet", ...options })
        .toPromise();
    const workbook = await XlsxPopulate.fromDataAsync(await exportFile.blob.arrayBuffer());

    return workbook.sheet(0);
}

function getNameCell(sheet: XlsxPopulate.Sheet, name: string) {
    const cell = sheet.find(name).at(0);
    if (!cell) throw new Error(`Cell not found: ${name}`);
    return cell;
}

const subSectionDataSet = createSubSectionDataSet();

function createSubSectionDataSet(): DataSet {
    const categoryCombo = { id: "cc_sex" };
    const categoryOptions = [createCategoryOption("Male"), createCategoryOption("Female")];
    const cocs = categoryOptions.map(option => ({
        id: `coc_${option.id}`,
        categoryOptions: [option],
    }));
    const dataElements = [
        createDataElement(HEADING_ID, HEADING_NAME, categoryCombo),
        createDataElement(VALUE_ID, VALUE_NAME, categoryCombo),
    ];
    const greyedFields: GreyedField[] = cocs.map(coc => ({
        dataElement: { id: HEADING_ID },
        categoryOptionCombo: { id: coc.id },
    }));

    return new DataSet({
        id: "sub_section_data_set",
        name: "Sub-section DataSet",
        displayName: "Sub-section DataSet",
        formType: "SECTION",
        translations: [],
        attributeValues: [],
        dataSetElements: [],
        sections: [
            {
                id: "section",
                name: "Section",
                displayName: "Section",
                translations: [],
                categoryCombos: [
                    {
                        ...categoryCombo,
                        categories: [{ categoryOptions: categoryOptions }],
                        categoryOptionCombos: cocs,
                        dataElements: dataElements,
                        greyedFields: [],
                    },
                ],
                dataElements: dataElements,
                greyedFields: greyedFields,
            },
        ],
    });
}

function createCategoryOption(name: string) {
    return { id: name.toLowerCase(), name: name, displayFormName: name, translations: [] };
}

function createDataElement(id: string, name: string, categoryCombo: { id: string }) {
    return { id: id, name: name, displayFormName: name, translations: [], categoryCombo };
}
