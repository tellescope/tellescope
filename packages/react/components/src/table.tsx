import React, { useCallback, useState, CSSProperties, JSXElementConstructor, useEffect } from "react"

import {
  Button,
  Checkbox,
  Elevated,  
  Styled,
  Paper,
  Typography,

  NavigateBeforeIcon,
  NavigateNextIcon,
} from "./mui"
import {
  LabeledIconButton,
} from "./controls"
import {  
  Flex,
  Item,
  ItemClickable,
  List,
  ScrollingList,
  WithHover,
} from "./layout"
import { LoadMoreFunctions } from "./state"

const LIGHT_GRAY = "#fafafa"
export const GRAY = "#EFEFEF"
const DARK_GRAY = "#E8E8E8"
const DARKER_GRAY = "#52575C"

const ROW_HEIGHT = 45
export interface HorizontalPadded { horizontalPadding?: number }
export interface TableTitleProps extends Styled, HorizontalPadded {
  title: React.ReactNode,
  textStyle?: CSSProperties,
  actionsComponent?: React.ReactNode,
}
export const TableTitle = ({ title, actionsComponent, style, textStyle={}, horizontalPadding } : TableTitleProps) => (
  <Flex flex={1} alignItems="center" justifyContent={"space-between"} style={{ 
    paddingLeft: horizontalPadding, paddingRight: horizontalPadding, 
    backgroundColor: LIGHT_GRAY,
    minHeight: 50,
    paddingTop: 0,
    ...style,
  }}> 
    {typeof title === 'string'
      ? (
        <Typography component="h3" style={{ 
          fontWeight: 600, 
          fontSize: 18, 
          marginRight: horizontalPadding,
          ...textStyle 
        }}>
          {title}
        </Typography>
      )
      : <Flex>{title}</Flex>
    }
    <Flex flex={1} alignItems="center" justifyContent={"flex-end"}>
      {actionsComponent}
    </Flex>
  </Flex>
)

const defaultWidthForFields = (n: number) => n <= 0 ? '100%' : `${Math.floor(100/n)}%`

const checkboxStyle: React.CSSProperties = {
  position: 'relative',
  right: '10px',
}

type Indices = { index: number, indexOfPage: number }
type Renderer <T> = (value: T, indices: Indices) => React.ReactElement | string | number
export type TableField <T> = {
  key: string | number,
  label: string,
  hidden?: boolean,
  render?: Renderer<T>,
  width?: CSSProperties['width'],
  textAlign?: CSSProperties['textAlign'],
  style?: CSSProperties,
  flex?: boolean,
}
export interface TableHeaderProps<T extends Item> extends Styled, HorizontalPadded, SelectionPropsOptional {
  fields: TableField<T>[],
  textStyle?: CSSProperties,
  fontSize?: CSSProperties['fontSize']
}
export const TableHeader = <T extends Item>({ fields, selectable, allSelected, setAllSelected, style, textStyle, horizontalPadding, fontSize=15 } : TableHeaderProps<T>) => (
  <Flex alignItems="center" style={{ 
    paddingLeft: horizontalPadding, paddingRight: horizontalPadding,
    minHeight: ROW_HEIGHT,
    backgroundColor: DARK_GRAY,
    ...style 
  }}>
    {selectable && 
      <Flex style={checkboxStyle}>
        <Checkbox  checked={allSelected} onChange={setAllSelected} />
      </Flex>
    }
    <Flex flex={1} justifyContent="space-between" wrap="nowrap">
    {fields.map(({ key, label, textAlign, width, hidden, style }) => hidden ? null : (
      <Flex key={key} flex={width !== undefined ? 0 : 1} style={{ 
        alignItems: 'center',
        justifyContent: textAlign === 'right' ? 'flex-end' : 'flex-start',
        ...style,
      }}
      >
        <Typography component="h5" style={{ 
          textAlign, fontSize,
          width: width ?? defaultWidthForFields(fields.length), 
          fontWeight: 600,
          ...textStyle 
        }}>
          {label}
        </Typography>
      </Flex>
    ))}
    </Flex>
  </Flex>
)

const ROW_DIVIDER_STYLE = `1px solid ${DARK_GRAY}` 

const get_display_value = <T,>(item: T, key: string | number, indices: Indices, render?: Renderer<T>) => {
  if (render) { return render(item, indices) }

  const value = item[key as keyof T]
  if (!(key in item)) console.warn(`Value missing for key ${key} while rendering Table without a specified render function.`)
  if (value === null || value === undefined) { return null }
  if (React.isValidElement(value)) { return value }
  if (typeof value === 'number') { return value }
  if (typeof (value as any).toString === 'function') { return (value as any).toString() }

  throw new Error(`Missing renderer in renderFields for key ${key}. The given value is not a valid React Element and does not have a toString() method.`)
}
export interface TableRowProps<T extends Item> extends Styled, HorizontalPadded, ItemClickable<T>, SelectionPropsOptional {
  item: T,
  indices: Indices,
  fields: TableHeaderProps<T>['fields']
  hoveredColor?: CSSProperties['color'],
  notHoveredColor?: CSSProperties['color'],
  hover?: boolean,
  fontSize?: CSSProperties['fontSize']
  textStyle?: CSSProperties,
}
export const TableRow = <T extends Item>({ 
  item, indices, fields, onClick, onPress, hover, 
  hoveredColor, 
  notHoveredColor, 
  horizontalPadding, 
  style,
  textStyle, 
  selectable,
  allSelected,
  selected,
  setSelected,
  fontSize=14, 
} : TableRowProps<T>) => (
  <WithHover hoveredColor={hoveredColor ?? GRAY} notHoveredColor={notHoveredColor} disabled={!hover} flex>
    <Flex flex={1} alignItems="center"
      onClick={() => (onClick ?? onPress)?.(item)}
      style={{ 
        paddingLeft: horizontalPadding, paddingRight: horizontalPadding, 
        minHeight: ROW_HEIGHT,
        ...style,
        backgroundColor: undefined, // leave in parent component
      }}
    >
      {selectable && setSelected &&
        <Flex style={checkboxStyle}>
        <Checkbox disabled={allSelected} 
          checked={allSelected || selected?.includes(item.id.toString())}
          onChange={() => {
            setSelected(
              selected?.includes(item.id.toString())
                ? selected.filter(s => s !== item.id.toString())
                : [...(selected ?? []), item.id.toString()]
            )
          }}
        />
        </Flex>
      }
      <Flex flex={1} justifyContent="space-between" wrap="nowrap">
      {fields.map(({ key, width, textAlign='left', render, hidden, flex, style }) => hidden ? null : (
        <Flex key={key} flex={width !== undefined ? 0 : 1} style={{ 
          alignItems: 'center',
          justifyContent: textAlign === 'right' ? 'flex-end' : 'flex-start',
          ...style,
        }}>
          <Typography component="div" style={{ 
            textAlign, fontSize,
            width: width ?? defaultWidthForFields(fields.length), 
            // display: flex ? 'flex' : undefined,
            // flex: flex ? 1 : undefined,
            color: DARKER_GRAY,
            ...textStyle
          }}>
            {get_display_value(item, key, indices, render)}
          </Typography>
        </Flex>
      ))}
      </Flex>
    </Flex>
  </WithHover>
)

export interface PaginationOptions {
  paginated?: boolean; // defaults to true
  pageSize?: number;
  initialPage?: number;
}
export interface PaginationProps<T> extends PaginationOptions {
  items: T[];
}
const DEFAULT_PAGE_SIZE = 10
export const usePagination = <T,>({ items, pageSize=DEFAULT_PAGE_SIZE, initialPage }: PaginationProps<T>) => {
  if (pageSize < 1) throw new Error("pageSize must be greater than 0")
  if (initialPage && initialPage < 0) throw new Error("initialPage must be a positive number")

  const count = items.length
  const numPages = Math.ceil(count / pageSize)

  const [selectedPage, setSelectedPage] = useState(initialPage ?? 0)

  const goToPage = useCallback((page: number) => {
    setSelectedPage(s => (s !== page && page <= numPages && page >= 0) ? page : s)
  }, [numPages])
  const goToNext = useCallback(() => {
    setSelectedPage(s => s <= numPages ? s + 1 : s)
  }, [numPages])
  const goToPrevious = useCallback(() => {
    setSelectedPage(s => s > 0 ? s - 1 : s)
  }, [])
  const mapSelectedItems = useCallback(<R,>(apply: (item: T, info: { index: number, isLast: boolean }) => R) => {
    const mapped: R[] = []
    for (let i=selectedPage * pageSize; i < (selectedPage + 1) * pageSize && i < count; i++) {
      mapped.push(apply(items[i], { index: i, isLast: i === count -1 || i === (selectedPage + 1) * pageSize - 1 }))
    }
    return mapped
  }, [items, count, selectedPage, numPages, pageSize])

  useEffect(() => {
    if (selectedPage >= numPages) {
      goToPage(0)
    }
  }, [goToPage, selectedPage, numPages])

  return {
    selectedPage,
    numPages,
    goToNext,
    goToPrevious,
    goToPage,
    mapSelectedItems,
    previousDisabled: selectedPage === 0,
    nextDisabled: selectedPage === numPages - 1
  }
}

export interface TableFooterProps <T> extends Styled, HorizontalPadded, Partial<LoadMoreFunctions<T>>, ReturnType<typeof usePagination> {}
export const TableFooter = <T,>({ horizontalPadding, style, previousDisabled, nextDisabled, selectedPage, numPages, goToNext, goToPrevious } : TableFooterProps<T>) => {
  return (
    <Flex flex={1} alignItems="center"
      style={{ 
        paddingLeft: horizontalPadding, paddingRight: horizontalPadding, 
        borderTop: BORDER_STYLE,
        ...style,
      }}
    >
      {numPages > 1 && 
        <>
        <LabeledIconButton Icon={NavigateBeforeIcon} label="Previous" placement="bottom" color="primary"
          onClick={goToPrevious} disabled={previousDisabled} 
        />
        <LabeledIconButton Icon={NavigateNextIcon} label="Next" placement="bottom" color="primary"
          onClick={goToNext} disabled={nextDisabled}
        />
        </>
      }
      <Typography style={{ fontSize: 12, marginLeft: 'auto' }}>
        Page {selectedPage + 1} of {numPages}
      </Typography>
    </Flex>
  )
}

// returns diaply numbers, not index
const resolve_middle_page_numbers = (selectedPage: number, numPages: number): [undefined | number, undefined | number, undefined | number] => {
  if (numPages <= 2) return [undefined, undefined, undefined]
  if (numPages === 3) return [undefined, 2, undefined]
  if (numPages === 4) return [2, 3, undefined]

  if (selectedPage <= 2) return [2, 3, 4]
  if (selectedPage >= numPages - 2) return [numPages - 3, numPages - 2, numPages - 1]

  return [selectedPage, selectedPage + 1, selectedPage + 2]
}

const FOOTER_BUTTON_SIZE = 30
export const TableFooterNumbered = <T,>({ horizontalPadding, loadMore, doneLoading, style, previousDisabled, nextDisabled, selectedPage, numPages, goToNext, goToPrevious, goToPage } : TableFooterProps<T>) => {
  const [middleLeft, middle, middleRight] = resolve_middle_page_numbers(selectedPage, numPages)

  const buttonProps = { 
    color: "primary" as "primary", 
    variant: "contained" as "contained", 
    style: { 
      minHeight: FOOTER_BUTTON_SIZE, 
      height: FOOTER_BUTTON_SIZE, 
      minWidth: FOOTER_BUTTON_SIZE, 
      width: FOOTER_BUTTON_SIZE, 
      marginTop: 3,
      marginBottom: 3,
      marginRight: 1,
    } 
  }

  useEffect(() => {
    if (!(loadMore && doneLoading)) return 
    if (doneLoading()) return
    if (!nextDisabled) return // return if not on last page

    loadMore()
  }, [loadMore, nextDisabled, doneLoading])


  return (
    <Flex flex={1} alignItems="center"
      style={{ 
        paddingLeft: horizontalPadding, paddingRight: horizontalPadding, 
        borderTop: BORDER_STYLE,
        ...style,
      }}
    >
      {((doneLoading && !doneLoading?.()) || numPages > 1) && 
        <>
        <Button disabled={previousDisabled} {...buttonProps} onClick={goToPrevious}>
          <NavigateBeforeIcon/>
        </Button>
        <Button disabled={previousDisabled} { ...buttonProps } onClick={() => goToPage(0)}>
          1
        </Button>

        {/* index is 1 below display number */}
        {middleLeft !== undefined &&
          <Button disabled={selectedPage === middleLeft - 1} {...buttonProps} onClick={() => goToPage(middleLeft - 1)}>
            {middleLeft}
          </Button> 
        }
        {middle !== undefined &&
          <Button disabled={selectedPage === middle - 1} {...buttonProps} onClick={() => goToPage(middle - 1)}>
            {middle}
          </Button> 
        }
        {middleRight !== undefined &&
          <Button disabled={selectedPage === middleRight - 1} {...buttonProps} onClick={() => goToPage(middleRight - 1)}> 
            {middleRight}
          </Button> 
        }

        {numPages !== 1 &&
          <Button disabled={nextDisabled} {...buttonProps} onClick={() => goToPage(numPages - 1)}>
            {numPages}
          </Button>
        }

        <Button disabled={nextDisabled} {...buttonProps} onClick={goToNext}>
          <NavigateNextIcon/>
        </Button>


        <Typography style={{ fontSize: 12, marginLeft: 'auto' }}>
          Page {selectedPage + 1} of {numPages}
        </Typography>
        </>
      }
    </Flex>
  )
}

export interface SelectionProps {
  selectable: boolean,
  selected: string[],
  setSelected: (s: string[]) => void,
  allSelected: boolean,
  setAllSelected: (b: boolean) => void,
}
export type SelectionPropsOptional = Partial<SelectionProps>

const BORDER_STYLE = `1px solid ${GRAY}`
export type WithTitle = {
  title?: React.ReactNode; 
  TitleComponent?: JSXElementConstructor<TableTitleProps>;
} 
export type WithHeader<T extends Item> = {
  fields?: TableHeaderProps<T>['fields']; 
  HeaderComponent?: JSXElementConstructor<TableHeaderProps<T>>;
} 
export type WithRows <T extends Item> = {
  fields?: TableRowProps<T>['fields']; 
  hoveredColor?: TableRowProps<T>['hoveredColor']; 
  RowComponent?: JSXElementConstructor<TableRowProps<T>>;
} 
export type WithFooter <T> = {
  paginated?: boolean;
  FooterComponent?: JSXElementConstructor<TableFooterProps<T>>;
}
export interface TableProps<T extends Item> extends WithTitle, WithHeader<T>, WithFooter<T>, WithRows<T>, 
  HorizontalPadded, Elevated, ItemClickable<T>, Partial<LoadMoreFunctions<T>>, SelectionPropsOptional
{
  items: T[],
  titleStyle?: React.CSSProperties,
  titleActionsComponent?: React.ReactNode,
  noPaper?: boolean,
  emptyText?: string,
  emptyComponent?: React.ReactElement,
  fields: TableHeaderProps<T>['fields']; // make fields required
  pageOptions?: PaginationOptions,
  paddingHorizontal?: number,
  headerFontSize?: CSSProperties['fontSize'],
  rowFontSize?: CSSProperties['fontSize'],
  footerStyle?: 'numbered' | 'prev-next',
  hover?: boolean,
  maxRowsHeight?: React.CSSProperties['maxHeight'],
  maxWidth?: React.CSSProperties['maxWidth'],
  noWrap?: boolean,
}
export const Table = <T extends Item>({
  items,
  emptyText,
  emptyComponent,
  noPaper,
  pageOptions={ paginated: true },
  style={},
  horizontalPadding=20,
  elevation=3,
  headerFontSize,
  rowFontSize,
  onClick,
  onPress,
  loadMore,
  doneLoading,

  title,
  titleStyle,
  titleActionsComponent,
  TitleComponent=TableTitle,
  fields,
  HeaderComponent=TableHeader,
  hover,
  hoveredColor,
  RowComponent=TableRow,
  footerStyle='numbered',
  FooterComponent=footerStyle === 'numbered' ? TableFooterNumbered : TableFooter, 

  selectable,
  selected,
  setSelected,
  allSelected,
  setAllSelected,

  noWrap,
  maxWidth,
  maxRowsHeight,
}: TableProps<T> & Styled) => {
  const paginated = pageOptions.paginated !== false // default to true
  const { ...paginationProps } = usePagination({ items, ...pageOptions, })
  RowComponent = RowComponent ?? TableRow // don't allow to be undefined 

  const table = (
    <Flex column>
      {title && TitleComponent && (
        <TitleComponent title={title} actionsComponent={titleActionsComponent} 
          horizontalPadding={noPaper ? 0 : horizontalPadding}
          style={{ maxWidth, ...titleStyle }} 
        />
      )} 
      <ScrollingList items={paginationProps.mapSelectedItems(i => i)} 
        noWrap={noWrap}
        maxHeight={maxRowsHeight} maxWidth={maxWidth}

        header={fields && HeaderComponent && fields.length > 0 && items.length > 0 && 
          <HeaderComponent selectable={selectable} allSelected={allSelected} setAllSelected={setAllSelected}
            fields={fields} horizontalPadding={horizontalPadding} fontSize={headerFontSize}
            style={{
              flexWrap: noWrap ? 'nowrap' : undefined,
            }}
          />
        }

        // handle load when scroll to bottom, when table not paginated
        doneLoading={!pageOptions.paginated ? doneLoading : undefined} 
        loadMore={!pageOptions.paginated ? loadMore : undefined}

        // renderProps={{ horizontalPadding }}
        emptyText={emptyComponent ?? (
          emptyText 
            ? <Typography style={{ padding: horizontalPadding }}>
                {emptyText}
              </Typography> 
            : undefined
          )
        }
        Item={({ item, index }) => ( // index within this list, e.g. a single page
          <RowComponent
            selectable={selectable} selected={selected} setSelected={setSelected} allSelected={allSelected}
            key={item.id} item={item} 
            indices={{ 
              // selectedPage indexed by zero
              index: index + paginationProps.selectedPage * (pageOptions.pageSize ?? DEFAULT_PAGE_SIZE), 
              indexOfPage: index 
            }}
            fields={fields} 
            hover={hover}
            hoveredColor={hoveredColor}
            fontSize={rowFontSize} 
            horizontalPadding={horizontalPadding}
            style={{
              flexWrap: noWrap ? 'nowrap' : undefined,
              borderBottom: (
                (index < items.length - 1 || !paginated) && 
                (pageOptions.pageSize === undefined || index < pageOptions.pageSize - 1)) 
                  ? BORDER_STYLE 
                  : undefined,
            }}
            onClick={onClick} onPress={onPress} 
          />
        )
      } />

    {paginated && FooterComponent && items.length > 0 && // avoid displaying footer / unnecessary border when no items
      <FooterComponent doneLoading={doneLoading} loadMore={loadMore} {...paginationProps } {...pageOptions} horizontalPadding={horizontalPadding}/>
    }
    </Flex>
  )

  if (noPaper) return table
  return (
    <Paper style={style} elevation={elevation}>
      {table}
    </Paper>
  )
}

