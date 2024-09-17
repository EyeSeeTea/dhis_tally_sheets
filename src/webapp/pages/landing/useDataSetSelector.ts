import React from "react";
import { useSnackbar } from "@eyeseetea/d2-ui-components";
import { BasicDataSet } from "$/domain/entities/BasicDataSet";
import { OrgUnit } from "$/domain/entities/OrgUnit";
import { useAppContext } from "$/webapp/contexts/app-context";
import { MultipleSelectorProps } from "$/webapp/components/multiple-selector/MultipleSelector";
import i18n from "$/utils/i18n";
import _c from "$/domain/entities/generic/Collection";

export type LoadingState = "loading" | "loaded" | "error";

export type SelectorProps<Item> = MultipleSelectorProps & {
    loading: LoadingState;
    allItems: Item[];
    selectedItems: Item[];
    allSelected: boolean;
};

export function useDataSetSelector() {
    const { compositionRoot } = useAppContext();

    const snackbar = useSnackbar();

    const [orgUnits, setOrgUnits] = React.useState<OrgUnit[]>([]);
    const [dataSets, setDataSets] = React.useState<BasicDataSet[]>([]);
    const [selected, setSelected] = React.useState<string[]>([]);
    const [loading, setLoading] = React.useState<LoadingState>("loading");

    const resetSelected = React.useCallback(() => {
        setSelected([]);
    }, []);

    const onChange = React.useCallback((values: string[]) => {
        setSelected(values);
    }, []);

    const allValue = "all-datasets";

    const props: SelectorProps<BasicDataSet> = React.useMemo(
        () => ({
            items: _c(dataSets.map(ds => ({ value: ds.id, text: ds.displayName })))
                .sortBy(i => i.text.toLowerCase())
                .value(),
            allItems: dataSets,
            values: selected,
            type: "dataset",
            pluralType: "datasets",
            onChange: onChange,
            label: i18n.t("Select a dataset"),
            name: "select-dataset",
            loading: loading,
            disabled: loading === "loading" || dataSets.length === 0,
            allOption: {
                value: allValue,
                text: i18n.t("ALL"),
            },
            allSelected: selected.includes(allValue),
            selectedItems: selected.includes(allValue)
                ? dataSets
                : dataSets.filter(i => selected.includes(i.id)),
        }),
        [selected, onChange, dataSets, loading]
    );

    React.useEffect(() => {
        compositionRoot.dataSets.getBasicList.execute(orgUnits).run(
            dataSets => {
                setDataSets(dataSets);
                setLoading("loaded");
            },
            err => {
                snackbar.error(i18n.t("Unable to fetch datasets list"));
                console.error(err);
                setLoading("error");
            }
        );

        return () => {
            setLoading("loading");
        };
    }, [compositionRoot, orgUnits, snackbar]);

    return {
        props: props,
        resetSelected: resetSelected,
        orgUnits: orgUnits,
        setOrgUnits: setOrgUnits,
    };
}
