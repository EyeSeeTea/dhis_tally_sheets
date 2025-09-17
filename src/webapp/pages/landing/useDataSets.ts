import React from "react";
import { useSnackbar } from "@eyeseetea/d2-ui-components";
import { BasicDataSet } from "$/domain/entities/BasicDataSet";
import { DataSet } from "$/domain/entities/DataSet";
import { useAppContext } from "$/webapp/contexts/app-context";
import { useBooleanState } from "$/webapp/utils/use-boolean";
import { getId, Id } from "$/domain/entities/Ref";
import _ from "$/domain/entities/generic/Collection";
import i18n from "$/utils/i18n";
import { HashMap } from "$/domain/entities/generic/HashMap";

export function useDataSets(selectedDataSets: BasicDataSet[]) {
    const { compositionRoot } = useAppContext();

    const snackbar = useSnackbar();

    // Maintain a cache of previously fetched DataSets to prevent unnecessary API requests on re-selection
    const [cachedDataSets, setCachedDataSets] = React.useState<HashMap<Id, DataSet>>(
        HashMap.empty()
    );
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

    React.useEffect(() => {
        const { added: addedArr, removed } = diffDataSets(selectedDataSets, dataSets);
        const added = _(addedArr);
        if (added.isEmpty() && _(removed).isEmpty()) return;

        const cached = added.compactMap(({ id }) => cachedDataSets.get(id));
        const toRequest = added.filter(({ id }) => !cachedDataSets.get(id));

        if (toRequest.isNotEmpty()) {
            startLoading();
            return compositionRoot.dataSets.getByIds.execute(toRequest.map(getId).value()).run(
                addedDataSets => {
                    setCachedDataSets(prev => prev.merge(_(addedDataSets).keyBy(getId)));
                    setDataSets(currentDataSets => {
                        const newDataSets = _(currentDataSets)
                            .concat(_(addedDataSets))
                            .concat(cached)
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
            setDataSets(currentDataSets => {
                const addedDataSets = added.compactMap(ds => cachedDataSets.get(ds.id));
                const newDataSets = added.isEmpty()
                    ? currentDataSets
                    : _(currentDataSets).concat(addedDataSets).uniqBy(getId).value();
                return _(removed).isEmpty() ? newDataSets : excludeRemoved(newDataSets, removed);
            });
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
    const removedIds = new Set(removed.map(getId));
    return dataSets.filter(ds => !removedIds.has(ds.id));
}

function diffDataSets(newDataSets: BasicDataSet[], oldDataSets: BasicDataSet[]) {
    const newDS = _(newDataSets);
    const oldDS = _(oldDataSets);

    const added = newDS.differenceBy(getId, oldDS);
    const removed = oldDS.differenceBy(getId, newDS);

    return { added: added.value(), removed: removed.value() };
}
