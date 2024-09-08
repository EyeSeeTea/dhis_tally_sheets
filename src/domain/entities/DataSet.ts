import { Id, Ref } from "$/domain/entities/Ref";
import { BasicDataSet, BasicDataSetAttrs, D2Translation } from "$/domain/entities/BasicDataSet";
import { Maybe } from "$/utils/ts-utils";
import { Locale } from "$/domain/entities/Locale";
import i18n from "$/utils/i18n";

export interface DataSetAttrs extends BasicDataSetAttrs {
    name: string;
    displayName: string;
    sections: Section[];
    dataSetElements: DataSetElement[];
}

interface EnhancedDataSetAttrs extends DataSetAttrs {
    locale?: Locale;
    headers?: Headers;
}

export interface ProcessedDataSet {
    id: Id;
    translations: D2Translation[];
    displayName: string;
    name: string;
    sections: Section<string[][]>[];
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
        this.sections = overridedSections;
        this.dataSetElements = attrs.dataSetElements;
    }

    _getAttributes(): EnhancedDataSetAttrs {
        return this._getAttributes() as EnhancedDataSetAttrs;
    }

    protected _update(partialAttrs: Partial<EnhancedDataSetAttrs>): this {
        Object.assign(this, partialAttrs);
        return this;
    }

    static create<DataSet>(
        this: new (attrs: DataSetAttrs) => DataSet,
        attrs: DataSetAttrs
    ): DataSet {
        return new this(attrs);
    }

    removeSection(sectionId: Id): DataSet {
        return this._update({
            sections: this.sections.filter(section => section.id !== sectionId),
        });
    }

    /* Default display fields on DataSet before method is called, are the fields to use in Presentation layer */
    applyLocale(locale: Locale): DataSet {
        const defaultHeaders = {
            healthFacility: i18n.t("Health facility", { lng: this.locale?.code ?? "en" }),
            reportingPeriod: i18n.t("Reporting period", { lng: this.locale?.code ?? "en" }),
        };

        // Is _update really just returning a new instance without modifying the original one?
        return this._update({
            ...this,
            locale: locale,
            headers: defaultHeaders,
            displayName: this.getDisplayName(this, locale.code),
            sections: this.sections.map(section => ({
                ...section,
                displayName: this.getDisplayName(section, locale.code),
                categoryCombos: section.categoryCombos.map(categoryCombo => ({
                    ...categoryCombo,
                    categories: categoryCombo.categories.map(category => ({
                        categoryOptions: category.categoryOptions.map(co => ({
                            ...co,
                            displayFormName: this.getDisplayFormName(co, locale.code),
                        })),
                    })),
                    categoryOptionCombos: categoryCombo.categoryOptionCombos.map(coc => ({
                        ...coc,
                        categoryOptions: coc.categoryOptions.map(co => ({
                            ...co,
                            displayFormName: this.getDisplayFormName(co, locale.code),
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
    }

    updateHeaders(headers: Headers) {
        return this._update({ headers });
    }

    private translateProperty(
        property: string,
        locale: string,
        translations: D2Translation[]
    ): Maybe<string> {
        return translations.find(
            translation => translation.locale === locale && translation.property === property
        )?.value;
    }

    private getDisplayName(
        metadata: { translations: D2Translation[]; name: string },
        locale: string
    ) {
        return this.translateProperty("NAME", locale, metadata.translations) ?? metadata.name;
    }

    private getDisplayFormName(
        metadata: { translations: D2Translation[]; name: string; formName?: string },
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

/* To remove Categories*/
export type Section<Categories = Category[]> = {
    id: Id;
    translations: D2Translation[];
    name: string;
    displayName: string;
    description?: string; // Description cannot be translated
    categoryCombos: CategoryCombo<Categories>[];
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
    translations: D2Translation[];
};

type SectionDataElement = DataElement & {
    categoryCombo: Ref;
};

/* To remove Categories*/
export type CategoryCombo<Categories = Category[]> = {
    id: Id;
    categories: Categories;
    categoryOptionCombos: CategoryOptionCombo[];
    dataElements?: SectionDataElement[] /* To remove */;
    greyedFields?: GreyedField[] /* To remove */;
};

type Category = {
    categoryOptions: CategoryOption[];
};

export type CategoryOption = {
    id: Id;
    name: string;
    formName?: string;
    displayFormName: string;
    translations: D2Translation[];
};

type CategoryOptionCombo = {
    id: Id;
    categoryOptions: CategoryOption[];
    categories?: string[] /* To Remove*/;
};

type GreyedField = { dataElement: Ref; categoryOptionCombo: Ref };

export type Headers = {
    healthFacility: string;
    reportingPeriod: string;
};
