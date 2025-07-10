import React, { CSSProperties, JSXElementConstructor } from "react";
import { Elevated, Styled } from "./mui";
import { Item, ItemClickable, ScrollingListProps } from "./layout";
import { LoadMoreFunctions, LoadMoreOptions } from "./state";
import { ListQueryQualifier, SortingField } from "@tellescope/types-models";
export declare const GRAY = "#EFEFEF";
export interface HorizontalPadded {
    horizontalPadding?: number;
}
export interface TableTitleProps extends Styled, HorizontalPadded {
    title: React.ReactNode;
    description?: string;
    textStyle?: CSSProperties;
    actionsComponent?: React.ReactNode;
}
export declare const TableTitle: ({ title, description, actionsComponent, style, textStyle, horizontalPadding }: TableTitleProps) => JSX.Element;
type LocalFilter = {
    query: string;
    values?: string[];
    valuesQualifier?: ListQueryQualifier;
};
export type Sorting = {
    field: string;
    direction: 'ascending' | 'descending';
};
type Indices = {
    index: number;
    indexOfPage: number;
};
type RenderOptions = {
    adjustedWidth?: number;
};
type Renderer<T> = (value: T, indices: Indices, options: RenderOptions) => React.ReactElement | string | number;
export type TableField<T> = {
    key: string | number;
    label: string;
    hidden?: boolean;
    render?: Renderer<T>;
    getExportData?: (v: T) => string | number;
    width?: CSSProperties['width'];
    titleWidth?: CSSProperties['width'];
    textAlign?: CSSProperties['textAlign'];
    style?: CSSProperties;
    flex?: boolean;
    getSortValue?: (v: T) => string | number;
    getFilterValue?: (v: T) => string | (string[]);
    filterType?: 'multi';
    filterSuggestions?: string[];
    filterIsActive?: boolean;
    filterComponent?: React.ReactNode;
    allowWidthAdjustment?: boolean;
    columnResizeZIndex?: number;
};
export interface TableHeaderProps<T extends Item> extends Styled, HorizontalPadded, SelectionPropsOptional {
    fields: TableField<T>[];
    textStyle?: CSSProperties;
    fontSize?: CSSProperties['fontSize'];
    sorting: Sorting[];
    setSorting: React.Dispatch<React.SetStateAction<Sorting[]>>;
    memoryId?: string;
    widthOffsets: Record<string, number>;
    setWidthOffsets: React.Dispatch<React.SetStateAction<Record<string, number>>>;
    onExport?: () => void;
    localFilters: LocalFilter[];
    setLocalFilters: React.Dispatch<React.SetStateAction<LocalFilter[]>>;
    filterSuggestions: Record<string, string[]>;
    minColumnWidth?: number;
    columnResizeZIndex?: number;
    headerHeight?: number;
}
export declare const TableHeader: <T extends Item>({ fields, sorting, setSorting, selectable, allSelected, setAllSelected, style, textStyle, horizontalPadding, fontSize, memoryId, widthOffsets, setWidthOffsets, onExport, localFilters, setLocalFilters, filterSuggestions, minColumnWidth, columnResizeZIndex, headerHeight, }: TableHeaderProps<T>) => JSX.Element;
export interface TableRowProps<T extends Item> extends Styled, HorizontalPadded, ItemClickable<T>, SelectionPropsOptional {
    item: T;
    indices: Indices;
    fields: TableHeaderProps<T>['fields'];
    hoveredColor?: CSSProperties['color'];
    notHoveredColor?: CSSProperties['color'];
    hover?: boolean;
    fontSize?: CSSProperties['fontSize'];
    textStyle?: CSSProperties;
    widthOffsets: Record<string, number>;
    minColumnWidth?: number;
    rowHeight?: number;
}
export declare const TableRow: <T extends Item>({ item, indices, fields, onClick, onPress, hover, hoveredColor, notHoveredColor, horizontalPadding, style, textStyle, selectable, allSelected, selected, setSelected, fontSize, widthOffsets, allowUnselectItemsAfterSelectAll, setAllSelected, minColumnWidth, rowHeight, }: TableRowProps<T>) => JSX.Element;
export interface PaginationOptions<T> {
    paginated?: boolean;
    pageSize?: number;
    initialPage?: number;
    pageMemoryId?: string;
    showLoadAll?: boolean;
}
export interface PaginationProps<T> extends PaginationOptions<T> {
    items: T[];
    applySorting?: (items: T[]) => T[];
}
export declare const usePagination: <T>({ paginated, items, pageMemoryId, pageSize, applySorting, initialPage }: PaginationProps<T>) => {
    selectedPage: number;
    numPages: number;
    goToNext: () => void;
    goToPrevious: () => void;
    goToPage: (page: number) => void;
    mapSelectedItems: <R>(apply: (item: T, info: {
        index: number;
        isLast: boolean;
    }) => R) => T[] | R[];
    previousDisabled: boolean;
    nextDisabled: boolean;
};
export interface TableFooterProps<T> extends Styled, HorizontalPadded, Partial<LoadMoreFunctions<T>>, ReturnType<typeof usePagination> {
    loadMoreOptions?: LoadMoreOptions<T>;
    showLoadAll?: boolean;
}
export declare const TableFooter: <T>({ horizontalPadding, style, previousDisabled, nextDisabled, selectedPage, numPages, goToNext, goToPrevious }: TableFooterProps<T>) => JSX.Element;
export declare const TableFooterNumbered: <T>({ showLoadAll, horizontalPadding, loadMore, loadMoreOptions, doneLoading, style, previousDisabled, nextDisabled, selectedPage, numPages, goToNext, goToPrevious, goToPage }: TableFooterProps<T>) => JSX.Element;
export interface SelectionProps {
    selectable: boolean;
    selected: string[];
    setSelected: (s: string[]) => void;
    allSelected: boolean;
    setAllSelected: (b: boolean) => void;
    allowUnselectItemsAfterSelectAll: boolean;
}
export type SelectionPropsOptional = Partial<SelectionProps>;
export type WithTitle = {
    title?: React.ReactNode;
    TitleComponent?: JSXElementConstructor<TableTitleProps>;
    renderTitleComponent?: (p: TableTitleProps) => React.ReactNode;
};
export type WithHeader<T extends Item> = {
    fields?: TableHeaderProps<T>['fields'];
    HeaderComponent?: JSXElementConstructor<TableHeaderProps<T>>;
};
export type WithRows<T extends Item> = {
    fields?: TableRowProps<T>['fields'];
    hoveredColor?: TableRowProps<T>['hoveredColor'];
    RowComponent?: JSXElementConstructor<TableRowProps<T>>;
};
export type WithFooter<T> = {
    paginated?: boolean;
    FooterComponent?: JSXElementConstructor<TableFooterProps<T>>;
};
export interface TableProps<T extends Item> extends WithTitle, WithHeader<T>, WithFooter<T>, WithRows<T>, HorizontalPadded, Elevated, ItemClickable<T>, Partial<LoadMoreFunctions<T>>, SelectionPropsOptional {
    items: T[];
    titleStyle?: React.CSSProperties;
    titleActionsComponent?: React.ReactNode;
    titleComponentHeight?: number;
    noPaper?: boolean;
    emptyText?: string;
    emptyComponent?: React.ReactElement;
    fields: TableHeaderProps<T>['fields'];
    pageOptions?: PaginationOptions<T>;
    paddingHorizontal?: number;
    headerFontSize?: CSSProperties['fontSize'];
    rowFontSize?: CSSProperties['fontSize'];
    footerStyle?: 'numbered' | 'prev-next';
    hover?: boolean;
    maxRowsHeight?: React.CSSProperties['maxHeight'];
    maxWidth?: React.CSSProperties['maxWidth'];
    noWrap?: boolean;
    memoryId?: string;
    onReorder?: (updated: {
        id: string;
        index: number;
    }[]) => void;
    filterCounts?: {
        filtered: number;
        total: number;
    };
    virtualization?: ScrollingListProps<T>['virtualization'];
    onExport?: (v: {
        data: (string | number)[][];
        labels: string[];
    }) => void;
    sort?: SortingField[];
    loadMoreOptions?: LoadMoreOptions<T>;
    refreshFilterSuggestionsKey?: number;
    minColumnWidth?: number;
    columnResizeZIndex?: number;
    rowHeight?: number;
    headerHeight?: number;
    onChangeColumnSorting?: (sorting: Sorting[]) => void;
}
export declare const Table: <T extends Item>({ items, emptyText, titleComponentHeight, emptyComponent, noPaper, pageOptions, style, horizontalPadding, elevation, headerFontSize, rowFontSize, onClick, onPress, loadMore, doneLoading, loadMoreOptions, filterCounts: _filterCounts, title, titleStyle, titleActionsComponent, TitleComponent, renderTitleComponent, fields, HeaderComponent, headerHeight, hover, hoveredColor, RowComponent, footerStyle, FooterComponent, rowHeight, selectable, selected, setSelected, allSelected, setAllSelected, allowUnselectItemsAfterSelectAll, noWrap, maxWidth, maxRowsHeight, memoryId, paginated: _paginated, onReorder, virtualization, onExport, sort, refreshFilterSuggestionsKey, minColumnWidth, columnResizeZIndex, onChangeColumnSorting, }: TableProps<T> & Styled) => JSX.Element;
export {};
//# sourceMappingURL=table.d.ts.map