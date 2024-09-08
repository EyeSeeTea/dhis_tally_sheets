import JSZip from "jszip";
import saveAs from "file-saver";
import { CategoryCombo, DataSet, ProcessedDataSet, Section } from "$/domain/entities/DataSet";
import { DataSetExportRepository } from "$/domain/repositories/DataSetExportRepository";
import { FutureData } from "$/data/api-futures";
import { HashMap } from "$/domain/entities/generic/HashMap";
import { Locale } from "$/domain/entities/Locale";
import { Future } from "$/domain/entities/generic/Future";
import { genericDataSet } from "$/data/repositories/__tests__/spreadsheet-fixtures/exportDataSetFixtures";
import _c, { Collection } from "$/domain/entities/generic/Collection";

export class ExportDataSetsUseCase {
    constructor(private exportRepository: DataSetExportRepository) {}

    //dataSets to load in LandingPage in order to have the removedSections already in use effect or something and later use it in the export directly
    public execute(dataSets: DataSet[], locales: Locale[]): FutureData<void> {
        const pickedTranslations: PickedTranslations = _c(dataSets).toHashMap(dataSet => {
            const availableLocaleCodes = _c(dataSet.translations)
                .filter(translation => translation.property === "NAME")
                .map(translation => translation.locale.split("_")[0])
                .concat("en") // Add English because it might not be in translations
                .uniq()
                .compact();

            const availableLocales = _c(locales).filter(({ code }) =>
                availableLocaleCodes.includes(code)
            );

            return [dataSet, availableLocales];
        });

        const translatedDatasets: HashMap<
            DataSet,
            Collection<DataSet>
        > = pickedTranslations.mapValues(([dataSet, locales]) =>
            locales.map(locale => dataSet.applyLocale(locale))
        );

        const mappedDatasets = translatedDatasets.mapValues(([_dataSet, dataSets]) => {
            return dataSets.map(dataSet => {
                return {
                    ...dataSet,
                    sections: dataSet.sections.map(mapSection),
                };
            });
        });

        /* Headers to be included in own domain -> dataSet... */
        const dataSetsWithHeaders: ProcessedDataSet[] = mappedDatasets
            .mapValues(([_k, translatedDataSets]) => translatedDataSets.value())
            .values()
            .flat();

        const downloadFiles$ = Future.sequential(
            [...dataSetsWithHeaders, genericDataSet].map(dataSet =>
                this.exportRepository.exportDataSet(dataSet)
            )
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
                categoryOptionCombos: categoryOptionCombos,
                categories: categories,
                dataElements: dataElements,
                greyedFields: greyedFields,
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

type PickedTranslations = HashMap<DataSet, Collection<Locale>>;
