import { CategoryCombo, GreyedField, Section } from "$/domain/entities/DataSet";
import { getId, Id } from "$/domain/entities/Ref";

/* A category option heading, covering `span` consecutive combinations */
export type HeaderCell = Readonly<{ label: string; span: number }>;

export type SectionTableRow = Readonly<{
    dataElementName: string;
    /* One entry per combination column, in header order */
    greyed: ReadonlyArray<boolean>;
    /* Used as a sub-section heading: every combo of the data element is greyed */
    isSubSection: boolean;
}>;

/* The tally sheet layout of one category combo of a section: one header row per category
 * and one row per data element */
export type SectionTable = Readonly<{
    headers: ReadonlyArray<ReadonlyArray<HeaderCell>>;
    rows: ReadonlyArray<SectionTableRow>;
}>;

export function getSectionTables(
    section: Pick<Section, "categoryCombos" | "greyedFields">
): ReadonlyArray<SectionTable> {
    return section.categoryCombos.map(categoryCombo =>
        getCategoryComboTable(categoryCombo, section.greyedFields)
    );
}

function getCategoryComboTable(
    categoryCombo: CategoryCombo,
    greyedFields: ReadonlyArray<GreyedField>
): SectionTable {
    const optionNames = categoryCombo.categories.map(({ categoryOptions }) =>
        categoryOptions.map(({ displayFormName }) => displayFormName)
    );
    const columnsCount = optionNames.length === 0 ? 0 : product(optionNames.map(o => o.length));
    const cocIds = categoryCombo.categoryOptionCombos.map(getId);

    const rows = (categoryCombo.dataElements ?? []).map((de): SectionTableRow => {
        const greyedCocIds = greyedFields
            .filter(gf => gf.dataElement.id === de.id)
            .map(gf => gf.categoryOptionCombo.id);

        return {
            dataElementName: de.displayFormName,
            greyed: Array.from({ length: columnsCount }, (_, idx) => {
                const cocId = cocIds.at(idx);
                return cocId !== undefined && greyedCocIds.includes(cocId);
            }),
            isSubSection: isSubSectionDataElement(cocIds, greyedCocIds),
        };
    });

    return { headers: columnsCount === 0 ? [] : getHeaders(optionNames), rows: rows };
}

/* Each option of a category spans all the combinations of the categories below it, and the
 * whole category repeats once per combination of the categories above it */
function getHeaders(
    optionNames: ReadonlyArray<ReadonlyArray<string>>
): ReadonlyArray<ReadonlyArray<HeaderCell>> {
    const counts = optionNames.map(names => names.length);

    return optionNames.map((names, level) => {
        const span = product(counts.slice(level + 1));
        const repetitions = product(counts.slice(0, level));

        return Array.from({ length: repetitions }, () =>
            names.map((label): HeaderCell => ({ label: label, span: span }))
        ).flat();
    });
}

function isSubSectionDataElement(
    cocIds: ReadonlyArray<Id>,
    greyedCocIds: ReadonlyArray<Id>
): boolean {
    return cocIds.length > 0 && cocIds.every(cocId => greyedCocIds.includes(cocId));
}

function product(values: ReadonlyArray<number>): number {
    return values.reduce((acc, value) => acc * value, 1);
}
