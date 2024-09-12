import React from "react";
import { Clear as ClearIcon, GetApp as DownloadIcon, Print as PrintIcon } from "@material-ui/icons";
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
import _c from "$/domain/entities/generic/Collection";
import i18n from "$/utils/i18n";
import "./landing-page.css";
import { OrgUnitFilter } from "$/webapp/components/org-unit-filter/OrgUnitFilter";
import { Maybe } from "$/utils/ts-utils";

export const LandingPage: React.FC = React.memo(() => {
    const theme = useTheme();
    const classes = useStyles();

    const { compositionRoot, currentUser } = useAppContext();

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
        orgUnitPaths,
        setOrgUnitPaths,
    } = useDataSetSelector();

    const selectedDatasets = dataSetSelectorProps.selectedItems;

    const availableLocales = React.useMemo(() => {
        const avail = _c(selectedDatasets.map(ds => ds.getAvailableLocaleCodes()))
            .flatten()
            .concat("en") // Add English because is not included in translations
            .uniq()
            .compact()
            .value();
        return _c(selectedDatasets).isEmpty() ? [] : avail;
    }, [selectedDatasets]);

    const languageSelectorProps = useLanguagesSelector(
        availableLocales,
        currentUser.preferredLocale,
        currentUser.canSelectAllLocales
    );

    const selectedLocales = languageSelectorProps.selectedItems;

    const loading = React.useMemo(
        () =>
            dataSetSelectorProps.loading === "loading" ||
            languageSelectorProps.loading === "loading",
        [dataSetSelectorProps.loading, languageSelectorProps.loading]
    );

    const { dataSets, removeSection } = useDataSets(selectedDatasets);

    const onRemoveSection = React.useMemo(
        () => (dataSetId: Id) => (sectionId: Id) => {
            removeSection(dataSetId, sectionId);
        },
        [removeSection]
    );

    const exportToExcel = React.useCallback(() => {
        if (_c(dataSets).isNotEmpty() && _c(selectedLocales).isNotEmpty())
            compositionRoot.dataSets.export.execute(dataSets, selectedLocales).run(() => {
                console.debug(`Exported to Excel ${dataSets.length} datasets`);
            }, console.error); //change to snackbar
    }, [compositionRoot, dataSets, selectedLocales]);

    const resetView = React.useCallback(() => {
        resetSelectedDataSets();
        setOptions({ includeHeaders: true });
        setOrgUnitPaths([]);
    }, [resetSelectedDataSets, setOrgUnitPaths]);

    return (
        <Box margin={theme.spacing(0.5)}>
            <Paper elevation={2}>
                <Box padding={theme.spacing(0.5)}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
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
                        <Box display="flex" gridColumnGap={theme.spacing(3)}>
                            <Button
                                variant="contained"
                                color="default"
                                startIcon={<PrintIcon />}
                                onClick={window.print}
                            >
                                {i18n.t("Print")}
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<DownloadIcon />}
                                onClick={exportToExcel}
                                disabled={
                                    _c(selectedDatasets).isEmpty() ||
                                    _c(selectedLocales).isEmpty() ||
                                    loading
                                }
                            >
                                {i18n.t("Export to Excel")}
                            </Button>
                        </Box>
                    </Box>
                    <Box display="flex" flexDirection="column">
                        <Box
                            display="flex"
                            marginTop={theme.spacing(0.25)}
                            gridColumnGap={theme.spacing(3)}
                            alignItems="center"
                        >
                            <OrgUnitFilter
                                onChange={setOrgUnitPaths}
                                selectedPaths={orgUnitPaths}
                            />
                            <MultipleSelector {...dataSetSelectorProps} />
                            <MultipleSelector {...languageSelectorProps} />
                            <Button
                                className={classes.resetButton}
                                aria-label="delete"
                                size="small"
                                variant="outlined"
                                onClick={resetView}
                            >
                                <ClearIcon fontSize="medium" />
                            </Button>

                            {loading && (
                                <Box display="flex" alignItems="center">
                                    <CircularProgress size="2em" thickness={4} />
                                </Box>
                            )}
                        </Box>
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

    const [orgUnitPaths, setOrgUnitPaths] = React.useState<string[]>([]);
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
        const orgUnits = _c(orgUnitPaths)
            .map(path => _c(path.split("/")).last())
            .compact()
            .value();

        compositionRoot.dataSets.getBasicList.execute(orgUnits).run(
            dataSets => {
                setDataSets(dataSets);
                setLoading("loaded");
            },
            err => {
                console.error(err);
                setLoading("error");
            }
        );

        return () => {
            setLoading("loading");
        };
    }, [compositionRoot.dataSets.getBasicList, orgUnitPaths]);

    return {
        props: props,
        resetSelected: resetSelected,
        orgUnitPaths: orgUnitPaths,
        setOrgUnitPaths: setOrgUnitPaths,
    };
}

function useLanguagesSelector(
    availableLocales: string[],
    preferredLocale: string,
    canSelectAllLocales: boolean
): SelectorProps<Locale> {
    const { compositionRoot } = useAppContext();

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
                    console.error(err);
                    setLoading("error");
                }
            ),
        [compositionRoot.locales.get]
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

    // Cache in useHook, to restore sections when a Data Set is added again and prevent quick
    const [cachedDataSets, setCachedDataSets] = React.useState<DataSet[]>([]);
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

    /* REFACTOR TO BE DONE */
    /* ALSO NOW REMOVE SECTION IS NOT RESTORING AFTER UNSELECT, SELECT */
    React.useEffect(() => {
        const { added, removed } = diffDataSets(selectedDataSets, dataSets);

        console.debug("Added DataSets", added, "Removed DataSets", removed);

        if (_c(added).isNotEmpty()) {
            const cached = cachedDataSets.filter(ds => added.map(getId).includes(ds.id));
            const toRequest = added.filter(ds => !cached.map(getId).includes(ds.id));
            if (_c(toRequest).isNotEmpty()) {
                compositionRoot.dataSets.getByIds.execute(toRequest.map(getId)).run(
                    addedDataSets =>
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
                        }),
                    err => console.error(err)
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
    }, [cachedDataSets, compositionRoot, dataSets, selectedDataSets]);

    return { dataSets, removeSection };
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
        resetButton: {
            marginTop: 3,
            maxWidth: "3rem",
            minWidth: "unset",
            height: "2.5rem",
        },
    })
);
