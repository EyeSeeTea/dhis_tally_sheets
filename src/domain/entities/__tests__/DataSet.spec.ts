import { describe, expect, it } from "vitest";
import { valid, withSections } from "$/domain/entities/__tests__/dataSetFixtures";
import { CategoryOption, DataSet } from "$/domain/entities/DataSet";
import {
    processedDataSet,
    spanish as spanishLocale,
} from "$/data/repositories/__tests__/spreadsheet-fixtures/spreadsheetFixtures";

describe("DataSet", () => {
    it("valid attributes should return an instance of DataSet", () => {
        expect(valid).toBeInstanceOf(DataSet);
    });

    it("should remove sections", () => {
        const dataSet = withSections;

        const sectionId = "section1";
        const updatedDataSet = dataSet.removeSection(sectionId);

        expect(updatedDataSet.sections).not.toContainEqual({ id: sectionId });
    });

    it("should have locale property when locale is applied", async () => {
        const dataSet = processedDataSet;
        const translatedDataSet = dataSet.applyLocale(spanishLocale);

        expect(translatedDataSet.locale).toBe(spanishLocale);
    });

    it("should translate all fields when locale is applied", async () => {
        const ds = processedDataSet;
        const translated = ds.applyLocale(spanishLocale);

        expectDisplayFieldsToNotEqualNameFields(translated);
    });
});

function expectCategoryOption(co: CategoryOption) {
    // displayFormName should not be the same as name, unless is foo/bar/baz/qux
    if (!["Foo", "Bar", "Baz", "Qux"].includes(co.displayFormName))
        expect(co.displayFormName).not.toBe(co.name);

    // if displayFormName equals default, it should be i18n.t("Value")
    if (co.name === "default") {
        expect(co.displayFormName).toBe("Valor");
    }
}

function expectDisplayFieldsToNotEqualNameFields(dataSet: DataSet) {
    expect(dataSet.displayName).not.toBe(dataSet.name);

    dataSet.sections.forEach(section => {
        expect(section.displayName).not.toBe(section.name);

        section.categoryCombos.forEach(cc => {
            cc.categories.forEach(c => {
                c.categoryOptions.forEach(expectCategoryOption);
            });

            cc.categoryOptionCombos.map(coc => {
                coc.categoryOptions.forEach(expectCategoryOption);
            });
        });

        section.dataElements.forEach(de => {
            expect(de.displayFormName).not.toBe(de.name);
        });
    });

    dataSet.dataSetElements.forEach(dse => {
        expect(dse.dataElement.displayFormName).not.toBe(dse.dataElement.name);
    });
}
