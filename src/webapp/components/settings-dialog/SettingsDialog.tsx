import React from "react";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    Box,
    useTheme,
    LinearProgress,
    Backdrop,
    makeStyles,
    createStyles,
    Theme,
} from "@material-ui/core";
import { useSettingsDialog } from "$/webapp/components/settings-dialog/useSettingsDialog";
import { useLocaleSelector } from "$/webapp/components/settings-dialog/useLocaleSelector";
import { LanguageSelector } from "$/webapp/components/settings-dialog/LanguageSelector";
import { TooltipTextField } from "$/webapp/components/settings-dialog/TooltipTextField";
import { TooltipSwitch } from "$/webapp/components/settings-dialog/TooltipSwitch";
import i18n from "$/utils/i18n";
import _ from "$/domain/entities/generic/Collection";

export interface SettingsDialogProps {
    open: boolean;
    onClose: () => void;
}

export const SettingsDialog: React.FC<SettingsDialogProps> = ({ open, onClose }) => {
    const theme = useTheme();
    const styles = useStyles();
    const localeSelectorProps = useLocaleSelector();

    const {
        loading,
        reloading,
        fields,
        handleSave,
        close,
        highlightSubSectionsProps,
        messageProps,
        messageChanged,
    } = useSettingsDialog({
        open,
        onClose,
        localeCode: localeSelectorProps.value,
    });

    return (
        <>
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
                        {fields.map((fieldProps, idx) => (
                            <TooltipTextField key={idx} {...fieldProps} />
                        ))}

                        <TooltipSwitch {...highlightSubSectionsProps} />

                        <Box display="flex" flexDirection="column">
                            {messageProps && <TooltipTextField {...messageProps} />}
                            <LanguageSelector
                                {...localeSelectorProps}
                                hasChanges={messageChanged}
                            />
                        </Box>
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
            <Backdrop open={reloading} className={styles.backdrop} />
        </>
    );
};

// TODO: replace makeStyles with styled-components
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        backdrop: {
            zIndex: theme.zIndex.modal,
        },
    })
);
