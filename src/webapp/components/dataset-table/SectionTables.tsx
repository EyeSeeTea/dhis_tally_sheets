import React from "react";
import { Box, useTheme } from "@material-ui/core";
import { SectionTable } from "$/domain/entities/SectionTable";
import { useAppContext } from "$/webapp/contexts/app-context";
import { DisplayTable } from "$/webapp/components/dataset-table/DisplayTable";

export const SectionTables: React.FC<{ tables: ReadonlyArray<SectionTable> }> = React.memo(
    props => {
        const { tables } = props;
        const { config } = useAppContext();

        const theme = useTheme();

        return (
            <Box display="flex" flexDirection="column" gridRowGap={theme.spacing(3)}>
                {tables.map((table, idx) => (
                    <DisplayTable
                        table={table}
                        highlightSubSections={config.highlightSubSections}
                        key={idx}
                    />
                ))}
            </Box>
        );
    }
);
