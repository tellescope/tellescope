import { Grid, Typography } from "@mui/material";
import React, { CSSProperties, useRef, useState } from "react";
import { ViewStyle } from "react-native"
import { ErrorOptions, useHandleError } from "./errors";

import {
  ClickableWeb,
  Styled,
} from "./mui"

export const IN_REACT_WEB = true

interface ConditionalWrap_T <P extends {}>{
  condition: boolean,
  Wrapper: React.JSXElementConstructor<P>,
  wrapperProps: P,
  children: React.ReactNode
}
export const ConditionalWrap = <P extends { [index: string]: any }>({ condition, Wrapper, wrapperProps, children } : ConditionalWrap_T<P>) => {
  if (condition) return <Wrapper {...wrapperProps}>{children}</Wrapper>
  return <>{children}</>
}

export interface ImageDimensions {
  height?: React.CSSProperties['height'],
  width?: React.CSSProperties['height'],
  minHeight?: React.CSSProperties['height'],
  minWidth?: React.CSSProperties['height'],
  maxHeight?: React.CSSProperties['height'],
  maxWidth?: React.CSSProperties['height'],
}
export interface ImageProps extends ImageDimensions, Styled {
  src: string,
  alt?: string,
}
export const Image = ({ src, alt, style, ...props }: ImageProps) => <img src={src} alt={alt} style={{ ...props, ...style }} />

export interface VideoProps extends Styled {
  src: string,
  dimensions?: ImageDimensions,
  onBuffer?: () => void,
  onError?: (e: any) => void, 
}
export const Video = ({ style, dimensions, ...props } : VideoProps) => (
  <video {...props} controls style={{
    ...style, ...dimensions
  }} />
)

// type FlexByBreakpoint = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12

export interface Flex_T {
  row?: boolean,
  column?: boolean,
  flex?: number,
  shrink?: number,
  children?: React.ReactNode,
  reverse?: boolean,
  wrap?: CSSProperties['flexWrap'] & ViewStyle['flexWrap'],
  alignItems?: CSSProperties['alignItems'] & ViewStyle['alignItems'],
  alignContent?: CSSProperties['alignContent'] & ViewStyle['alignContent'],
  justifyContent?: CSSProperties['justifyContent'] & ViewStyle['justifyContent'],
  alignSelf?: CSSProperties['alignSelf'] & ViewStyle['alignSelf'],
  component?: "div" | 'span',
}

interface Flex_Web extends Flex_T, Styled, ClickableWeb {
  // xs?: FlexByBreakpoint;
  // sm?: FlexByBreakpoint;
  // md?: FlexByBreakpoint;
  // lg?: FlexByBreakpoint;
  // xl?: FlexByBreakpoint;
}

export const resolve_direction_for_props = (row?: boolean, col?: boolean) => (
    row ? 'row' 
  : col ? 'column' 
  : 'row' // default to row, like web
)

export const compute_flex_direction_with_props = <T extends string>(direction: T, reverse?: boolean) => (
  reverse === true
    ? direction + '-reverse' as `${T}-reverse`
    : direction
)

export interface WithHoverColors {
  hoveredColor?: CSSProperties['backgroundColor'], 
  notHoveredColor?: CSSProperties['backgroundColor'],
}
export interface WithHoverProps extends WithHoverColors { 
  disabled?: boolean,
  style?: CSSProperties 
  flex?: boolean,
  children: React.ReactNode,
}
export const WithHover = ({ hoveredColor, notHoveredColor, flex, disabled, children, style={} } : WithHoverProps) => {
  const [hovered, setHovered] = useState(false)

  if (disabled) return <>{children}</>
  return (
    <span onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} 
      style={{ 
        display: flex ? 'flex' : undefined,
        flex: flex ? 1 : undefined,
        cursor: disabled ? undefined : 'pointer', 
        backgroundColor: hovered && !disabled ? hoveredColor : notHoveredColor, 
        ...style,
      }}
    >
      {children}
    </span>
  )
}

export const Flex = (props: Flex_Web) => {
  const direction = resolve_direction_for_props(props.row, props.column)
  const flexDirection = compute_flex_direction_with_props(direction, props.reverse)
  const flex = props.flex ?? 0
  const flexShrink = props.shrink ?? 1 // same default as web
  const children = props.children ?? null
  const wrap = props.wrap  ?? 'wrap'

  const style = {
    alignItems: props.alignItems, 
    alignContent: props.alignContent ?? 'stretch', // web default 
    justifyContent: props.justifyContent, 
    alignSelf: props.alignSelf, 
    flex, 
    flexDirection,
    flexWrap: wrap,
    display: 'flex', 
    flexShrink,
    ...props.style, 
  }

  if (props.component === 'span') return (
    <span style={style} onClick={props.onClick ?? props.onPress}>
      {children}
    </span>
  )

  return (
    <div style={style} onClick={props.onClick ?? props.onPress}>
      {children}
    </div>
  )
}

export interface FormProps extends Styled, ErrorOptions {
  onSubmit: () => void;
  children?: React.ReactNode;
}
export const Form = ({ onSubmit, uniquenessError, onError, children, style }: FormProps) =>  {
  const { errorDisplay, handleAPIError } = useHandleError({ uniquenessError, onError })

  return (
    <form style={style} onSubmit={e => handleAPIError(async () => { 
      e.preventDefault(); 
      await onSubmit(); 
    })}>
      {children}

      {errorDisplay && errorDisplay}
    </form>
  )
}
export const SUPPORTS_FORMS = true


export type Item = { id: string | number }
export type ItemClickable<T> = { 
  onClick?: (item: T) => void;
  onPress?: (item: T) => void;
}
export type ItemRenderer <T extends Item, P={}> = (
  item: T, 
  props: { onClick?: (item: T) => void, index: number } & P
) => React.ReactElement
export interface ListOptions <T extends Item, P={}>{
  render: ItemRenderer<T, P>,
  renderProps?: P,
}
export interface ItemOptions <T extends Item>{
  item: T,
  index: number,
  onClick?: (item: T) => void;
}

export const ObjectHeader = <T extends Item>({ item }: ItemOptions<T>) => {
  return (
    <Flex row>
    {  
      Object.keys(item).map(k => {
        return (
          <Flex key={k}>{k}</Flex> 
        )  
      })
    }
    </Flex>
  )
}
export const ObjectRow = <T extends Item>({ item, onClick, index, style }: ItemOptions<T> & Styled) => {
  return (
    <Flex row style={style}>
    {
      Object.keys(item).map((_k, i) => {
        const key = _k as keyof T
        return (
          <Flex column key={_k ?? i} onClick={() => onClick?.(item)}>
            {typeof item[key] === 'object' 
              ? JSON.stringify(item[key])
              : item[key]
            }
          </Flex> 
        )
      })
    }
    </Flex>
  )
}

export interface ListItem_T <T extends Item, P={}> extends ListOptions<T>, ItemOptions<T>, Styled {}
export const ListItem = <T extends Item, P={}>({ item, index, render, onClick, renderProps, style }: ListItem_T<T, P>) => {
  if (render) return render(item, { index, onClick, ...renderProps })

  return <ObjectRow item={item} index={index} onClick={onClick} style={style} />
}

export interface List_T <T extends Item, P={}> extends ListOptions<T, P>, WithHoverColors {
  items: T[] ,
  emptyComponent?: React.ReactElement,
  header?: React.ReactNode,
  rowStyle?: React.CSSProperties,
  onClick?: (item: T) => void;
  onPress?: (item: T) => void;
  reverse?: boolean,
}
export const List = <T extends Item, P={}>({ items, hoveredColor, notHoveredColor, emptyComponent, render, renderProps, onClick, reverse, style, rowStyle, }: List_T<T> & Styled) => {
  if (items.length === 0 && emptyComponent) return emptyComponent
  
  return (
    <div style={{ overflowY: 'auto', ...style }}>
    <Flex flex={1} column reverse={reverse}>
      {items.map((item, i) => 
        hoveredColor 
        ? <WithHover key={item.id ?? i} flex hoveredColor={hoveredColor} notHoveredColor={notHoveredColor}>  
            <ListItem index={i} item={item} render={render} renderProps={renderProps} onClick={onClick} style={rowStyle} />
          </WithHover>
        : <ListItem key={item.id ?? i} index={i} item={item} render={render} renderProps={renderProps} onClick={onClick} style={rowStyle} />
      )}
    </Flex>
    </div>
  )
}

export type TitleComponentType = React.JSXElementConstructor<{ title?: React.ReactNode, titleStyle?: React.CSSProperties}>
export interface ScrollingListProps <T extends { id: string | number }> extends Styled {
  items: T[],
  Item: React.JSXElementConstructor<{ item: T, index: number }>
  title?: React.ReactNode,
  header?: React.ReactNode,
  emptyText?: React.ReactNode,
  maxHeight?: React.CSSProperties['maxHeight'],
  maxWidth?: React.CSSProperties['maxWidth'],
  minHeight?: React.CSSProperties['minHeight'],
  titleStyle?: React.CSSProperties,
  itemContainerStyle?: React.CSSProperties,
  doneLoading?: () => boolean,
  loadMore?: () => Promise<void>,
  TitleComponent?: TitleComponentType,
  titleActionsComponent?: React.ReactNode,
  noWrap?: boolean,
}
export const ScrollingList = <T extends { id: string | number }>({
  title,
  maxHeight,
  maxWidth,
  minHeight,
  titleStyle,
  items,
  emptyText,
  doneLoading,
  loadMore,
  Item,
  TitleComponent,
  titleActionsComponent,
  style,
  noWrap,
  header,
  itemContainerStyle,
} : ScrollingListProps<T>) => {
  const fetchRef = useRef(0)
  const titleStyleWithDefaults = { fontSize: 20, fontWeight: 'bold', marginBottom: 3, ...titleStyle }
 
  return (
    <Grid container direction="column" style={style} wrap={noWrap ? 'nowrap' : undefined}>
      {TitleComponent
        ? <TitleComponent title={title} titleStyle={titleStyleWithDefaults} />
        : (
          <Grid container alignItems="center" justifyContent="space-between">
            {typeof title === 'string'
              ? (
                <Typography style={titleStyleWithDefaults}>
                  {title}
                </Typography>
              )
              : title   
            } 
            
            {titleActionsComponent}
          </Grid>
        )
      }

      <Grid container direction="column" flexWrap={'nowrap'} 
        style={{ minHeight, maxHeight, maxWidth, overflow: 'auto' }}
        onScroll={e => {
          if (doneLoading?.() || !loadMore) return

          const atBottom = e.currentTarget.scrollHeight - e.currentTarget.scrollTop <= e.currentTarget.clientHeight + 5;
          if (!atBottom) return

          if (fetchRef.current === e.currentTarget.scrollHeight) return
          fetchRef.current = e.currentTarget.scrollHeight

          loadMore().catch(console.error)
        }}
      >
        <Grid container direction="column" style={itemContainerStyle}>
          {header}

          {items.length === 0 
            ? typeof emptyText === 'string'
              ? <Typography>{emptyText}</Typography>
              : emptyText
            : null
          }

          {items.map((item, index) => (
            <Item key={item.id} item={item} index={index} />
          ))}
        </Grid>
      </Grid>
    </Grid>
  )
}