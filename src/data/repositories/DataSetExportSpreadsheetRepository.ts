import _c, { Collection } from "$/domain/entities/generic/Collection";
import {
    CategoryCombo,
    GreyedField,
    Headers,
    ProcessedDataSet,
    Section,
} from "$/domain/entities/DataSet";
import { DataSetExportRepository, ExportFile } from "$/domain/repositories/DataSetExportRepository";
import XlsxPopulate, { Sheet, Workbook } from "@eyeseetea/xlsx-populate";
import { FutureData } from "$/data/api-futures";
import { Future } from "$/domain/entities/generic/Future";
import i18n from "$/utils/i18n";
import { Maybe } from "$/utils/ts-utils";

export class DataSetExportSpreadsheetRepository implements DataSetExportRepository {
    // refactor "export" to "save" so DataSetExportRepo would be DataSetSpreadsheetRepo and save is the method
    exportDataSet(dataSet: ProcessedDataSet): FutureData<ExportFile> {
        return Future.fromComputation((resolve, reject) => {
            XlsxPopulate.fromBlankAsync().then(workbook => {
                exportDataSet(workbook, dataSet)
                    .then(blob => {
                        resolve({ name: `${dataSet.displayName.trim()}`, blob });
                    })
                    .catch(reject);
            });

            return () => {};
        });
    }
}

function exportDataSet(workbook: Workbook, dataSet: ProcessedDataSet) {
    const sheet = workbook.sheet(0);
    sheet.name("MSF-OCBA HMIS");

    const { formType } = dataSet;

    const finalRow =
        formType === "DEFAULT"
            ? populateDefault(sheet, dataSet)
            : formType === "SECTION"
            ? populateSections(sheet, dataSet)
            : 1;
    const values = sheet.range(`A1:A${finalRow}`).value();
    const ranges = _c(values)
        .flatten()
        .compact()
        .map(s => s.length)
        .value();
    const length = Math.min(60, Math.max(...ranges));
    sheet.column("A").width(length);

    return workbook.outputAsync().then(buffer => {
        return new Blob([buffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
    });
}

const borderStyle = { style: "thin", color: "000000" };

const styles = {
    dataElementStyle: { fontSize: 10, wrapText: true },
    titleStyle: {
        bold: true,
        fontSize: 13.5,
    },
    categoryHeaderStyle: {
        bold: true,
        fontSize: 10,
        horizontalAlignment: "center",
        verticalAlignment: "center",
    },
    borders: {
        border: {
            left: borderStyle,
            right: borderStyle,
            top: borderStyle,
            bottom: borderStyle,
        },
    },
};

function populateHeaders(sheet: Sheet, headers: Headers, title: string) {
    sheet.cell("A1").value(headers.healthFacility).style(styles.titleStyle);
    sheet.cell("A2").value(headers.reportingPeriod).style({ bold: true, fontSize: 18 });
    sheet.cell("A3").value(title).style(styles.titleStyle);
}

function populateDefault(sheet: Sheet, dataSet: ProcessedDataSet) {
    if (dataSet.headers) populateHeaders(sheet, dataSet.headers, dataSet.displayName);
    sheet.cell("A4").value(dataSet.displayName).style(styles.titleStyle);
    sheet.cell("B6").value("Value");
    sheet.row(6).style(styles.categoryHeaderStyle);
    dataSet.dataSetElements.forEach((dse, idx) =>
        sheet
            .row(7 + idx) //(6 + 1 cause idx starts on 0)
            .cell(1)
            .value(dse.dataElement.displayFormName)
            .style(styles.dataElementStyle)
    );

    const lastCell = sheet.row(dataSet.dataSetElements.length + 6).cell(2); //B = 2
    sheet.row(6).cell(1).rangeTo(lastCell).style(styles.borders);

    return dataSet.dataSetElements.length + 6;
}

function populateSections(sheet: Sheet, dataSet: ProcessedDataSet) {
    if (dataSet.headers) populateHeaders(sheet, dataSet.headers, dataSet.displayName);
    const row = Collection.range(0, dataSet.sections.length).reduce((row, v) => {
        const section = dataSet.sections[v];
        if (!section) return row;
        return addSection(sheet, section, row);
    }, 3); //starts at 3 because of the headers

    return row - 1;
}

function markGreyedFields(columns: number[], length: number): (string | undefined)[] {
    return Array.from({ length: length }, (_, i) => (columns.includes(i) ? "X" : undefined));
}

function getSectionTables(
    categoryCombos: CategoryCombo<NewCategory>[],
    greyedFields: GreyedField[]
): Table[] {
    return categoryCombos.map(categoryCombo => {
        const thead = (_c(categoryCombo.categories).cartesian().unzip().value() as string[][]).map(
            row => [undefined, ...row] //add an empty cell for the data elements column
        );

        const cocIds = categoryCombo.categoryOptionCombos.map(({ id }) => id);
        const combinations = (_c(thead).first()?.length ?? 1) - DATA_ELEMENTS_OFFSET;

        const tbody =
            categoryCombo.dataElements?.map(de => {
                const gfs = greyedFields
                    .filter(gf => gf.dataElement.id === de.id)
                    .map(gf => cocIds.indexOf(gf.categoryOptionCombo.id))
                    .filter(idx => idx >= 0);

                return [de.displayFormName, ...markGreyedFields(gfs, combinations)];
            }) ?? [];

        return { thead, tbody };
    });
}

function getMergeRanges(row: Row): MergeRange[] {
    return row
        .reduce<MergeRange[]>((acc, v, idx, arr) => {
            const last = acc.slice(-1);
            const rest = acc.slice(0, -1);
            if (!last || arr.at(idx - 1) !== v) return acc.concat([[idx, idx]]);
            else return rest.concat(last.map(([start, _end]) => [start, idx]));
        }, [])
        .filter(([start, end]) => start !== end);
}

function addSection(sheet: Sheet, section: Section<NewCategory>, rowNum: RowNumber): RowNumber {
    sheet.row(++rowNum).cell(START_COLUMN).value(section.displayName).style(styles.titleStyle);
    if (section.description) sheet.row(++rowNum).cell(START_COLUMN).value(section.description);
    ++rowNum;

    const tables = getSectionTables(section.categoryCombos, section.greyedFields);

    const rowsNum = tables.reduce<number>((rowNum, { thead, tbody }) => {
        const num = rowNum + LINE_BREAK;

        const _headRows = thead.map((row, rIdx) => {
            const r = num + rIdx;

            //to add value translated with i18n by dataset locale
            const _cells = _c(row)
                .map((v, cIdx) => {
                    if (!v) return;
                    return sheet
                        .row(r)
                        .cell(cIdx + DATA_ELEMENTS_OFFSET)
                        .value(v === "default" ? i18n.t("Value") : v);
                })
                .compact()
                .value();

            const mergeRanges = getMergeRanges(row);
            mergeRanges.forEach(([start, end]) => {
                const startCell = sheet.row(r).cell(start + DATA_ELEMENTS_OFFSET);
                const endCell = sheet.row(r).cell(end + DATA_ELEMENTS_OFFSET);
                const range = startCell.rangeTo(endCell);
                range.merged(true);
            });

            sheet.row(num + rIdx).style(styles.categoryHeaderStyle);
        });

        const _bodyRows = tbody.map((row, rIdx) => {
            const r = num + rIdx + thead.length;

            const _cells = _c(row)
                .map((v, cIdx) => {
                    if (!v) return;
                    return sheet
                        .row(r)
                        .cell(cIdx + 1)
                        .value(v)
                        .style(styles.dataElementStyle);
                })
                .compact()
                .value();
        });

        const columnsLength = _c(thead).first()?.length ?? 1;
        const lastRow = rowNum + thead.length + tbody.length;
        const lastCell = sheet.row(lastRow).cell(columnsLength);
        sheet.row(num).cell(START_COLUMN).rangeTo(lastCell).style(styles.borders);

        return lastRow + LINE_BREAK;
    }, rowNum);

    return rowsNum;
}

type RowNumber = number;
type NewCategory = string[][];
type MergeRange = [number, number];

type Row = Maybe<string>[];
type Table = { thead: Row[]; tbody: Row[] };

const START_COLUMN = 1;
const LINE_BREAK = 1;
const DATA_ELEMENTS_OFFSET = 1;
