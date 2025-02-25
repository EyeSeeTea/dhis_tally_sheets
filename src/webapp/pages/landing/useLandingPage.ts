import React from "react";
import { useAppContext } from "$/webapp/contexts/app-context";
import { Id } from "$/domain/entities/Ref";
import { OrgUnit } from "$/domain/entities/OrgUnit";
import { useSnackbar } from "@eyeseetea/d2-ui-components";
import { useBooleanState } from "$/webapp/utils/use-boolean";
import { useLanguageSelector } from "$/webapp/pages/landing/useLanguageSelector";
import { useDataSets } from "$/webapp/pages/landing/useDataSets";
import { useDataSetSelector } from "$/webapp/pages/landing/useDataSetSelector";
import { BasicDataSet } from "$/domain/entities/BasicDataSet";
import i18n from "$/utils/i18n";
import _ from "$/domain/entities/generic/Collection";
import "./landing-page.css";

export function useLandingPage() {
    const { config, compositionRoot, currentUser } = useAppContext();

    const snackbar = useSnackbar();

    const [isSettingsOpen, { enable: openSettings, disable: closeSettings }] =
        useBooleanState(false);
    const [includeHeaders, { set: setIncludeHeaders, enable: addHeaders }] = useBooleanState(true);

    const handleChange = React.useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setIncludeHeaders(event.target.checked);
        },
        [setIncludeHeaders]
    );

    const {
        props: dataSetSelectorProps,
        resetSelected: resetSelectedDataSets,
        orgUnits,
        setOrgUnits,
    } = useDataSetSelector();

    const selectedDataSets = dataSetSelectorProps.selectedItems;

    const availableLocales = React.useMemo(
        () => getAvailableLocales(selectedDataSets),
        [selectedDataSets]
    );

    const languageSelectorProps = useLanguageSelector(
        availableLocales,
        currentUser.preferredLocale,
        currentUser.authorizations.canSelectAllLocales
    );

    const selectedLocales = languageSelectorProps.selectedItems;

    const { dataSets, removeSection, loadingDataSets } = useDataSets(selectedDataSets);

    const loading =
        dataSetSelectorProps.loading === "loading" ||
        languageSelectorProps.loading === "loading" ||
        loadingDataSets;

    const onRemoveSection = React.useMemo(
        () => (dataSetId: Id) => (sectionId: Id) => {
            removeSection(dataSetId, sectionId);
        },
        [removeSection]
    );

    const exportToExcel = React.useCallback(() => {
        if (_(dataSets).isNotEmpty() && _(selectedLocales).isNotEmpty())
            compositionRoot.dataSets.export
                .execute({
                    dataSets,
                    locales: selectedLocales,
                    config,
                    includeHeaders: includeHeaders,
                })
                .run(
                    () => {
                        console.debug(`Exported to Excel ${dataSets.length} datasets`);
                    },
                    err => {
                        snackbar.error(
                            i18n.t("Something went wrong while creating the excel file")
                        );
                        console.error(err);
                    }
                );
    }, [compositionRoot, config, dataSets, includeHeaders, selectedLocales, snackbar]);

    const resetView = React.useCallback(() => {
        resetSelectedDataSets();
        addHeaders();
        setOrgUnits([]);
    }, [resetSelectedDataSets, addHeaders, setOrgUnits]);

    const setSelectedOrgUnits = React.useCallback(
        (orgUnits: OrgUnit[]) => {
            resetSelectedDataSets();
            setOrgUnits(orgUnits);
        },
        [resetSelectedDataSets, setOrgUnits]
    );

    const disabledRestore =
        loading ||
        (_(selectedDataSets).isEmpty() && _(selectedLocales).isEmpty() && _(orgUnits).isEmpty());

    return {
        loading,
        orgUnits,
        isSettingsOpen,
        openSettings,
        closeSettings,
        handleChange,
        onRemoveSection,
        exportToExcel,
        resetView,
        setSelectedOrgUnits,
        disabledRestore,
        dataSets,
        dataSetSelectorProps,
        languageSelectorProps,
        includeHeaders,
        disabledExport: _(selectedDataSets).isEmpty() || _(selectedLocales).isEmpty() || loading,
        allDataSetsSelected: dataSetSelectorProps.allSelected,
    };
}

function getAvailableLocales(dataSets: BasicDataSet[]): string[] {
    const avail = _(dataSets.map(ds => ds.getAvailableLocaleCodes()))
        .flatten()
        .concat("en") // Add English because is not included in translations
        .uniq()
        .compact()
        .value();
    return _(dataSets).isEmpty() ? [] : avail;
}
