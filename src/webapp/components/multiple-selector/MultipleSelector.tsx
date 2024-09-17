import React from "react";
import {
    Box,
    createStyles,
    Divider,
    FormControl,
    InputLabel,
    makeStyles,
    MenuItem,
    Select,
    Theme,
} from "@material-ui/core";
import { MultipleDropdownProps } from "@eyeseetea/d2-ui-components";
import i18n from "$/utils/i18n";
import _c from "$/domain/entities/generic/Collection";
import { useBooleanState } from "$/webapp/utils/use-boolean";
import { DisableableTooltip } from "$/webapp/components/disableable-tooltip/DisableableTooltip";

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
    } = props;

    const classes = useStyles();

    const [menuIsOpen, { enable: openMenu, disable: closeMenu }] = useBooleanState(false);
    const [tooltipIsOpen, { enable: openTooltip, disable: closeTooltip }] = useBooleanState(false);
    const mergedClasses = [className, classes.formControl].join(" ");

    const notifyChange = React.useCallback(
        (event: React.ChangeEvent<{ value: unknown }>) => {
            onChange((event.target.value as string[]).filter(s => s !== "multiple-selector-void"));
        },
        [onChange]
    );

    const isAllSelected = React.useMemo(
        () => (allOption ? values.includes(allOption.value) : false),
        [allOption, values]
    );

    const selected = React.useMemo(() => {
        if (isAllSelected && allOption) return [allOption.value];
        else return _c(values).isEmpty() ? ["multiple-selector-void"] : values;
    }, [allOption, isAllSelected, values]);

    const helperText = React.useMemo(() => {
        if (allOption && isAllSelected)
            return `${items.length} ${items.length > 1 ? pluralType : type} ` + i18n.t("selected");
        const selectedCount = selected.filter(v => v !== "multiple-selector-void").length;
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
                <InputLabel htmlFor={name}>{label}</InputLabel>
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
                    multiple
                >
                    <MenuItem value="multiple-selector-void" disabled>
                        {i18n.t("Nothing selected")}
                    </MenuItem>
                    {/* Material UI does not like React.Fragment as children inside the Menu component */}
                    {allOption && <MenuItem value={allOption.value}>{allOption.text}</MenuItem>}
                    {allOption && (
                        <Box margin="0.5rem 0.75rem">
                            <Divider />
                        </Box>
                    )}
                    {renderItems.map(item => (
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
        },
    })
);

const ITEM_HEIGHT = 36; // line-height: 1.5 + padding: 6 * 2

const ITEM_PADDING_TOP = 8;

const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 12 + ITEM_PADDING_TOP,
            maxWidth: 600,
        },
    },
    /* [Select] Moves when re-rendering or selecting multiple items https://github.com/mui/material-ui/issues/19245 */
    getContentAnchorEl: null,
    anchorOrigin: { vertical: "bottom", horizontal: "left" },
} as const;
