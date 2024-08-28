import { BasicDataSet, BasicDataSetAttrs } from "$/domain/entities/BasicDataSet";
import { DataSet, DataSetAttrs } from "$/domain/entities/DataSet";

export const validBasic = new BasicDataSet(validBasicAttrs());
export const valid = new DataSet(validAttrs());
export const withSections = new DataSet(withSectionsAttrs());

function validBasicAttrs(): BasicDataSetAttrs {
    return createBasicAttrs();
}

export function basicAttrsWithCustomFormType(): BasicDataSetAttrs {
    return createBasicAttrs({ formType: "CUSTOM" });
}

export function basicAttrsWithHideInTallySheetsAttribute(): BasicDataSetAttrs {
    return createBasicAttrs({
        attributeValues: [
            { value: "true", attribute: { id: "BwyMfDBLih9", name: "hideInTallySheet" } },
        ],
    });
}

function validAttrs(): DataSetAttrs {
    return createAttrs();
}

function withSectionsAttrs(): DataSetAttrs {
    return createAttrs({
        sections: [
            {
                id: "section1",
                translations: [],
                name: "Section 1",
                displayName: "Section 1",
                description: "",
                categoryCombos: [],
                dataElements: [],
                greyedFields: [],
            },
        ],
    });
}

function createBasicAttrs(options?: {
    formType?: BasicDataSetAttrs["formType"];
    attributeValues?: BasicDataSetAttrs["attributeValues"];
}): BasicDataSetAttrs {
    const formType = options?.formType ?? "DEFAULT";
    const attributeValues = options?.attributeValues ?? [];

    return {
        id: "BwyMfDBLih9",
        translations: [],
        displayName: "Basic Data Set",
        formType: formType,
        attributeValues: attributeValues,
    };
}

function createAttrs(options?: { sections?: DataSetAttrs["sections"] }): DataSetAttrs {
    return {
        ...createBasicAttrs(),
        name: "",
        displayFormName: "",
        formName: "",
        sections: options?.sections ?? [],
        dataSetElements: [],
    };
}
