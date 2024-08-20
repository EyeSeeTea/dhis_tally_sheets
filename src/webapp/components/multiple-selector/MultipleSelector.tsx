import React from "react";
import {
    createStyles,
    FormControl,
    InputLabel,
    makeStyles,
    MenuItem,
    Select,
    Theme,
    useTheme,
} from "@material-ui/core";
import { MultipleDropdownProps } from "@eyeseetea/d2-ui-components";

export interface MultipleSelectorProps extends MultipleDropdownProps {
    /* Select doesn't support variant="outlined" https://github.com/mui/material-ui/issues/14203 */
    name: string;
}

export const MultipleSelector: React.FC<MultipleSelectorProps> = React.memo(props => {
    const { items, values, onChange, label, className, name } = props;

    const theme = useTheme();
    const classes = useStyles();

    const notifyChange = React.useCallback(
        (event: React.ChangeEvent<{ value: unknown }>) => onChange(event.target.value as string[]),
        [onChange]
    );

    const mergedClasses = [className, classes.formControl].join(" ");

    return (
        <FormControl variant="outlined" className={mergedClasses} fullWidth margin="dense">
            <InputLabel htmlFor={name}>{label}</InputLabel>
            <Select
                id={name}
                label={label}
                name={name}
                multiple
                value={values}
                onChange={notifyChange}
                MenuProps={MenuProps}
            >
                {items.map(item => (
                    <MenuItem
                        key={item.value}
                        value={item.value}
                        style={getStyles(name, values, theme)}
                    >
                        {item.text}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
});

function getStyles(name: string, values: string[], theme: Theme) {
    return {
        fontWeight:
            values.indexOf(name) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        formControl: {
            minWidth: theme.spacing(32),
        },
    })
);

const ITEM_HEIGHT = 36; // line-height: 1.5 + padding: 6 * 2
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 12 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
    /* [Select] Moves when re-rendering or selecting multiple items https://github.com/mui/material-ui/issues/19245 */
    getContentAnchorEl: null,
    anchorOrigin: { vertical: "bottom", horizontal: "left" },
} as const;
