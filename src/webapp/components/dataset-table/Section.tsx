import React from "react";
import { Box, Button, Typography, useTheme } from "@material-ui/core";
import { Clear as ClearIcon } from "@material-ui/icons";
import { Section as SectionType } from "$/domain/entities/DataSet";
import { SectionTable } from "$/domain/entities/SectionTable";
import { SectionTables } from "$/webapp/components/dataset-table/SectionTables";
import { useStyles } from "$/webapp/components/dataset-table/styles";

interface SectionProps {
    section: SectionType;
    tables: ReadonlyArray<SectionTable>;
    onDelete: (section: SectionType) => void;
}

export const Section: React.FC<SectionProps> = React.memo(props => {
    const { section, tables, onDelete } = props;

    const theme = useTheme();
    const classes = useStyles();

    const deleteSection = React.useCallback(() => onDelete(section), [onDelete, section]);

    return (
        <Box marginTop={theme.spacing(0.25)}>
            <Typography className={classes.subtitle} variant="h6">
                <Button
                    className={classes.deleteButton}
                    aria-label="delete"
                    size="small"
                    variant="outlined"
                    onClick={deleteSection}
                >
                    <ClearIcon fontSize="small" />
                </Button>
                {section.displayName}
                <Box
                    border={"1px solid #ddd"}
                    borderRadius={theme.shape.borderRadius}
                    marginTop={theme.spacing(0.25)}
                >
                    <SectionTables tables={tables} />
                </Box>
            </Typography>
        </Box>
    );
});
