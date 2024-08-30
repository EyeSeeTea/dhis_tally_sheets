import { Id } from "$/domain/entities/Ref";
import { BasicDataSet, BasicDataSetAttrs } from "$/domain/entities/BasicDataSet";
import { DataSet, DataSetAttrs } from "$/domain/entities/DataSet";
import { DataSetRepository } from "$/domain/repositories/DataSetRepository";
import { D2Api, MetadataPick } from "$/types/d2-api";
import { apiToFuture, FutureData } from "$/data/api-futures";
import { filterValidInstances } from "$/utils/instance-utils";

export class DataSetD2Repository implements DataSetRepository {
    constructor(private api: D2Api) {}

    public getBasic(): FutureData<BasicDataSet[]> {
        return apiToFuture(
            this.api.models.dataSets.get({
                fields: partialDataSetFields,
                filter: { formType: { "!eq": "CUSTOM" } },
                translate: "true",
                paging: false,
            })
        ).map(res => {
            return this.createBasicDataSets(res.objects);
        });
    }

    public getByIds(ids: Id[]): FutureData<DataSet[]> {
        return apiToFuture(
            this.api.models.dataSets.get({
                fields: dataSetFields,
                filter: { id: { in: ids }, formType: { "!eq": "CUSTOM" } },
                translate: "true",
                paging: false,
            })
        ).map(res => {
            return this.createDataSets(res.objects);
        });
    }

    public get(): FutureData<DataSet[]> {
        return apiToFuture(
            this.api.models.dataSets.get({
                fields: dataSetFields,
                filter: { formType: { "!eq": "CUSTOM" } },
                translate: "true",
                paging: false,
            })
        ).map(res => {
            return this.createDataSets(res.objects);
        });
    }

    private createBasicDataSets(attrs: BasicDataSetAttrs[]): BasicDataSet[] {
        return filterValidInstances(BasicDataSet, attrs).instances;
    }

    private createDataSets(attrs: DataSetAttrs[]): DataSet[] {
        return filterValidInstances(DataSet, attrs).instances;
    }
}

//CHECK DISPLAY NAMES ARE NOW AUTO TRANSLATED
const dataSetFields = {
    id: true,
    name: true,
    displayFormName: true,
    translations: true,
    formName: true,
    displayName: true,
    formType: true,
    attributeValues: {
        attribute: {
            id: true,
            name: true,
        },
        value: true,
    },
    sections: {
        id: true,
        translations: true,
        name: true,
        displayName: true,
        description: true,
        categoryCombos: {
            id: true,
            displayName: true,
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
