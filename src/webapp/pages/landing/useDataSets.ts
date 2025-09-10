import React from "react";
import { useSnackbar } from "@eyeseetea/d2-ui-components";
import { BasicDataSet } from "$/domain/entities/BasicDataSet";
import { DataSet } from "$/domain/entities/DataSet";
import { useAppContext } from "$/webapp/contexts/app-context";
import { useBooleanState } from "$/webapp/utils/use-boolean";
import { getId, Id } from "$/domain/entities/Ref";
import _ from "$/domain/entities/generic/Collection";
import i18n from "$/utils/i18n";

export function useDataSets(selectedDataSets: BasicDataSet[]) {
    const { compositionRoot } = useAppContext();

    const snackbar = useSnackbar();

    // Maintain a cache of previously fetched DataSets to prevent unnecessary API requests on re-selection
    const [cachedDataSets, setCachedDataSets] = React.useState<DataSet[]>([]);
    const [loading, { enable: startLoading, disable: stopLoading }] = useBooleanState(false);
    const [dataSets, setDataSets] = React.useState<DataSet[]>([]);

    const removeSection = React.useCallback(
        (dataSetId: Id, sectionId: Id) => {
            setDataSets(dataSets => {
                const dataSet = dataSets.find(ds => ds.id === dataSetId);

                return dataSet
                    ? dataSets.map(ds =>
                          ds.id === dataSet.id ? dataSet.removeSection(sectionId) : ds
                      )
                    : dataSets;
            });
        },
        [setDataSets]
    );

    /* This block is causing performance issues after deselecting ALL option */
    React.useEffect(() => {
        const { added, removed } = diffDataSets(selectedDataSets, dataSets);

        console.debug("Added DataSets", added, "Removed DataSets", removed);

        if (_(added).isNotEmpty()) {
            const addedIds = new Set(added.map(getId));

            const cached = cachedDataSets.filter(ds => addedIds.has(ds.id));
            const toRequest = excludeFromDataSet(added, cached);
            if (_(toRequest).isNotEmpty()) {
                startLoading();
                compositionRoot.dataSets.getByIds.execute(toRequest.map(getId)).run(
                    addedDataSets => {
                        setDataSets(currentDataSets => {
                            const newCached = _(cachedDataSets)
                                .concat(_(addedDataSets))
                                .uniqBy(getId)
                                .value();
                            setCachedDataSets(newCached);

                            const newDataSets = _(currentDataSets)
                                .concat(_(addedDataSets))
                                .concat(_(cached))
                                .uniqBy(getId)
                                .value();
                            return _(removed).isEmpty()
                                ? newDataSets
                                : excludeFromDataSet(newDataSets, removed);
                        });
                        stopLoading();
                    },
                    err => {
                        snackbar.error(i18n.t("Unable to fetch datasets"));
                        console.error(err);
                        stopLoading();
                    }
                );
            } else {
                setDataSets(dataSets => {
                    const newDataSets = _(dataSets).concat(_(cached)).uniqBy(getId).value();
                    return _(removed).isEmpty()
                        ? newDataSets
                        : excludeFromDataSet(newDataSets, removed);
                });
            }
        } else if (_(removed).isNotEmpty()) {
            setDataSets(dataSets => excludeFromDataSet(dataSets, removed));
        }
    }, [
        cachedDataSets,
        compositionRoot,
        dataSets,
        selectedDataSets,
        snackbar,
        startLoading,
        stopLoading,
    ]);

    return { dataSets, removeSection, loadingDataSets: loading };
}

function excludeFromDataSet<T extends BasicDataSet>(dataSets: T[], removed: BasicDataSet[]) {
    const removeIds = new Set(removed.map(getId));
    return dataSets.filter(ds => !removeIds.has(ds.id));
}

function diffDataSets(newDataSets: BasicDataSet[], oldDataSets: BasicDataSet[]) {
    const newDS = _(newDataSets);
    const oldDS = _(oldDataSets);

    const added = newDS.differenceBy(getId, oldDS);
    const removed = oldDS.differenceBy(getId, newDS);

    return { added: added.value(), removed: removed.value() };
}
