import XlsxPopulate from "@eyeseetea/xlsx-populate";
import fs from "fs";

function compareWorkbooks(workbook1: XlsxPopulate.Workbook, workbook2: XlsxPopulate.Workbook) {
    workbook2.sheets().forEach((sheet, index) => {
        const referenceSheet = workbook1.sheet(index);
        expect(sheet.name()).toEqual(referenceSheet.name());

        const usedRange = sheet.usedRange();
        usedRange?.value().forEach((row, rowIndex) => {
            row.forEach((cellValue, colIndex) => {
                const referenceCellValue = referenceSheet.cell(rowIndex + 1, colIndex + 1).value();
                expect(cellValue).toEqual(referenceCellValue);
            });
        });
    });
}

export async function getWorkbookFromFilePath(filePath: string) {
    if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
    }
    const fileBuffer = fs.readFileSync(filePath);
    return await XlsxPopulate.fromDataAsync(fileBuffer);
}

export { compareWorkbooks as expectWorkbooksToMatch };
