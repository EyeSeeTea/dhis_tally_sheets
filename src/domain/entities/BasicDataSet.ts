import _c from "$/domain/entities/generic/Collection";
import { Struct } from "$/domain/entities/generic/Struct";
import { Id, NamedRef } from "$/domain/entities/Ref";

export interface BasicDataSetAttrs {
    id: Id;
    translations: Translation[];
    displayName: string;
    formType: DataSetFormType;
    attributeValues: AttributeValue[];
}

export class BasicDataSet extends Struct<BasicDataSetAttrs>() {
    constructor(attrs: BasicDataSetAttrs) {
        super(attrs);
        validateDataSetIsAllowed(this);
    }

    getAvailableLocaleCodes(): string[] {
        return _c(this.translations)
            .filter(translation => translation.property === "NAME")
            .map(translation => translation.locale.split("_")[0])
            .concat("en") // Add English because it might not be in translations
            .uniq()
            .compact()
            .value();
    }
}

export function validateDataSetIsAllowed(basicDataSet: BasicDataSet): BasicDataSet {
    const hasHideAttribute = basicDataSet.attributeValues.some(
        av => av.attribute.name === "hideInTallySheet" && av.value === "true"
    );

    const hasCustomFormType = basicDataSet.formType === "CUSTOM";
    const hasDefaultFormType = basicDataSet.formType === "DEFAULT"; // Was not really implemented before

    if (hasHideAttribute) {
        throw new Error(`DataSet ${basicDataSet.id} marked to be ignored in Tally Sheets`);
    } else if (hasCustomFormType || hasDefaultFormType) {
        throw new Error(`DataSet ${basicDataSet.id} has ${basicDataSet.formType} form type`);
    } else {
        return basicDataSet;
    }
}

type AttributeValue = {
    value: string;
    attribute: NamedRef;
};

export type DataSetFormType = "DEFAULT" | "CUSTOM" | "SECTION" | "SECTION_MULTIORG";

export type Translation = {
    property: string;
    locale: string;
    value: string;
};
