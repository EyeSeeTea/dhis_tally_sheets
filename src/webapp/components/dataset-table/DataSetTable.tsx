import React from "react";
import {
    Box,
    Button,
    createStyles,
    makeStyles,
    Theme,
    Typography,
    useTheme,
} from "@material-ui/core";
import { Clear as ClearIcon } from "@material-ui/icons";
import { DataSet, Section as SectionType } from "$/domain/entities/DataSet";
import { Id } from "$/domain/entities/Ref";
import i18n from "$/utils/i18n";
import { styled } from "styled-components";
import _c, { Collection } from "$/domain/entities/generic/Collection";

interface DataSetTableProps {
    dataSet: DataSet;
    includeHeaders: boolean;
    onRemoveSection: (sectionId: Id) => void;
}

export const DataSetTable: React.FC<DataSetTableProps> = React.memo(props => {
    const { includeHeaders, dataSet, onRemoveSection } = props;

    const theme = useTheme();
    const classes = useStyles();

    const deleteSection = React.useCallback(
        (section: SectionType) => {
            onRemoveSection(section.id);
        },
        [onRemoveSection]
    );

    return (
        <Box>
            {includeHeaders && (
                <Box
                    display="flex"
                    flexDirection="column"
                    gridRowGap={theme.spacing(2)}
                    marginBottom={theme.spacing(0.25)}
                >
                    {/* TO ADD HEADERS BY DATASET DIRECTLY */}
                    <Typography className={classes.headers} variant="h6">
                        {i18n.t("Health facility")}:
                    </Typography>
                    <Typography className={classes.headers} variant="h6">
                        {i18n.t("Reporting period")}:
                    </Typography>
                </Box>
            )}
            <Box>
                <Typography className={[classes.headers, classes.title].join(" ")} variant="h4">
                    {dataSet.displayFormName}
                </Typography>
                {dataSet.sections.map(section => (
                    <Section key={section.id} section={section} onDelete={deleteSection} />
                ))}
            </Box>
        </Box>
    );
});

interface SectionProps {
    section: SectionType;
    onDelete: (section: SectionType) => void;
}

const Section: React.FC<SectionProps> = React.memo(props => {
    const { section, onDelete } = props;

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
                    <SectionTable section={section} />
                </Box>
            </Typography>
        </Box>
    );
});

const SectionTable: React.FC<{ section: SectionType }> = React.memo(props => {
    const { section } = props;

    const table = React.useMemo(() => {
        return section.categoryCombos.map(categoryCombo => {
            return _c(
                categoryCombo.categories.map(c => c.categoryOptions.map(co => co.displayFormName))
            )
                .cartesian()
                .value();
        });
    }, []);

    React.useEffect(() => {
        console.log(table);
    }, [table]);

    return (
        <DisplayTable>
            {/* <thead></thead>
            <tbody></tbody> */}
        </DisplayTable>
    );
});

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        headers: {
            border: "1px solid black",
            padding: "0.0625rem 0.25rem",
            fontWeight: 400,
        },
        title: {
            fontSize: "1.75rem",
        },
        subtitle: {
            fontSize: "1.5rem",
            fontWeight: 400,
        },
        deleteButton: {
            maxWidth: "2rem",
            minWidth: "unset",
            marginRight: theme.spacing(2),
        },
    })
);

const DisplayTable = styled.table`
    font-size: 1rem;
    border-collapse: collapse;
    td,
    th {
        border: 1px solid #000;
    }
`;