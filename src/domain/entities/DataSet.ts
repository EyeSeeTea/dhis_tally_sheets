import { Id, Ref } from "$/domain/entities/Ref";
import { BasicDataSet, BasicDataSetAttrs, Translation } from "$/domain/entities/BasicDataSet";
import { Maybe } from "$/utils/ts-utils";
import { Locale } from "$/domain/entities/Locale";
import _c from "$/domain/entities/generic/Collection";
import i18n from "$/utils/i18n";

export interface DataSetAttrs extends BasicDataSetAttrs {
    name: string;
    displayName: string;
    sections: Section[];
    dataSetElements: DataSetElement[];
    locale?: Locale;
    headers?: Headers;
}

export class DataSet extends BasicDataSet {
    name: string;
    displayName: string;
    sections: Section[];
    dataSetElements: DataSetElement[];
    locale?: Locale;
    headers?: Headers;

    constructor(attrs: DataSetAttrs) {
        super(attrs);

        const sections = this.excludeCommentsSection(attrs.sections);
        const overridedSections = this.assignCategoryCombos(attrs.dataSetElements, sections);

        this.name = attrs.name;
        this.displayName = attrs.displayName;
        this.sections = overridedSections.map(this.orderSectionContent);
        this.dataSetElements = attrs.dataSetElements;
        this.locale = attrs.locale;
        this.headers = attrs.headers;
    }

    _getAttributes(): DataSetAttrs {
        return this._getAttributes() as DataSetAttrs;
    }

    static create<DataSet>(
        this: new (attrs: DataSetAttrs) => DataSet,
        attrs: DataSetAttrs
    ): DataSet {
        return new this(attrs);
    }

    removeSection(sectionId: Id): DataSet {
        return new DataSet({
            ...this,
            sections: this.sections.filter(section => section.id !== sectionId),
        });
    }

    /**
     * Applies the given locale to the DataSet, updating all relevant display names and headers
     * to match the specified locale. This method traverses through the DataSet's sections,
     * categoryCombos, categories, categoryOptions, categoryOptionCombos, dataElements, and
     * dataSetElements, updating their display names using the provided locale. **Translations will
     * be removed from all metadata after the locale is applied**.
     *
     * @param locale - The locale to apply to the DataSet.
     * @returns A new DataSet instance with the locale applied and removed translations.
     *
     * @remarks
     * This method is designed to at least reduce some memory because there will be not useful
     * information on translations after the locale is applied. Actually quite a difference
     * in memory usage if ALL datasets and ALL languages are selected.
     */
    applyLocale(locale: Locale): DataSet {
        const defaultHeaders = {
            healthFacility: `${i18n.t("Health facility", { lng: locale.code })}:`,
            reportingPeriod: `${i18n.t("Reporting period", { lng: locale.code })}:`,
        };

        const newAttrs = this.removeTranslationsFromAttrs({
            ...this,
            translations: [],
            locale: locale,
            headers: defaultHeaders,
            displayName: this.getDisplayName(this, locale.code),
            sections: this.sections.map(section => ({
                ...section,
                displayName: this.getDisplayName(section, locale.code),
                categoryCombos: section.categoryCombos.map(categoryCombo => ({
                    ...categoryCombo,
                    categories: categoryCombo.categories.map(category => ({
                        categoryOptions: category.categoryOptions.map(co => {
                            const displayFormName = this.getDisplayFormName(co, locale.code);
                            return {
                                ...co,
                                displayFormName:
                                    displayFormName === "default"
                                        ? i18n.t("Value")
                                        : displayFormName,
                            };
                        }),
                    })),
                    categoryOptionCombos: categoryCombo.categoryOptionCombos.map(coc => ({
                        ...coc,
                        categoryOptions: coc.categoryOptions.map(co => ({
                            ...co,
                            displayFormName: this.getDisplayFormName(co, locale.code), //Although it will not be used in export
                        })),
                    })),
                })),
                dataElements: section.dataElements.map(de => ({
                    ...de,
                    displayFormName: this.getDisplayFormName(de, locale.code),
                })),
            })),
            dataSetElements: this.dataSetElements.map(dse => ({
                ...dse,
                dataElement: {
                    ...dse.dataElement,
                    displayFormName: this.getDisplayFormName(dse.dataElement, locale.code),
                },
            })),
        });

        return new DataSet(newAttrs);
    }

    updateHeaders(headers: Maybe<Headers>): DataSet {
        return new DataSet({ ...this, headers });
    }

    private removeTranslationsFromAttrs(attrs: DataSetAttrs): DataSetAttrs {
        return {
            ...attrs,
            sections: attrs.sections.map(section => ({
                ...section,
                translations: [],
                categoryCombos: section.categoryCombos.map(categoryCombo => ({
                    ...categoryCombo,
                    categories: categoryCombo.categories.map(category => ({
                        categoryOptions: category.categoryOptions.map(co => ({
                            ...co,
                            translations: [],
                        })),
                    })),
                    categoryOptionCombos: categoryCombo.categoryOptionCombos.map(coc => ({
                        ...coc,
                        categoryOptions: coc.categoryOptions.map(co => ({
                            ...co,
                            translations: [],
                        })),
                    })),
                })),
                dataElements: section.dataElements.map(de => ({
                    ...de,
                    translations: [],
                })),
            })),
            dataSetElements: attrs.dataSetElements.map(dse => ({
                ...dse,
                dataElement: {
                    ...dse.dataElement,
                    translations: [],
                },
            })),
        };
    }

    private translateProperty(
        property: string,
        locale: string,
        translations: Translation[]
    ): Maybe<string> {
        return translations.find(
            translation => translation.locale === locale && translation.property === property
        )?.value;
    }

    private getDisplayName(
        metadata: { translations: Translation[]; name: string },
        locale: string
    ) {
        return this.translateProperty("NAME", locale, metadata.translations) ?? metadata.name;
    }

    private getDisplayFormName(
        metadata: { translations: Translation[]; name: string; formName?: string },
        locale: string
    ) {
        return (
            this.translateProperty("FORM_NAME", locale, metadata.translations) ??
            this.translateProperty("NAME", locale, metadata.translations) ??
            metadata.formName ??
            metadata.name
        );
    }

    private excludeCommentsSection(sections: DataSet["sections"]) {
        return sections.filter(
            section =>
                !(
                    section.name.toLowerCase().includes("comments") ||
                    section.displayName.toLowerCase().includes("comments") ||
                    section.displayName.toLowerCase().includes("comentarios") ||
                    section.displayName.toLowerCase().includes("commentaires") ||
                    section.displayName.toLowerCase().includes("comentários") ||
                    section.displayName.toLowerCase().includes("notas")
                )
        );
    }

    private orderSectionContent(section: Section): Section {
        const mappedCategoryCombos = section.categoryCombos.map(categoryCombo => {
            const optionNames = categoryCombo.categories.map(({ categoryOptions }) =>
                categoryOptions.map(({ displayFormName }) => displayFormName)
            );

            const categoriesOrder = categoryCombo.categories.map(({ categoryOptions }) =>
                categoryOptions.map(({ id }) => id)
            );

            const categoryOptionCombos = categoryCombo.categoryOptionCombos
                .map(categoryOptionCombo => ({
                    id: categoryOptionCombo.id,
                    categoryOptions: _c(categoryOptionCombo.categoryOptions)
                        .sortBy(({ id }) => categoriesOrder.findIndex(c => c.includes(id)))
                        .value(),
                }))
                .filter(categoryOptionCombo => {
                    const flatCategories = optionNames.flat();
                    const includesInCategories = categoryOptionCombo.categoryOptions
                        .map(({ displayFormName }) => displayFormName)
                        .every(category => flatCategories.includes(category));

                    return includesInCategories;
                });

            const dataElements = section.dataElements.filter(
                de => de.categoryCombo.id === categoryCombo.id
            );

            const deIds = dataElements.map(({ id }) => id);
            const cocIds = categoryOptionCombos.map(({ id }) => id);

            const greyedFields = section.greyedFields.filter(
                gf =>
                    deIds.includes(gf.dataElement.id) && cocIds.includes(gf.categoryOptionCombo?.id)
            );

            const modifiedCategoryOptions = categoryCombo.categories.map(c => ({
                ...c,
                categoryOptions: c.categoryOptions.map(co => ({
                    ...co,
                    displayFormName:
                        co.displayFormName === "default" ? i18n.t("Value") : co.displayFormName,
                })),
            }));

            return {
                ...categoryCombo,
                categoryOptionCombos: categoryOptionCombos,
                categories: modifiedCategoryOptions,
                dataElements: dataElements,
                greyedFields: greyedFields,
            };
        });

        //Order category combos by the ones that comes first on the dataset dataElements
        //Needed when multiple dataElements differ on categoryCombo
        const orderedCategoryCombos = _c(mappedCategoryCombos).sortBy(categoryCombo =>
            section.dataElements.findIndex(de => de.categoryCombo.id === categoryCombo.id)
        );

        const categoryCombos = orderedCategoryCombos
            .map(categoryCombo => {
                return {
                    ...categoryCombo,
                    categoryOptionCombos: _c(categoryCombo.categoryOptionCombos)
                        .sortBy(categoryOptionCombo => {
                            //Assign to each word of the (displayFormName) the index where it appears on categoryCombo.categories[]
                            //Output: [1, 2, 0]
                            const prio = categoryOptionCombo.categoryOptions
                                .map(({ displayFormName }) => displayFormName)
                                .map(category => {
                                    const optionNames = categoryCombo.categories
                                        .map(({ categoryOptions }) =>
                                            categoryOptions.map(
                                                ({ displayFormName }) => displayFormName
                                            )
                                        )
                                        .flat();
                                    return optionNames.indexOf(category);
                                });

                            //Gives lower priority as [N] increases and does a sum of all values
                            //[1, 2, 0] -> [100, 20, 0] -> 120
                            return prio
                                .map((v, idx) => v * Math.pow(10, prio.length - 1 - idx))
                                .reduce((a, b) => a + b, 0);
                        })
                        .value(),
                };
            })
            .value();

        return {
            ...section,
            categoryCombos,
        };
    }

    /**
     * Reassigns the `categoryCombo` of the `dataElements` in the `dataSet` based on the `dataSetElements`.
     * The `dataElements` in the `dataSet` may have a `categoryCombo` that doesn't correspond with the relationship `dataSet-dataElement-categoryCombo`.
     * This function looks for `dataSet.id` in `dataElement.categoryCombos` where the relationship is expressed.
     *
     * @param dataSetElements - The `dataSetElements` containing the correct `categoryCombos`.
     * @param sections - The sections of the `dataSet`.
     * @returns The sections of the `dataSet` with reassigned `categoryCombos` for the `dataElements`.
     */
    private assignCategoryCombos(
        dataSetElements: DataSet["dataSetElements"],
        sections: DataSet["sections"]
    ): DataSet["sections"] {
        const overrides = dataSetElements.map(dse => ({
            categoryComboId: dse.categoryCombo?.id,
            dataElementId: dse.dataElement.id,
        }));

        return sections.map(section => ({
            ...section,
            dataElements: section.dataElements.map(de => ({
                ...de,
                categoryCombo: {
                    id:
                        overrides.find(o => o.dataElementId === de.id)?.categoryComboId ??
                        de.categoryCombo.id,
                },
            })),
        }));
    }
}

/* Metadata with formName: CategoryOption, DataElement
 * formName might be undefined even though displayFormName is defined,
 * because it will be autogenerated picking the name even if formName
 * is not defined. So the best flow for picking the "display" field would be:
 * formName -> name (both in translations), -> formName -> name
 * (without translations) */

/* Default display fields on DataSet before applyLocale() is called,
 * are the fields to use in Presentation layer */

export type Section = {
    id: Id;
    translations: Translation[];
    name: string;
    displayName: string;
    description?: string; // Description cannot be translated
    categoryCombos: CategoryCombo[];
    dataElements: SectionDataElement[];
    greyedFields: GreyedField[];
};

type DataSetElement = {
    categoryCombo: Ref;
    dataElement: DataElement;
};

type DataElement = {
    id: Id;
    name: string;
    formName?: string;
    displayFormName: string;
    translations: Translation[];
};

type SectionDataElement = DataElement & {
    categoryCombo: Ref;
};

export type CategoryCombo = {
    id: Id;
    categories: Category[];
    categoryOptionCombos: CategoryOptionCombo[];
    dataElements: SectionDataElement[];
    greyedFields: GreyedField[];
};

type Category = {
    categoryOptions: CategoryOption[];
};

export type CategoryOption = {
    id: Id;
    name: string;
    formName?: string;
    displayFormName: string;
    translations: Translation[];
};

type CategoryOptionCombo = {
    id: Id;
    categoryOptions: CategoryOption[];
};

export type GreyedField = { dataElement: Ref; categoryOptionCombo: Ref };

export type Headers = {
    healthFacility: string;
    reportingPeriod: string;
};
