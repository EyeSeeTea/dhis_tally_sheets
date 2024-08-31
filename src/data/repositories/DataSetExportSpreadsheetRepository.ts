import _c, { Collection } from "$/domain/entities/generic/Collection";
import { Headers, ProcessedDataSet, Section } from "$/domain/entities/DataSet";
import { DataSetExportRepository, ExportFile } from "$/domain/repositories/DataSetExportRepository";
import XlsxPopulate, { Sheet, Workbook } from "@eyeseetea/xlsx-populate";

export class DataSetExportSpreadsheetRepository implements DataSetExportRepository {
    async exportDataSet(dataSet: ProcessedDataSet): Promise<ExportFile> {
        return {
            name: `${dataSet.displayFormName.trim()}`,
            blob: await XlsxPopulate.fromBlankAsync().then(workbook =>
                exportDataSet(workbook, dataSet)
            ),
        };
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

function populateHeaders(sheet: Sheet, header: Headers, title: string) {
    sheet.cell("A1").value(header.healthFacility).style(styles.titleStyle);
    sheet.cell("A2").value(header.reportingPeriod).style({ bold: true, fontSize: 18 });
    sheet.cell("A3").value(title).style(styles.titleStyle);
}

function populateDefault(sheet: Sheet, dataSet: ProcessedDataSet) {
    if (dataSet.headers) populateHeaders(sheet, dataSet.headers, dataSet.displayFormName);
    sheet.cell("A4").value(dataSet.displayFormName).style(styles.titleStyle);
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
    if (dataSet.headers) populateHeaders(sheet, dataSet.headers, dataSet.displayFormName);
    const row = Collection.range(0, dataSet.sections.length).reduce((row, v) => {
        const section = dataSet.sections[v];
        if (!section) return row;
        return addSection(sheet, section, row);
    }, 3); //starts at 3 because of the headers

    return row - 1;
}

function addSection(sheet: Sheet, section: Section<NewCategory>, row: RowNumber): RowNumber {
    sheet.row(++row).cell(1).value(section.displayName).style(styles.titleStyle);
    if (section.description) sheet.row(++row).cell(1).value(section.description);
    ++row;

    section.categoryCombos.forEach(categoryCombo => {
        const combinations = categoryCombo.categories.map(cg => cg.length).reduce((a, b) => a * b);
        let categoryWidth = combinations;
        let loops = 1;
        const firstRow = row;
        categoryCombo.categories.forEach((categoryGroup, cgIdx) => {
            ++row;
            categoryWidth = categoryWidth / categoryGroup.length;
            loops = loops * categoryGroup.length;
            categoryCombo.categoryOptionCombos.forEach((categoryOptionCombo, idx) => {
                const value = categoryOptionCombo.categories?.at(cgIdx) ?? "";
                sheet
                    .row(row)
                    .cell(idx + 2) //(1 + 1) starts at B and starts from 1 not 0
                    .value(value === "default" ? "Value" : value);
            });
            if (categoryWidth > 1) {
                Collection.range(0, loops).map(i => {
                    const start = i * categoryWidth + 2; //(1 + 1) starts at B and starts from 1 not 0
                    const end = start + categoryWidth - 1;
                    const startCell = sheet.row(row).cell(start);
                    const endCell = sheet.row(row).cell(end);
                    const range = startCell.rangeTo(endCell);
                    range.merged(true);
                });
            }
            sheet.row(row).style(styles.categoryHeaderStyle);
        });

        const cocIds = categoryCombo.categoryOptionCombos.map(({ id }) => id);

        categoryCombo.dataElements?.forEach(de => {
            sheet.row(++row).cell(1).value(de.displayFormName).style(styles.dataElementStyle);

            if (categoryCombo.greyedFields && _c(categoryCombo.greyedFields).isNotEmpty()) {
                const applicableGF = section.greyedFields.filter(gf => gf.dataElement.id === de.id);
                applicableGF.forEach(gf => {
                    const idx = cocIds.indexOf(gf.categoryOptionCombo.id);
                    if (idx >= 0)
                        sheet
                            .row(row)
                            .cell(idx + 2) //(1 + 1)
                            .value("X");
                });
            }
        });

        const lastCell = sheet.row(row).cell(combinations + 1);
        sheet
            .row(firstRow + 1)
            .cell(1)
            .rangeTo(lastCell)
            .style(styles.borders);

        ++row;
    });

    return row;
}

type RowNumber = number;
type NewCategory = string[][];
