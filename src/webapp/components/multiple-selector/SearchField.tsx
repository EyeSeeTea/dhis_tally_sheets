import React from "react";
import { InputAdornment, TextField } from "@material-ui/core";
import { Search as SearchIcon } from "@material-ui/icons";

interface SearchFieldProps {
    text: string;
    filter: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const SearchField: React.FC<SearchFieldProps> = React.memo(({ filter, text }) => (
    <TextField
        id="standard-basic"
        label="Search"
        margin="dense"
        variant="outlined"
        size="small"
        onChange={filter}
        value={text}
        InputProps={InputProps}
        onKeyDown={preventAutoselect}
        onClick={stopPropagation}
        autoFocus
        fullWidth
    />
));

const InputProps = {
    endAdornment: (
        <InputAdornment position="end">
            <SearchIcon color="disabled" />
        </InputAdornment>
    ),
} as const;

// Prevents autoselecting item while typing (default Select behaviour)
function preventAutoselect(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key !== "Escape") e.stopPropagation();
}

function stopPropagation(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.stopPropagation();
}
