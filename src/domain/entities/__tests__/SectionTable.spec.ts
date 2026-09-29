import { describe, expect, it } from "vitest";
import { CategoryCombo, CategoryOption, GreyedField } from "$/domain/entities/DataSet";
import { getSectionTables } from "$/domain/entities/SectionTable";

const [MALE, FEMALE, UNDER_5, OVER_5] = ["Male", "Female", "<5", ">=5"];
const [COC_MALE, COC_FEMALE, COC_OTHER_COMBO] = ["coc_male", "coc_female", "coc_other"];
const [DEFAULT, COC_DEFAULT] = ["default", "coc_default"];
const [DE_HEADING, DE_VALUE] = ["de_heading", "de_value"];

describe("getSectionTables", () => {
    describe("headers", () => {
        it("spans each option over the combinations of the categories below it", () => {
            const categoryCombo = createCategoryCombo({
                categories: [
                    [MALE, FEMALE],
                    [UNDER_5, OVER_5],
                ],
                cocIds: [],
                dataElementIds: [],
            });

            const [table] = getSectionTables(createSection([categoryCombo], []));

            expect(table?.headers).toEqual([
                [
                    { label: MALE, span: 2 },
                    { label: FEMALE, span: 2 },
                ],
                [
                    { label: UNDER_5, span: 1 },
                    { label: OVER_5, span: 1 },
                    { label: UNDER_5, span: 1 },
                    { label: OVER_5, span: 1 },
                ],
            ]);
        });

        it("keeps adjacent options with the same label as separate cells", () => {
            const categoryCombo = createCategoryCombo({
                categories: [[MALE, MALE]],
                cocIds: [],
                dataElementIds: [],
            });

            const [table] = getSectionTables(createSection([categoryCombo], []));

            expect(table?.headers).toEqual([
                [
                    { label: MALE, span: 1 },
                    { label: MALE, span: 1 },
                ],
            ]);
        });

        it("has no headers and no columns when the category combo has no categories", () => {
            const categoryCombo = createCategoryCombo({
                categories: [],
                cocIds: [],
                dataElementIds: [DE_HEADING],
            });

            const [table] = getSectionTables(createSection([categoryCombo], []));

            expect(table).toEqual({
                headers: [],
                rows: [{ dataElementName: nameOf(DE_HEADING), greyed: [], isSubSection: false }],
            });
        });
    });

    describe("rows", () => {
        it("builds one table per category combo", () => {
            const combos = [sexCombo([DE_HEADING]), sexCombo([DE_VALUE])];

            const tables = getSectionTables(createSection(combos, []));

            expect(tables.map(({ rows }) => rows.map(row => row.dataElementName))).toEqual([
                [nameOf(DE_HEADING)],
                [nameOf(DE_VALUE)],
            ]);
        });

        it("marks the greyed combos in header order", () => {
            const greyedFields = [greyed(DE_VALUE, COC_FEMALE)];

            const [table] = getSectionTables(createSection([sexCombo([DE_VALUE])], greyedFields));

            expect(table?.rows).toEqual([
                { dataElementName: nameOf(DE_VALUE), greyed: [false, true], isSubSection: false },
            ]);
        });
    });

    describe("sub-section data elements", () => {
        it("flags a data element with every combo greyed and keeps its greyed marks", () => {
            const allGreyed = [greyed(DE_HEADING, COC_MALE), greyed(DE_HEADING, COC_FEMALE)];

            const [table] = getSectionTables(
                createSection([sexCombo([DE_HEADING, DE_VALUE])], allGreyed)
            );

            expect(table?.rows).toEqual([
                { dataElementName: nameOf(DE_HEADING), greyed: [true, true], isSubSection: true },
                { dataElementName: nameOf(DE_VALUE), greyed: [false, false], isSubSection: false },
            ]);
        });

        it("does not flag a data element with only some combos greyed", () => {
            expect(getSubSectionFlags([greyed(DE_HEADING, COC_MALE)])).toEqual([false, false]);
        });

        it("does not flag anything when the section has no greyed fields", () => {
            expect(getSubSectionFlags([])).toEqual([false, false]);
        });

        it("ignores greyed fields of other data elements", () => {
            const otherDataElement = [greyed(DE_VALUE, COC_MALE), greyed(DE_VALUE, COC_FEMALE)];

            expect(getSubSectionFlags(otherDataElement)).toEqual([false, true]);
        });

        it("ignores greyed fields of combos outside the category combo", () => {
            const outsideCombo = [
                greyed(DE_HEADING, COC_MALE),
                greyed(DE_HEADING, COC_OTHER_COMBO),
            ];

            expect(getSubSectionFlags(outsideCombo)).toEqual([false, false]);
        });

        /* Accepted false positive, same as in Data Entry (ClickUp #869ee3pre): a default
         * category combo has a single combo, so greying it flags the row */
        it("flags a data element with the default category combo and its only combo greyed", () => {
            const categoryCombo = createCategoryCombo({
                categories: [[DEFAULT]],
                cocIds: [COC_DEFAULT],
                dataElementIds: [DE_HEADING],
            });
            const section = createSection([categoryCombo], [greyed(DE_HEADING, COC_DEFAULT)]);

            const [table] = getSectionTables(section);

            expect(table?.rows).toEqual([
                { dataElementName: nameOf(DE_HEADING), greyed: [true], isSubSection: true },
            ]);
        });
    });
});

/* Sub-section flags of [DE_HEADING, DE_VALUE] in a Male/Female category combo */
function getSubSectionFlags(greyedFields: ReadonlyArray<GreyedField>): ReadonlyArray<boolean> {
    const section = createSection([sexCombo([DE_HEADING, DE_VALUE])], greyedFields);

    return getSectionTables(section).flatMap(({ rows }) =>
        rows.map(({ isSubSection }) => isSubSection)
    );
}

function sexCombo(dataElementIds: ReadonlyArray<string>): CategoryCombo {
    return createCategoryCombo({
        categories: [[MALE, FEMALE]],
        cocIds: [COC_MALE, COC_FEMALE],
        dataElementIds: dataElementIds,
    });
}

function createSection(
    categoryCombos: ReadonlyArray<CategoryCombo>,
    greyedFields: ReadonlyArray<GreyedField>
) {
    return { categoryCombos: [...categoryCombos], greyedFields: [...greyedFields] };
}

function createCategoryCombo(options: {
    categories: ReadonlyArray<ReadonlyArray<string>>;
    cocIds: ReadonlyArray<string>;
    dataElementIds: ReadonlyArray<string>;
}): CategoryCombo {
    const id = "category_combo";

    return {
        id: id,
        categories: options.categories.map(names => ({
            categoryOptions: names.map(createCategoryOption),
        })),
        categoryOptionCombos: options.cocIds.map(cocId => ({ id: cocId, categoryOptions: [] })),
        dataElements: options.dataElementIds.map(deId => ({
            id: deId,
            name: nameOf(deId),
            displayFormName: nameOf(deId),
            translations: [],
            categoryCombo: { id: id },
        })),
        greyedFields: [],
    };
}

function createCategoryOption(name: string): CategoryOption {
    return { id: name, name: name, displayFormName: name, translations: [] };
}

function greyed(dataElementId: string, cocId: string): GreyedField {
    return { dataElement: { id: dataElementId }, categoryOptionCombo: { id: cocId } };
}

function nameOf(dataElementId: string): string {
    return `Name of ${dataElementId}`;
}
