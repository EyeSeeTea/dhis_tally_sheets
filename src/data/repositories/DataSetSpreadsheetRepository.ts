import XlsxPopulate, { Sheet, Workbook } from "@eyeseetea/xlsx-populate";
import { CategoryCombo, GreyedField, Headers, DataSet, Section } from "$/domain/entities/DataSet";
import { DataSetExportRepository, ExportFile } from "$/domain/repositories/DataSetExportRepository";
import { FutureData } from "$/data/api-futures";
import { Future } from "$/domain/entities/generic/Future";
import { Maybe } from "$/utils/ts-utils";
import { defaultConfig } from "$/domain/entities/Config";
import _, { Collection } from "$/domain/entities/generic/Collection";
import { getId } from "$/domain/entities/Ref";

/* Note: Shouldn't be the implemented repository DataSetRepository itself, instead of the "export"?
 * Right? And save method inside DataSetRepository */
export class DataSetSpreadsheetRepository implements DataSetExportRepository {
    save(
        dataSet: DataSet,
        options = { sheetName: defaultConfig.sheetName }
    ): FutureData<ExportFile> {
        return Future.fromComputation((resolve, reject) => {
            XlsxPopulate.fromBlankAsync().then(workbook => {
                exportDataSet(workbook, dataSet, options.sheetName)
                    .then(blob => {
                        resolve({ name: `${dataSet.displayName.trim()}`, blob });
                    })
                    .catch(reject);
            });

            return () => {};
        });
    }
}

function exportDataSet(workbook: Workbook, dataSet: DataSet, sheetName: string) {
    const sheet = workbook.sheet(0);
    sheet.name(sheetName);

    const { formType } = dataSet;

    const finalRow = formType === "SECTION" ? populateSections(sheet, dataSet) : 1;
    const values = sheet.range(`A1:A${finalRow}`).value();
    const ranges = _(values)
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

function populateHeaders(sheet: Sheet, headers: Maybe<Headers>, title: string) {
    if (headers) {
        sheet.cell("A1").value(headers.healthFacility).style(styles.titleStyle);
        sheet.cell("A2").value(headers.reportingPeriod).style({ bold: true, fontSize: 18 });
    }
    sheet.cell("A3").value(title).style(styles.titleStyle);
}

function populateSections(sheet: Sheet, dataSet: DataSet) {
    populateHeaders(sheet, dataSet.headers, dataSet.displayName);
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

function getSectionTables(categoryCombos: CategoryCombo[], greyedFields: GreyedField[]): Table[] {
    return categoryCombos.map(categoryCombo => {
        const optionNames = categoryCombo.categories.map(({ categoryOptions }) =>
            categoryOptions.map(({ displayFormName }) => displayFormName)
        );
        const thead = (_(optionNames).cartesian().unzip().value() as string[][]).map(
            row => [undefined, ...row] //add an empty cell for the data elements column
        );

        const cocIds = categoryCombo.categoryOptionCombos.map(getId);
        const combinations = (_(thead).first()?.length ?? 1) - DATA_ELEMENTS_OFFSET;

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

function addSection(sheet: Sheet, section: Section, rowNum: RowNumber): RowNumber {
    sheet.row(++rowNum).cell(START_COLUMN).value(section.displayName).style(styles.titleStyle);
    if (section.description) sheet.row(++rowNum).cell(START_COLUMN).value(section.description);
    ++rowNum;

    const tables = getSectionTables(section.categoryCombos, section.greyedFields);

    const rowsNum = tables.reduce<number>((rowNum, { thead, tbody }) => {
        const num = rowNum + LINE_BREAK;

        const _headRows = thead.map((row, rIdx) => {
            const r = num + rIdx;

            const _cells = _(row)
                .map((v, cIdx) => {
                    if (!v) return;
                    return sheet
                        .row(r)
                        .cell(cIdx + DATA_ELEMENTS_OFFSET)
                        .value(v);
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

            const _cells = _(row)
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

        const columnsLength = _(thead).first()?.length ?? 1;
        const lastRow = rowNum + thead.length + tbody.length;
        const lastCell = sheet.row(lastRow).cell(columnsLength);
        sheet.row(num).cell(START_COLUMN).rangeTo(lastCell).style(styles.borders);

        return lastRow + LINE_BREAK;
    }, rowNum);

    return rowsNum;
}

type RowNumber = number;
type MergeRange = [number, number];

type Row = Maybe<string>[];
type Table = { thead: Row[]; tbody: Row[] };

const START_COLUMN = 1;
const LINE_BREAK = 1;
const DATA_ELEMENTS_OFFSET = 1;
