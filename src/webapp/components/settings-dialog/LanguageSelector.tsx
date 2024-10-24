import React from "react";
import {
    Box,
    useTheme,
    makeStyles,
    createStyles,
    Theme,
    Select,
    MenuItem,
    Divider,
    Input,
    ListItemIcon,
} from "@material-ui/core";
import {
    CheckCircleOutline as CheckCircleIcon,
    Translate as TranslateIcon,
} from "@material-ui/icons";
import { DropdownItem, useSnackbar } from "@eyeseetea/d2-ui-components";
import { useAppContext } from "$/webapp/contexts/app-context";
import { SearchField } from "$/webapp/components/multiple-selector/SearchField";
import i18n from "$/utils/i18n";
import _ from "$/domain/entities/generic/Collection";

interface SelectorProps {
    name: string;
    items: DropdownItem[];
    label: string;
    value: string;
    disabled: boolean;
    hasChanges: boolean;
    onChange: (values: string) => void;
}

export const LanguageSelector: React.FC<SelectorProps> = React.memo(props => {
    const { items, value, onChange, label, name, disabled, hasChanges } = props;
    const { config } = useAppContext();

    const theme = useTheme();
    const classes = useStyles();
    const snackbar = useSnackbar();

    const [filterText, setFilterText] = React.useState("");
    const localesUsed = Object.keys(config.messageInfo);

    const notifyChange = React.useCallback(
        (event: React.ChangeEvent<{ value: unknown }>) => {
            if (hasChanges)
                snackbar.info(
                    i18n.t(
                        "You have made changes. Please save or discard them before changing the language."
                    )
                );
            else onChange(event.target.value as string);
        },
        [hasChanges, onChange, snackbar]
    );

    const filter = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setFilterText(event.target.value);
    }, []);

    const selectClasses = React.useMemo(
        () => ({
            select: classes.select,
            icon: classes.icon,
        }),
        [classes]
    );

    const filteredItems = React.useMemo(
        () => items.filter(item => item.text.toLowerCase().includes(filterText.toLowerCase())),
        [items, filterText]
    );

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
                classes={selectClasses}
                disabled={disabled}
            >
                <Box padding={theme.spacing(0, 3.5, 0, 2)}>
                    <SearchField text={filterText} filter={filter} />
                </Box>

                <Box margin="0.75rem 0">
                    <Divider />
                </Box>

                {filteredItems.map(item => (
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
const DIVIDER = 12 + 1 + 12;
const SEARCH_FIELD = 52;
const IMAGINARY_PADDING_BOTTOM = 8;

const MenuProps = {
    PaperProps: {
        style: {
            maxHeight:
                ITEM_HEIGHT * 5 +
                ITEM_PADDING_TOP +
                DIVIDER +
                SEARCH_FIELD +
                IMAGINARY_PADDING_BOTTOM,
            maxWidth: 600,
        },
    },
    /* [Select] Moves when re-rendering or selecting multiple items https://github.com/mui/material-ui/issues/19245 */
    getContentAnchorEl: null,
    anchorOrigin: { vertical: "top", horizontal: "left" },
    autoFocus: false,
} as const;
