import React, { CSSProperties } from "react";
import { ViewStyle } from "react-native";
import { ErrorOptions } from "./errors";
import { ClickableWeb, Styled } from "./mui";
import { FixedSizeList } from 'react-window';
import { LoadMoreOptions } from "./state";
export declare const IN_REACT_WEB = true;
interface ConditionalWrap_T<P extends {}> {
    condition: boolean;
    Wrapper: React.JSXElementConstructor<P>;
    wrapperProps: P;
    children: React.ReactNode;
}
export declare const ConditionalWrap: <P extends {
    [index: string]: any;
}>({ condition, Wrapper, wrapperProps, children }: ConditionalWrap_T<P>) => JSX.Element;
export interface ImageDimensions {
    height?: React.CSSProperties['height'];
    width?: React.CSSProperties['height'];
    minHeight?: React.CSSProperties['height'];
    minWidth?: React.CSSProperties['height'];
    maxHeight?: React.CSSProperties['height'];
    maxWidth?: React.CSSProperties['height'];
}
export interface ImageProps extends ImageDimensions, Styled {
    src: string;
    alt?: string;
    onClick?: () => void;
    crossOrigin?: 'anonymous' | 'use-credentials';
}
export declare const Image: ({ src, alt, style, onClick, crossOrigin, ...props }: ImageProps) => JSX.Element;
export interface VideoProps extends Styled {
    src: string;
    dimensions?: ImageDimensions;
    onBuffer?: () => void;
    onError?: (e: any) => void;
}
export declare const Video: ({ style, dimensions, ...props }: VideoProps) => JSX.Element;
export interface Flex_T {
    row?: boolean;
    column?: boolean;
    flex?: number;
    shrink?: number;
    children?: React.ReactNode;
    reverse?: boolean;
    wrap?: CSSProperties['flexWrap'] & ViewStyle['flexWrap'];
    alignItems?: CSSProperties['alignItems'] & ViewStyle['alignItems'];
    alignContent?: CSSProperties['alignContent'] & ViewStyle['alignContent'];
    justifyContent?: CSSProperties['justifyContent'] & ViewStyle['justifyContent'];
    alignSelf?: CSSProperties['alignSelf'] & ViewStyle['alignSelf'];
    component?: "div" | 'span';
    id?: string;
}
interface Flex_Web extends Flex_T, Styled, ClickableWeb {
}
export declare const resolve_direction_for_props: (row?: boolean, col?: boolean) => "column" | "row";
export declare const compute_flex_direction_with_props: <T extends string>(direction: T, reverse?: boolean) => T | `${T}-reverse`;
export interface WithHoverColors {
    hoveredColor?: CSSProperties['backgroundColor'];
    notHoveredColor?: CSSProperties['backgroundColor'];
}
export interface WithHoverProps extends WithHoverColors {
    disabled?: boolean;
    style?: CSSProperties;
    flex?: boolean;
    children: React.ReactNode;
}
export declare const WithHover: ({ hoveredColor, notHoveredColor, flex, disabled, children, style }: WithHoverProps) => JSX.Element;
export declare const Flex: (props: Flex_Web) => JSX.Element;
export interface FormProps extends Styled, ErrorOptions {
    onSubmit: () => void;
    children?: React.ReactNode;
}
export declare const WithHTMLFormContext: React.Context<{
    loading: boolean;
}>;
export declare const Form: ({ onSubmit, uniquenessError, onError, children, style }: FormProps) => JSX.Element;
export declare const SUPPORTS_FORMS = true;
export type Item = {
    id: string | number;
    index?: number;
};
export type ItemClickable<T> = {
    onClick?: (item: T) => void;
    onPress?: (item: T) => void;
};
export type ItemRenderer<T extends Item, P = {}> = (item: T, props: {
    onClick?: (item: T) => void;
    index: number;
} & P) => React.ReactElement;
export interface ListOptions<T extends Item, P = {}> {
    render: ItemRenderer<T, P>;
    renderProps?: P;
}
export interface ItemOptions<T extends Item> {
    item: T;
    index: number;
    onClick?: (item: T) => void;
}
export declare const ObjectHeader: <T extends Item>({ item }: ItemOptions<T>) => JSX.Element;
export declare const ObjectRow: <T extends Item>({ item, onClick, index, style }: ItemOptions<T> & Styled) => JSX.Element;
export interface ListItem_T<T extends Item, P = {}> extends ListOptions<T>, ItemOptions<T>, Styled {
}
export declare const ListItem: <T extends Item, P = {}>({ item, index, render, onClick, renderProps, style }: ListItem_T<T, P>) => JSX.Element;
export interface List_T<T extends Item, P = {}> extends ListOptions<T, P>, WithHoverColors {
    items: T[];
    emptyComponent?: React.ReactElement;
    header?: React.ReactNode;
    rowStyle?: React.CSSProperties;
    onClick?: (item: T) => void;
    onPress?: (item: T) => void;
    reverse?: boolean;
    scrollToBottom?: boolean;
}
export declare const List: <T extends Item, P = {}>({ scrollToBottom, items, hoveredColor, notHoveredColor, emptyComponent, render, renderProps, onClick, reverse, style, rowStyle, }: List_T<T, {}> & Styled) => JSX.Element;
export type TitleComponentType = React.JSXElementConstructor<{
    title?: React.ReactNode;
    titleStyle?: React.CSSProperties;
}>;
export interface ScrollingListProps<T extends {
    id: string | number;
}> extends Styled {
    items: T[];
    Item: React.JSXElementConstructor<{
        item: T;
        index: number;
    }>;
    title?: React.ReactNode;
    header?: React.ReactNode;
    emptyText?: React.ReactNode;
    maxHeight?: React.CSSProperties['maxHeight'];
    maxWidth?: React.CSSProperties['maxWidth'];
    minHeight?: React.CSSProperties['minHeight'];
    titleStyle?: React.CSSProperties;
    itemContainerStyle?: React.CSSProperties;
    doneLoading?: () => boolean;
    loadMore?: (options?: LoadMoreOptions<T>) => Promise<void>;
    TitleComponent?: TitleComponentType;
    titleActionsComponent?: React.ReactNode;
    noWrap?: boolean;
    virtualization?: {
        rowHeight?: number;
        height?: number;
        width?: number | string;
        widthOffset?: number;
        virtualize?: boolean;
        hideHorizontalScroll?: boolean;
    };
    loadMoreOptions?: LoadMoreOptions<T>;
    scrollRef?: React.RefObject<FixedSizeList<T[]>>;
}
export declare const ScrollingList: <T extends {
    id: string | number;
}>({ title, maxHeight, maxWidth, minHeight, titleStyle, items, emptyText, doneLoading, loadMore, Item, TitleComponent, titleActionsComponent, style, header, itemContainerStyle, virtualization, loadMoreOptions, initialScrollOffset, scrollRef, }: ScrollingListProps<T> & {
    noParentScroll?: boolean | undefined;
    initialScrollOffset?: number | undefined;
}) => JSX.Element;
export declare const DraggableList: <T extends {
    id: string | number;
}>({ title, titleStyle, items: _items, emptyText, Item, TitleComponent, titleActionsComponent, style, noWrap, header, itemContainerStyle, onReorder, virtualization, doneLoading, loadMore, maxWidth, minHeight, maxHeight, loadMoreOptions, }: ScrollingListProps<T> & {
    onReorder?: ((updated: {
        id: string;
        index: number;
    }[]) => any) | undefined;
}) => JSX.Element;
export {};
//# sourceMappingURL=layout.d.ts.map