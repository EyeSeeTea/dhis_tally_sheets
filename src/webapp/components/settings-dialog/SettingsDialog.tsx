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
import { Config } from "$/domain/entities/Config";
import { useBooleanState } from "$/webapp/utils/use-boolean";
import { useSnackbar } from "@eyeseetea/d2-ui-components/snackbar";
import i18n from "$/utils/i18n";

interface SettingsDialogProps {
    open: boolean;
    onClose: () => void;
}

export const SettingsDialog: React.FC<SettingsDialogProps> = ({ open, onClose }) => {
    const { config, compositionRoot } = useAppContext();

    const theme = useTheme();
    const snackbar = useSnackbar();

    const [loading, { enable: startLoading, disable: stopLoading }] = useBooleanState(false);
    const [settings, setSettings] = React.useState<Config>(config);

    const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSettings(prevSettings => ({
            ...prevSettings,
            [name]: name === "administratorGroups" ? value.split(",").map(v => v.trim()) : value,
        }));
    }, []);

    const handleSave = React.useCallback(() => {
        startLoading();
        compositionRoot.config.update.execute(settings).run(
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
        setSettings(config);
        onClose();
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
                    <TextField
                        label={i18n.t("Sheet name")}
                        name="sheetName"
                        margin="dense"
                        variant="standard"
                        value={settings.sheetName}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        label={i18n.t("Filename")}
                        name="fileName"
                        margin="dense"
                        variant="standard"
                        value={settings.fileName}
                        onChange={handleChange}
                        fullWidth
                    />
                    <Tooltip title="User Group IDs separated by commas">
                        <TextField
                            label={i18n.t("Administrator Groups")}
                            name="administratorGroups"
                            margin="dense"
                            variant="standard"
                            value={settings.administratorGroups.join(", ")}
                            onChange={handleChange}
                            fullWidth
                        />
                    </Tooltip>
                    <TextField
                        label={i18n.t("OU label")}
                        name="ouLabel"
                        margin="dense"
                        variant="standard"
                        value={settings.ouLabel}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        label={i18n.t("Period label")}
                        name="periodLabel"
                        margin="dense"
                        variant="standard"
                        value={settings.periodLabel}
                        onChange={handleChange}
                        fullWidth
                    />
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
