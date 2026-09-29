import XlsxPopulate, { Sheet, Workbook } from "@eyeseetea/xlsx-populate";
import { Headers, DataSet } from "$/domain/entities/DataSet";
import {
    DataSetExportOptions,
    DataSetExportRepository,
    ExportFile,
} from "$/domain/repositories/DataSetExportRepository";
import { FutureData } from "$/data/api-futures";
import { Future } from "$/domain/entities/generic/Future";
import { Maybe } from "$/utils/ts-utils";
import { defaultConfig } from "$/domain/entities/Config";
import _ from "$/domain/entities/generic/Collection";
import { HeaderCell, SectionTable, SectionWithTables } from "$/domain/entities/SectionTable";

/* Shouldn't be the implemented repository DataSetRepository itself, instead of the "export"?
 * Right? And save method inside DataSetRepository */
/* TODO: https://github.com/EyeSeeTea/dhis_tally_sheets/pull/14#discussion_r1762634403 */
export class DataSetSpreadsheetRepository implements DataSetExportRepository {
    save(dataSet: DataSet, options: DataSetExportOptions = defaultOptions): FutureData<ExportFile> {
        return Future.fromComputation((resolve, reject) => {
            XlsxPopulate.fromBlankAsync().then(workbook => {
                exportDataSet(workbook, dataSet, options)
                    .then(blob => {
                        resolve({ name: `${dataSet.displayName.trim()}`, blob });
                    })
                    .catch(reject);
            });

            return () => {};
        });
    }
}

const defaultOptions: DataSetExportOptions = {
    sheetName: defaultConfig.sheetName,
    highlightSubSections: defaultConfig.highlightSubSections,
};

function exportDataSet(workbook: Workbook, dataSet: DataSet, options: DataSetExportOptions) {
    const sheet = workbook.sheet(0);
    sheet.name(options.sheetName);

    const { formType } = dataSet;

    const finalRow = formType === "SECTION" ? populateSections(sheet, dataSet, options) : 1;
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

const dataElementStyle = { fontSize: 10, wrapText: true };

const styles = {
    dataElementStyle: dataElementStyle,
    subSectionStyle: { ...dataElementStyle, bold: true, fontSize: 18, fill: "A0ADBA" },
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

function populateSections(sheet: Sheet, dataSet: DataSet, options: DataSetExportOptions) {
    populateHeaders(sheet, dataSet.headers, dataSet.displayName);
    const row = dataSet.toTable().sections.reduce(
        (row, sectionWithTables) => addSection(sheet, sectionWithTables, row, options),
        3 //starts at 3 because of the headers
    );

    return row - 1;
}

function addSection(
    sheet: Sheet,
    sectionWithTables: SectionWithTables,
    rowNum: RowNumber,
    options: DataSetExportOptions
): RowNumber {
    const { section, tables } = sectionWithTables;
    const titleRow = rowNum + 1;
    const descriptionRow = section.description ? titleRow + 1 : titleRow;
    sheet.row(titleRow).cell(START_COLUMN).value(section.displayName).style(styles.titleStyle);
    if (section.description)
        sheet.row(descriptionRow).cell(START_COLUMN).value(section.description);

    return tables.reduce<RowNumber>(
        (row, table) => addTable(sheet, table, row, options),
        descriptionRow + 1
    );
}

function addTable(
    sheet: Sheet,
    table: SectionTable,
    rowNum: RowNumber,
    options: DataSetExportOptions
): RowNumber {
    const { headers, rows } = table;
    const num = rowNum + LINE_BREAK;

    headers.forEach((headerRow, rIdx) => {
        const r = num + rIdx;

        withStartColumns(headerRow).forEach(({ label, span, column }) => {
            const range = sheet
                .row(r)
                .cell(column)
                .rangeTo(sheet.row(r).cell(column + span - 1))
                .value(label);
            if (span > 1) range.merged(true);
        });

        sheet.row(r).style(styles.categoryHeaderStyle);
    });

    rows.forEach((row, rIdx) => {
        const r = num + rIdx + headers.length;
        const highlight = options.highlightSubSections && row.isSubSection;

        if (row.dataElementName)
            sheet
                .row(r)
                .cell(START_COLUMN)
                .value(row.dataElementName)
                .style(highlight ? styles.subSectionStyle : styles.dataElementStyle);

        row.greyed.forEach((isGreyed, idx) => {
            if (isGreyed)
                sheet
                    .row(r)
                    .cell(FIRST_COMBINATION_COLUMN + idx)
                    .value(GREYED_FIELD_MARK)
                    .style(styles.dataElementStyle);
        });
    });

    const columnsLength = START_COLUMN + getWidth(headers);
    const lastRow = rowNum + headers.length + rows.length;
    const lastCell = sheet.row(lastRow).cell(columnsLength);
    sheet.row(num).cell(START_COLUMN).rangeTo(lastCell).style(styles.borders);

    return lastRow + LINE_BREAK;
}

function withStartColumns(
    headerRow: ReadonlyArray<HeaderCell>
): ReadonlyArray<HeaderCell & { column: number }> {
    return headerRow.reduce<ReadonlyArray<HeaderCell & { column: number }>>((acc, cell) => {
        const previous = acc.at(-1);
        const column = previous ? previous.column + previous.span : FIRST_COMBINATION_COLUMN;
        return [...acc, { ...cell, column: column }];
    }, []);
}

function getWidth(headers: SectionTable["headers"]): number {
    return (headers.at(0) ?? []).reduce((width, { span }) => width + span, 0);
}

type RowNumber = number;

const START_COLUMN = 1;
const FIRST_COMBINATION_COLUMN = START_COLUMN + 1;
const LINE_BREAK = 1;
const GREYED_FIELD_MARK = "X";
