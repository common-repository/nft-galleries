import React, {CSSProperties, MutableRefObject, ReactElement, RefObject, useCallback, useLayoutEffect, useRef, useState} from "react";
import classes from "./SelectionGrid.pcss";
import {useDetectOutsideClick} from "spotlight/utils/react/useDetectOutsideClick";
import {mergeRefs} from "spotlight/utils/jsx/mergeRefs";
import {Square} from "spotlight/common/components/Square/Square";
import {JumboAddButton, Props as JumboAddButtonProps} from "spotlight/admin-common/components/JumboAddButton/JumboAddButton";

const ADD_BUTTON_KEY = "_add_btn";

export type Props<T> = {
    items: Array<T>;
    selected?: number;
    disabled?: boolean;
    controlled?: boolean;
    canDeselect?: boolean;
    initialSelected?: string;
    keyFn?: (item: T, idx: number) => string;
    gridGap?: number;
    gridStyle?: CSSProperties;
    useKeyBinds?: boolean;
    addButton?: JumboAddButtonProps,
    onClick?: (item: T | null, idx: number | null, elem: HTMLDivElement) => void;
    onSelect?: (item: T | null, idx: number | null, elem: HTMLDivElement) => void;
    children: (props: { item: T, idx: number, isSelected: boolean }) => ReactElement;
}

export function SelectionGrid<T>(
    {disabled, controlled, canDeselect, children, onClick, onSelect, addButton, ...props}: Props<T>,
) {
    const isUsingAddBtn = !!addButton;
    const items: (T | JumboAddButtonProps)[] = isUsingAddBtn
        ? [addButton, ...props.items]
        : props.items;

    let initial = 0;
    if (props.initialSelected && props.keyFn) {
        initial = props.items.findIndex((item, idx) => props.keyFn(item, idx) === props.initialSelected);
        initial = (initial === -1) ? 0 : initial;
    }

    const [selectedState, setSelectedState] = useState<number | null>(initial);
    const rootRef = React.useRef<HTMLDivElement>();
    const gridRef = React.useRef<HTMLDivElement>();
    const firstItemRef = React.useRef<HTMLDivElement>();

    const selected = controlled ? props.selected : selectedState;
    const gridGap = props.gridGap ?? 15;
    const useKeyBinds = props.useKeyBinds ?? true;

    useLayoutEffect(() => {
        firstItemRef.current?.focus();
    }, [firstItemRef]);

    function handleItemSelected(idx: number, target?: HTMLDivElement) {
        if (!disabled) {
            if (!controlled) {
                setSelectedState(idx);
            }

            const item = items[idx];
            if (!isAddButtonProps(isUsingAddBtn, item, idx)) {
                onSelect && onSelect(item, idx, target);
            }
        }
    }

    function handleItemClicked(idx?: number, target?: HTMLDivElement) {
        if (!disabled) {
            handleItemSelected(idx, target);

            const item = items[idx];
            if (isAddButtonProps(isUsingAddBtn, item, idx)) {
                addButton?.onClick && addButton.onClick();
            } else {
                onClick && onClick(item, idx, target);
            }
        }
    }

    function getNumCols() {
        const selfBox = gridRef.current.getBoundingClientRect();
        const itemBox = firstItemRef.current.getBoundingClientRect();
        const gridWidth = selfBox.width;
        const itemWidth = itemBox.width;

        return Math.floor((gridWidth + gridGap) / (itemWidth + gridGap));
    }

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (disabled || !useKeyBinds) return;

        const numCols = getNumCols();
        const numRows = Math.ceil(items.length / numCols);

        switch (e.key) {
            case " ":
            case "Enter":
                handleItemClicked(selected);
                break;
            case "ArrowLeft":
                handleItemSelected(Math.max(selected - 1, 0));
                break;
            case "ArrowRight":
                handleItemSelected(Math.min(selected + 1, items.length - 1));
                break;
            case "ArrowUp": {
                const newIdx = Math.max(0, selected - numCols);
                const currRow = Math.floor(selected / numCols);
                const newRow = Math.floor(newIdx / numCols);

                if (numRows > 1 && newRow !== currRow) {
                    handleItemSelected(newIdx);
                }

                break;
            }
            case "ArrowDown": {
                const newIdx = Math.min(items.length - 1, selected + numCols);
                const currRow = Math.floor(selected / numCols);
                const newRow = Math.floor(newIdx / numCols);

                if (numRows > 1 && newRow !== currRow) {
                    handleItemSelected(newIdx);
                }

                break;
            }

            default:
                return;
        }

        e.preventDefault();
        e.stopPropagation();
    }, [disabled, useKeyBinds, items, handleItemSelected]);

    useDetectOutsideClick(
        gridRef,
        () => {
            if (canDeselect && selected !== null) {
                handleItemSelected(null);
            }
        },
        [],
        [canDeselect, handleItemSelected, selected],
    );

    const gridStyle = {...props.gridStyle, gridGap};
    const gridClass = disabled ? classes.gridDisabled : classes.grid;

    return (
        <div ref={rootRef} className={classes.root}>
            <div ref={gridRef} className={gridClass} style={gridStyle}>
                {
                    items.map((item, idx) => {
                            if (isAddButtonProps(isUsingAddBtn, item, idx)) {
                                return (
                                    <div className={classes.item} key={ADD_BUTTON_KEY}>
                                        <Square>
                                            <JumboAddButton {...item} isFocused={selected === idx} />
                                        </Square>
                                    </div>
                                );
                            }

                            const realIdx = idx;
                            const virtIdx = isUsingAddBtn ? idx - 1 : idx;

                            return (
                                <Item
                                    key={props.keyFn ? props.keyFn(item, virtIdx) : virtIdx}
                                    ref={virtIdx === 0 ? firstItemRef : null}
                                    focused={!disabled && selected === realIdx}
                                    onClick={e => handleItemClicked(realIdx, e.currentTarget)}
                                    onSelect={e => handleItemSelected(realIdx, e.currentTarget)}
                                    onKeyDown={handleKeyDown}>
                                    {children({item, idx: virtIdx, isSelected: selected === realIdx})}
                                </Item>
                            );
                        },
                    )
                }
            </div>
        </div>
    );
}

interface ItemProps {
    ref?: MutableRefObject<HTMLElement>;
    focused: boolean;
    onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
    onSelect: (e: React.FocusEvent<HTMLDivElement>) => void;
    onKeyDown: (e: React.KeyboardEvent) => void;
    children: ReactElement;
}

const Item = React.forwardRef(
    ({focused, onClick, onSelect, onKeyDown, children}: ItemProps, forwardRef?: RefObject<HTMLElement>) => {
        const thisRef = useRef<HTMLDivElement>();

        useLayoutEffect(() => {
            if (focused) {
                thisRef?.current?.focus();
            }
        }, [focused, thisRef]);

        return (
            <div
                // @ts-ignore
                ref={mergeRefs(thisRef, forwardRef)}
                className={classes.item}
                onClick={onClick}
                onFocus={onSelect}
                onKeyDown={onKeyDown}
                tabIndex={0}>
                {children}
            </div>
        );
    },
);

function isAddButtonProps<T>(enabled: boolean, item: T | JumboAddButtonProps, idx: number): item is JumboAddButtonProps {
    return enabled && idx === 0;
}
