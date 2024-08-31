import JSZip from "jszip";
import saveAs from "file-saver";
import { FutureData } from "$/data/api-futures";
import {
    CategoryCombo,
    CategoryOption,
    DataSet,
    DataSetAttrs,
    ProcessedDataSet,
    Section,
} from "$/domain/entities/DataSet";
import _c, { Collection } from "$/domain/entities/generic/Collection";
import { DataSetExportRepository } from "$/domain/repositories/DataSetExportRepository";
import { D2Translation } from "$/domain/entities/BasicDataSet";
import { HashMap } from "$/domain/entities/generic/HashMap";
import { Locale } from "$/domain/entities/Locale";
import { Maybe } from "$/utils/ts-utils";
import { Future } from "$/domain/entities/generic/Future";
import i18n from "$/utils/i18n";

export class ExportDataSetsUseCase {
    constructor(private exportRepository: DataSetExportRepository) {}

    //dataSets to load in LandingPage in order to have the removedSections already in use effect or something and later use it in the export directly
    public execute(dataSets: DataSet[], locales: Locale[]): FutureData<void> {
        const translations = _c(locales).toHashMap(({ code }) => [
            code,
            {
                facility: i18n.t("Health facility", { lng: code }),
                period: i18n.t("Reporting period", { lng: code }),
            },
        ]);

        const pickedTranslations: PickedTranslations = _c(dataSets).toHashMap(dataSet => {
            const translations = _c(locales)
                .map(({ code }) => code)
                .intersection(
                    _c(dataSet.translations)
                        .filter(translation => translation.property === "NAME")
                        .map(translation => translation.locale.split("_")[0])
                        .concat("en") // Add English because it might not be in translations
                        .uniq()
                );

            return [dataSet, translations];
        });

        const translatedDatasets: HashMap<DataSet, TranslatedDataSets> =
            pickedTranslations.mapValues(([dataSet, locales]) =>
                translateDataSet(dataSet, locales)
            );

        const mappedDatasets = translatedDatasets.mapValues(([_dataSet, dataSets]) => {
            return dataSets.map(dataSet => {
                return {
                    ...dataSet,
                    // dataSetElements: dataSet.dataSetElements.map(({ dataElement }) => dataElement),
                    sections: dataSet.sections.map(mapSection),
                };
            });
        });

        /* Headers to be included in own domain -> dataSet... */
        const dataSetsWithHeaders: ProcessedDataSet[] = mappedDatasets
            .mapValues(([_k, translatedDataSets]) =>
                translatedDataSets
                    .map(dataSet => {
                        const healthFacility =
                            (dataSet.locale && translations.get(dataSet.locale)?.facility) ??
                            i18n.t("Health facility");
                        const reportingPeriod =
                            (dataSet.locale && translations.get(dataSet.locale)?.period) ??
                            i18n.t("Reporting period");
                        return {
                            ...dataSet,
                            headers: {
                                healthFacility: healthFacility ? healthFacility + ": " : "",
                                reportingPeriod: reportingPeriod ? reportingPeriod + ": " : "",
                            },
                        };
                    })
                    .value()
            )
            .values()
            .flat();

        const downloadFiles$ = Future.sequential(
            dataSetsWithHeaders.map(dataSet => this.exportRepository.exportDataSet(dataSet))
        ).map(blobFiles => {
            if (blobFiles.length > 1) {
                const zip = new JSZip();

                blobFiles.reduce<string[]>((names, file) => {
                    const name = sanitizeFileName(file.name);
                    const idx = names.filter(s => s === name).length;
                    zip.file(name + (idx ? ` (${idx})` : "") + ".xlsx", file.blob);
                    return names.concat(name);
                }, []);

                zip.generateAsync({ type: "blob" }).then(blob => {
                    saveAs(blob, "MSF-OCBA HMIS.zip");
                });
            } else if (blobFiles.length === 1) {
                const file = blobFiles[0];
                if (!file) return;
                return saveAs(file.blob, sanitizeFileName(file.name));
            }
        });

        return downloadFiles$;
    }
}

type NewCategories = string[][];

function mapSection(section: Section): Section<NewCategories> {
    const mappedCategoryCombos = section.categoryCombos.map(
        (categoryCombo): CategoryCombo<NewCategories> => {
            const categories = categoryCombo.categories.map(({ categoryOptions }) =>
                categoryOptions.map(({ displayFormName }) => displayFormName)
            );

            const categoriesOrder = categoryCombo.categories.map(({ categoryOptions }) =>
                categoryOptions.map(({ id }) => id)
            );

            const categoryOptionCombos = categoryCombo.categoryOptionCombos
                .map(categoryOptionCombo => ({
                    ...categoryOptionCombo,
                    categories: _c(categoryOptionCombo.categoryOptions)
                        .sortBy(({ id }) => categoriesOrder.findIndex(c => c.includes(id)))
                        .map(({ displayFormName }) => displayFormName)
                        .value(),
                }))
                .filter(categoryOptionCombo => {
                    const flatCategories = categories.flat();
                    const includesInCategories = categoryOptionCombo.categories.every(category =>
                        flatCategories.includes(category)
                    );
                    const sameCategoriesLength =
                        categoryOptionCombo.categoryOptions.length ===
                        categoryCombo.categories.length;

                    return includesInCategories && sameCategoriesLength;
                });

            const dataElements = section.dataElements.filter(
                de => de.categoryCombo.id === categoryCombo.id
            );

            const deIds = dataElements.map(({ id }) => id);
            const cocIds = categoryOptionCombos.map(({ id }) => id);

            const greyedFields = section.greyedFields.filter(
                gf =>
                    deIds.includes(gf.dataElement.id) && cocIds.includes(gf.categoryOptionCombo?.id)
            );

            return {
                ...categoryCombo,
                categoryOptionCombos,
                categories,
                dataElements,
                greyedFields,
            };
        }
    );

    //Order category combos by the ones that comes first on the dataset dataElements
    //Needed when multiple dataElements differ on categoryCombo
    const orderedCategoryCombos = _c(mappedCategoryCombos).sortBy(categoryCombo =>
        section.dataElements.findIndex(de => de.categoryCombo.id === categoryCombo.id)
    );

    const categoryCombos = orderedCategoryCombos
        .map(categoryCombo => {
            return {
                ...categoryCombo,
                categoryOptionCombos: _c(categoryCombo.categoryOptionCombos)
                    .sortBy(categoryOptionCombo => {
                        //Assign to each word of the (displayFormName) the index where it appears on categoryCombo.categories[]
                        //Output: [1, 2, 0]
                        /* TO REMOVE "AS"! */
                        const prio = (categoryOptionCombo.categories as string[]).map(category => {
                            const categories = categoryCombo.categories.flat();
                            return categories.indexOf(category);
                        });

                        //Gives lower priority as [N] increases and does a sum of all values
                        //[1, 2, 0] -> [100, 20, 0] -> 120
                        return prio
                            .map((v, idx) => v * Math.pow(10, prio.length - 1 - idx))
                            .reduce((a, b) => a + b, 0);
                    })
                    .value(),
            };
        })
        .value();

    return {
        ...section,
        categoryCombos,
    };
}

function sanitizeFileName(str: string): string {
    return str
        .replaceAll("<", "less than")
        .replaceAll(">", "greater than")
        .replaceAll(/[\\/]/g, "_")
        .replace(/[^\p{L}\s\d\-_~,;[\]().'{}]/gisu, "");
}

function getTranslationValue(
    translations: D2Translation[],
    locale: string,
    property = "NAME"
): Maybe<string> {
    return translations.find(
        translation => translation.locale === locale && translation.property === property
    )?.value;
}

function mapCategoryOption(categoryOption: CategoryOption, locale: string) {
    return {
        ...categoryOption,
        displayFormName:
            getTranslationValue(categoryOption.translations, locale, "FORM_NAME") ??
            getTranslationValue(categoryOption.translations, locale, "NAME") ??
            (locale === "en" ? categoryOption.name : categoryOption.displayFormName),
    };
}

type TranslatedDataSets = Collection<DataSetAttrs>;

/* TO BE REVIEWED THE SYSTEM OF TRANSLATING AND ORDER */
function translateDataSet(dataSet: DataSet, locales: Collection<string>): TranslatedDataSets {
    return locales.map(locale => {
        const translatedDataSet = {
            ...dataSet,
            displayFormName:
                getTranslationValue(dataSet.translations, locale) ??
                (locale === "en" ? dataSet.formName ?? dataSet.name : dataSet.displayFormName),
            sections: dataSet.sections.map(section => ({
                ...section,
                //section does not have description available to translate??
                displayName:
                    getTranslationValue(section.translations, locale) ??
                    (locale === "en" ? section.name : section.displayName),
                categoryCombos: section.categoryCombos.map(categoryCombo => ({
                    ...categoryCombo,
                    categories: categoryCombo.categories.map(category => ({
                        categoryOptions: category.categoryOptions.map(co =>
                            mapCategoryOption(co, locale)
                        ),
                    })),
                    categoryOptionCombos: categoryCombo.categoryOptionCombos.map(coc => {
                        const categoryOptions = coc.categoryOptions.map(co =>
                            mapCategoryOption(co, locale)
                        );
                        const ids = (locale === "en" ? coc.name : coc.displayFormName)
                            .split(", ")
                            .map(
                                dco =>
                                    coc.categoryOptions.find(
                                        co =>
                                            (locale === "en" ? co.name : co.displayFormName) === dco
                                    )?.id
                            );
                        const displayFormName = ids
                            .map(id => {
                                const co = categoryOptions.find(co => co.id === id);
                                return locale === "en" ? co?.name : co?.displayFormName;
                            })
                            .join(", ");

                        return {
                            ...coc,
                            displayFormName,
                            categoryOptions,
                        };
                    }),
                })),
                dataElements: section.dataElements.map(de => ({
                    ...de,
                    displayFormName:
                        getTranslationValue(de.translations, locale, "FORM_NAME") ??
                        getTranslationValue(de.translations, locale, "NAME") ??
                        (locale === "en" ? de.formName ?? de.name : de.displayFormName),
                })),
            })),
            dataSetElements: dataSet.dataSetElements.map(dse => ({
                ...dse,
                dataElement: {
                    ...dse.dataElement,
                    displayFormName:
                        getTranslationValue(dse.dataElement.translations, locale, "FORM_NAME") ??
                        getTranslationValue(dse.dataElement.translations, locale, "NAME") ??
                        (locale === "en"
                            ? dse.dataElement.formName ?? dse.dataElement.name
                            : dse.dataElement.displayFormName),
                },
            })),
        };

        return { ...translatedDataSet, locale: locale };
    });
}

type PickedTranslations = HashMap<DataSet, Collection<string>>;
