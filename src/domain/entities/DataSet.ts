import { Id, Ref } from "$/domain/entities/Ref";
import { BasicDataSet, BasicDataSetAttrs, D2Translation } from "$/domain/entities/BasicDataSet";

export interface DataSetAttrs extends BasicDataSetAttrs {
    name: string;
    displayFormName: string;
    formName: string;
    sections: Section[];
    dataSetElements: DataSetElement[];
    locale?: string /* To be removed */;
    headers?: Headers;
}

export type Headers = {
    healthFacility: string;
    reportingPeriod: string;
};

/* TO REMOVE */
export interface ProcessedDataSet extends BasicDataSetAttrs {
    name: string;
    displayFormName: string;
    formName: string;
    sections: Section<string[][]>[];
    dataSetElements: DataSetElement[];
    locale?: string /* To be removed */;
    headers?: {
        healthFacility: string;
        reportingPeriod: string;
    };
}

export class DataSet extends BasicDataSet {
    name: string;
    displayFormName: string;
    formName: string;
    sections: Section[];
    dataSetElements: DataSetElement[];

    constructor(attrs: DataSetAttrs) {
        super(attrs);

        const sections = this.excludeCommentsSection(attrs.sections);
        const overridedSections = this.assignCategoryCombos(attrs.dataSetElements, sections);

        this.name = attrs.name;
        this.displayFormName = attrs.displayFormName;
        this.formName = attrs.formName;
        this.sections = overridedSections;
        this.dataSetElements = attrs.dataSetElements;
    }

    _getAttributes(): DataSetAttrs {
        return this._getAttributes() as DataSetAttrs;
    }

    protected _update(partialAttrs: Partial<DataSetAttrs>): this {
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

/* To remove Categories*/
export type Section<Categories = Category[]> = {
    id: Id;
    translations: D2Translation[];
    name: string;
    displayName: string;
    description: string;
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
    displayFormName: string;
    translations: D2Translation[];
    formName: string;
};

type SectionDataElement = DataElement & {
    categoryCombo: Ref;
};

/* To remove Categories*/
export type CategoryCombo<Categories = Category[]> = {
    id: Id;
    displayName: string;
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
    displayFormName: string;
    translations: D2Translation[];
};

type CategoryOptionCombo = {
    id: Id;
    name: string;
    displayFormName: string;
    categoryOptions: CategoryOption[];
    categories?: string[] /* To Remove*/;
};

type GreyedField = { dataElement: Ref; categoryOptionCombo: Ref };
