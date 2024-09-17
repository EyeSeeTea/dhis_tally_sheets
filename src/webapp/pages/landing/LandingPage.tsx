import React from "react";
import {
    GetApp as DownloadIcon,
    Print as PrintIcon,
    Restore as RestoreIcon,
    Settings as SettingsIcon,
} from "@material-ui/icons";
import { Alert } from "@material-ui/lab";
import {
    Box,
    Button,
    Checkbox,
    CircularProgress,
    createStyles,
    FormControlLabel,
    makeStyles,
    Paper,
    Theme,
    Tooltip,
    useTheme,
} from "@material-ui/core";
import {
    MultipleSelector,
    MultipleSelectorProps,
} from "$/webapp/components/multiple-selector/MultipleSelector";
import { useAppContext } from "$/webapp/contexts/app-context";
import { BasicDataSet } from "$/domain/entities/BasicDataSet";
import { Locale } from "$/domain/entities/Locale";
import { DataSet } from "$/domain/entities/DataSet";
import { DataSetTable } from "$/webapp/components/dataset-table/DataSetTable";
import { Id } from "$/domain/entities/Ref";
import { OrgUnitSelector } from "$/webapp/components/org-unit-selector/OrgUnitSelector";
import { OrgUnit } from "$/domain/entities/OrgUnit";
import { useSnackbar } from "@eyeseetea/d2-ui-components";
import { useBooleanState } from "$/webapp/utils/use-boolean";
import { SettingsDialog } from "$/webapp/components/settings-dialog/SettingsDialog";
import { DisableableTooltip } from "$/webapp/components/disableable-tooltip/DisableableTooltip";
import i18n from "$/utils/i18n";
import _c from "$/domain/entities/generic/Collection";
import "./landing-page.css";

export const LandingPage: React.FC = React.memo(() => {
    const { config, compositionRoot, currentUser } = useAppContext();

    const theme = useTheme();
    const classes = useStyles();
    const snackbar = useSnackbar();

    const [isSettingsOpen, { enable: openSettings, disable: closeSettings }] =
        useBooleanState(false);
    const [options, setOptions] = React.useState({
        includeHeaders: true,
    });

    const handleChange = React.useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setOptions({ ...options, [event.target.name]: event.target.checked });
        },
        [options]
    );

    const {
        props: dataSetSelectorProps,
        resetSelected: resetSelectedDataSets,
        orgUnits,
        setOrgUnits,
    } = useDataSetSelector();

    const selectedDataSets = dataSetSelectorProps.selectedItems;

    const availableLocales = React.useMemo(() => {
        const avail = _c(selectedDataSets.map(ds => ds.getAvailableLocaleCodes()))
            .flatten()
            .concat("en") // Add English because is not included in translations
            .uniq()
            .compact()
            .value();
        return _c(selectedDataSets).isEmpty() ? [] : avail;
    }, [selectedDataSets]);

    const languageSelectorProps = useLanguagesSelector(
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
        if (_c(dataSets).isNotEmpty() && _c(selectedLocales).isNotEmpty())
            compositionRoot.dataSets.export
                .execute({
                    dataSets,
                    locales: selectedLocales,
                    config,
                    includeHeaders: options.includeHeaders,
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
    }, [compositionRoot, config, dataSets, options.includeHeaders, selectedLocales, snackbar]);

    const resetView = React.useCallback(() => {
        resetSelectedDataSets();
        setOptions({ includeHeaders: true });
        setOrgUnits([]);
    }, [resetSelectedDataSets, setOrgUnits]);

    const setSelectedOrgUnits = React.useCallback(
        (orgUnits: OrgUnit[]) => {
            resetSelectedDataSets();
            setOrgUnits(orgUnits);
        },
        [resetSelectedDataSets, setOrgUnits]
    );

    const disabledRestore =
        loading ||
        (_c(selectedDataSets).isEmpty() && _c(selectedLocales).isEmpty() && _c(orgUnits).isEmpty());

    return (
        <Box margin={theme.spacing(0.5)}>
            {config.infoPlaceholder && (
                <Box
                    marginBottom={theme.spacing(0.25)}
                    border={`1px solid ${theme.palette.primary.light}`}
                    borderRadius={theme.shape.borderRadius}
                >
                    <Alert severity="info" variant="standard">
                        {config.infoPlaceholder}
                    </Alert>
                </Box>
            )}
            <Paper elevation={2}>
                <Box padding={theme.spacing(3, 4, 2.5)}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box display="flex" gridColumnGap={theme.spacing(2)} alignItems="center">
                            <OrgUnitSelector
                                onChange={setSelectedOrgUnits}
                                selected={orgUnits}
                                disabled={loading}
                            />
                            <MultipleSelector {...dataSetSelectorProps} />
                            <MultipleSelector {...languageSelectorProps} />
                            <DisableableTooltip
                                title={i18n.t("Restore changes")}
                                disabled={disabledRestore}
                            >
                                <Button
                                    className={classes.iconButton}
                                    aria-label="restore"
                                    size="small"
                                    variant="outlined"
                                    disabled={disabledRestore}
                                    onClick={resetView}
                                >
                                    <RestoreIcon fontSize="medium" />
                                </Button>
                            </DisableableTooltip>

                            {loading && (
                                <Box display="flex" alignItems="center">
                                    <CircularProgress size="2em" thickness={4} />
                                </Box>
                            )}
                        </Box>

                        <Box display="flex" gridColumnGap={theme.spacing(2)}>
                            {currentUser.isAdmin() && (
                                <Tooltip title={i18n.t("Settings")}>
                                    <Button
                                        className={classes.iconButton}
                                        aria-label="settings"
                                        size="small"
                                        variant="outlined"
                                        onClick={openSettings}
                                    >
                                        <SettingsIcon fontSize="medium" />
                                    </Button>
                                </Tooltip>
                            )}
                            <Button
                                className={classes.actionButton}
                                variant="outlined"
                                color="default"
                                startIcon={<PrintIcon />}
                                onClick={window.print}
                            >
                                {i18n.t("Print")}
                            </Button>
                            <Button
                                className={classes.actionButton}
                                variant="contained"
                                color="primary"
                                startIcon={<DownloadIcon />}
                                onClick={exportToExcel}
                                disableElevation
                                disabled={
                                    _c(selectedDataSets).isEmpty() ||
                                    _c(selectedLocales).isEmpty() ||
                                    loading
                                }
                            >
                                {i18n.t("Export to Excel")}
                            </Button>
                        </Box>
                    </Box>
                    <Box marginTop={theme.spacing(0.25)}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={options.includeHeaders}
                                    onChange={handleChange}
                                    name="includeHeaders"
                                    color="primary"
                                />
                            }
                            label={i18n.t("Include headers")}
                        />
                    </Box>
                </Box>
            </Paper>

            {!dataSetSelectorProps.allSelected && _c(dataSets).isNotEmpty() && (
                <Box
                    className="print-zone"
                    marginTop={theme.spacing(0.5)}
                    display="flex"
                    flexDirection="column"
                    gridRowGap={theme.spacing(2)}
                >
                    {dataSets.map(ds => (
                        <DataSetTable
                            includeHeaders={options.includeHeaders}
                            key={ds.id}
                            dataSet={ds}
                            onRemoveSection={onRemoveSection(ds.id)}
                        />
                    ))}
                </Box>
            )}

            <SettingsDialog open={isSettingsOpen} onClose={closeSettings} />
        </Box>
    );
});

type LoadingState = "loading" | "loaded" | "error";
type SelectorProps<Item> = MultipleSelectorProps & {
    loading: LoadingState;
    allItems: Item[];
    selectedItems: Item[];
    allSelected: boolean;
};

function useDataSetSelector() {
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

function useLanguagesSelector(
    availableLocales: string[],
    preferredLocale: string,
    canSelectAllLocales: boolean
): SelectorProps<Locale> {
    const { compositionRoot } = useAppContext();

    const snackbar = useSnackbar();

    const [locales, setLocales] = React.useState<Locale[]>([]);
    const [loading, setLoading] = React.useState<LoadingState>("loading");
    const [selected, setSelected] = React.useState<string[]>([]);

    const available = React.useMemo(
        () => locales.filter(locale => availableLocales?.includes(locale.code)),
        [availableLocales, locales]
    );

    const items = React.useMemo(
        () =>
            available.map(locale => ({
                value: locale.code,
                text: locale.displayName,
            })),
        [available]
    );

    const onChange = React.useCallback((values: string[]) => {
        setSelected(values);
    }, []);

    const allValue = "all-languages";

    const props: SelectorProps<Locale> = React.useMemo(
        () => ({
            items: items,
            values: selected,
            onChange: onChange,
            label: i18n.t("Select a language"),
            name: "select-language",
            loading: loading,
            type: "language",
            pluralType: "languages",
            allItems: available,
            disabled: loading === "loading" || _c(available).isEmpty(),
            allOption: canSelectAllLocales
                ? {
                      value: allValue,
                      text: i18n.t("ALL"),
                  }
                : undefined,
            allSelected: selected.includes(allValue),
            selectedItems: selected.includes(allValue)
                ? available
                : available.filter(i => selected.includes(i.code)),
        }),
        [items, selected, onChange, loading, available, canSelectAllLocales]
    );

    React.useEffect(
        () =>
            compositionRoot.locales.get.execute().run(
                locales => {
                    setLocales(locales);
                    setLoading("loaded");
                },
                err => {
                    snackbar.error(i18n.t("Unable to fetch languages list"));
                    console.error(err);
                    setLoading("error");
                }
            ),
        [compositionRoot, snackbar]
    );

    React.useEffect(() => {
        const preferredIsAvailable = available.map(locale => locale.code).includes(preferredLocale);
        const codes = available.map(locale => locale.code);

        setSelected(selected =>
            _c(selected).isEmpty() && preferredIsAvailable
                ? [preferredLocale]
                : _c(selected)
                      .select(s => codes.includes(s))
                      .value()
        );
    }, [available, preferredLocale]);

    return props;
}

function useDataSets(selectedDataSets: BasicDataSet[]) {
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

        if (_c(added).isNotEmpty()) {
            const cached = cachedDataSets.filter(ds => added.map(getId).includes(ds.id));
            const toRequest = added.filter(ds => !cached.map(getId).includes(ds.id));
            if (_c(toRequest).isNotEmpty()) {
                startLoading();
                compositionRoot.dataSets.getByIds.execute(toRequest.map(getId)).run(
                    addedDataSets => {
                        setDataSets(dataSets => {
                            setCachedDataSets(cachedDataSets => {
                                const newCached = _c(cachedDataSets)
                                    .concat(_c(addedDataSets))
                                    .uniqBy(getId)
                                    .value();
                                setCachedDataSets(newCached);
                                return newCached;
                            });
                            const newDataSets = _c(dataSets)
                                .concat(_c(addedDataSets))
                                .concat(_c(cached))
                                .uniqBy(getId)
                                .value();
                            return _c(removed).isEmpty()
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
                    const newDataSets = _c(dataSets).concat(_c(cached)).uniqBy(getId).value();
                    return _c(removed).isEmpty()
                        ? newDataSets
                        : excludeRemoved(newDataSets, removed);
                });
            }
        } else if (_c(removed).isNotEmpty()) {
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
    const newDS = _c(newDataSets);
    const oldDS = _c(oldDataSets);

    const added = newDS.differenceBy(getId, oldDS);
    const removed = oldDS.differenceBy(getId, newDS);

    return { added: added.value(), removed: removed.value() };
}

function getId(dataSet: BasicDataSet) {
    return dataSet.id;
}

const useStyles = makeStyles((_theme: Theme) =>
    createStyles({
        iconButton: {
            marginTop: 3.5, // pixel distortion visual adjustment
            maxWidth: "3rem",
            minWidth: "unset",
            height: "2.5rem",
        },
        actionButton: {
            marginTop: 3.5, // pixel distortion visual adjustment
            minWidth: "unset",
            height: "2.5rem",
        },
    })
);
