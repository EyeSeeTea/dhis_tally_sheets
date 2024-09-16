import React from "react";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    TextField,
    Box,
    useTheme,
    LinearProgress,
    Tooltip,
} from "@material-ui/core";
import { useAppContext } from "$/webapp/contexts/app-context";
import { useBooleanState } from "$/webapp/utils/use-boolean";
import { useSnackbar } from "@eyeseetea/d2-ui-components/snackbar";
import i18n from "$/utils/i18n";
import { Maybe } from "$/utils/ts-utils";

interface SettingsDialogProps {
    open: boolean;
    onClose: () => void;
}

export const SettingsDialog: React.FC<SettingsDialogProps> = ({ open, onClose }) => {
    const { config, compositionRoot } = useAppContext();

    const theme = useTheme();
    const snackbar = useSnackbar();

    const [loading, { enable: startLoading, disable: stopLoading }] = useBooleanState(false);
    const [settings, setSettings] = React.useState<Settings>({
        ...config,
        administratorGroups: config.administratorGroups.join(", "),
    });

    const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSettings(prevSettings => ({
            ...prevSettings,
            [name]: value,
        }));
    }, []);

    const handleSave = React.useCallback(() => {
        startLoading();

        const config = {
            ...settings,
            administratorGroups: settings.administratorGroups.split(",").map(id => id.trim()),
        };

        compositionRoot.config.update.execute(config).run(
            () => {
                snackbar.success(i18n.t("Settings saved. Reloading page..."));
                stopLoading();
                setTimeout(() => window.location.reload(), 1000);
            },
            err => {
                snackbar.error(err.message);
                stopLoading();
            }
        );
    }, [compositionRoot, settings, snackbar, startLoading, stopLoading]);

    const close = React.useCallback(() => {
        onClose();
        setSettings({
            ...config,
            administratorGroups: config.administratorGroups.join(", "),
        });
    }, [config, onClose]);

    return (
        <Dialog open={open} onClose={close} fullWidth>
            <DialogTitle>{i18n.t("Settings")}</DialogTitle>
            <DialogContent dividers>
                <Box
                    display="flex"
                    flexDirection="column"
                    padding={theme.spacing(0.125)}
                    marginBottom={theme.spacing(0.125)}
                    gridRowGap={theme.spacing(1)}
                >
                    <Tooltip
                        title={i18n.t(
                            "The sheet name of the zip file that will be created when more than one dataset is selected"
                        )}
                        enterDelay={500}
                    >
                        <TextField
                            label={i18n.t("Sheet name")}
                            name="sheetName"
                            margin="dense"
                            variant="standard"
                            value={settings.sheetName}
                            onChange={handleChange}
                            fullWidth
                        />
                    </Tooltip>
                    <Tooltip
                        title={i18n.t(
                            "The filename of the zip file that will be created when more than one dataset is selected"
                        )}
                        enterDelay={500}
                    >
                        <TextField
                            label={i18n.t("Filename")}
                            name="fileName"
                            margin="dense"
                            variant="standard"
                            value={settings.fileName}
                            onChange={handleChange}
                            fullWidth
                        />
                    </Tooltip>
                    <Tooltip title={i18n.t("User Group IDs separated by commas")} enterDelay={500}>
                        <TextField
                            label={i18n.t("Administrator Groups")}
                            name="administratorGroups"
                            margin="dense"
                            variant="standard"
                            value={settings.administratorGroups}
                            onChange={handleChange}
                            fullWidth
                        />
                    </Tooltip>
                    <Tooltip
                        title={i18n.t(
                            "The placeholder label that will be added next to '{{healthFacility}}: '",
                            { healthFacility: i18n.t("Health Facility"), nsSeparator: false }
                        )}
                        enterDelay={500}
                    >
                        <TextField
                            label={i18n.t("OU label")}
                            name="ouLabel"
                            margin="dense"
                            variant="standard"
                            value={settings.ouLabel}
                            onChange={handleChange}
                            fullWidth
                        />
                    </Tooltip>
                    <Tooltip
                        title={i18n.t(
                            "The placeholder label that will be added next to '{{reportingPeriod}}: '",
                            { reportingPeriod: i18n.t("Reporting Period"), nsSeparator: false }
                        )}
                        enterDelay={500}
                    >
                        <TextField
                            label={i18n.t("Period label")}
                            name="periodLabel"
                            margin="dense"
                            variant="standard"
                            value={settings.periodLabel}
                            onChange={handleChange}
                            fullWidth
                        />
                    </Tooltip>
                    <Tooltip
                        title={i18n.t(
                            "The placeholder message that will be shown to users at the top of the app. You can use this field to provide instructions or other information. To hide this message, leave this field empty."
                        )}
                        enterDelay={500}
                    >
                        <TextField
                            label={i18n.t("Message placeholder")}
                            name="infoPlaceholder"
                            margin="dense"
                            variant="standard"
                            value={settings.infoPlaceholder}
                            onChange={handleChange}
                            minRows={4}
                            fullWidth
                            multiline
                        />
                    </Tooltip>
                </Box>
            </DialogContent>
            <LinearProgress hidden={!loading} />
            <DialogActions>
                <Button onClick={close} color="default">
                    {i18n.t("Cancel")}
                </Button>
                <Button onClick={handleSave} color="primary">
                    {i18n.t("Save")}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

type Settings = {
    sheetName: string;
    fileName: string;
    administratorGroups: string;
    ouLabel: string;
    periodLabel: string;
    infoPlaceholder: Maybe<string>;
};
