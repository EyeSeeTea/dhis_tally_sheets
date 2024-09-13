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
} from "@material-ui/core";
import { useAppContext } from "$/webapp/contexts/app-context";
import { Config } from "$/domain/entities/Config";
import { useBooleanState } from "$/webapp/utils/use-boolean";
import i18n from "$/utils/i18n";

interface SettingsDialogProps {
    open: boolean;
    onClose: () => void;
}

export const SettingsDialog: React.FC<SettingsDialogProps> = ({ open, onClose }) => {
    const { config } = useAppContext();

    const theme = useTheme();

    const [loading, { enable: _startLoading, disable: _stopLoading }] = useBooleanState(false);
    const [settings, setSettings] = React.useState<Config>(config);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSettings(prevSettings => ({ ...prevSettings, [name]: value }));
    };

    const handleSave = () => {
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth>
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
                        value={settings.sheetName || ""}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        label={i18n.t("Filename")}
                        name="fileName"
                        margin="dense"
                        variant="standard"
                        value={settings.fileName || ""}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        label={i18n.t("OU label")}
                        name="ouLabel"
                        margin="dense"
                        variant="standard"
                        value={settings.ouLabel || ""}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        label={i18n.t("Period label")}
                        name="periodLabel"
                        margin="dense"
                        variant="standard"
                        value={settings.periodLabel || ""}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        label={i18n.t("Message placeholder")}
                        name="infoPlaceholder"
                        margin="dense"
                        variant="standard"
                        value={settings.infoPlaceholder || ""}
                        onChange={handleChange}
                        minRows={4}
                        fullWidth
                        multiline
                    />
                </Box>
            </DialogContent>
            <LinearProgress hidden={!loading} />
            <DialogActions>
                <Button onClick={onClose} color="default">
                    Cancel
                </Button>
                <Button onClick={handleSave} color="primary">
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};
