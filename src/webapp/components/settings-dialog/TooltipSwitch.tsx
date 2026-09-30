import React from "react";
import { FormControlLabel, Switch, Tooltip } from "@material-ui/core";

export interface TooltipSwitchProps {
    title: string;
    label: string;
    name: string;
    checked: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const TooltipSwitch: React.FC<TooltipSwitchProps> = React.memo(props => {
    const { title, label, name, checked, onChange } = props;

    return (
        <Tooltip title={title} enterDelay={500}>
            <FormControlLabel
                control={
                    <Switch name={name} checked={checked} onChange={onChange} color="primary" />
                }
                label={label}
            />
        </Tooltip>
    );
});
