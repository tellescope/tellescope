import React from "react";
import { Flex_T, FormProps, Item, ImageProps, VideoProps, List_T, WithHoverProps, ScrollingListProps } from "./layout.js";
import { ClickableNative, NativeStyled } from "./mui";
export declare const IN_REACT_WEB = false;
export declare const WithHTMLFormContext: React.Context<{
    loading: boolean;
}>;
export declare const Image: ({ src, alt, ...props }: ImageProps) => JSX.Element;
export declare const Video: ({ style, src, dimensions, ...props }: VideoProps) => JSX.Element;
interface Flex_Native extends Flex_T, NativeStyled, ClickableNative {
}
export declare const Flex: (props: Flex_Native) => JSX.Element;
export declare const Form: ({ children, style }: FormProps) => JSX.Element;
export declare const SUPPORTS_FORMS = false;
export declare const List: <T extends Item>({ items, emptyComponent, render, onClick, onPress, reverse, style }: List_T<T, {}> & NativeStyled) => JSX.Element;
export declare const WithHover: ({ children }: WithHoverProps) => JSX.Element;
export declare const ScrollingList: <T extends {
    id: string | number;
}>({ title, maxHeight, minHeight, titleStyle, items, emptyText, doneLoading, loadMore, Item, TitleComponent, titleActionsComponent, style, }: ScrollingListProps<T>) => JSX.Element;
export {};
//# sourceMappingURL=layout.native.d.ts.map