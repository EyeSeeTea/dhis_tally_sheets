import JSZip from "jszip";
import saveAs from "file-saver";
import { DataSet } from "$/domain/entities/DataSet";
import { FutureData } from "$/data/api-futures";
import { Locale } from "$/domain/entities/Locale";
import { Future } from "$/domain/entities/generic/Future";
import { Repositories } from "$/CompositionRoot";
import { Config } from "$/domain/entities/Config";
import _ from "$/domain/entities/generic/Collection";

export class ExportDataSetsUseCase {
    constructor(private repositories: Repositories) {}

    public execute(options: {
        dataSets: DataSet[];
        locales: Locale[];
        config: Config;
        includeHeaders: boolean;
    }): FutureData<void> {
        const { dataSets, locales, config, includeHeaders: _includeHeaders } = options;

        const pickedTranslations = _(dataSets).toHashMap(dataSet => {
            const availableLocaleCodes = dataSet.getAvailableLocaleCodes();
            const availableLocales = _(locales).filter(({ code }) =>
                availableLocaleCodes.includes(code)
            );

            return [dataSet, availableLocales];
        });

        const translatedDataSets = pickedTranslations
            .mapValues(([dataSet, locales]) =>
                locales
                    .map(locale => dataSet.applyLocale(locale))
                    .map(ds => {
                        const headers = ds.headers;
                        if (!headers) return ds;
                        const newHeaders = {
                            healthFacility: config.ouLabel
                                ? `${headers.healthFacility} ${config.ouLabel}`
                                : headers.healthFacility,
                            reportingPeriod: config.periodLabel
                                ? `${headers.reportingPeriod} ${config.periodLabel}`
                                : headers.reportingPeriod,
                        };

                        // (includeHeaders ? newHeaders: undefined) previously we were always including headers
                        return ds.updateHeaders(newHeaders);
                    })
                    .value()
            )
            .values()
            .flat();

        const downloadFiles$ = Future.sequential(
            translatedDataSets.map(dataSet =>
                this.repositories.dataSetExportRepository.save(dataSet, {
                    sheetName: config.sheetName,
                })
            )
        ).map(blobFiles => {
            if (blobFiles.length > 1) {
                const zip = new JSZip();

                blobFiles.reduce<string[]>((names, file) => {
                    const name = sanitizeFileName(file.name);
                    const idx = names.filter(s => s === name).length;
                    zip.file(name + (idx ? ` (${idx})` : "") + ".xlsx", file.blob); // Avoids overwriting files with the same name
                    return names.concat(name);
                }, []);

                zip.generateAsync({ type: "blob" }).then(blob => {
                    saveAs(blob, `${sanitizeFileName(config.fileName)}.zip`);
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
