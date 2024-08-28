import { Id, Ref } from "$/domain/entities/Ref";
import { Maybe } from "$/utils/ts-utils";
import { BasicDataSet, BasicDataSetAttrs, D2Translation } from "$/domain/entities/BasicDataSet";

export interface DataSetAttrs extends BasicDataSetAttrs {
    name: string;
    displayFormName: string;
    formName: string;
    sections: Section[];
    dataSetElements: DataSetElement[];
}

export class DataSet extends BasicDataSet {
    name: string;
    displayFormName: string;
    formName: string;
    sections: Section[];
    dataSetElements: DataSetElement[];

    constructor(attrs: DataSetAttrs) {
        super(attrs);
        this.name = attrs.name;
        this.displayFormName = attrs.displayFormName;
        this.formName = attrs.formName;
        this.sections = attrs.sections;
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
