import { Id, NamedRef, Ref } from "$/domain/entities/Ref";
import { Maybe } from "$/utils/ts-utils";
import { D2DataSet } from "@eyeseetea/d2-api/2.36";
import { D2Translation } from "@eyeseetea/d2-api/schemas";

export interface DataSet {
    id: Id;
    name: string;
    displayFormName: string;
    translations: D2Translation[];
    formName: string;
    displayName: string;
    formType: D2DataSet["formType"];
    sections: Section[];
    dataSetElements: DataSetElement[];
}

export interface PartialDataSet {
    id: Id;
    translations: D2Translation[];
    displayName: string;
    formType: D2DataSet["formType"];
    attributeValues: AttributeValue[];
}

interface Section {
    id: Id;
    translations: D2Translation[];
    name: string;
    displayName: string;
    description: string;
    categoryCombos: CategoryCombo[];
    dataElements: DataElement[];
    greyedFields: { dataElement: Ref; categoryOptionCombo: Ref }[];
}

interface DataSetElement {
    categoryCombo: Ref;
    dataElement: DataElement;
}

interface DataElement {
    id: Id;
    name: string;
    displayFormName: string;
    translations: D2Translation[];
    formName: string;
    categoryCombo: Maybe<Ref>;
}

interface CategoryCombo {
    id: Id;
    displayName: Maybe<string>;
    categories: Category[];
    categoryOptionCombos: CategoryOptionCombo[];
}

interface Category {
    categoryOptions: CategoryOption[];
}

interface CategoryOption {
    id: Id;
    name: string;
    displayFormName: string;
    translations: D2Translation[];
}

interface CategoryOptionCombo {
    id: Id;
    name: string;
    displayFormName: string;
    categoryOptions: CategoryOption[];
}

interface AttributeValue {
    value: string;
    attribute: NamedRef;
}
