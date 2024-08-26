import { Struct } from "$/domain/entities/generic/Struct";
import { Id, Ref } from "$/domain/entities/Ref";
import { Maybe } from "$/utils/ts-utils";
import {
    BasicDataSetAttrs,
    D2Translation,
    validateDataSetIsAllowed,
} from "$/domain/entities/BasicDataSet";

export interface DataSetAttrs extends BasicDataSetAttrs {
    name: string;
    displayFormName: string;
    formName: string;
    sections: Section[];
    dataSetElements: DataSetElement[];
}

export class DataSet extends Struct<DataSetAttrs>() {
    constructor(attrs: DataSetAttrs) {
        super(attrs);
        validateDataSetIsAllowed(this);
    }

    removeSection(sectionId: Id): DataSet {
        return this._update({
            sections: this.sections.filter(section => section.id !== sectionId),
        });
    }
}

type Section = {
    id: Id;
    translations: D2Translation[];
    name: string;
    displayName: string;
    description: string;
    categoryCombos: CategoryCombo[];
    dataElements: DataElement[];
    greyedFields: { dataElement: Ref; categoryOptionCombo: Ref }[];
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
    categoryCombo: Maybe<Ref>;
};

type CategoryCombo = {
    id: Id;
    displayName: Maybe<string>;
    categories: Category[];
    categoryOptionCombos: CategoryOptionCombo[];
};

type Category = {
    categoryOptions: CategoryOption[];
};

type CategoryOption = {
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
};
