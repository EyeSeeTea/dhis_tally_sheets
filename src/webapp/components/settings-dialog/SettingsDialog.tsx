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
    Backdrop,
    makeStyles,
    createStyles,
    Theme,
    Select,
    MenuItem,
    Divider,
    InputAdornment,
    Input,
    ListItemIcon,
} from "@material-ui/core";
import { DropdownItem, useSnackbar } from "@eyeseetea/d2-ui-components";
import { useSettingsDialog } from "$/webapp/components/settings-dialog/useSettingsDialog";
import { Maybe } from "$/utils/ts-utils";
import { useAppContext } from "$/webapp/contexts/app-context";
import { useLocaleSelector } from "$/webapp/components/settings-dialog/useLocaleSelector";
import {
    CheckCircleOutline as CheckCircleIcon,
    Search as SearchIcon,
    Translate as TranslateIcon,
} from "@material-ui/icons";
import i18n from "$/utils/i18n";
import _ from "$/domain/entities/generic/Collection";

export interface SettingsDialogProps {
    open: boolean;
    onClose: () => void;
}

export const SettingsDialog: React.FC<SettingsDialogProps> = ({ open, onClose }) => {
    const { currentUser } = useAppContext();

    const theme = useTheme();
    const styles = useStyles();

    const localeSelectorProps = useLocaleSelector(currentUser.preferredLocale);

    const { loading, reloading, fields, handleSave, close, placeholderProps, placeholderChanged } =
        useSettingsDialog({
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

                        <Box display="flex" flexDirection="column">
                            {placeholderProps && <TooltipTextField {...placeholderProps} />}
                            <LanguageSelector
                                {...localeSelectorProps}
                                hasChanges={placeholderChanged}
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

export interface TooltipTextFieldProps {
    title: string;
    label: string;
    name: string;
    value: Maybe<string>;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    minRows?: number;
    multiline?: boolean;
}

const TooltipTextField: React.FC<TooltipTextFieldProps> = React.memo(props => {
    const { title, label, name, value, onChange, minRows, multiline } = props;

    return (
        <Tooltip title={title} enterDelay={500}>
            <TextField
                label={label}
                name={name}
                margin="dense"
                variant="standard"
                value={value}
                onChange={onChange}
                fullWidth
                minRows={minRows}
                multiline={multiline}
            />
        </Tooltip>
    );
});

interface SelectorProps {
    name: string;
    items: DropdownItem[];
    label: string;
    value: string;
    disabled: boolean;
    hasChanges: boolean;
    onChange: (values: string) => void;
}

const LanguageSelector: React.FC<SelectorProps> = React.memo(props => {
    const { items, value, onChange, label, name, disabled, hasChanges } = props;
    const { config } = useAppContext();

    const theme = useTheme();
    const classes = useStyles();
    const snackbar = useSnackbar();

    const [filterText, setFilterText] = React.useState("");
    const localesUsed = Object.keys(config.infoPlaceholder);

    const notifyChange = React.useCallback(
        (event: React.ChangeEvent<{ value: unknown }>) => {
            if (hasChanges)
                snackbar.info(
                    "You have made changes. Please save or discard them before changing the language."
                );
            else onChange(event.target.value as string);
        },
        [hasChanges, onChange, snackbar]
    );

    const filter = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setFilterText(event.target.value);
    }, []);

    return (
        <Box alignSelf="flex-end">
            <Select
                id={name}
                label={label}
                name={name}
                value={value}
                onChange={notifyChange}
                MenuProps={MenuProps}
                input={<Input disableUnderline color="secondary" />}
                autoFocus={false}
                endAdornment={<TranslateIcon className={classes.icon} />}
                classes={{
                    icon: classes.dropdownArrow,
                    select: classes.select,
                }}
                disabled={disabled}
            >
                <Box padding={theme.spacing(0, 3.5, 0, 2)}>
                    <TextField
                        id="standard-basic"
                        label="Search"
                        margin="dense"
                        variant="outlined"
                        size="small"
                        onChange={filter}
                        value={filterText}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <SearchIcon color="disabled" />
                                </InputAdornment>
                            ),
                        }}
                        onKeyDown={e => {
                            // Prevents autoselecting item while typing (default Select behaviour)
                            if (e.key !== "Escape") e.stopPropagation();
                        }}
                        onClick={e => e.stopPropagation()}
                        autoFocus
                        fullWidth
                    />
                </Box>
                <Box margin="0.75rem 0">
                    <Divider />
                </Box>
                {items
                    .filter(item => item.text.toLowerCase().includes(filterText.toLowerCase()))
                    .map(item => (
                        <MenuItem key={item.value} value={item.value}>
                            <Box
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                                gridColumnGap={theme.spacing(1)}
                                width="100%"
                            >
                                {item.text}
                                {localesUsed.includes(item.value) && (
                                    <ListItemIcon>
                                        <CheckCircleIcon fontSize="small" />
                                    </ListItemIcon>
                                )}
                            </Box>
                        </MenuItem>
                    ))}
            </Select>
        </Box>
    );
});

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        backdrop: {
            zIndex: theme.zIndex.modal,
        },
        languageLabel: {
            fontSize: "0.75rem",
            color: theme.palette.text.secondary,
        },
        select: {
            fontSize: "0.75rem",
            color: theme.palette.text.secondary,
            display: "flex",
            alignItems: "center",
            "&&": {
                // Needs double specifying to override MUI styles
                padding: 0,
                lineHeight: 1,
            },
            "& .MuiListItemIcon-root": {
                display: "none",
            },
        },
        dropdownArrow: {
            display: "none",
        },
        icon: {
            height: "1rem",
            color: theme.palette.text.secondary,
        },
    })
);

const ITEM_HEIGHT = 36; // line-height: 1.5 + padding: 6 * 2

const ITEM_PADDING_TOP = 8;

const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 7 + ITEM_PADDING_TOP,
            maxWidth: 600,
        },
    },
    /* [Select] Moves when re-rendering or selecting multiple items https://github.com/mui/material-ui/issues/19245 */
    getContentAnchorEl: null,
    anchorOrigin: { vertical: "top", horizontal: "left" },
    autoFocus: false,
} as const;
