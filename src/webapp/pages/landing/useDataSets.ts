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

    // Cache in useHook, to restore sections when a Data Set is added again and prevent quick
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
            const cached = cachedDataSets.filter(ds => added.map(getId).includes(ds.id));
            const toRequest = added.filter(ds => !cached.map(getId).includes(ds.id));
            if (_(toRequest).isNotEmpty()) {
                startLoading();
                compositionRoot.dataSets.getByIds.execute(toRequest.map(getId)).run(
                    addedDataSets => {
                        setDataSets(dataSets => {
                            setCachedDataSets(cachedDataSets => {
                                const newCached = _(cachedDataSets)
                                    .concat(_(addedDataSets))
                                    .uniqBy(getId)
                                    .value();
                                setCachedDataSets(newCached);
                                return newCached;
                            });
                            const newDataSets = _(dataSets)
                                .concat(_(addedDataSets))
                                .concat(_(cached))
                                .uniqBy(getId)
                                .value();
                            return _(removed).isEmpty()
                                ? newDataSets
                                : excludeRemoved(newDataSets, removed);
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
                        : excludeRemoved(newDataSets, removed);
                });
            }
        } else if (_(removed).isNotEmpty()) {
            setDataSets(dataSets => excludeRemoved(dataSets, removed));
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

function excludeRemoved(dataSets: DataSet[], removed: BasicDataSet[]) {
    return dataSets.filter(ds => !removed.map(getId).includes(ds.id));
}

function diffDataSets(newDataSets: BasicDataSet[], oldDataSets: BasicDataSet[]) {
    const newDS = _(newDataSets);
    const oldDS = _(oldDataSets);

    const added = newDS.differenceBy(getId, oldDS);
    const removed = oldDS.differenceBy(getId, newDS);

    return { added: added.value(), removed: removed.value() };
}
