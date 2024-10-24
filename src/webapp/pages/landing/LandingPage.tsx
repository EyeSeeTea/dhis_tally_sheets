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
    useMediaQuery,
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
import _ from "$/domain/entities/generic/Collection";
import "./landing-page.css";

export const LandingPage: React.FC = React.memo(() => {
    const theme = useTheme();
    const classes = useStyles();

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

    const isSmScreen = useMediaQuery("(max-width:980px)");

    return (
        <Box margin={theme.spacing(0.5)}>
            <MessagePlaceholder />
            <Paper elevation={2}>
                <Box display="flex" flexDirection="column" padding={theme.spacing(3, 4, 2.5)}>
                    {isSmScreen && (
                        <Box alignSelf="flex-end" display="flex" marginBottom={theme.spacing(0.25)}>
                            <DisableableTooltip
                                title={i18n.t("Reset filters")}
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
                            <Actions
                                openSettings={openSettings}
                                exportToExcel={exportToExcel}
                                disabledExport={disabledExport}
                            />
                        </Box>
                    )}
                    <Box
                        display="flex"
                        flexGrow={1}
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <Selectors
                            loading={loading}
                            orgUnits={orgUnits}
                            disabledRestore={disabledRestore}
                            dataSetSelectorProps={dataSetSelectorProps}
                            languageSelectorProps={languageSelectorProps}
                            setSelectedOrgUnits={setSelectedOrgUnits}
                            resetView={resetView}
                        />

                        {!isSmScreen && (
                            <Actions
                                openSettings={openSettings}
                                exportToExcel={exportToExcel}
                                disabledExport={disabledExport}
                            />
                        )}
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

            {!allDataSetsSelected && _(dataSets).isNotEmpty() && (
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

    const isSmScreen = useMediaQuery("(max-width:980px)");

    return (
        <Box
            display="flex"
            flexDirection={isSmScreen ? "column" : "row"}
            flexGrow={1}
            gridColumnGap={theme.spacing(2)}
            gridRowGap={theme.spacing(1)}
            alignItems="center"
        >
            <OrgUnitSelector
                onChange={setSelectedOrgUnits}
                selected={orgUnits}
                disabled={loading}
            />

            <MultipleSelector {...dataSetSelectorProps} />
            <MultipleSelector {...languageSelectorProps} />

            {!isSmScreen && (
                <DisableableTooltip title={i18n.t("Reset filters")} disabled={disabledRestore}>
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
            )}

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
    const isMdScreen = useMediaQuery("(max-width:1600px)");

    const buttonProps = React.useMemo(
        () => ({
            print: {
                color: "default",
                variant: "outlined",
                onClick: window.print,
                className: isMdScreen ? classes.iconButton : classes.actionButton,
                "aria-label": isMdScreen ? i18n.t("Print") : "",
                size: isMdScreen ? "small" : undefined,
                startIcon: isMdScreen ? undefined : <PrintIcon />,
                children: isMdScreen ? <PrintIcon fontSize="medium" /> : i18n.t("Print"),
            } as const,
            export: {
                color: "primary",
                variant: "contained",
                onClick: exportToExcel,
                disableElevation: true,
                disabled: disabledExport,
                className: isMdScreen ? classes.iconButton : classes.actionButton,
                "aria-label": isMdScreen ? i18n.t("Export to Excel") : "",
                size: isMdScreen ? "small" : undefined,
                startIcon: isMdScreen ? undefined : <DownloadIcon />,
                children: isMdScreen ? (
                    <DownloadIcon fontSize="medium" />
                ) : (
                    i18n.t("Export to Excel")
                ),
            } as const,
        }),
        [classes, disabledExport, exportToExcel, isMdScreen]
    );

    return (
        <Box display="flex" gridColumnGap={theme.spacing(2)} marginLeft={theme.spacing(0.25)}>
            {currentUser.isAdmin() && (
                <Tooltip title={i18n.t("Settings")}>
                    <Button
                        className={classes.iconButton}
                        aria-label={i18n.t("Settings")}
                        size="small"
                        variant="outlined"
                        onClick={openSettings}
                    >
                        <SettingsIcon fontSize="medium" />
                    </Button>
                </Tooltip>
            )}

            <Tooltip title={buttonProps.print["aria-label"]}>
                <Button {...buttonProps.print} />
            </Tooltip>

            <Tooltip title={buttonProps.export["aria-label"]}>
                <Button {...buttonProps.export} />
            </Tooltip>
        </Box>
    );
});

const MessagePlaceholder: React.FC = React.memo(() => {
    const { config, currentUser } = useAppContext();
    const theme = useTheme();

    if (!config.messageInfo) return null;

    const message = config.messageInfo[currentUser.preferredLocale] ?? config.messageInfo["en"];

    if (!message) return null;

    return (
        <Box
            marginBottom={theme.spacing(0.25)}
            border={`1px solid ${theme.palette.primary.light}`}
            borderRadius={theme.shape.borderRadius}
        >
            <Alert severity="info" variant="standard">
                {message}
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
