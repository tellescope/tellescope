import React, { CSSProperties, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Grid, Typography } from "@mui/material";
import { ViewStyle } from "react-native"
import { ErrorOptions, useHandleError } from "./errors";

import {
  ClickableWeb,
  LinearProgress,
  Styled,
} from "./mui"
import { DragDropContext, Draggable, DropResult, Droppable } from "react-beautiful-dnd";
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

import { FixedSizeList } from 'react-window';
import { usePageWidth } from "./CMS";
import { LoadMoreOptions } from "./state";
import { LoadingButton } from ".";

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
  onClick?: () => void,
  crossOrigin?: 'anonymous' | 'use-credentials',
}
export const Image = ({ src, alt, style, onClick, crossOrigin, ...props }: ImageProps) => (
  <img crossOrigin={crossOrigin} src={src} alt={alt} onClick={onClick} style={{ cursor: !!onClick ? 'pointer' : undefined, ...props, ...style }} />
)

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
  id?: string,
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
    <span style={style} id={props.id} onClick={props.onClick ?? props.onPress}>
      {children}
    </span>
  )

  return (
    <div style={style} id={props.id} onClick={props.onClick ?? props.onPress}>
      {children}
    </div>
  )
}

export interface FormProps extends Styled, ErrorOptions {
  onSubmit: () => void;
  children?: React.ReactNode;
}
export const WithHTMLFormContext = React.createContext({ loading: false })
export const Form = ({ onSubmit, uniquenessError, onError, children, style }: FormProps) =>  {
  const { errorDisplay, handleAPIError, loading } = useHandleError({ uniquenessError, onError })

  return (
    <WithHTMLFormContext.Provider value={{ loading }}>
    <form style={style} onSubmit={e => handleAPIError(async () => { 
      e.preventDefault(); 
      await onSubmit(); 
    })}>
      {children}

      {errorDisplay && errorDisplay}
    </form>
    </WithHTMLFormContext.Provider>
  )
}
export const SUPPORTS_FORMS = true


export type Item = { id: string | number, index?: number }
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
  scrollToBottom?: boolean,
}
export const List = <T extends Item, P={}>({ scrollToBottom, items, hoveredColor, notHoveredColor, emptyComponent, render, renderProps, onClick, reverse, style, rowStyle, }: List_T<T> & Styled) => {
  const scrollRef = useRef<HTMLDivElement>(null)
  if (items.length === 0 && emptyComponent) return emptyComponent

  useEffect(() => {
    if (!scrollToBottom) return
    
    scrollRef.current?.scroll?.({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [scrollToBottom, items.length])
  
  return (
    <div style={{ overflowY: 'auto', ...style }} ref={scrollRef}>
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
  renderItem?: (p: { item: T, index: number }) => React.ReactElement,
  title?: React.ReactNode,
  header?: React.ReactNode,
  emptyText?: React.ReactNode,
  maxHeight?: React.CSSProperties['maxHeight'],
  maxWidth?: React.CSSProperties['maxWidth'],
  minHeight?: React.CSSProperties['minHeight'],
  titleStyle?: React.CSSProperties,
  itemContainerStyle?: React.CSSProperties,
  doneLoading?: () => boolean,
  loadMore?: (options?: LoadMoreOptions<T>) => Promise<void>,
  TitleComponent?: TitleComponentType,
  titleActionsComponent?: React.ReactNode,
  noWrap?: boolean,
  virtualization?: {
    rowHeight?: number,
    height?: number,
    width?: number | string,
    widthOffset?: number,
    virtualize?: boolean,
    hideHorizontalScroll?: boolean,
  }
  loadMoreOptions?: LoadMoreOptions<T>,
  scrollRef?: React.RefObject<FixedSizeList<T[]>>,
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
  renderItem,
  TitleComponent,
  titleActionsComponent,
  style,
  header,
  itemContainerStyle,
  virtualization,
  loadMoreOptions,
  initialScrollOffset,
  scrollRef,
} : ScrollingListProps<T> & { noParentScroll?: boolean, initialScrollOffset?: number }) => {
  const width = usePageWidth()
  const fetchRef = useRef(0)
  const titleStyleWithDefaults = { fontSize: 20, fontWeight: 'bold', marginBottom: 3, ...titleStyle }
  const rowHeight = virtualization?.rowHeight ?? 40
  const [loading, setLoading] = useState(false)

  return (
    <Grid container direction="column" 
      style={{ 
        maxWidth, 
        overflowX: maxWidth ? 'auto' : undefined, 
        ...style, 
      }}
    >
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
            <Grid item> 
              {titleActionsComponent}
            </Grid>
          </Grid>
        )
      }

      {header}
      
      <div style={{ 
        minHeight, maxHeight, overflowY: virtualization?.virtualize ? undefined : 'auto',
        ...itemContainerStyle,
      }}
        onScroll={e => {
          if (doneLoading?.() || !loadMore) return

          const atBottom = e.currentTarget.scrollHeight - e.currentTarget.scrollTop <= e.currentTarget.clientHeight + 5;
          if (!atBottom) return

          if (fetchRef.current === e.currentTarget.scrollHeight) return
          fetchRef.current = e.currentTarget.scrollHeight

          loadMore().catch(console.error)
        }}
      >
      {items.length === 0 
        ? typeof emptyText === 'string'
          ? <Typography>{emptyText}</Typography>
          : emptyText
        : virtualization?.virtualize ? (
          // keep consistent with DraggableList
            <FixedSizeList initialScrollOffset={initialScrollOffset} ref={scrollRef}
              style={{ overflowX: virtualization?.hideHorizontalScroll ? 'hidden' : undefined }}
              height={virtualization?.height || window.innerHeight - 225}
              width={
                typeof virtualization.width === 'string'
                  ? virtualization.width
                  : (virtualization?.width ?? width) - 200 - (virtualization?.widthOffset || 0)
              }
              itemCount={items.length}
              itemSize={rowHeight}
              itemData={items}
              itemKey={(index, data) => data[index].id}
              onScroll={p => {
                const tableHeight = virtualization?.height || window.innerHeight - 225

                if (p.scrollOffset, (tableHeight + p.scrollOffset) / (items.length * rowHeight) < .75) {
                  return
                }
                if (doneLoading?.() || !loadMore) return

                setLoading(true)
                loadMore(loadMoreOptions).catch(console.error).finally(() => setLoading(false))
              }}
            >
              {({ data, index, style }) => (
                <div style={style}>
                  {renderItem ? renderItem({ item: data[index], index }) : <Item key={data[index].id} item={data[index]} index={index} />}

                  {index === items.length -1 && loadMore && !doneLoading?.() &&
                    <div style={{ textAlign: 'center' }}>
                    <LoadingButton submitText="Load Older Data" submittingText="Loading..."
                      disabled={doneLoading?.()} onClick={loadMore} 
                      variant="outlined" style={{ width: 200, textAlign: 'center', marginTop: 10 }}
                    />
                    </div>
                  }
                </div>
              )}
            </FixedSizeList>
        ) : (
          items.map((item, index) => (
            renderItem ? renderItem({ item, index }) : <Item key={item.id} item={item} index={index} />
          ))
        )
      }
      {loading && <LinearProgress style={{ position: 'relative', bottom: 3, minHeight: 7 }} />}
      </div>
    </Grid>
  )
}

const getListStyle = (isDraggingOver: boolean) => ({
  // background: isDraggingOver ? "#ffffff44" : undefined,
  // padding: `${grid}px`,
  // width: '250px'
});

const grid = 2;
const defaultStyles: React.CSSProperties = {
  // border: '1px solid',
  // borderColor: "primary.main",
  // borderRadius: grid / 2,
}

const getItemStyle = (isDragging: boolean, draggableStyle?: React.CSSProperties): React.CSSProperties => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: `${grid}px`,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  backgroundColor: isDragging ? "#ffffff88" : undefined,
  
  ...defaultStyles,

  // styles we need to apply on draggables
  ...draggableStyle
});

const reorder = <T,>(list: T[], startIndex: number, endIndex: number): T[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const DRAG_ICON_WIDTH = 20
export const DraggableList = <T extends { id: string | number }>({
  title,
  titleStyle,
  items: _items,
  emptyText,
  Item,
  TitleComponent,
  titleActionsComponent,
  style,
  noWrap,
  header,
  itemContainerStyle,
  onReorder,
  virtualization,
  doneLoading,
  loadMore,
  maxWidth,
  minHeight, maxHeight,
  loadMoreOptions,
} : ScrollingListProps<T> & {
  onReorder?: (updated: { id: string, index: number }[]) => any,
}) => {
  const width = usePageWidth()
  const titleStyleWithDefaults = { fontSize: 20, fontWeight: 'bold', marginBottom: 3, ...titleStyle }
  const rowHeight = virtualization?.rowHeight ?? 40
  
  const [items, setItems] = useState(_items)
  const [updating, setUpdating] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setItems(_items)
  }, [_items])

  const Row = useMemo(() => ({ data, index, style }: { data: T[], index: number, style: React.CSSProperties }) => (
    <Draggable 
      key={data[index].id} 
      index={index}
      draggableId={data[index].id.toString()} 
      isDragDisabled={updating} 
    >
      {(provided, snapshot) => (
        <Grid container alignItems="center" wrap="nowrap"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          sx={{
            ...getItemStyle(
              snapshot.isDragging,
              provided.draggableProps.style
            ),
            // ...itemStyle,
          }}
          style={{ height: rowHeight, ...style }}
        >
          <Grid item sx={{ width: DRAG_ICON_WIDTH, height: DRAG_ICON_WIDTH, ml: '2px' }}>
            <DragIndicatorIcon fontSize={'small'} 
              color={updating ? 'inherit' : "primary"} 
            />
          </Grid>

          <Item key={data[index].id} item={data[index]} index={index} />
        </Grid>
      )}
    </Draggable>
  ), [updating, rowHeight, Item])

  const handleDragEnd = useCallback(async (result: DropResult) => {
    if (!result.destination) {
      return;
    }
    if (result.destination === result.source) return
  
    try {
      const updated = reorder(
        items,
        result.source.index,
        result.destination.index
      )
      setItems(updated)
      setUpdating(true)
      await onReorder?.(updated.map(({ id }, index) => ({ id: id.toString(), index })))
    } catch(err) {
      setItems(items) // in case of error, reset with original data
    } finally {
      setUpdating(false)
    }
  }, [items, onReorder])
 
  return (
    <Grid container direction="column" wrap={noWrap ? 'nowrap' : undefined}
      style={{ 
        maxWidth, 
        overflowX: maxWidth ? 'auto' : undefined, 
        ...style, 
      }}
    >
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
            <Grid item> 
              {titleActionsComponent}
            </Grid>
          </Grid>
        )
      }

      {header}

      <div
        style={{
          minHeight, maxHeight, // overflowY: 'auto',
          ...itemContainerStyle
        }}
      >
        {items.length === 0 
          ? typeof emptyText === 'string'
            ? <Typography>{emptyText}</Typography>
            : emptyText
          : null
        }

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="droppable"
            mode="virtual"
            renderClone={(provided, snapshot, rubric) => (
              <Grid container alignItems="center" wrap="nowrap"
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                sx={{
                  ...getItemStyle(
                    snapshot.isDragging,
                    provided.draggableProps.style
                  ),
                  // ...itemStyle,
                }}
                style={{ height: rowHeight, margin: 0 }}
              >
                <Grid item sx={{ width: DRAG_ICON_WIDTH, height: DRAG_ICON_WIDTH, ml: '2px' }}>
                  <DragIndicatorIcon fontSize={'small'} 
                    color={updating ? 'inherit' : "primary"} 
                  />
                </Grid>

                <Item 
                  key={items[rubric.source.index].id} 
                  item={items[rubric.source.index]} 
                  index={rubric.source.index} 
                />
              </Grid>
            )}
          >
            {/* keep consistent with ScrollingList  */}
            {(provided) => (
              <FixedSizeList
                style={{ overflowX: virtualization?.hideHorizontalScroll ? 'hidden' : undefined }}
                height={virtualization?.height || window.innerHeight - 225}
                width={
                  typeof virtualization?.width === 'string'
                    ? virtualization?.width
                    : (virtualization?.width ?? width) - 200 - (virtualization?.widthOffset || 0)
                }
                itemCount={items.length}
                itemSize={rowHeight}
                outerRef={provided.innerRef}
                itemData={items}
                itemKey={(index, data) => data[index].id}
                onScroll={p => {
                  const tableHeight = virtualization?.height || window.innerHeight - 225

                  if (p.scrollOffset, (tableHeight + p.scrollOffset) / (items.length * rowHeight) < .75) {
                    return
                  }
                  if (doneLoading?.() || !loadMore) return

                  setLoading(true)
                  loadMore(loadMoreOptions).finally(() => setLoading(false))
                }}
              >
                {Row}
              </FixedSizeList>
            )}
          </Droppable>
        </DragDropContext>
      {loading && <LinearProgress style={{ position: 'relative', bottom: 3, minHeight: 7 }} />}
      </div>
    </Grid>
  )
}