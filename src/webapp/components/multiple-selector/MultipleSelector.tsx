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
import i18n from "$/utils/i18n";
import _c from "$/domain/entities/generic/Collection";

export interface MultipleSelectorProps extends MultipleDropdownProps {
    /* Select doesn't support variant="outlined" https://github.com/mui/material-ui/issues/14203 */
    name: string;
    disabled?: boolean;
    allOption?: {
        value: string;
        text: string;
    };
}

export const MultipleSelector: React.FC<MultipleSelectorProps> = React.memo(props => {
    const { items, values, onChange, label, className, name, disabled, allOption } = props;

    const classes = useStyles();

    const mergedClasses = [className, classes.formControl].join(" ");

    const isAllSelected = React.useMemo(
        () => (allOption ? values.includes(allOption.value) : false),
        [allOption, values]
    );

    const selected = React.useMemo(() => {
        if (isAllSelected && allOption) return [allOption.value];
        else return _c(values).isEmpty() ? ["multiple-selector-void"] : values;
    }, [allOption, isAllSelected, values]);

    const notifyChange = React.useCallback(
        (event: React.ChangeEvent<{ value: unknown }>) => {
            onChange((event.target.value as string[]).filter(s => s !== "multiple-selector-void"));
        },
        [onChange]
    );

    return (
        <FormControl
            variant="outlined"
            className={mergedClasses}
            fullWidth
            margin="dense"
            disabled={disabled}
        >
            <InputLabel htmlFor={name}>{label}</InputLabel>
            <Select
                id={name}
                label={label}
                name={name}
                multiple
                value={selected}
                onChange={notifyChange}
                MenuProps={MenuProps}
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
                {items.map(item => (
                    <MenuItem key={item.value} value={item.value} disabled={isAllSelected}>
                        {item.text}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
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
