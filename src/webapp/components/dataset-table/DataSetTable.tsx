import React from "react";
import { Box, Paper, Typography, useTheme } from "@material-ui/core";
import { DataSet, Section as SectionType } from "$/domain/entities/DataSet";
import { Id } from "$/domain/entities/Ref";
import i18n from "$/utils/i18n";
import { useAppContext } from "$/webapp/contexts/app-context";
import { Section } from "$/webapp/components/dataset-table/Section";
import { useStyles } from "$/webapp/components/dataset-table/styles";

interface DataSetTableProps {
    dataSet: DataSet;
    includeHeaders: boolean;
    onRemoveSection: (sectionId: Id) => void;
}

export const DataSetTable: React.FC<DataSetTableProps> = React.memo(props => {
    const { includeHeaders, dataSet, onRemoveSection } = props;
    const { config } = useAppContext();

    const theme = useTheme();
    const classes = useStyles();

    const { sections } = React.useMemo(() => dataSet.toTable(), [dataSet]);

    const deleteSection = React.useCallback(
        (section: SectionType) => {
            onRemoveSection(section.id);
        },
        [onRemoveSection]
    );

    return (
        <Paper variant="outlined" className="dataset-container">
            <Box padding={theme.spacing(0.5)}>
                {includeHeaders && (
                    <Box
                        className="dataset-headers"
                        display="flex"
                        flexDirection="column"
                        gridRowGap={theme.spacing(2)}
                        marginBottom={theme.spacing(0.25)}
                    >
                        <Typography className={classes.headers} variant="h6">
                            {i18n.t("Health facility")}: {config.ouLabel}
                        </Typography>
                        <Typography className={classes.headers} variant="h6">
                            {i18n.t("Reporting period")}: {config.periodLabel}
                        </Typography>
                    </Box>
                )}
                <Box>
                    <Typography className={[classes.headers, classes.title].join(" ")} variant="h4">
                        {dataSet.displayName}
                    </Typography>
                    {sections.map(({ section, tables }) => (
                        <Section
                            key={section.id}
                            section={section}
                            tables={tables}
                            onDelete={deleteSection}
                        />
                    ))}
                </Box>
            </Box>
        </Paper>
    );
});
