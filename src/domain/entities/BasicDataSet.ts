import { Struct } from "$/domain/entities/generic/Struct";
import { Id, NamedRef } from "$/domain/entities/Ref";

export interface BasicDataSetAttrs {
    id: Id;
    translations: D2Translation[];
    displayName: string;
    formType: DataSetFormType;
    attributeValues: AttributeValue[];
}

export class BasicDataSet extends Struct<BasicDataSetAttrs>() {
    constructor(attrs: BasicDataSetAttrs) {
        super(attrs);
        validateDataSetIsAllowed(this);
    }
}

export function validateDataSetIsAllowed(basicDataSet: BasicDataSet): BasicDataSet {
    const hasHideAttribute = basicDataSet.attributeValues.some(
        av => av.attribute.name === "hideInTallySheet" && av.value === "true"
    );

    const hasCustomFormType = basicDataSet.formType === "CUSTOM";

    if (hasHideAttribute) {
        throw new Error(`DataSet ${basicDataSet.id} marked to be ignored in Tally Sheets`);
    }

    if (hasCustomFormType) {
        throw new Error(`DataSet ${basicDataSet.id} has CUSTOM form type`);
    }

    return basicDataSet;
}

type AttributeValue = {
    value: string;
    attribute: NamedRef;
};

export type DataSetFormType = "DEFAULT" | "CUSTOM" | "SECTION" | "SECTION_MULTIORG";

export type D2Translation = {
    property: string;
    locale: string;
    value: string;
};
