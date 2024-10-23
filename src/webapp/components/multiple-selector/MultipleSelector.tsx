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
    useTheme,
} from "@material-ui/core";
import { MultipleDropdownProps } from "@eyeseetea/d2-ui-components";
import { DisableableTooltip } from "$/webapp/components/disableable-tooltip/DisableableTooltip";
import { useMultipleSelector } from "$/webapp/components/multiple-selector/useMultipleSelector";
import { SearchField } from "$/webapp/components/multiple-selector/SearchField";
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
        label,
        className,
        name,
        allOption,
        customMenu,
        disabled = false,
        isSearchable = false,
    } = props;

    const classes = useStyles();
    const theme = useTheme();

    const {
        menuIsOpen,
        tooltipIsOpen,
        openMenu,
        closeMenu,
        openTooltip,
        closeTooltip,
        filterText,
        filter,
        virtualValues,
        notifyChange,
        isAllSelected,
        helperText,
        filteredItems,
    } = useMultipleSelector(props);

    const mergedClasses = [className, classes.formControl].join(" ");

    const MenuProps = React.useMemo(
        () => getMenuProps(isSearchable, 2, isSearchable),
        [isSearchable]
    );

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
                    {/* Note: Material UI does not like React.Fragment as children inside the Menu component,
                     * so the code separates the fragments under the same condition to avoid Material UI complaining. */}
                    {isSearchable && (
                        <Box padding={theme.spacing(0, 3.5, 0, 2)}>
                            <SearchField text={filterText} filter={filter} />
                        </Box>
                    )}

                    {isSearchable && (
                        <Box margin="0.75rem 0">
                            <Divider />
                        </Box>
                    )}

                    <MenuItem className={classes.hide} value="multiple-selector-void" disabled>
                        {i18n.t("Nothing selected")}
                    </MenuItem>

                    {allOption && <MenuItem value={allOption.value}>{allOption.text}</MenuItem>}

                    {allOption && (
                        <Box margin="0.75rem 0">
                            <Divider />
                        </Box>
                    )}

                    {filteredItems.map(item => (
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

function getMenuProps(autoFocus: boolean, dividers = 0, isSearchable = false) {
    return {
        PaperProps: {
            style: {
                maxHeight:
                    ITEM_HEIGHT * 10 +
                    ITEM_PADDING_TOP +
                    dividers * DIVIDER +
                    (isSearchable ? SEARCH_FIELD : 0) +
                    IMAGINARY_PADDING_BOTTOM,
                maxWidth: 600,
            },
        },
        /* [Select] Moves when re-rendering or selecting multiple items https://github.com/mui/material-ui/issues/19245 */
        getContentAnchorEl: null,
        anchorOrigin: { vertical: "bottom", horizontal: "left" },
        autoFocus: autoFocus,
    } as const;
}

const ITEM_HEIGHT = 36; // line-height: 1.5 + padding: 6 * 2
const ITEM_PADDING_TOP = 8;
const DIVIDER = 12 + 1 + 12;
const SEARCH_FIELD = 52;
const IMAGINARY_PADDING_BOTTOM = 8;
