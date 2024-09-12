import { Id } from "$/domain/entities/Ref";
import { BasicDataSet, BasicDataSetAttrs } from "$/domain/entities/BasicDataSet";
import { DataSet, DataSetAttrs } from "$/domain/entities/DataSet";
import { DataSetRepository } from "$/domain/repositories/DataSetRepository";
import { D2Api } from "$/types/d2-api";
import { apiToFuture, FutureData } from "$/data/api-futures";
import { filterValidInstances } from "$/utils/instance-utils";
import { Future } from "$/domain/entities/generic/Future";
import _c from "$/domain/entities/generic/Collection";

export class DataSetD2Repository implements DataSetRepository {
    constructor(private api: D2Api) {}

    public getBasic(orgUnitIds: Id[]): FutureData<BasicDataSet[]> {
        if (_c(orgUnitIds).isEmpty()) return this.getBasicDataSets([]);

        const basicDataSets$ = Future.sequential(
            _c(orgUnitIds)
                .chunk(500)
                .map(ids => this.getBasicDataSets(ids))
                .value()
        );

        return basicDataSets$.map(basicDataSets =>
            _c(basicDataSets)
                .flatten()
                .uniqBy(({ id }) => id)
                .value()
        );
    }

    public getByIds(ids: Id[]): FutureData<DataSet[]> {
        return apiToFuture(
            this.api.models.dataSets.get({
                fields: dataSetFields,
                filter: { id: { in: ids }, formType: { "!eq": "CUSTOM" } },
                paging: false,
            })
        ).map(res => this.createDataSets(res.objects));
    }

    public get(): FutureData<DataSet[]> {
        return apiToFuture(
            this.api.models.dataSets.get({
                fields: dataSetFields,
                filter: { formType: { "!eq": "CUSTOM" } },
                paging: false,
            })
        ).map(res => this.createDataSets(res.objects));
    }

    private getBasicDataSets(orgUnitIds: Id[]): FutureData<BasicDataSet[]> {
        return apiToFuture(
            this.api.models.dataSets.get({
                fields: partialDataSetFields,
                filter: {
                    formType: { "!eq": "CUSTOM" },
                    "organisationUnits.id": _c(orgUnitIds).isNotEmpty()
                        ? { in: orgUnitIds }
                        : undefined,
                },
                paging: false,
            })
        ).map(res => this.createBasicDataSets(res.objects));
    }

    private createBasicDataSets(attrs: BasicDataSetAttrs[]): BasicDataSet[] {
        return filterValidInstances(BasicDataSet, attrs).instances;
    }

    private createDataSets(attrs: DataSetAttrs[]): DataSet[] {
        return filterValidInstances(DataSet, attrs).instances;
    }
}

const dataSetFields = {
    id: true,
    name: true,
    displayName: true,
    formType: true,
    translations: true,
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
        displayDescription: true,
        categoryCombos: {
            id: true,
            categories: {
                categoryOptions: {
                    id: true,
                    name: true,
                    formName: true,
                    displayFormName: true,
                    translations: true,
                },
            },
            categoryOptionCombos: {
                id: true,
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
            formName: true,
            displayFormName: true,
            translations: true,
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
            formName: true,
            displayFormName: true,
            translations: true,
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
