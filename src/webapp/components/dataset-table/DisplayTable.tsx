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
