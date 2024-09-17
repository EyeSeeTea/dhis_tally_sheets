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
import { MultipleSelector } from "$/webapp/components/multiple-selector/MultipleSelector";
import { useAppContext } from "$/webapp/contexts/app-context";
import { BasicDataSet } from "$/domain/entities/BasicDataSet";
import { DataSetTable } from "$/webapp/components/dataset-table/DataSetTable";
import { Id } from "$/domain/entities/Ref";
import { OrgUnitSelector } from "$/webapp/components/org-unit-selector/OrgUnitSelector";
import { OrgUnit } from "$/domain/entities/OrgUnit";
import { useSnackbar } from "@eyeseetea/d2-ui-components";
import { useBooleanState } from "$/webapp/utils/use-boolean";
import { SettingsDialog } from "$/webapp/components/settings-dialog/SettingsDialog";
import { DisableableTooltip } from "$/webapp/components/disableable-tooltip/DisableableTooltip";
import { useLanguageSelector } from "$/webapp/pages/landing/useLanguageSelector";
import { useDataSets } from "$/webapp/pages/landing/useDataSets";
import { useDataSetSelector } from "$/webapp/pages/landing/useDataSetSelector";
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

function getAvailableLocales(dataSets: BasicDataSet[]): string[] {
    const avail = _c(dataSets.map(ds => ds.getAvailableLocaleCodes()))
        .flatten()
        .concat("en") // Add English because is not included in translations
        .uniq()
        .compact()
        .value();
    return _c(dataSets).isEmpty() ? [] : avail;
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
