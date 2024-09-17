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
import { DataSetTable } from "$/webapp/components/dataset-table/DataSetTable";
import { OrgUnitSelector } from "$/webapp/components/org-unit-selector/OrgUnitSelector";
import { SettingsDialog } from "$/webapp/components/settings-dialog/SettingsDialog";
import { DisableableTooltip } from "$/webapp/components/disableable-tooltip/DisableableTooltip";
import { useLandingPage } from "$/webapp/pages/landing/useLandingPage";
import { OrgUnit } from "$/domain/entities/OrgUnit";
import i18n from "$/utils/i18n";
import _c from "$/domain/entities/generic/Collection";
import "./landing-page.css";

export const LandingPage: React.FC = React.memo(() => {
    const theme = useTheme();

    const {
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
        disabledExport,
        allDataSetsSelected,
    } = useLandingPage();

    return (
        <Box margin={theme.spacing(0.5)}>
            <MessagePlaceholder />
            <Paper elevation={2}>
                <Box padding={theme.spacing(3, 4, 2.5)}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Selectors
                            loading={loading}
                            orgUnits={orgUnits}
                            disabledRestore={disabledRestore}
                            dataSetSelectorProps={dataSetSelectorProps}
                            languageSelectorProps={languageSelectorProps}
                            setSelectedOrgUnits={setSelectedOrgUnits}
                            resetView={resetView}
                        />

                        <Actions
                            openSettings={openSettings}
                            exportToExcel={exportToExcel}
                            disabledExport={disabledExport}
                        />
                    </Box>
                    <Box marginTop={theme.spacing(0.25)}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={includeHeaders}
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

            {!allDataSetsSelected && _c(dataSets).isNotEmpty() && (
                <Box
                    className="print-zone"
                    marginTop={theme.spacing(0.5)}
                    display="flex"
                    flexDirection="column"
                    gridRowGap={theme.spacing(2)}
                >
                    {dataSets.map(ds => (
                        <DataSetTable
                            includeHeaders={includeHeaders}
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

interface SelectorsProps {
    loading: boolean;
    orgUnits: OrgUnit[];
    disabledRestore: boolean;
    dataSetSelectorProps: MultipleSelectorProps;
    languageSelectorProps: MultipleSelectorProps;
    setSelectedOrgUnits: (orgUnits: OrgUnit[]) => void;
    resetView: () => void;
}

const Selectors: React.FC<SelectorsProps> = React.memo(props => {
    const {
        loading,
        orgUnits,
        disabledRestore,
        dataSetSelectorProps,
        languageSelectorProps,
        setSelectedOrgUnits,
        resetView,
    } = props;

    const theme = useTheme();
    const classes = useStyles();

    return (
        <Box display="flex" gridColumnGap={theme.spacing(2)} alignItems="center">
            <OrgUnitSelector
                onChange={setSelectedOrgUnits}
                selected={orgUnits}
                disabled={loading}
            />

            <MultipleSelector {...dataSetSelectorProps} />
            <MultipleSelector {...languageSelectorProps} />

            <DisableableTooltip title={i18n.t("Restore changes")} disabled={disabledRestore}>
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
    );
});

interface ActionsProps {
    openSettings: () => void;
    exportToExcel: () => void;
    disabledExport: boolean;
}

const Actions: React.FC<ActionsProps> = React.memo(props => {
    const { openSettings, exportToExcel, disabledExport } = props;
    const { currentUser } = useAppContext();

    const theme = useTheme();
    const classes = useStyles();

    return (
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
                disabled={disabledExport}
            >
                {i18n.t("Export to Excel")}
            </Button>
        </Box>
    );
});

const MessagePlaceholder: React.FC = React.memo(() => {
    const { config } = useAppContext();
    const theme = useTheme();

    if (!config.infoPlaceholder) return null;
    return (
        <Box
            marginBottom={theme.spacing(0.25)}
            border={`1px solid ${theme.palette.primary.light}`}
            borderRadius={theme.shape.borderRadius}
        >
            <Alert severity="info" variant="standard">
                {config.infoPlaceholder}
            </Alert>
        </Box>
    );
});

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
