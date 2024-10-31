import React, {ReactNode} from "react";
import {classList} from "spotlight/utils/jsx/classes";
import styles from "./Table.pcss";

interface Props<T> {
    className?: string;
    cols: Array<Column<T>>;
    rows: Array<T>;
    footerCols?: boolean;
    styleMap?: TableStyleMap;
}

export interface Column<T> {
    id: string;
    label: string;
    align?: "left" | "right" | "center";
    render: (row: T, idx: number) => ReactNode;
}

export interface TableStyleMap {
    cols: { [k: string]: string };
    cells: { [k: string]: string };
}

export default function Table<T>({className, cols, rows, footerCols, styleMap}: Props<T>) {
    styleMap = styleMap ?? {cols: {}, cells: {}};

    return (
        <table className={classList(styles.table, className)}>
            <thead className={styles.header}>
                <ColHeaders cols={cols} styleMap={styleMap} />
            </thead>

            <tbody>
                {rows.map((row, idx) => <Row key={idx} idx={idx} row={row} cols={cols} styleMap={styleMap} />)}
            </tbody>

            {footerCols && (
                <tfoot className={styles.footer}>
                    <ColHeaders cols={cols} styleMap={styleMap} />
                </tfoot>
            )}
        </table>
    );
}

interface RowProps<T> {
    idx: number;
    row: T;
    cols: Array<Column<T>>;
    styleMap: TableStyleMap;
}

function Row<T>({idx, row, cols, styleMap}: RowProps<T>) {
    return (
        <tr className={styles.row}>
            {cols.map(col => {
                return (
                    <td key={col.id} className={classList(styles.cell, alignClass(col), styleMap.cells[col.id])}>
                        {col.render(row, idx)}
                    </td>
                );
            })}
        </tr>
    );
}

interface ColHeadersProps<T> {
    cols: Array<Column<T>>;
    styleMap: TableStyleMap;
}

function ColHeaders<T>({cols, styleMap}: ColHeadersProps<T>) {
    return (
        <tr>
            {cols.map(col => {
                const className = classList(styles.colHeading, alignClass(col), styleMap.cols[col.id]);

                return (
                    <th key={col.id} className={className}>
                        {col.label}
                    </th>
                );
            })}
        </tr>
    );
}

/**
 * Determines the correct class to use for alignment.
 *
 * @param col The column config.
 */
function alignClass<T>(col: Column<T>) {
    if (col.align === "center") {
        return styles.alignCenter;
    }

    if (col.align === "right") {
        return styles.alignRight;
    }

    return styles.alignLeft;
}
