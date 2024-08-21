import { DataSet, PartialDataSet } from "$/domain/entities/DataSet";
import { DataSetRepository } from "$/domain/repositories/DataSetRepository";
import { D2Api, MetadataPick } from "$/types/d2-api";
import { apiToFuture, FutureData } from "$/data/api-futures";
import { Id } from "$/domain/entities/Ref";

export class DataSetD2Repository implements DataSetRepository {
    constructor(private api: D2Api) {}

    public get(): FutureData<PartialDataSet[]> {
        return apiToFuture(
            this.api.models.dataSets.get({
                fields: partialDataSetFields,
                filter: { formType: { "!eq": "CUSTOM" } },
                translate: "true",
                paging: false,
            })
        ).map(d2DataSet => d2DataSet.objects.map(this.buildPartialDataSet));
    }

    public getByIds(ids: Id[]): FutureData<DataSet[]> {
        return apiToFuture(
            this.api.models.dataSets.get({
                fields: dataSetFields,
                filter: { id: { in: ids } },
                paging: false,
            })
        ).map(d2DataSet => d2DataSet.objects.map(this.buildFullDataSet));
    }

    private buildPartialDataSet(d2DataSet: PartialD2DataSet): PartialDataSet {
        return {
            id: d2DataSet.id,
            formType: d2DataSet.formType,
            displayName: d2DataSet.displayName,
            translations: d2DataSet.translations,
            attributeValues: d2DataSet.attributeValues,
        };
    }

    private buildFullDataSet(d2DataSet: D2DataSet): DataSet {
        return {
            id: d2DataSet.id,
            name: d2DataSet.name,
            displayFormName: d2DataSet.displayFormName,
            translations: d2DataSet.translations,
            formName: d2DataSet.formName,
            displayName: d2DataSet.displayName,
            formType: d2DataSet.formType,
            sections: d2DataSet.sections.map(section => ({
                id: section.id,
                translations: section.translations,
                name: section.name,
                displayName: section.displayName,
                description: section.description,
                categoryCombos: section.categoryCombos.map(categoryCombo => ({
                    id: categoryCombo.id,
                    displayName: undefined,
                    categories: categoryCombo.categories,
                    categoryOptionCombos: categoryCombo.categoryOptionCombos,
                })),
                dataElements: section.dataElements.map(dataElement => ({
                    id: dataElement.id,
                    name: dataElement.name,
                    displayFormName: dataElement.displayFormName,
                    translations: dataElement.translations,
                    formName: dataElement.formName,
                    categoryCombo: dataElement.categoryCombo,
                })),
                greyedFields: section.greyedFields,
            })),
            dataSetElements: d2DataSet.dataSetElements.map(dataSetElement => ({
                categoryCombo: dataSetElement.categoryCombo,
                dataElement: { ...dataSetElement.dataElement, categoryCombo: undefined },
            })),
        };
    }
}

const dataSetFields = {
    id: true,
    name: true,
    displayFormName: true,
    translations: true,
    formName: true,
    displayName: true,
    formType: true,
    sections: {
        id: true,
        translations: true,
        name: true,
        displayName: true,
        description: true,
        categoryCombos: {
            id: true,
            categories: {
                categoryOptions: {
                    id: true,
                    name: true,
                    displayFormName: true,
                    translations: true,
                },
            },
            categoryOptionCombos: {
                id: true,
                name: true,
                displayFormName: true,
                categoryOptions: {
                    id: true,
                    name: true,
                    displayFormName: true,
                    translations: true,
                },
            },
        },
        dataElements: {
            id: true,
            name: true,
            displayFormName: true,
            translations: true,
            formName: true,
            categoryCombo: true,
        },
        greyedFields: { dataElement: true, categoryOptionCombo: true },
    },
    dataSetElements: {
        categoryCombo: {
            id: true,
        },
        dataElement: {
            id: true,
            name: true,
            displayFormName: true,
            translations: true,
            formName: true,
        },
    },
} as const;

const partialDataSetFields = {
    id: true,
    formType: true,
    displayName: true,
    translations: true,
    attributeValues: {
        attribute: {
            id: true,
            name: true,
        },
        value: true,
    },
} as const;

type D2DataSet = MetadataPick<{
    dataSets: { fields: typeof dataSetFields };
}>["dataSets"][number];

type PartialD2DataSet = MetadataPick<{
    dataSets: { fields: typeof partialDataSetFields };
}>["dataSets"][number];
