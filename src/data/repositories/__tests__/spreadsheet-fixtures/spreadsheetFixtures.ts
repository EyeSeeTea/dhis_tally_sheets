import { DataSet } from "$/domain/entities/DataSet";
import { HashMap } from "$/domain/entities/generic/HashMap";
import { Locale } from "$/domain/entities/Locale";

type LocaleCodes = "ar" | "en" | "es" | "fr" | "pt";

const arabic: Locale = {
    id: "ar",
    name: "Arabic",
    displayName: "Arabic",
    code: "ar",
};

const english: Locale = {
    id: "en",
    name: "English",
    displayName: "English",
    code: "en",
};

export const spanish: Locale = {
    id: "es",
    name: "Spanish",
    displayName: "Spanish",
    code: "es",
};

const french: Locale = {
    id: "fr",
    name: "French",
    displayName: "French",
    code: "fr",
};

const portuguese: Locale = {
    id: "pt",
    name: "Portuguese",
    displayName: "Portuguese",
    code: "pt",
};

export const locales: Locale[] = [english, spanish, french, portuguese, arabic];

export const processedDataSet: DataSet = new DataSet({
    name: "Processed DataSet",
    id: "processed_data_set",
    formType: "SECTION" as const,
    displayName: "Processed DataSet",
    dataSetElements: [],
    translations: [
        {
            property: "NAME",
            locale: "en",
            value: "Processed DataSet",
        },
        {
            property: "NAME",
            locale: "es",
            value: "Conjunto de datos procesado",
        },
        {
            property: "NAME",
            locale: "fr",
            value: "Ensemble de données traitées",
        },
        {
            property: "NAME",
            locale: "pt",
            value: "Conjunto de dados processados",
        },
        {
            property: "NAME",
            locale: "ar",
            value: "مجموعة البيانات المعالجة",
        },
    ],
    attributeValues: [],
    sections: [
        {
            name: "Section Two Categories",
            id: "sec_two_categores",
            displayName: "Section Two Categories",
            greyedFields: [],
            translations: [
                {
                    property: "NAME",
                    locale: "en",
                    value: "Section Two Categories",
                },
                {
                    property: "NAME",
                    locale: "es",
                    value: "Sección Dos Categorías",
                },
                {
                    property: "NAME",
                    locale: "fr",
                    value: "Section Deux Catégories",
                },
                {
                    property: "NAME",
                    locale: "pt",
                    value: "Seção Duas Categorias",
                },
                {
                    property: "NAME",
                    locale: "ar",
                    value: "قسمان فئتان",
                },
            ],
            categoryCombos: [
                {
                    id: "cc_1",
                    categories: [
                        {
                            categoryOptions: [
                                {
                                    name: "Option A",
                                    id: "option_a",
                                    displayFormName: "Option A",
                                    translations: [
                                        {
                                            property: "NAME",
                                            locale: "en",
                                            value: "Option A",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "es",
                                            value: "Opción A",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "fr",
                                            value: "Option A",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "pt",
                                            value: "Opção A",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "ar",
                                            value: "الخيار أ",
                                        },
                                    ],
                                },
                                {
                                    name: "Option B",
                                    id: "option_b",
                                    displayFormName: "Option B",
                                    translations: [
                                        {
                                            property: "NAME",
                                            locale: "en",
                                            value: "Option B",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "es",
                                            value: "Opción B",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "fr",
                                            value: "Option B",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "pt",
                                            value: "Opção B",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "ar",
                                            value: "الخيار ب",
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            categoryOptions: [
                                {
                                    name: "Option 1",
                                    id: "option_1",
                                    displayFormName: "Option 1",
                                    translations: [
                                        {
                                            property: "NAME",
                                            locale: "en",
                                            value: "Option 1",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "es",
                                            value: "Opción 1",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "fr",
                                            value: "Option 1",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "pt",
                                            value: "Opção 1",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "ar",
                                            value: "الخيار 1",
                                        },
                                    ],
                                },
                                {
                                    name: "Option 2",
                                    id: "option_2",
                                    displayFormName: "Option 2",
                                    translations: [
                                        {
                                            property: "NAME",
                                            locale: "en",
                                            value: "Option 2",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "es",
                                            value: "Opción 2",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "fr",
                                            value: "Option 2",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "pt",
                                            value: "Opção 2",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "ar",
                                            value: "الخيار 2",
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                    categoryOptionCombos: [
                        {
                            id: "opt_a_1",
                            categoryOptions: [
                                {
                                    name: "Option A",
                                    id: "option_a",
                                    displayFormName: "Option A",
                                    translations: [
                                        {
                                            property: "NAME",
                                            locale: "en",
                                            value: "Option A",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "es",
                                            value: "Opción A",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "fr",
                                            value: "Option A",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "pt",
                                            value: "Opção A",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "ar",
                                            value: "الخيار أ",
                                        },
                                    ],
                                },
                                {
                                    name: "Option 1",
                                    id: "option_1",
                                    displayFormName: "Option 1",
                                    translations: [
                                        {
                                            property: "NAME",
                                            locale: "en",
                                            value: "Option 1",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "es",
                                            value: "Opción 1",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "fr",
                                            value: "Option 1",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "pt",
                                            value: "Opção 1",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "ar",
                                            value: "الخيار 1",
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            id: "opt_a_2",
                            categoryOptions: [
                                {
                                    name: "Option A",
                                    id: "option_a",
                                    displayFormName: "Option A",
                                    translations: [
                                        {
                                            property: "NAME",
                                            locale: "en",
                                            value: "Option A",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "es",
                                            value: "Opción A",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "fr",
                                            value: "Option A",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "pt",
                                            value: "Opção A",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "ar",
                                            value: "الخيار أ",
                                        },
                                    ],
                                },
                                {
                                    name: "Option 2",
                                    id: "option_2",
                                    displayFormName: "Option 2",
                                    translations: [
                                        {
                                            property: "NAME",
                                            locale: "en",
                                            value: "Option 2",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "es",
                                            value: "Opción 2",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "fr",
                                            value: "Option 2",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "pt",
                                            value: "Opção 2",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "ar",
                                            value: "الخيار 2",
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            id: "opt_b_1",
                            categoryOptions: [
                                {
                                    name: "Option B",
                                    id: "option_b",
                                    displayFormName: "Option B",
                                    translations: [
                                        {
                                            property: "NAME",
                                            locale: "en",
                                            value: "Option B",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "es",
                                            value: "Opción B",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "fr",
                                            value: "Option B",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "pt",
                                            value: "Opção B",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "ar",
                                            value: "الخيار ب",
                                        },
                                    ],
                                },
                                {
                                    name: "Option 1",
                                    id: "option_1",
                                    displayFormName: "Option 1",
                                    translations: [
                                        {
                                            property: "NAME",
                                            locale: "en",
                                            value: "Option 1",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "es",
                                            value: "Opción 1",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "fr",
                                            value: "Option 1",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "pt",
                                            value: "Opção 1",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "ar",
                                            value: "الخيار 1",
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            id: "opt_b_2",
                            categoryOptions: [
                                {
                                    name: "Option B",
                                    id: "option_b",
                                    displayFormName: "Option B",
                                    translations: [
                                        {
                                            property: "NAME",
                                            locale: "en",
                                            value: "Option B",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "es",
                                            value: "Opción B",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "fr",
                                            value: "Option B",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "pt",
                                            value: "Opção B",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "ar",
                                            value: "الخيار ب",
                                        },
                                    ],
                                },
                                {
                                    name: "Option 2",
                                    id: "option_2",
                                    displayFormName: "Option 2",
                                    translations: [
                                        {
                                            property: "NAME",
                                            locale: "en",
                                            value: "Option 2",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "es",
                                            value: "Opción 2",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "fr",
                                            value: "Option 2",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "pt",
                                            value: "Opção 2",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "ar",
                                            value: "الخيار 2",
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                    dataElements: [
                        {
                            name: "DataElement 0",
                            id: "de_0",
                            formName: "DataElement 0",
                            displayFormName: "DataElement 0",
                            categoryCombo: {
                                id: "cc_1",
                            },
                            translations: [
                                {
                                    property: "NAME",
                                    locale: "en",
                                    value: "DataElement 0",
                                },
                                {
                                    property: "NAME",
                                    locale: "es",
                                    value: "Elemento de datos 0",
                                },
                                {
                                    property: "NAME",
                                    locale: "fr",
                                    value: "Élément de données 0",
                                },
                                {
                                    property: "NAME",
                                    locale: "pt",
                                    value: "Elemento de dados 0",
                                },
                                {
                                    property: "NAME",
                                    locale: "ar",
                                    value: "عنصر البيانات 0",
                                },
                            ],
                        },
                        {
                            name: "DataElement 1",
                            id: "de_1",
                            formName: "DataElement 1",
                            displayFormName: "DataElement 1",
                            categoryCombo: {
                                id: "cc_1",
                            },
                            translations: [
                                {
                                    property: "NAME",
                                    locale: "en",
                                    value: "DataElement 1",
                                },
                                {
                                    property: "NAME",
                                    locale: "es",
                                    value: "Elemento de datos 1",
                                },
                                {
                                    property: "NAME",
                                    locale: "fr",
                                    value: "Élément de données 1",
                                },
                                {
                                    property: "NAME",
                                    locale: "pt",
                                    value: "Elemento de dados 1",
                                },
                                {
                                    property: "NAME",
                                    locale: "ar",
                                    value: "عنصر البيانات 1",
                                },
                            ],
                        },
                        {
                            name: "DataElement 2",
                            id: "de_2",
                            formName: "DataElement 2",
                            displayFormName: "DataElement 2",
                            categoryCombo: {
                                id: "cc_1",
                            },
                            translations: [
                                {
                                    property: "NAME",
                                    locale: "en",
                                    value: "DataElement 2",
                                },
                                {
                                    property: "NAME",
                                    locale: "es",
                                    value: "Elemento de datos 2",
                                },
                                {
                                    property: "NAME",
                                    locale: "fr",
                                    value: "Élément de données 2",
                                },
                                {
                                    property: "NAME",
                                    locale: "pt",
                                    value: "Elemento de dados 2",
                                },
                                {
                                    property: "NAME",
                                    locale: "ar",
                                    value: "عنصر البيانات 2",
                                },
                            ],
                        },
                    ],
                    greyedFields: [],
                },
            ],
            dataElements: [
                {
                    name: "DataElement 0",
                    id: "de_0",
                    formName: "DataElement 0",
                    displayFormName: "DataElement 0",
                    categoryCombo: {
                        id: "cc_1",
                    },
                    translations: [
                        {
                            property: "NAME",
                            locale: "en",
                            value: "DataElement 0",
                        },
                        {
                            property: "NAME",
                            locale: "es",
                            value: "Elemento de datos 0",
                        },
                        {
                            property: "NAME",
                            locale: "fr",
                            value: "Élément de données 0",
                        },
                        {
                            property: "NAME",
                            locale: "pt",
                            value: "Elemento de dados 0",
                        },
                        {
                            property: "NAME",
                            locale: "ar",
                            value: "عنصر البيانات 0",
                        },
                    ],
                },
                {
                    name: "DataElement 1",
                    id: "de_1",
                    formName: "DataElement 1",
                    displayFormName: "DataElement 1",
                    categoryCombo: {
                        id: "cc_1",
                    },
                    translations: [
                        {
                            property: "NAME",
                            locale: "en",
                            value: "DataElement 1",
                        },
                        {
                            property: "NAME",
                            locale: "es",
                            value: "Elemento de datos 1",
                        },
                        {
                            property: "NAME",
                            locale: "fr",
                            value: "Élément de données 1",
                        },
                        {
                            property: "NAME",
                            locale: "pt",
                            value: "Elemento de dados 1",
                        },
                        {
                            property: "NAME",
                            locale: "ar",
                            value: "عنصر البيانات 1",
                        },
                    ],
                },
                {
                    name: "DataElement 2",
                    id: "de_2",
                    formName: "DataElement 2",
                    displayFormName: "DataElement 2",
                    categoryCombo: {
                        id: "cc_1",
                    },
                    translations: [
                        {
                            property: "NAME",
                            locale: "en",
                            value: "DataElement 2",
                        },
                        {
                            property: "NAME",
                            locale: "es",
                            value: "Elemento de datos 2",
                        },
                        {
                            property: "NAME",
                            locale: "fr",
                            value: "Élément de données 2",
                        },
                        {
                            property: "NAME",
                            locale: "pt",
                            value: "Elemento de dados 2",
                        },
                        {
                            property: "NAME",
                            locale: "ar",
                            value: "عنصر البيانات 2",
                        },
                    ],
                },
            ],
        },
        {
            name: "Section Default",
            id: "sec_default",
            displayName: "Section Default",
            greyedFields: [],
            translations: [
                {
                    property: "NAME",
                    locale: "en",
                    value: "Section Default",
                },
                {
                    property: "NAME",
                    locale: "es",
                    value: "Sección predeterminada",
                },
                {
                    property: "NAME",
                    locale: "fr",
                    value: "Section par défaut",
                },
                {
                    property: "NAME",
                    locale: "pt",
                    value: "Seção padrão",
                },
                {
                    property: "NAME",
                    locale: "ar",
                    value: "القسم الافتراضي",
                },
            ],
            categoryCombos: [
                {
                    id: "cc_default",
                    categories: [
                        {
                            categoryOptions: [
                                {
                                    name: "default",
                                    id: "co_default",
                                    displayFormName: "Value",
                                    translations: [
                                        {
                                            property: "NAME",
                                            locale: "en",
                                            value: "Value",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "es",
                                            value: "Valor",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "fr",
                                            value: "Valeur",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "pt",
                                            value: "Valor",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "ar",
                                            value: "القيمة",
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                    categoryOptionCombos: [],
                    dataElements: [
                        {
                            name: "DataElement 0",
                            id: "de_0",
                            formName: "DataElement 0",
                            displayFormName: "DataElement 0",
                            categoryCombo: {
                                id: "cc_default",
                            },
                            translations: [
                                {
                                    property: "NAME",
                                    locale: "en",
                                    value: "DataElement 0",
                                },
                                {
                                    property: "NAME",
                                    locale: "es",
                                    value: "Elemento de datos 0",
                                },
                                {
                                    property: "NAME",
                                    locale: "fr",
                                    value: "Élément de données 0",
                                },
                                {
                                    property: "NAME",
                                    locale: "pt",
                                    value: "Elemento de dados 0",
                                },
                                {
                                    property: "NAME",
                                    locale: "ar",
                                    value: "عنصر البيانات 0",
                                },
                            ],
                        },
                        {
                            name: "DataElement 1",
                            id: "de_1",
                            formName: "DataElement 1",
                            displayFormName: "DataElement 1",
                            categoryCombo: {
                                id: "cc_default",
                            },
                            translations: [
                                {
                                    property: "NAME",
                                    locale: "en",
                                    value: "DataElement 1",
                                },
                                {
                                    property: "NAME",
                                    locale: "es",
                                    value: "Elemento de datos 1",
                                },
                                {
                                    property: "NAME",
                                    locale: "fr",
                                    value: "Élément de données 1",
                                },
                                {
                                    property: "NAME",
                                    locale: "pt",
                                    value: "Elemento de dados 1",
                                },
                                {
                                    property: "NAME",
                                    locale: "ar",
                                    value: "عنصر البيانات 1",
                                },
                            ],
                        },
                        {
                            name: "DataElement 2",
                            id: "de_2",
                            formName: "DataElement 2",
                            displayFormName: "DataElement 2",
                            categoryCombo: {
                                id: "cc_default",
                            },
                            translations: [
                                {
                                    property: "NAME",
                                    locale: "en",
                                    value: "DataElement 2",
                                },
                                {
                                    property: "NAME",
                                    locale: "es",
                                    value: "Elemento de datos 2",
                                },
                                {
                                    property: "NAME",
                                    locale: "fr",
                                    value: "Élément de données 2",
                                },
                                {
                                    property: "NAME",
                                    locale: "pt",
                                    value: "Elemento de dados 2",
                                },
                                {
                                    property: "NAME",
                                    locale: "ar",
                                    value: "عنصر البيانات 2",
                                },
                            ],
                        },
                    ],
                    greyedFields: [],
                },
            ],
            dataElements: [
                {
                    name: "DataElement 0",
                    id: "de_0",
                    formName: "DataElement 0",
                    displayFormName: "DataElement 0",
                    categoryCombo: {
                        id: "cc_default",
                    },
                    translations: [
                        {
                            property: "NAME",
                            locale: "en",
                            value: "DataElement 0",
                        },
                        {
                            property: "NAME",
                            locale: "es",
                            value: "Elemento de datos 0",
                        },
                        {
                            property: "NAME",
                            locale: "fr",
                            value: "Élément de données 0",
                        },
                        {
                            property: "NAME",
                            locale: "pt",
                            value: "Elemento de dados 0",
                        },
                        {
                            property: "NAME",
                            locale: "ar",
                            value: "عنصر البيانات 0",
                        },
                    ],
                },
                {
                    name: "DataElement 1",
                    id: "de_1",
                    formName: "DataElement 1",
                    displayFormName: "DataElement 1",
                    categoryCombo: {
                        id: "cc_default",
                    },
                    translations: [
                        {
                            property: "NAME",
                            locale: "en",
                            value: "DataElement 1",
                        },
                        {
                            property: "NAME",
                            locale: "es",
                            value: "Elemento de datos 1",
                        },
                        {
                            property: "NAME",
                            locale: "fr",
                            value: "Élément de données 1",
                        },
                        {
                            property: "NAME",
                            locale: "pt",
                            value: "Elemento de dados 1",
                        },
                        {
                            property: "NAME",
                            locale: "ar",
                            value: "عنصر البيانات 1",
                        },
                    ],
                },
                {
                    name: "DataElement 2",
                    id: "de_2",
                    formName: "DataElement 2",
                    displayFormName: "DataElement 2",
                    categoryCombo: {
                        id: "cc_default",
                    },
                    translations: [
                        {
                            property: "NAME",
                            locale: "en",
                            value: "DataElement 2",
                        },
                        {
                            property: "NAME",
                            locale: "es",
                            value: "Elemento de datos 2",
                        },
                        {
                            property: "NAME",
                            locale: "fr",
                            value: "Élément de données 2",
                        },
                        {
                            property: "NAME",
                            locale: "pt",
                            value: "Elemento de dados 2",
                        },
                        {
                            property: "NAME",
                            locale: "ar",
                            value: "عنصر البيانات 2",
                        },
                    ],
                },
            ],
        },
        {
            name: "Section X/Y",
            id: "sec_x_y",
            displayName: "Section X/Y",
            greyedFields: [],
            translations: [
                {
                    property: "NAME",
                    locale: "en",
                    value: "Section X/Y",
                },
                {
                    property: "NAME",
                    locale: "es",
                    value: "Sección X/Y",
                },
                {
                    property: "NAME",
                    locale: "fr",
                    value: "Section X/Y",
                },
                {
                    property: "NAME",
                    locale: "pt",
                    value: "Seção X/Y",
                },
                {
                    property: "NAME",
                    locale: "ar",
                    value: "القسم X/Y",
                },
            ],
            categoryCombos: [
                {
                    id: "cc_2",
                    categories: [
                        {
                            categoryOptions: [
                                {
                                    name: "Option X",
                                    id: "option_x",
                                    displayFormName: "Option X",
                                    translations: [
                                        {
                                            property: "NAME",
                                            locale: "en",
                                            value: "Option X",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "es",
                                            value: "Opción X",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "fr",
                                            value: "Option X",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "pt",
                                            value: "Opção X",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "ar",
                                            value: "الخيار X",
                                        },
                                    ],
                                },
                                {
                                    name: "Option Y",
                                    id: "option_y",
                                    displayFormName: "Option Y",
                                    translations: [
                                        {
                                            property: "NAME",
                                            locale: "en",
                                            value: "Option Y",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "es",
                                            value: "Opción Y",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "fr",
                                            value: "Option Y",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "pt",
                                            value: "Opção Y",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "ar",
                                            value: "الخيار Y",
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                    categoryOptionCombos: [
                        {
                            id: "coc_x",
                            categoryOptions: [
                                {
                                    name: "Option X",
                                    id: "option_x",
                                    displayFormName: "Option X",
                                    translations: [
                                        {
                                            property: "NAME",
                                            locale: "en",
                                            value: "Option X",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "es",
                                            value: "Opción X",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "fr",
                                            value: "Option X",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "pt",
                                            value: "Opção X",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "ar",
                                            value: "الخيار X",
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            id: "coc_y",
                            categoryOptions: [
                                {
                                    name: "Option Y",
                                    id: "option_y",
                                    displayFormName: "Option Y",
                                    translations: [
                                        {
                                            property: "NAME",
                                            locale: "en",
                                            value: "Option Y",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "es",
                                            value: "Opción Y",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "fr",
                                            value: "Option Y",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "pt",
                                            value: "Opção Y",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "ar",
                                            value: "الخيار Y",
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                    dataElements: [
                        {
                            name: "DataElement 0",
                            id: "de_0",
                            formName: "DataElement 0",
                            displayFormName: "DataElement 0",
                            categoryCombo: {
                                id: "cc_2",
                            },
                            translations: [
                                {
                                    property: "NAME",
                                    locale: "en",
                                    value: "DataElement 0",
                                },
                                {
                                    property: "NAME",
                                    locale: "es",
                                    value: "Elemento de datos 0",
                                },
                                {
                                    property: "NAME",
                                    locale: "fr",
                                    value: "Élément de données 0",
                                },
                                {
                                    property: "NAME",
                                    locale: "pt",
                                    value: "Elemento de dados 0",
                                },
                                {
                                    property: "NAME",
                                    locale: "ar",
                                    value: "عنصر البيانات 0",
                                },
                            ],
                        },
                        {
                            name: "DataElement 1",
                            id: "de_1",
                            formName: "DataElement 1",
                            displayFormName: "DataElement 1",
                            categoryCombo: {
                                id: "cc_2",
                            },
                            translations: [
                                {
                                    property: "NAME",
                                    locale: "en",
                                    value: "DataElement 1",
                                },
                                {
                                    property: "NAME",
                                    locale: "es",
                                    value: "Elemento de datos 1",
                                },
                                {
                                    property: "NAME",
                                    locale: "fr",
                                    value: "Élément de données 1",
                                },
                                {
                                    property: "NAME",
                                    locale: "pt",
                                    value: "Elemento de dados 1",
                                },
                                {
                                    property: "NAME",
                                    locale: "ar",
                                    value: "عنصر البيانات 1",
                                },
                            ],
                        },
                        {
                            name: "DataElement 2",
                            id: "de_2",
                            formName: "DataElement 2",
                            displayFormName: "DataElement 2",
                            categoryCombo: {
                                id: "cc_2",
                            },
                            translations: [
                                {
                                    property: "NAME",
                                    locale: "en",
                                    value: "DataElement 2",
                                },
                                {
                                    property: "NAME",
                                    locale: "es",
                                    value: "Elemento de datos 2",
                                },
                                {
                                    property: "NAME",
                                    locale: "fr",
                                    value: "Élément de données 2",
                                },
                                {
                                    property: "NAME",
                                    locale: "pt",
                                    value: "Elemento de dados 2",
                                },
                                {
                                    property: "NAME",
                                    locale: "ar",
                                    value: "عنصر البيانات 2",
                                },
                            ],
                        },
                    ],
                    greyedFields: [],
                },
            ],
            dataElements: [
                {
                    name: "DataElement 0",
                    id: "de_0",
                    formName: "DataElement 0",
                    displayFormName: "DataElement 0",
                    categoryCombo: {
                        id: "cc_2",
                    },
                    translations: [
                        {
                            property: "NAME",
                            locale: "en",
                            value: "DataElement 0",
                        },
                        {
                            property: "NAME",
                            locale: "es",
                            value: "Elemento de datos 0",
                        },
                        {
                            property: "NAME",
                            locale: "fr",
                            value: "Élément de données 0",
                        },
                        {
                            property: "NAME",
                            locale: "pt",
                            value: "Elemento de dados 0",
                        },
                        {
                            property: "NAME",
                            locale: "ar",
                            value: "عنصر البيانات 0",
                        },
                    ],
                },
                {
                    name: "DataElement 1",
                    id: "de_1",
                    formName: "DataElement 1",
                    displayFormName: "DataElement 1",
                    categoryCombo: {
                        id: "cc_2",
                    },
                    translations: [
                        {
                            property: "NAME",
                            locale: "en",
                            value: "DataElement 1",
                        },
                        {
                            property: "NAME",
                            locale: "es",
                            value: "Elemento de datos 1",
                        },
                        {
                            property: "NAME",
                            locale: "fr",
                            value: "Élément de données 1",
                        },
                        {
                            property: "NAME",
                            locale: "pt",
                            value: "Elemento de dados 1",
                        },
                        {
                            property: "NAME",
                            locale: "ar",
                            value: "عنصر البيانات 1",
                        },
                    ],
                },
                {
                    name: "DataElement 2",
                    id: "de_2",
                    formName: "DataElement 2",
                    displayFormName: "DataElement 2",
                    categoryCombo: {
                        id: "cc_2",
                    },
                    translations: [
                        {
                            property: "NAME",
                            locale: "en",
                            value: "DataElement 2",
                        },
                        {
                            property: "NAME",
                            locale: "es",
                            value: "Elemento de datos 2",
                        },
                        {
                            property: "NAME",
                            locale: "fr",
                            value: "Élément de données 2",
                        },
                        {
                            property: "NAME",
                            locale: "pt",
                            value: "Elemento de dados 2",
                        },
                        {
                            property: "NAME",
                            locale: "ar",
                            value: "عنصر البيانات 2",
                        },
                    ],
                },
            ],
        },
        {
            name: "Section Greyed Fields",
            id: "sec_greyed_fields",
            displayName: "Section Greyed Fields",
            greyedFields: [
                {
                    categoryOptionCombo: {
                        id: "coc_baz",
                    },
                    dataElement: {
                        id: "de_foobar_0",
                    },
                },
                {
                    categoryOptionCombo: {
                        id: "coc_bar",
                    },
                    dataElement: {
                        id: "de_foobar_3",
                    },
                },
                {
                    categoryOptionCombo: {
                        id: "coc_qux",
                    },
                    dataElement: {
                        id: "de_foobar_1",
                    },
                },
                {
                    categoryOptionCombo: {
                        id: "coc_qux",
                    },
                    dataElement: {
                        id: "de_foobar_0",
                    },
                },
                {
                    categoryOptionCombo: {
                        id: "coc_baz",
                    },
                    dataElement: {
                        id: "de_foobar_2",
                    },
                },
                {
                    categoryOptionCombo: {
                        id: "coc_baz",
                    },
                    dataElement: {
                        id: "de_foobar_3",
                    },
                },
                {
                    categoryOptionCombo: {
                        id: "coc_bar",
                    },
                    dataElement: {
                        id: "de_foobar_0",
                    },
                },
                {
                    categoryOptionCombo: {
                        id: "coc_bar",
                    },
                    dataElement: {
                        id: "de_foobar_1",
                    },
                },
                {
                    categoryOptionCombo: {
                        id: "coc_qux",
                    },
                    dataElement: {
                        id: "de_foobar_2",
                    },
                },
                {
                    categoryOptionCombo: {
                        id: "coc_bar",
                    },
                    dataElement: {
                        id: "de_foobar_2",
                    },
                },
                {
                    categoryOptionCombo: {
                        id: "coc_baz",
                    },
                    dataElement: {
                        id: "de_foobar_1",
                    },
                },
                {
                    categoryOptionCombo: {
                        id: "coc_qux",
                    },
                    dataElement: {
                        id: "de_foobar_3",
                    },
                },
            ],
            translations: [
                {
                    property: "NAME",
                    locale: "en",
                    value: "Section Greyed Fields",
                },
                {
                    property: "NAME",
                    locale: "es",
                    value: "Sección de campos grises",
                },
                {
                    property: "NAME",
                    locale: "fr",
                    value: "Section des champs grisés",
                },
                {
                    property: "NAME",
                    locale: "pt",
                    value: "Seção de campos cinza",
                },
                {
                    property: "NAME",
                    locale: "ar",
                    value: "القسم الرمادي",
                },
            ],
            categoryCombos: [
                {
                    id: "foobar",
                    categories: [
                        {
                            categoryOptions: [
                                {
                                    name: "Foo",
                                    id: "foo",
                                    displayFormName: "Foo",
                                    translations: [],
                                },
                                {
                                    name: "Bar",
                                    id: "bar",
                                    displayFormName: "Bar",
                                    translations: [],
                                },
                                {
                                    name: "Baz",
                                    id: "baz",
                                    displayFormName: "Baz",
                                    translations: [],
                                },
                                {
                                    name: "Qux",
                                    id: "qux",
                                    displayFormName: "Qux",
                                    translations: [],
                                },
                            ],
                        },
                    ],
                    categoryOptionCombos: [
                        {
                            id: "coc_foo",
                            categoryOptions: [
                                {
                                    name: "Foo",
                                    id: "foo",
                                    displayFormName: "Foo",
                                    translations: [],
                                },
                            ],
                        },
                        {
                            id: "coc_bar",
                            categoryOptions: [
                                {
                                    name: "Bar",
                                    id: "bar",
                                    displayFormName: "Bar",
                                    translations: [],
                                },
                            ],
                        },
                        {
                            id: "coc_baz",
                            categoryOptions: [
                                {
                                    name: "Baz",
                                    id: "baz",
                                    displayFormName: "Baz",
                                    translations: [],
                                },
                            ],
                        },
                        {
                            id: "coc_qux",
                            categoryOptions: [
                                {
                                    name: "Qux",
                                    id: "qux",
                                    displayFormName: "Qux",
                                    translations: [],
                                },
                            ],
                        },
                    ],
                    dataElements: [
                        {
                            name: "DataElement 0",
                            id: "de_foobar_0",
                            formName: "DataElement 0",
                            displayFormName: "DataElement 0",
                            categoryCombo: {
                                id: "foobar",
                            },
                            translations: [
                                {
                                    property: "NAME",
                                    locale: "en",
                                    value: "DataElement 0",
                                },
                                {
                                    property: "NAME",
                                    locale: "es",
                                    value: "Elemento de datos 0",
                                },
                                {
                                    property: "NAME",
                                    locale: "fr",
                                    value: "Élément de données 0",
                                },
                                {
                                    property: "NAME",
                                    locale: "pt",
                                    value: "Elemento de dados 0",
                                },
                                {
                                    property: "NAME",
                                    locale: "ar",
                                    value: "عنصر البيانات 0",
                                },
                            ],
                        },
                        {
                            name: "DataElement 1",
                            id: "de_foobar_1",
                            formName: "DataElement 1",
                            displayFormName: "DataElement 1",
                            categoryCombo: {
                                id: "foobar",
                            },
                            translations: [
                                {
                                    property: "NAME",
                                    locale: "en",
                                    value: "DataElement 1",
                                },
                                {
                                    property: "NAME",
                                    locale: "es",
                                    value: "Elemento de datos 1",
                                },
                                {
                                    property: "NAME",
                                    locale: "fr",
                                    value: "Élément de données 1",
                                },
                                {
                                    property: "NAME",
                                    locale: "pt",
                                    value: "Elemento de dados 1",
                                },
                                {
                                    property: "NAME",
                                    locale: "ar",
                                    value: "عنصر البيانات 1",
                                },
                            ],
                        },
                        {
                            name: "DataElement 2",
                            id: "de_foobar_2",
                            formName: "DataElement 2",
                            displayFormName: "DataElement 2",
                            categoryCombo: {
                                id: "foobar",
                            },
                            translations: [
                                {
                                    property: "NAME",
                                    locale: "en",
                                    value: "DataElement 2",
                                },
                                {
                                    property: "NAME",
                                    locale: "es",
                                    value: "Elemento de datos 2",
                                },
                                {
                                    property: "NAME",
                                    locale: "fr",
                                    value: "Élément de données 2",
                                },
                                {
                                    property: "NAME",
                                    locale: "pt",
                                    value: "Elemento de dados 2",
                                },
                                {
                                    property: "NAME",
                                    locale: "ar",
                                    value: "عنصر البيانات 2",
                                },
                            ],
                        },
                        {
                            name: "DataElement 3",
                            id: "de_foobar_3",
                            formName: "DataElement 3",
                            displayFormName: "DataElement 3",
                            categoryCombo: {
                                id: "foobar",
                            },
                            translations: [
                                {
                                    property: "NAME",
                                    locale: "en",
                                    value: "DataElement 3",
                                },
                                {
                                    property: "NAME",
                                    locale: "es",
                                    value: "Elemento de datos 3",
                                },
                                {
                                    property: "NAME",
                                    locale: "fr",
                                    value: "Élément de données 3",
                                },
                                {
                                    property: "NAME",
                                    locale: "pt",
                                    value: "Elemento de dados 3",
                                },
                                {
                                    property: "NAME",
                                    locale: "ar",
                                    value: "عنصر البيانات 3",
                                },
                            ],
                        },
                    ],
                    greyedFields: [
                        {
                            categoryOptionCombo: {
                                id: "coc_baz",
                            },
                            dataElement: {
                                id: "de_foobar_0",
                            },
                        },
                        {
                            categoryOptionCombo: {
                                id: "coc_bar",
                            },
                            dataElement: {
                                id: "de_foobar_3",
                            },
                        },
                        {
                            categoryOptionCombo: {
                                id: "coc_qux",
                            },
                            dataElement: {
                                id: "de_foobar_1",
                            },
                        },
                        {
                            categoryOptionCombo: {
                                id: "coc_qux",
                            },
                            dataElement: {
                                id: "de_foobar_0",
                            },
                        },
                        {
                            categoryOptionCombo: {
                                id: "coc_baz",
                            },
                            dataElement: {
                                id: "de_foobar_2",
                            },
                        },
                        {
                            categoryOptionCombo: {
                                id: "coc_baz",
                            },
                            dataElement: {
                                id: "de_foobar_3",
                            },
                        },
                        {
                            categoryOptionCombo: {
                                id: "coc_bar",
                            },
                            dataElement: {
                                id: "de_foobar_0",
                            },
                        },
                        {
                            categoryOptionCombo: {
                                id: "coc_bar",
                            },
                            dataElement: {
                                id: "de_foobar_1",
                            },
                        },
                        {
                            categoryOptionCombo: {
                                id: "coc_qux",
                            },
                            dataElement: {
                                id: "de_foobar_2",
                            },
                        },
                        {
                            categoryOptionCombo: {
                                id: "coc_bar",
                            },
                            dataElement: {
                                id: "de_foobar_2",
                            },
                        },
                        {
                            categoryOptionCombo: {
                                id: "coc_baz",
                            },
                            dataElement: {
                                id: "de_foobar_1",
                            },
                        },
                        {
                            categoryOptionCombo: {
                                id: "coc_qux",
                            },
                            dataElement: {
                                id: "de_foobar_3",
                            },
                        },
                    ],
                },
            ],
            dataElements: [
                {
                    name: "DataElement 0",
                    id: "de_foobar_0",
                    formName: "DataElement 0",
                    displayFormName: "DataElement 0",
                    categoryCombo: {
                        id: "foobar",
                    },
                    translations: [
                        {
                            property: "NAME",
                            locale: "en",
                            value: "DataElement 0",
                        },
                        {
                            property: "NAME",
                            locale: "es",
                            value: "Elemento de datos 0",
                        },
                        {
                            property: "NAME",
                            locale: "fr",
                            value: "Élément de données 0",
                        },
                        {
                            property: "NAME",
                            locale: "pt",
                            value: "Elemento de dados 0",
                        },
                        {
                            property: "NAME",
                            locale: "ar",
                            value: "عنصر البيانات 0",
                        },
                    ],
                },
                {
                    name: "DataElement 1",
                    id: "de_foobar_1",
                    formName: "DataElement 1",
                    displayFormName: "DataElement 1",
                    categoryCombo: {
                        id: "foobar",
                    },
                    translations: [
                        {
                            property: "NAME",
                            locale: "en",
                            value: "DataElement 1",
                        },
                        {
                            property: "NAME",
                            locale: "es",
                            value: "Elemento de datos 1",
                        },
                        {
                            property: "NAME",
                            locale: "fr",
                            value: "Élément de données 1",
                        },
                        {
                            property: "NAME",
                            locale: "pt",
                            value: "Elemento de dados 1",
                        },
                        {
                            property: "NAME",
                            locale: "ar",
                            value: "عنصر البيانات 1",
                        },
                    ],
                },
                {
                    name: "DataElement 2",
                    id: "de_foobar_2",
                    formName: "DataElement 2",
                    displayFormName: "DataElement 2",
                    categoryCombo: {
                        id: "foobar",
                    },
                    translations: [
                        {
                            property: "NAME",
                            locale: "en",
                            value: "DataElement 2",
                        },
                        {
                            property: "NAME",
                            locale: "es",
                            value: "Elemento de datos 2",
                        },
                        {
                            property: "NAME",
                            locale: "fr",
                            value: "Élément de données 2",
                        },
                        {
                            property: "NAME",
                            locale: "pt",
                            value: "Elemento de dados 2",
                        },
                        {
                            property: "NAME",
                            locale: "ar",
                            value: "عنصر البيانات 2",
                        },
                    ],
                },
                {
                    name: "DataElement 3",
                    id: "de_foobar_3",
                    formName: "DataElement 3",
                    displayFormName: "DataElement 3",
                    categoryCombo: {
                        id: "foobar",
                    },
                    translations: [
                        {
                            property: "NAME",
                            locale: "en",
                            value: "DataElement 3",
                        },
                        {
                            property: "NAME",
                            locale: "es",
                            value: "Elemento de datos 3",
                        },
                        {
                            property: "NAME",
                            locale: "fr",
                            value: "Élément de données 3",
                        },
                        {
                            property: "NAME",
                            locale: "pt",
                            value: "Elemento de dados 3",
                        },
                        {
                            property: "NAME",
                            locale: "ar",
                            value: "عنصر البيانات 3",
                        },
                    ],
                },
            ],
        },
        {
            name: "Section One Column Greyed Field",
            id: "sec_one_column_greyed_field",
            displayName: "Section One Column Greyed Field",
            greyedFields: [
                {
                    categoryOptionCombo: {
                        id: "coc_blue",
                    },
                    dataElement: {
                        id: "de_colors_2",
                    },
                },
                {
                    categoryOptionCombo: {
                        id: "coc_blue",
                    },
                    dataElement: {
                        id: "de_colors_1",
                    },
                },
                {
                    categoryOptionCombo: {
                        id: "coc_blue",
                    },
                    dataElement: {
                        id: "de_colors_4",
                    },
                },
                {
                    categoryOptionCombo: {
                        id: "coc_blue",
                    },
                    dataElement: {
                        id: "de_colors_0",
                    },
                },
                {
                    categoryOptionCombo: {
                        id: "coc_blue",
                    },
                    dataElement: {
                        id: "de_colors_3",
                    },
                },
                {
                    categoryOptionCombo: {
                        id: "coc_blue",
                    },
                    dataElement: {
                        id: "de_colors_5",
                    },
                },
            ],
            translations: [
                {
                    property: "NAME",
                    locale: "en",
                    value: "Section One Column Greyed Field",
                },
                {
                    property: "NAME",
                    locale: "es",
                    value: "Sección de un campo gris",
                },
                {
                    property: "NAME",
                    locale: "fr",
                    value: "Section d'un champ gris",
                },
                {
                    property: "NAME",
                    locale: "pt",
                    value: "Seção de um campo cinza",
                },
                {
                    property: "NAME",
                    locale: "ar",
                    value: "القسم الرمادي لعمود واحد",
                },
            ],
            categoryCombos: [
                {
                    id: "colors",
                    categories: [
                        {
                            categoryOptions: [
                                {
                                    name: "Red",
                                    id: "red",
                                    displayFormName: "Red",
                                    translations: [
                                        {
                                            property: "NAME",
                                            locale: "en",
                                            value: "Red",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "es",
                                            value: "Rojo",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "fr",
                                            value: "Rouge",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "pt",
                                            value: "Vermelho",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "ar",
                                            value: "أحمر",
                                        },
                                    ],
                                },
                                {
                                    name: "Blue",
                                    id: "blue",
                                    displayFormName: "Blue",
                                    translations: [
                                        {
                                            property: "NAME",
                                            locale: "en",
                                            value: "Blue",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "es",
                                            value: "Azul",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "fr",
                                            value: "Bleu",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "pt",
                                            value: "Azul",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "ar",
                                            value: "أزرق",
                                        },
                                    ],
                                },
                                {
                                    name: "Yellow",
                                    id: "yellow",
                                    displayFormName: "Yellow",
                                    translations: [
                                        {
                                            property: "NAME",
                                            locale: "en",
                                            value: "Yellow",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "es",
                                            value: "Amarillo",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "fr",
                                            value: "Jaune",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "pt",
                                            value: "Amarelo",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "ar",
                                            value: "أصفر",
                                        },
                                    ],
                                },
                                {
                                    name: "Green",
                                    id: "green",
                                    displayFormName: "Green",
                                    translations: [
                                        {
                                            property: "NAME",
                                            locale: "en",
                                            value: "Green",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "es",
                                            value: "Verde",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "fr",
                                            value: "Vert",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "pt",
                                            value: "Verde",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "ar",
                                            value: "أخضر",
                                        },
                                    ],
                                },
                                {
                                    name: "Black",
                                    id: "black",
                                    displayFormName: "Black",
                                    translations: [
                                        {
                                            property: "NAME",
                                            locale: "en",
                                            value: "Black",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "es",
                                            value: "Negro",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "fr",
                                            value: "Noir",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "pt",
                                            value: "Preto",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "ar",
                                            value: "أسود",
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                    categoryOptionCombos: [
                        {
                            id: "coc_red",
                            categoryOptions: [
                                {
                                    name: "Red",
                                    id: "red",
                                    displayFormName: "Red",
                                    translations: [
                                        {
                                            property: "NAME",
                                            locale: "en",
                                            value: "Red",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "es",
                                            value: "Rojo",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "fr",
                                            value: "Rouge",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "pt",
                                            value: "Vermelho",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "ar",
                                            value: "أحمر",
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            id: "coc_blue",
                            categoryOptions: [
                                {
                                    name: "Blue",
                                    id: "blue",
                                    displayFormName: "Blue",
                                    translations: [
                                        {
                                            property: "NAME",
                                            locale: "en",
                                            value: "Blue",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "es",
                                            value: "Azul",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "fr",
                                            value: "Bleu",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "pt",
                                            value: "Azul",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "ar",
                                            value: "أزرق",
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            id: "coc_yellow",
                            categoryOptions: [
                                {
                                    name: "Yellow",
                                    id: "yellow",
                                    displayFormName: "Yellow",
                                    translations: [
                                        {
                                            property: "NAME",
                                            locale: "en",
                                            value: "Yellow",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "es",
                                            value: "Amarillo",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "fr",
                                            value: "Jaune",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "pt",
                                            value: "Amarelo",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "ar",
                                            value: "أصفر",
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            id: "coc_green",
                            categoryOptions: [
                                {
                                    name: "Green",
                                    id: "green",
                                    displayFormName: "Green",
                                    translations: [
                                        {
                                            property: "NAME",
                                            locale: "en",
                                            value: "Green",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "es",
                                            value: "Verde",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "fr",
                                            value: "Vert",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "pt",
                                            value: "Verde",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "ar",
                                            value: "أخضر",
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            id: "coc_black",
                            categoryOptions: [
                                {
                                    name: "Black",
                                    id: "black",
                                    displayFormName: "Black",
                                    translations: [
                                        {
                                            property: "NAME",
                                            locale: "en",
                                            value: "Black",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "es",
                                            value: "Negro",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "fr",
                                            value: "Noir",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "pt",
                                            value: "Preto",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "ar",
                                            value: "أسود",
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                    dataElements: [
                        {
                            name: "DataElement 0",
                            id: "de_colors_0",
                            formName: "DataElement 0",
                            displayFormName: "DataElement 0",
                            categoryCombo: {
                                id: "colors",
                            },
                            translations: [
                                {
                                    property: "NAME",
                                    locale: "en",
                                    value: "DataElement 0",
                                },
                                {
                                    property: "NAME",
                                    locale: "es",
                                    value: "Elemento de datos 0",
                                },
                                {
                                    property: "NAME",
                                    locale: "fr",
                                    value: "Élément de données 0",
                                },
                                {
                                    property: "NAME",
                                    locale: "pt",
                                    value: "Elemento de dados 0",
                                },
                                {
                                    property: "NAME",
                                    locale: "ar",
                                    value: "عنصر البيانات 0",
                                },
                            ],
                        },
                        {
                            name: "DataElement 1",
                            id: "de_colors_1",
                            formName: "DataElement 1",
                            displayFormName: "DataElement 1",
                            categoryCombo: {
                                id: "colors",
                            },
                            translations: [
                                {
                                    property: "NAME",
                                    locale: "en",
                                    value: "DataElement 1",
                                },
                                {
                                    property: "NAME",
                                    locale: "es",
                                    value: "Elemento de datos 1",
                                },
                                {
                                    property: "NAME",
                                    locale: "fr",
                                    value: "Élément de données 1",
                                },
                                {
                                    property: "NAME",
                                    locale: "pt",
                                    value: "Elemento de dados 1",
                                },
                                {
                                    property: "NAME",
                                    locale: "ar",
                                    value: "عنصر البيانات 1",
                                },
                            ],
                        },
                        {
                            name: "DataElement 2",
                            id: "de_colors_2",
                            formName: "DataElement 2",
                            displayFormName: "DataElement 2",
                            categoryCombo: {
                                id: "colors",
                            },
                            translations: [
                                {
                                    property: "NAME",
                                    locale: "en",
                                    value: "DataElement 2",
                                },
                                {
                                    property: "NAME",
                                    locale: "es",
                                    value: "Elemento de datos 2",
                                },
                                {
                                    property: "NAME",
                                    locale: "fr",
                                    value: "Élément de données 2",
                                },
                                {
                                    property: "NAME",
                                    locale: "pt",
                                    value: "Elemento de dados 2",
                                },
                                {
                                    property: "NAME",
                                    locale: "ar",
                                    value: "عنصر البيانات 2",
                                },
                            ],
                        },
                        {
                            name: "DataElement 3",
                            id: "de_colors_3",
                            formName: "DataElement 3",
                            displayFormName: "DataElement 3",
                            categoryCombo: {
                                id: "colors",
                            },
                            translations: [
                                {
                                    property: "NAME",
                                    locale: "en",
                                    value: "DataElement 3",
                                },
                                {
                                    property: "NAME",
                                    locale: "es",
                                    value: "Elemento de datos 3",
                                },
                                {
                                    property: "NAME",
                                    locale: "fr",
                                    value: "Élément de données 3",
                                },
                                {
                                    property: "NAME",
                                    locale: "pt",
                                    value: "Elemento de dados 3",
                                },
                                {
                                    property: "NAME",
                                    locale: "ar",
                                    value: "عنصر البيانات 3",
                                },
                            ],
                        },
                        {
                            name: "DataElement 4",
                            id: "de_colors_4",
                            formName: "DataElement 4",
                            displayFormName: "DataElement 4",
                            categoryCombo: {
                                id: "colors",
                            },
                            translations: [
                                {
                                    property: "NAME",
                                    locale: "en",
                                    value: "DataElement 4",
                                },
                                {
                                    property: "NAME",
                                    locale: "es",
                                    value: "Elemento de datos 4",
                                },
                                {
                                    property: "NAME",
                                    locale: "fr",
                                    value: "Élément de données 4",
                                },
                                {
                                    property: "NAME",
                                    locale: "pt",
                                    value: "Elemento de dados 4",
                                },
                                {
                                    property: "NAME",
                                    locale: "ar",
                                    value: "عنصر البيانات 4",
                                },
                            ],
                        },
                        {
                            name: "DataElement 5",
                            id: "de_colors_5",
                            formName: "DataElement 5",
                            displayFormName: "DataElement 5",
                            categoryCombo: {
                                id: "colors",
                            },
                            translations: [
                                {
                                    property: "NAME",
                                    locale: "en",
                                    value: "DataElement 5",
                                },
                                {
                                    property: "NAME",
                                    locale: "es",
                                    value: "Elemento de datos 5",
                                },
                                {
                                    property: "NAME",
                                    locale: "fr",
                                    value: "Élément de données 5",
                                },
                                {
                                    property: "NAME",
                                    locale: "pt",
                                    value: "Elemento de dados 5",
                                },
                                {
                                    property: "NAME",
                                    locale: "ar",
                                    value: "عنصر البيانات 5",
                                },
                            ],
                        },
                    ],
                    greyedFields: [
                        {
                            categoryOptionCombo: {
                                id: "coc_blue",
                            },
                            dataElement: {
                                id: "de_colors_2",
                            },
                        },
                        {
                            categoryOptionCombo: {
                                id: "coc_blue",
                            },
                            dataElement: {
                                id: "de_colors_1",
                            },
                        },
                        {
                            categoryOptionCombo: {
                                id: "coc_blue",
                            },
                            dataElement: {
                                id: "de_colors_4",
                            },
                        },
                        {
                            categoryOptionCombo: {
                                id: "coc_blue",
                            },
                            dataElement: {
                                id: "de_colors_0",
                            },
                        },
                        {
                            categoryOptionCombo: {
                                id: "coc_blue",
                            },
                            dataElement: {
                                id: "de_colors_3",
                            },
                        },
                        {
                            categoryOptionCombo: {
                                id: "coc_blue",
                            },
                            dataElement: {
                                id: "de_colors_5",
                            },
                        },
                    ],
                },
            ],
            dataElements: [
                {
                    name: "DataElement 0",
                    id: "de_colors_0",
                    formName: "DataElement 0",
                    displayFormName: "DataElement 0",
                    categoryCombo: {
                        id: "colors",
                    },
                    translations: [
                        {
                            property: "NAME",
                            locale: "en",
                            value: "DataElement 0",
                        },
                        {
                            property: "NAME",
                            locale: "es",
                            value: "Elemento de datos 0",
                        },
                        {
                            property: "NAME",
                            locale: "fr",
                            value: "Élément de données 0",
                        },
                        {
                            property: "NAME",
                            locale: "pt",
                            value: "Elemento de dados 0",
                        },
                        {
                            property: "NAME",
                            locale: "ar",
                            value: "عنصر البيانات 0",
                        },
                    ],
                },
                {
                    name: "DataElement 1",
                    id: "de_colors_1",
                    formName: "DataElement 1",
                    displayFormName: "DataElement 1",
                    categoryCombo: {
                        id: "colors",
                    },
                    translations: [
                        {
                            property: "NAME",
                            locale: "en",
                            value: "DataElement 1",
                        },
                        {
                            property: "NAME",
                            locale: "es",
                            value: "Elemento de datos 1",
                        },
                        {
                            property: "NAME",
                            locale: "fr",
                            value: "Élément de données 1",
                        },
                        {
                            property: "NAME",
                            locale: "pt",
                            value: "Elemento de dados 1",
                        },
                        {
                            property: "NAME",
                            locale: "ar",
                            value: "عنصر البيانات 1",
                        },
                    ],
                },
                {
                    name: "DataElement 2",
                    id: "de_colors_2",
                    formName: "DataElement 2",
                    displayFormName: "DataElement 2",
                    categoryCombo: {
                        id: "colors",
                    },
                    translations: [
                        {
                            property: "NAME",
                            locale: "en",
                            value: "DataElement 2",
                        },
                        {
                            property: "NAME",
                            locale: "es",
                            value: "Elemento de datos 2",
                        },
                        {
                            property: "NAME",
                            locale: "fr",
                            value: "Élément de données 2",
                        },
                        {
                            property: "NAME",
                            locale: "pt",
                            value: "Elemento de dados 2",
                        },
                        {
                            property: "NAME",
                            locale: "ar",
                            value: "عنصر البيانات 2",
                        },
                    ],
                },
                {
                    name: "DataElement 3",
                    id: "de_colors_3",
                    formName: "DataElement 3",
                    displayFormName: "DataElement 3",
                    categoryCombo: {
                        id: "colors",
                    },
                    translations: [
                        {
                            property: "NAME",
                            locale: "en",
                            value: "DataElement 3",
                        },
                        {
                            property: "NAME",
                            locale: "es",
                            value: "Elemento de datos 3",
                        },
                        {
                            property: "NAME",
                            locale: "fr",
                            value: "Élément de données 3",
                        },
                        {
                            property: "NAME",
                            locale: "pt",
                            value: "Elemento de dados 3",
                        },
                        {
                            property: "NAME",
                            locale: "ar",
                            value: "عنصر البيانات 3",
                        },
                    ],
                },
                {
                    name: "DataElement 4",
                    id: "de_colors_4",
                    formName: "DataElement 4",
                    displayFormName: "DataElement 4",
                    categoryCombo: {
                        id: "colors",
                    },
                    translations: [
                        {
                            property: "NAME",
                            locale: "en",
                            value: "DataElement 4",
                        },
                        {
                            property: "NAME",
                            locale: "es",
                            value: "Elemento de datos 4",
                        },
                        {
                            property: "NAME",
                            locale: "fr",
                            value: "Élément de données 4",
                        },
                        {
                            property: "NAME",
                            locale: "pt",
                            value: "Elemento de dados 4",
                        },
                        {
                            property: "NAME",
                            locale: "ar",
                            value: "عنصر البيانات 4",
                        },
                    ],
                },
                {
                    name: "DataElement 5",
                    id: "de_colors_5",
                    formName: "DataElement 5",
                    displayFormName: "DataElement 5",
                    categoryCombo: {
                        id: "colors",
                    },
                    translations: [
                        {
                            property: "NAME",
                            locale: "en",
                            value: "DataElement 5",
                        },
                        {
                            property: "NAME",
                            locale: "es",
                            value: "Elemento de datos 5",
                        },
                        {
                            property: "NAME",
                            locale: "fr",
                            value: "Élément de données 5",
                        },
                        {
                            property: "NAME",
                            locale: "pt",
                            value: "Elemento de dados 5",
                        },
                        {
                            property: "NAME",
                            locale: "ar",
                            value: "عنصر البيانات 5",
                        },
                    ],
                },
            ],
        },
        {
            name: "Section Two Category Combos",
            id: "sec_two_category_combos",
            displayName: "Section Two Category Combos",
            greyedFields: [],
            translations: [
                {
                    property: "NAME",
                    locale: "en",
                    value: "Section Two Category Combos",
                },
                {
                    property: "NAME",
                    locale: "es",
                    value: "Sección de combinaciones de categorías",
                },
                {
                    property: "NAME",
                    locale: "fr",
                    value: "Section des combinaisons de catégories",
                },
                {
                    property: "NAME",
                    locale: "pt",
                    value: "Seção de combinações de categorias",
                },
                {
                    property: "NAME",
                    locale: "ar",
                    value: "قسم تصنيفات الفئات",
                },
            ],
            categoryCombos: [
                {
                    id: "colors",
                    categories: [
                        {
                            categoryOptions: [
                                {
                                    name: "Red",
                                    id: "red",
                                    displayFormName: "Red",
                                    translations: [
                                        {
                                            property: "NAME",
                                            locale: "en",
                                            value: "Red",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "es",
                                            value: "Rojo",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "fr",
                                            value: "Rouge",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "pt",
                                            value: "Vermelho",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "ar",
                                            value: "أحمر",
                                        },
                                    ],
                                },
                                {
                                    name: "Blue",
                                    id: "blue",
                                    displayFormName: "Blue",
                                    translations: [
                                        {
                                            property: "NAME",
                                            locale: "en",
                                            value: "Blue",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "es",
                                            value: "Azul",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "fr",
                                            value: "Bleu",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "pt",
                                            value: "Azul",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "ar",
                                            value: "أزرق",
                                        },
                                    ],
                                },
                                {
                                    name: "Yellow",
                                    id: "yellow",
                                    displayFormName: "Yellow",
                                    translations: [
                                        {
                                            property: "NAME",
                                            locale: "en",
                                            value: "Yellow",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "es",
                                            value: "Amarillo",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "fr",
                                            value: "Jaune",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "pt",
                                            value: "Amarelo",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "ar",
                                            value: "أصفر",
                                        },
                                    ],
                                },
                                {
                                    name: "Green",
                                    id: "green",
                                    displayFormName: "Green",
                                    translations: [
                                        {
                                            property: "NAME",
                                            locale: "en",
                                            value: "Green",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "es",
                                            value: "Verde",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "fr",
                                            value: "Vert",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "pt",
                                            value: "Verde",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "ar",
                                            value: "أخضر",
                                        },
                                    ],
                                },
                                {
                                    name: "Black",
                                    id: "black",
                                    displayFormName: "Black",
                                    translations: [
                                        {
                                            property: "NAME",
                                            locale: "en",
                                            value: "Black",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "es",
                                            value: "Negro",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "fr",
                                            value: "Noir",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "pt",
                                            value: "Preto",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "ar",
                                            value: "أسود",
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                    categoryOptionCombos: [
                        {
                            id: "coc_red",
                            categoryOptions: [
                                {
                                    name: "Red",
                                    id: "red",
                                    displayFormName: "Red",
                                    translations: [
                                        {
                                            property: "NAME",
                                            locale: "en",
                                            value: "Red",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "es",
                                            value: "Rojo",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "fr",
                                            value: "Rouge",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "pt",
                                            value: "Vermelho",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "ar",
                                            value: "أحمر",
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            id: "coc_blue",
                            categoryOptions: [
                                {
                                    name: "Blue",
                                    id: "blue",
                                    displayFormName: "Blue",
                                    translations: [
                                        {
                                            property: "NAME",
                                            locale: "en",
                                            value: "Blue",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "es",
                                            value: "Azul",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "fr",
                                            value: "Bleu",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "pt",
                                            value: "Azul",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "ar",
                                            value: "أزرق",
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            id: "coc_yellow",
                            categoryOptions: [
                                {
                                    name: "Yellow",
                                    id: "yellow",
                                    displayFormName: "Yellow",
                                    translations: [
                                        {
                                            property: "NAME",
                                            locale: "en",
                                            value: "Yellow",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "es",
                                            value: "Amarillo",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "fr",
                                            value: "Jaune",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "pt",
                                            value: "Amarelo",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "ar",
                                            value: "أصفر",
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            id: "coc_green",
                            categoryOptions: [
                                {
                                    name: "Green",
                                    id: "green",
                                    displayFormName: "Green",
                                    translations: [
                                        {
                                            property: "NAME",
                                            locale: "en",
                                            value: "Green",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "es",
                                            value: "Verde",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "fr",
                                            value: "Vert",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "pt",
                                            value: "Verde",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "ar",
                                            value: "أخضر",
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            id: "coc_black",
                            categoryOptions: [
                                {
                                    name: "Black",
                                    id: "black",
                                    displayFormName: "Black",
                                    translations: [
                                        {
                                            property: "NAME",
                                            locale: "en",
                                            value: "Black",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "es",
                                            value: "Negro",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "fr",
                                            value: "Noir",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "pt",
                                            value: "Preto",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "ar",
                                            value: "أسود",
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                    dataElements: [
                        {
                            name: "DataElement 0",
                            id: "de_colors_0",
                            formName: "DataElement 0",
                            displayFormName: "DataElement 0",
                            categoryCombo: {
                                id: "colors",
                            },
                            translations: [
                                {
                                    property: "NAME",
                                    locale: "en",
                                    value: "DataElement 0",
                                },
                                {
                                    property: "NAME",
                                    locale: "es",
                                    value: "Elemento de datos 0",
                                },
                                {
                                    property: "NAME",
                                    locale: "fr",
                                    value: "Élément de données 0",
                                },
                                {
                                    property: "NAME",
                                    locale: "pt",
                                    value: "Elemento de dados 0",
                                },
                                {
                                    property: "NAME",
                                    locale: "ar",
                                    value: "عنصر البيانات 0",
                                },
                            ],
                        },
                        {
                            name: "DataElement 1",
                            id: "de_colors_1",
                            formName: "DataElement 1",
                            displayFormName: "DataElement 1",
                            categoryCombo: {
                                id: "colors",
                            },
                            translations: [
                                {
                                    property: "NAME",
                                    locale: "en",
                                    value: "DataElement 1",
                                },
                                {
                                    property: "NAME",
                                    locale: "es",
                                    value: "Elemento de datos 1",
                                },
                                {
                                    property: "NAME",
                                    locale: "fr",
                                    value: "Élément de données 1",
                                },
                                {
                                    property: "NAME",
                                    locale: "pt",
                                    value: "Elemento de dados 1",
                                },
                                {
                                    property: "NAME",
                                    locale: "ar",
                                    value: "عنصر البيانات 1",
                                },
                            ],
                        },
                        {
                            name: "DataElement 2",
                            id: "de_colors_2",
                            formName: "DataElement 2",
                            displayFormName: "DataElement 2",
                            categoryCombo: {
                                id: "colors",
                            },
                            translations: [
                                {
                                    property: "NAME",
                                    locale: "en",
                                    value: "DataElement 2",
                                },
                                {
                                    property: "NAME",
                                    locale: "es",
                                    value: "Elemento de datos 2",
                                },
                                {
                                    property: "NAME",
                                    locale: "fr",
                                    value: "Élément de données 2",
                                },
                                {
                                    property: "NAME",
                                    locale: "pt",
                                    value: "Elemento de dados 2",
                                },
                                {
                                    property: "NAME",
                                    locale: "ar",
                                    value: "عنصر البيانات 2",
                                },
                            ],
                        },
                    ],
                    greyedFields: [],
                },
                {
                    id: "cc_default",
                    categories: [
                        {
                            categoryOptions: [
                                {
                                    name: "default",
                                    id: "co_default",
                                    displayFormName: "Value",
                                    translations: [
                                        {
                                            property: "NAME",
                                            locale: "en",
                                            value: "Value",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "es",
                                            value: "Valor",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "fr",
                                            value: "Valeur",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "pt",
                                            value: "Valor",
                                        },
                                        {
                                            property: "NAME",
                                            locale: "ar",
                                            value: "القيمة",
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                    categoryOptionCombos: [],
                    dataElements: [
                        {
                            name: "DataElement 3",
                            id: "de_def_3",
                            formName: "DataElement 3",
                            displayFormName: "DataElement 3",
                            categoryCombo: {
                                id: "cc_default",
                            },
                            translations: [
                                {
                                    property: "NAME",
                                    locale: "en",
                                    value: "DataElement 3",
                                },
                                {
                                    property: "NAME",
                                    locale: "es",
                                    value: "Elemento de datos 3",
                                },
                                {
                                    property: "NAME",
                                    locale: "fr",
                                    value: "Élément de données 3",
                                },
                                {
                                    property: "NAME",
                                    locale: "pt",
                                    value: "Elemento de dados 3",
                                },
                                {
                                    property: "NAME",
                                    locale: "ar",
                                    value: "عنصر البيانات 3",
                                },
                            ],
                        },
                        {
                            name: "DataElement 4",
                            id: "de_def_4",
                            formName: "DataElement 4",
                            displayFormName: "DataElement 4",
                            categoryCombo: {
                                id: "cc_default",
                            },
                            translations: [
                                {
                                    property: "NAME",
                                    locale: "en",
                                    value: "DataElement 4",
                                },
                                {
                                    property: "NAME",
                                    locale: "es",
                                    value: "Elemento de datos 4",
                                },
                                {
                                    property: "NAME",
                                    locale: "fr",
                                    value: "Élément de données 4",
                                },
                                {
                                    property: "NAME",
                                    locale: "pt",
                                    value: "Elemento de dados 4",
                                },
                                {
                                    property: "NAME",
                                    locale: "ar",
                                    value: "عنصر البيانات 4",
                                },
                            ],
                        },
                        {
                            name: "DataElement 5",
                            id: "de_def_5",
                            formName: "DataElement 5",
                            displayFormName: "DataElement 5",
                            categoryCombo: {
                                id: "cc_default",
                            },
                            translations: [
                                {
                                    property: "NAME",
                                    locale: "en",
                                    value: "DataElement 5",
                                },
                                {
                                    property: "NAME",
                                    locale: "es",
                                    value: "Elemento de datos 5",
                                },
                                {
                                    property: "NAME",
                                    locale: "fr",
                                    value: "Élément de données 5",
                                },
                                {
                                    property: "NAME",
                                    locale: "pt",
                                    value: "Elemento de dados 5",
                                },
                                {
                                    property: "NAME",
                                    locale: "ar",
                                    value: "عنصر البيانات 5",
                                },
                            ],
                        },
                        {
                            name: "DataElement 6",
                            id: "de_def_6",
                            formName: "DataElement 6",
                            displayFormName: "DataElement 6",
                            categoryCombo: {
                                id: "cc_default",
                            },
                            translations: [
                                {
                                    property: "NAME",
                                    locale: "en",
                                    value: "DataElement 6",
                                },
                                {
                                    property: "NAME",
                                    locale: "es",
                                    value: "Elemento de datos 6",
                                },
                                {
                                    property: "NAME",
                                    locale: "fr",
                                    value: "Élément de données 6",
                                },
                                {
                                    property: "NAME",
                                    locale: "pt",
                                    value: "Elemento de dados 6",
                                },
                                {
                                    property: "NAME",
                                    locale: "ar",
                                    value: "عنصر البيانات 6",
                                },
                            ],
                        },
                        {
                            name: "DataElement 7",
                            id: "de_def_7",
                            formName: "DataElement 7",
                            displayFormName: "DataElement 7",
                            categoryCombo: {
                                id: "cc_default",
                            },
                            translations: [
                                {
                                    property: "NAME",
                                    locale: "en",
                                    value: "DataElement 7",
                                },
                                {
                                    property: "NAME",
                                    locale: "es",
                                    value: "Elemento de datos 7",
                                },
                                {
                                    property: "NAME",
                                    locale: "fr",
                                    value: "Élément de données 7",
                                },
                                {
                                    property: "NAME",
                                    locale: "pt",
                                    value: "Elemento de dados 7",
                                },
                                {
                                    property: "NAME",
                                    locale: "ar",
                                    value: "عنصر البيانات 7",
                                },
                            ],
                        },
                    ],
                    greyedFields: [],
                },
            ],
            dataElements: [
                {
                    name: "DataElement 0",
                    id: "de_colors_0",
                    formName: "DataElement 0",
                    displayFormName: "DataElement 0",
                    categoryCombo: {
                        id: "colors",
                    },
                    translations: [
                        {
                            property: "NAME",
                            locale: "en",
                            value: "DataElement 0",
                        },
                        {
                            property: "NAME",
                            locale: "es",
                            value: "Elemento de datos 0",
                        },
                        {
                            property: "NAME",
                            locale: "fr",
                            value: "Élément de données 0",
                        },
                        {
                            property: "NAME",
                            locale: "pt",
                            value: "Elemento de dados 0",
                        },
                        {
                            property: "NAME",
                            locale: "ar",
                            value: "عنصر البيانات 0",
                        },
                    ],
                },
                {
                    name: "DataElement 1",
                    id: "de_colors_1",
                    formName: "DataElement 1",
                    displayFormName: "DataElement 1",
                    categoryCombo: {
                        id: "colors",
                    },
                    translations: [
                        {
                            property: "NAME",
                            locale: "en",
                            value: "DataElement 1",
                        },
                        {
                            property: "NAME",
                            locale: "es",
                            value: "Elemento de datos 1",
                        },
                        {
                            property: "NAME",
                            locale: "fr",
                            value: "Élément de données 1",
                        },
                        {
                            property: "NAME",
                            locale: "pt",
                            value: "Elemento de dados 1",
                        },
                        {
                            property: "NAME",
                            locale: "ar",
                            value: "عنصر البيانات 1",
                        },
                    ],
                },
                {
                    name: "DataElement 2",
                    id: "de_colors_2",
                    formName: "DataElement 2",
                    displayFormName: "DataElement 2",
                    categoryCombo: {
                        id: "colors",
                    },
                    translations: [
                        {
                            property: "NAME",
                            locale: "en",
                            value: "DataElement 2",
                        },
                        {
                            property: "NAME",
                            locale: "es",
                            value: "Elemento de datos 2",
                        },
                        {
                            property: "NAME",
                            locale: "fr",
                            value: "Élément de données 2",
                        },
                        {
                            property: "NAME",
                            locale: "pt",
                            value: "Elemento de dados 2",
                        },
                        {
                            property: "NAME",
                            locale: "ar",
                            value: "عنصر البيانات 2",
                        },
                    ],
                },
                {
                    name: "DataElement 3",
                    id: "de_def_3",
                    formName: "DataElement 3",
                    displayFormName: "DataElement 3",
                    categoryCombo: {
                        id: "cc_default",
                    },
                    translations: [
                        {
                            property: "NAME",
                            locale: "en",
                            value: "DataElement 3",
                        },
                        {
                            property: "NAME",
                            locale: "es",
                            value: "Elemento de datos 3",
                        },
                        {
                            property: "NAME",
                            locale: "fr",
                            value: "Élément de données 3",
                        },
                        {
                            property: "NAME",
                            locale: "pt",
                            value: "Elemento de dados 3",
                        },
                        {
                            property: "NAME",
                            locale: "ar",
                            value: "عنصر البيانات 3",
                        },
                    ],
                },
                {
                    name: "DataElement 4",
                    id: "de_def_4",
                    formName: "DataElement 4",
                    displayFormName: "DataElement 4",
                    categoryCombo: {
                        id: "cc_default",
                    },
                    translations: [
                        {
                            property: "NAME",
                            locale: "en",
                            value: "DataElement 4",
                        },
                        {
                            property: "NAME",
                            locale: "es",
                            value: "Elemento de datos 4",
                        },
                        {
                            property: "NAME",
                            locale: "fr",
                            value: "Élément de données 4",
                        },
                        {
                            property: "NAME",
                            locale: "pt",
                            value: "Elemento de dados 4",
                        },
                        {
                            property: "NAME",
                            locale: "ar",
                            value: "عنصر البيانات 4",
                        },
                    ],
                },
                {
                    name: "DataElement 5",
                    id: "de_def_5",
                    formName: "DataElement 5",
                    displayFormName: "DataElement 5",
                    categoryCombo: {
                        id: "cc_default",
                    },
                    translations: [
                        {
                            property: "NAME",
                            locale: "en",
                            value: "DataElement 5",
                        },
                        {
                            property: "NAME",
                            locale: "es",
                            value: "Elemento de datos 5",
                        },
                        {
                            property: "NAME",
                            locale: "fr",
                            value: "Élément de données 5",
                        },
                        {
                            property: "NAME",
                            locale: "pt",
                            value: "Elemento de dados 5",
                        },
                        {
                            property: "NAME",
                            locale: "ar",
                            value: "عنصر البيانات 5",
                        },
                    ],
                },
                {
                    name: "DataElement 6",
                    id: "de_def_6",
                    formName: "DataElement 6",
                    displayFormName: "DataElement 6",
                    categoryCombo: {
                        id: "cc_default",
                    },
                    translations: [
                        {
                            property: "NAME",
                            locale: "en",
                            value: "DataElement 6",
                        },
                        {
                            property: "NAME",
                            locale: "es",
                            value: "Elemento de datos 6",
                        },
                        {
                            property: "NAME",
                            locale: "fr",
                            value: "Élément de données 6",
                        },
                        {
                            property: "NAME",
                            locale: "pt",
                            value: "Elemento de dados 6",
                        },
                        {
                            property: "NAME",
                            locale: "ar",
                            value: "عنصر البيانات 6",
                        },
                    ],
                },
                {
                    name: "DataElement 7",
                    id: "de_def_7",
                    formName: "DataElement 7",
                    displayFormName: "DataElement 7",
                    categoryCombo: {
                        id: "cc_default",
                    },
                    translations: [
                        {
                            property: "NAME",
                            locale: "en",
                            value: "DataElement 7",
                        },
                        {
                            property: "NAME",
                            locale: "es",
                            value: "Elemento de datos 7",
                        },
                        {
                            property: "NAME",
                            locale: "fr",
                            value: "Élément de données 7",
                        },
                        {
                            property: "NAME",
                            locale: "pt",
                            value: "Elemento de dados 7",
                        },
                        {
                            property: "NAME",
                            locale: "ar",
                            value: "عنصر البيانات 7",
                        },
                    ],
                },
            ],
        },
    ],
    headers: {
        healthFacility: "Health Facility:",
        reportingPeriod: "Reporting Period:",
    },
});

export const noHeadersDataSet: DataSet = processedDataSet.updateHeaders(undefined);

export const noSectionsDataSet: DataSet = new DataSet({ ...processedDataSet, sections: [] });

export const withHeadersDataSet: DataSet = processedDataSet.updateHeaders({
    healthFacility: `${processedDataSet.headers?.healthFacility} OU Label`,
    reportingPeriod: `${processedDataSet.headers?.reportingPeriod} Period Label`,
});

export const translatedDataSets: Record<LocaleCodes, DataSet> = HashMap.fromPairs(
    locales.map(locale => [locale.code, processedDataSet.applyLocale(locale)])
).toObject();
