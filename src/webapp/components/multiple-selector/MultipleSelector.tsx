import React from "react";
import {
    Box,
    createStyles,
    Divider,
    FormControl,
    InputAdornment,
    InputLabel,
    makeStyles,
    MenuItem,
    Select,
    TextField,
    Theme,
    useTheme,
} from "@material-ui/core";
import { MultipleDropdownProps } from "@eyeseetea/d2-ui-components";
import { Search as SearchIcon } from "@material-ui/icons";
import { useBooleanState } from "$/webapp/utils/use-boolean";
import { DisableableTooltip } from "$/webapp/components/disableable-tooltip/DisableableTooltip";
import i18n from "$/utils/i18n";
import _ from "$/domain/entities/generic/Collection";

export interface MultipleSelectorProps extends MultipleDropdownProps {
    name: string;
    type?: string;
    pluralType?: string;
    disabled?: boolean;
    allOption?: {
        value: string;
        text: string;
    };
    customMenu?: {
        onOpen: () => void;
    };
    isSearchable?: boolean;
}

export const MultipleSelector: React.FC<MultipleSelectorProps> = React.memo(props => {
    const {
        items,
        values,
        onChange,
        label,
        className,
        name,
        allOption,
        customMenu,
        disabled = false,
        type = "item",
        pluralType = "items",
        isSearchable = false,
    } = props;

    const classes = useStyles();
    const theme = useTheme();

    const [menuIsOpen, { enable: openMenu, disable: closeMenu }] = useBooleanState(false);
    const [tooltipIsOpen, { enable: openTooltip, disable: closeTooltip }] = useBooleanState(false);
    const [filterText, setFilterText] = React.useState("");
    const mergedClasses = [className, classes.formControl].join(" ");

    const notifyChange = React.useCallback(
        (event: React.ChangeEvent<{ value: unknown }>) => {
            onChange(
                (event.target.value as string[]).filter(
                    s => s !== "multiple-selector-void" && s !== undefined && s !== null
                )
            );
        },
        [onChange]
    );

    const filter = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setFilterText(event.target.value);
    }, []);

    const isAllSelected = React.useMemo(
        () => (allOption ? values.includes(allOption.value) : false),
        [allOption, values]
    );

    const selected = React.useMemo(() => {
        if (isAllSelected && allOption) return [allOption.value];
        else return _(values).isEmpty() ? ["multiple-selector-void"] : values;
    }, [allOption, isAllSelected, values]);

    const helperText = React.useMemo(() => {
        if (allOption && isAllSelected)
            return `${items.length} ${items.length > 1 ? pluralType : type} ` + i18n.t("selected");
        const selectedCount = selected.filter(
            v => v !== "multiple-selector-void" && v !== undefined
        ).length;
        return selectedCount
            ? `${selectedCount} ${selectedCount > 1 ? pluralType : type} ` + i18n.t("selected")
            : undefined;
    }, [allOption, isAllSelected, items.length, pluralType, selected, type]);

    const virtualValues = React.useMemo(
        () => (customMenu?.onOpen && selected.length > 500 ? selected.slice(0, 10) : selected),
        [customMenu?.onOpen, selected]
    );

    const renderItems = React.useMemo(() => {
        return customMenu?.onOpen && items.length > 500 ? items.slice(0, 10) : items;
    }, [customMenu?.onOpen, items]);

    const MenuProps = React.useMemo(() => getMenuProps(isSearchable), [isSearchable]);

    return (
        <DisableableTooltip
            disabled={disabled}
            title={helperText ?? ""}
            open={!menuIsOpen && tooltipIsOpen}
            onOpen={openTooltip}
            onClose={closeTooltip}
        >
            <FormControl
                margin="dense"
                variant="outlined"
                className={mergedClasses}
                disabled={disabled}
                fullWidth
            >
                <InputLabel htmlFor={name} className={classes.label}>
                    {label}
                </InputLabel>
                <Select
                    id={name}
                    label={label}
                    name={name}
                    value={virtualValues}
                    open={customMenu?.onOpen ? false : menuIsOpen}
                    onOpen={customMenu?.onOpen ?? openMenu}
                    onClose={closeMenu}
                    onChange={notifyChange}
                    MenuProps={MenuProps}
                    autoFocus={!isSearchable}
                    multiple
                >
                    {isSearchable && (
                        <>
                            <Box padding={theme.spacing(1, 3.5, 0, 2)}>
                                <TextField
                                    id="standard-basic"
                                    label="Search"
                                    margin="dense"
                                    variant="outlined"
                                    size="small"
                                    onChange={filter}
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
                            <Box margin="1rem 0">
                                <Divider />
                            </Box>
                        </>
                    )}
                    <MenuItem className={classes.hide} value="multiple-selector-void" disabled>
                        {i18n.t("Nothing selected")}
                    </MenuItem>
                    {/* Material UI does not like React.Fragment as children inside the Menu component */}
                    {allOption && <MenuItem value={allOption.value}>{allOption.text}</MenuItem>}
                    {allOption && (
                        <Box margin="1rem 0">
                            <Divider />
                        </Box>
                    )}
                    {renderItems
                        .filter(item => item.text.toLowerCase().includes(filterText.toLowerCase()))
                        .map(item => (
                            <MenuItem key={item.value} value={item.value} disabled={isAllSelected}>
                                {item.text}
                            </MenuItem>
                        ))}
                </Select>
            </FormControl>
        </DisableableTooltip>
    );
});

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        formControl: {
            minWidth: theme.spacing(42),
            maxWidth: theme.spacing(42),
            [theme.breakpoints.down(1600)]: {
                minWidth: theme.spacing(32),
                maxWidth: theme.spacing(32),
            },
            [theme.breakpoints.down(1200)]: {
                minWidth: theme.spacing(24),
                maxWidth: theme.spacing(24),
            },
            [theme.breakpoints.down(980)]: {
                minWidth: "100%",
                maxWidth: "100%",
            },
        },
        label: {
            maxHeight: "1em",
            textOverflow: "ellipsis",
            textWrap: "nowrap",
            maxWidth: "100%",
            whiteSpace: "nowrap",
            overflow: "hidden",
        },
        hide: {
            display: "none",
        },
    })
);

const ITEM_HEIGHT = 36; // line-height: 1.5 + padding: 6 * 2

const ITEM_PADDING_TOP = 8;

function getMenuProps(autoFocus: boolean) {
    return {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 16 + ITEM_PADDING_TOP,
                maxWidth: 600,
            },
        },
        /* [Select] Moves when re-rendering or selecting multiple items https://github.com/mui/material-ui/issues/19245 */
        getContentAnchorEl: null,
        anchorOrigin: { vertical: "bottom", horizontal: "left" },
        autoFocus: autoFocus,
    } as const;
}
