import React from "react";
import {
    Box,
    Button,
    createStyles,
    makeStyles,
    Paper,
    Theme,
    Typography,
    useTheme,
} from "@material-ui/core";
import { Clear as ClearIcon } from "@material-ui/icons";
import { DataSet, Section as SectionType } from "$/domain/entities/DataSet";
import { Id } from "$/domain/entities/Ref";
import { SectionTable } from "$/domain/entities/SectionTable";
import i18n from "$/utils/i18n";
import { styled } from "styled-components";
import { useAppContext } from "$/webapp/contexts/app-context";

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

interface SectionProps {
    section: SectionType;
    tables: ReadonlyArray<SectionTable>;
    onDelete: (section: SectionType) => void;
}

const Section: React.FC<SectionProps> = React.memo(props => {
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

const SectionTables: React.FC<{ tables: ReadonlyArray<SectionTable> }> = React.memo(props => {
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
});

interface DisplayTableProps {
    table: SectionTable;
    highlightSubSections: boolean;
}

const DisplayTable: React.FC<DisplayTableProps> = React.memo(props => {
    const {
        table: { headers, rows },
        highlightSubSections,
    } = props;

    return (
        <Table>
            <thead>
                {headers.map((headerRow, rIdx) => (
                    <tr key={rIdx}>
                        <th className="no-border" />
                        {headerRow.map(({ label, span }, cIdx) => (
                            <th key={cIdx} colSpan={span > 1 ? span : undefined}>
                                {label}
                            </th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody>
                {rows.map((row, rIdx) => (
                    <tr key={rIdx}>
                        <td
                            className={
                                highlightSubSections && row.isSubSection ? "sub-section" : undefined
                            }
                        >
                            {row.dataElementName}
                        </td>
                        {row.greyed.map((isGreyed, cIdx) => (
                            <td key={cIdx}>{isGreyed ? GREYED_FIELD_MARK : undefined}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </Table>
    );
});

const GREYED_FIELD_MARK = "X";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        headers: {
            border: "1px solid black",
            padding: "0 0.25em",
            fontWeight: 400,
        },
        title: {
            fontSize: "1.75em",
        },
        subtitle: {
            fontSize: "1.5em",
            fontWeight: 400,
        },
        deleteButton: {
            maxWidth: "2rem",
            minWidth: "unset",
            marginRight: theme.spacing(2),
        },
    })
);

const Table = styled.table`
    font-size: 1em;
    border-collapse: collapse;
    border-spacing: 0px 1px;
    width: 100%;

    td,
    th {
        font-size: 0.6125em;
        padding: 0.1rem 0.3rem 0;
        box-sizing: border-box;
        vertical-align: middle;
    }

    td:not(:first-child) {
        text-align: center;
    }

    /* Same look as sub-sections in the Data Entry app (ClickUp #869ee3pre), scaled like the
     * export: 10pt data elements, 18pt sub-sections */
    td.sub-section {
        font-size: calc(0.6125em * 1.8);
        font-weight: 700;
        background-color: #a0adba;
        print-color-adjust: exact;
    }

    td,
    th:not(.no-border) {
        border: 1px solid #000;
    }
`;
