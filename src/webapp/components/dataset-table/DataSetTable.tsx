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
import {
    CategoryCombo,
    DataSet,
    GreyedField,
    Section as SectionType,
} from "$/domain/entities/DataSet";
import { Id } from "$/domain/entities/Ref";
import i18n from "$/utils/i18n";
import { styled } from "styled-components";
import { Maybe } from "$/utils/ts-utils";
import _c from "$/domain/entities/generic/Collection";

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
                    {dataSet.displayName}
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

    const tables = React.useMemo(() => {
        return getSectionTables(section.categoryCombos, section.greyedFields);
    }, [section.categoryCombos, section.greyedFields]);

    return (
        <Box>
            {tables.map((table, idx) => (
                <DisplayTable table={table} key={idx} />
            ))}
        </Box>
    );
});

const DisplayTable: React.FC<{ table: Table }> = React.memo(props => {
    const {
        table: { thead, tbody },
    } = props;

    return (
        <Table>
            <thead>
                {thead.map((row, rIdx) => (
                    <tr key={rIdx}>
                        {row.map((cell, cIdx) => (
                            <th key={cIdx}>{cell}</th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody>
                {tbody.map((row, rIdx) => (
                    <tr key={rIdx}>
                        {row.map((cell, cIdx) => (
                            <td key={cIdx}>{cell}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </Table>
    );
});

function getSectionTables(categoryCombos: CategoryCombo[], greyedFields: GreyedField[]): Table[] {
    return categoryCombos.map(categoryCombo => {
        const optionNames = categoryCombo.categories.map(({ categoryOptions }) =>
            categoryOptions.map(({ displayFormName }) => displayFormName)
        );
        const thead = (_c(optionNames).cartesian().unzip().value() as string[][]).map(
            row => [undefined, ...row] //add an empty cell for the data elements column
        );

        const cocIds = categoryCombo.categoryOptionCombos.map(({ id }) => id);
        const combinations = (_c(thead).first()?.length ?? 1) - DATA_ELEMENTS_OFFSET;

        const tbody =
            categoryCombo.dataElements?.map(de => {
                const gfs = greyedFields
                    .filter(gf => gf.dataElement.id === de.id)
                    .map(gf => cocIds.indexOf(gf.categoryOptionCombo.id))
                    .filter(idx => idx >= 0);

                return [de.displayFormName, ...markGreyedFields(gfs, combinations)];
            }) ?? [];

        return { thead, tbody };
    });
}

function getMergeRanges(row: Row): MergeRange[] {
    return row
        .reduce<MergeRange[]>((acc, v, idx, arr) => {
            const last = acc.slice(-1);
            const rest = acc.slice(0, -1);
            if (!last || arr.at(idx - 1) !== v) return acc.concat([[idx, idx]]);
            else return rest.concat(last.map(([start, _end]) => [start, idx]));
        }, [])
        .filter(([start, end]) => start !== end);
}

function markGreyedFields(columns: number[], length: number): (string | undefined)[] {
    return Array.from({ length: length }, (_, i) => (columns.includes(i) ? "X" : undefined));
}

const DATA_ELEMENTS_OFFSET = 1;

type MergeRange = [number, number];

type Row = Maybe<string>[];
type Table = { thead: Row[]; tbody: Row[] };

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

const Table = styled.table`
    font-size: 1rem;
    border-collapse: collapse;
    td,
    th {
        border: 1px solid #000;
    }
`;
