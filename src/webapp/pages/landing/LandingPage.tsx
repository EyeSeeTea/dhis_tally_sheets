import React from "react";
import { GetApp as DownloadIcon, Print as PrintIcon } from "@material-ui/icons";
import {
    Box,
    Button,
    Checkbox,
    CircularProgress,
    FormControlLabel,
    Paper,
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

export const LandingPage: React.FC = React.memo(() => {
    const theme = useTheme();
    const { compositionRoot, currentUser } = useAppContext();

    const [options, setOptions] = React.useState({
        includeHeaders: true,
        allLanguages: false,
        allDatasets: false,
    });

    const handleChange = React.useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setOptions({ ...options, [event.target.name]: event.target.checked });
        },
        [options]
    );

    const dataSetSelectorProps = useDataSetSelector();

    const resetView = React.useCallback(() => {}, []);

    const selectedDatasets = React.useMemo(() => {
        return options.allDatasets
            ? dataSetSelectorProps.allItems
            : dataSetSelectorProps.allItems.filter(i => dataSetSelectorProps.values.includes(i.id));
    }, [dataSetSelectorProps.allItems, dataSetSelectorProps.values, options.allDatasets]);

    const availableLocales = React.useMemo(() => {
        return _c(selectedDatasets).isEmpty()
            ? []
            : _c(
                  selectedDatasets.flatMap(dataSet =>
                      dataSet.translations.flatMap(t =>
                          t.property === "NAME" ? [t.locale.split("_")[0]] : []
                      )
                  )
              )
                  .concat("en")
                  .uniq()
                  .compact()
                  .value(); // Add English because is not included in translations
    }, [selectedDatasets]);

    const languageSelectorProps = useLanguagesSelector(
        availableLocales,
        currentUser.preferredLocale
    );

    const selectedLocales = React.useMemo(() => {
        return options.allLanguages
            ? languageSelectorProps.allItems
            : languageSelectorProps.allItems.filter(i =>
                  languageSelectorProps.values.includes(i.code)
              );
    }, [languageSelectorProps.allItems, languageSelectorProps.values, options.allLanguages]);

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
        compositionRoot.dataSets.export
            .execute(dataSets, selectedLocales)
            .run(console.log, console.error);
    }, [compositionRoot, dataSets, selectedLocales]);

    React.useEffect(() => {
        if (options.allDatasets === false) {
            resetView();
        }
    }, [options.allDatasets, resetView]);

    return (
        <Box margin={theme.spacing(0.5)}>
            <Paper>
                <Box display="flex" justifyContent="space-between" padding={theme.spacing(0.5)}>
                    <Box display="flex" flexDirection="column">
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
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={options.allLanguages}
                                    onChange={handleChange}
                                    name="allLanguages"
                                    color="primary"
                                />
                            }
                            label={i18n.t("Select all languages")}
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={options.allDatasets}
                                    onChange={handleChange}
                                    name="allDatasets"
                                    color="primary"
                                />
                            }
                            label={i18n.t("Select all datasets")}
                        />
                        <Box
                            display="flex"
                            marginTop={theme.spacing(0.25)}
                            gridColumnGap={theme.spacing(3)}
                            alignItems="center"
                        >
                            {!options.allDatasets && <MultipleSelector {...dataSetSelectorProps} />}
                            {!options.allLanguages && currentUser.canSelectAllLocales && (
                                <MultipleSelector {...languageSelectorProps} />
                            )}

                            {loading && (
                                <Box display="flex" alignItems="center">
                                    <CircularProgress size="2em" thickness={4} />
                                </Box>
                            )}
                        </Box>
                    </Box>
                    <Box display="flex" gridColumnGap={theme.spacing(3)} alignItems="flex-start">
                        <Button variant="contained" color="default" startIcon={<PrintIcon />}>
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
            </Paper>

            {_c(dataSets).isNotEmpty() && (
                <Paper>
                    <Box
                        marginTop={theme.spacing(0.5)}
                        padding={theme.spacing(0.5)}
                        display="flex"
                        flexDirection="column"
                        gridRowGap={theme.spacing(8)}
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
                </Paper>
            )}
        </Box>
    );
});

type LoadingState = "loading" | "loaded" | "error";
type SelectorProps<Item> = MultipleSelectorProps & { loading: LoadingState; allItems: Item[] };

function useDataSetSelector(): SelectorProps<BasicDataSet> {
    const { compositionRoot } = useAppContext();

    const [dataSets, setDataSets] = React.useState<BasicDataSet[]>([]);
    const [selected, setSelected] = React.useState<string[]>([]);
    const [loading, setLoading] = React.useState<LoadingState>("loading");

    const onChange = React.useCallback((values: string[]) => {
        setSelected(values);
    }, []);

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
        }),
        [selected, onChange, dataSets, loading]
    );

    React.useEffect(
        () =>
            compositionRoot.dataSets.getBasicList.execute().run(
                dataSets => {
                    setDataSets(dataSets);
                    setLoading("loaded");
                },
                err => {
                    console.error(err);
                    setLoading("error");
                }
            ),
        [compositionRoot.dataSets.getBasicList]
    );

    return props;
}

function useLanguagesSelector(
    availableLocales: string[],
    preferredLocale: string
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
        }),
        [items, selected, onChange, loading, available]
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
        console.log("updated");
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
