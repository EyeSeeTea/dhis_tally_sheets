import React from "react";
import { TextField, Tooltip } from "@material-ui/core";
import { Maybe } from "$/utils/ts-utils";

export interface TooltipTextFieldProps {
    title: string;
    label: string;
    name: string;
    value: Maybe<string>;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    minRows?: number;
    multiline?: boolean;
}

export const TooltipTextField: React.FC<TooltipTextFieldProps> = React.memo(props => {
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
