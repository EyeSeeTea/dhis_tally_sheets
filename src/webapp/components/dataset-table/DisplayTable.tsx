import React from "react";
import { styled } from "styled-components";
import { SectionTable } from "$/domain/entities/SectionTable";

interface DisplayTableProps {
    table: SectionTable;
    highlightSubSections: boolean;
}

export const DisplayTable: React.FC<DisplayTableProps> = React.memo(props => {
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
                {rows.map((row, rIdx) => {
                    const highlight = highlightSubSections && row.isSubSection;

                    return (
                        <tr key={rIdx} className={highlight ? "sub-section" : undefined}>
                            <td>{row.dataElementName}</td>
                            {row.greyed.map((isGreyed, cIdx) => (
                                <td key={cIdx}>
                                    {isGreyed && !highlight ? GREYED_FIELD_MARK : undefined}
                                </td>
                            ))}
                        </tr>
                    );
                })}
            </tbody>
        </Table>
    );
});

const GREYED_FIELD_MARK = "X";

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

    tr.sub-section td {
        print-color-adjust: exact;
        background-color: #e8edf2;
        background-size: 8px 8px;
        background-image: repeating-linear-gradient(
            45deg,
            #d5dde5 0,
            #d5dde5 0.8px,
            #e8edf2 0,
            #e8edf2 50%
        );
    }

    /* 1.4 is the 10pt to 14pt ratio of data elements to sub-sections in the export */
    tr.sub-section td:first-child {
        font-size: calc(0.6125em * 1.4);
        font-weight: 700;
        background-color: #a0adba;
        background-image: none;
    }

    td,
    th:not(.no-border) {
        border: 1px solid #000;
    }
`;
