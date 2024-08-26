import { BasicDataSetAttrs } from "$/domain/entities/BasicDataSet";

export function validBasicAttrs(): BasicDataSetAttrs {
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
