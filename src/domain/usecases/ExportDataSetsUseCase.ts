import JSZip from "jszip";
import saveAs from "file-saver";
import { DataSet } from "$/domain/entities/DataSet";
import { DataSetExportRepository } from "$/domain/repositories/DataSetExportRepository";
import { FutureData } from "$/data/api-futures";
import { HashMap } from "$/domain/entities/generic/HashMap";
import { Locale } from "$/domain/entities/Locale";
import { Future } from "$/domain/entities/generic/Future";
import _c, { Collection } from "$/domain/entities/generic/Collection";

export class ExportDataSetsUseCase {
    constructor(private exportRepository: DataSetExportRepository) {}

    public execute(dataSets: DataSet[], locales: Locale[]): FutureData<void> {
        const pickedTranslations: PickedTranslations = _c(dataSets).toHashMap(dataSet => {
            const availableLocaleCodes = dataSet.getAvailableLocaleCodes();
            const availableLocales = _c(locales).filter(({ code }) =>
                availableLocaleCodes.includes(code)
            );

            return [dataSet, availableLocales];
        });

        const translatedDatasets: DataSet[] = pickedTranslations
            .mapValues(([dataSet, locales]) =>
                locales.map(locale => dataSet.applyLocale(locale)).value()
            )
            .values()
            .flat();

        const downloadFiles$ = Future.sequential(
            translatedDatasets.map(dataSet => this.exportRepository.save(dataSet))
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

function sanitizeFileName(str: string): string {
    return str
        .replaceAll("<", "less than")
        .replaceAll(">", "greater than")
        .replaceAll(/[\\/]/g, "_")
        .replace(/[^\p{L}\s\d\-_~,;[\]().'{}]/gisu, "");
}

type PickedTranslations = HashMap<DataSet, Collection<Locale>>;
