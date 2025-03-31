import React, { useCallback, useState, CSSProperties, JSXElementConstructor, useEffect, useMemo } from "react"

import {
  Button,
  Checkbox,
  Elevated,  
  Styled,
  Paper,
  Typography,

  NavigateBeforeIcon,
  NavigateNextIcon,
  SortDescendingIcon,
  SortAscendingIcon,
  SortInactiveIcon,
  FilterIcon,
  FilterActiveIcon,
  Modal,
  TextField,
} from "./mui"
import {
  LabeledIconButton,
} from "./controls"
import {  
  DraggableList,
  Flex,
  Item,
  ItemClickable,
  ScrollingList,
  ScrollingListProps,
  WithHover,
} from "./layout"
import { LoadMoreFunctions, LoadMoreOptions } from "./state"
import { read_local_storage, update_local_storage } from "@tellescope/utilities"

import Draggable from 'react-draggable'; // The default
import { PRIMARY_HEX } from "@tellescope/constants"

import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import { Autocomplete } from "@mui/material"
import { ListQueryQualifier, SortingField } from "@tellescope/types-models"
import { LoadingButton } from "./forms"
// import DragHandleIcon from '@mui/icons-material/DragHandle';

const LIGHT_GRAY = "#fafafa"
export const GRAY = "#EFEFEF"
const DARK_GRAY = "#E8E8E8"
const DARKER_GRAY = "#52575C"

const ROW_HEIGHT = 45
export interface HorizontalPadded { horizontalPadding?: number }
export interface TableTitleProps extends Styled, HorizontalPadded {
  title: React.ReactNode,
  description?: string,
  textStyle?: CSSProperties,
  actionsComponent?: React.ReactNode,
}
export const TableTitle = ({ title, description, actionsComponent, style, textStyle={}, horizontalPadding } : TableTitleProps) => (
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
    {/* {description && 
      <Typography style={{ 
        fontSize: 14, 
        marginRight: horizontalPadding,
        minWidth: 100,
        ...textStyle 
      }}>
        {description}
      </Typography>
    } */}
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

type LocalFilter = {
  query: string,
  values?: string[],
  valuesQualifier?: ListQueryQualifier,
}

// export type SortType = 'infer'
export type Sorting = {
  field: string,
  // type: SortType,
  direction: 'ascending' | 'descending'
}
type Indices = { index: number, indexOfPage: number }
type RenderOptions = { adjustedWidth?: number }
type Renderer <T> = (value: T, indices: Indices, options: RenderOptions) => React.ReactElement | string | number
export type TableField <T> = {
  key: string | number,
  label: string,
  hidden?: boolean,
  render?: Renderer<T>,
  getExportData?: (v: T) => string | number,
  width?: CSSProperties['width'],
  // @deprecated no longer used
  titleWidth?: CSSProperties['width'],
  textAlign?: CSSProperties['textAlign'],
  style?: CSSProperties,
  flex?: boolean,
  // sortType?: SortType,
  getSortValue?: (v: T) => string | number,
  getFilterValue?: (v: T) => string | (string[]),
  filterType?: 'multi',
  filterSuggestions?: string[],
  filterIsActive?: boolean,
  filterComponent?: React.ReactNode,
  allowWidthAdjustment?: boolean,
  columnResizeZIndex?: number,
}
export interface TableHeaderProps<T extends Item> extends Styled, HorizontalPadded, SelectionPropsOptional {
  fields: TableField<T>[],
  textStyle?: CSSProperties,
  fontSize?: CSSProperties['fontSize']
  sorting: Sorting[],
  setSorting: React.Dispatch<React.SetStateAction<Sorting[]>>,
  memoryId?: string,
  widthOffsets: Record<string, number>,
  setWidthOffsets: React.Dispatch<React.SetStateAction<Record<string, number>>>,
  onExport?: () => void,
  localFilters: LocalFilter[],
  setLocalFilters: React.Dispatch<React.SetStateAction<LocalFilter[]>>,
  filterSuggestions: Record<string, string[]>,
  minColumnWidth?: number,
  columnResizeZIndex?: number,
  headerHeight?: number,
}
export const TableHeader = <T extends Item>({ 
  fields, 
  sorting, 
  setSorting, 
  selectable, 
  allSelected, 
  setAllSelected, 
  style, 
  textStyle, 
  horizontalPadding,
  fontSize=15,
  memoryId,
  widthOffsets,
  setWidthOffsets,
  onExport,
  localFilters,
  setLocalFilters,
  filterSuggestions,
  minColumnWidth=75,
  columnResizeZIndex=1000,
  headerHeight=ROW_HEIGHT,
} : TableHeaderProps<T>) => { 
  const [openFilter, setOpenFilter] = useState(-1)
  const [startX, setStartX] = useState(0)
  const [dragPosition, setDragPosition] = useState<{x: number, y: number}>()

  return (
    <>
    <Modal open={openFilter !== -1} setOpen={o => !o && setOpenFilter(-1)} >
    {fields[openFilter]?.filterComponent 
      || (
        <Flex flex={1} justifyContent="center">
        {fields[openFilter]?.filterType === 'multi'
          ? (
            <>
            <Autocomplete disableClearable disablePortal size={'small'} options={['One Of', 'All Of']} sx={{ width: 140, mr: 0.5 }}
              onChange={(e, value) => {
                setLocalFilters(fs => fs.map((f, i) => i === openFilter ? { ...f, valuesQualifier: value === 'All Of' ? 'All Of' : 'One Of' } : f))
              }}
              value={localFilters[openFilter]?.valuesQualifier === 'All Of' ? 'All Of' : 'One Of'}
              renderInput={(params) => 
                <TextField {...params} fullWidth autoFocus label={"Qualifier"} size={'small'}
                  value={localFilters[openFilter]?.valuesQualifier === 'All Of' ? 'All Of' : 'One Of'}
                />
              }
            />
            
            <Autocomplete size={'small'}
              disablePortal multiple
              options={(filterSuggestions?.[fields[openFilter]?.key?.toString()] || []).sort()}
              freeSolo autoSelect // allow any input and select it on change
              onChange={(e, values=[]) => {
                setLocalFilters(fs => fs.map((f, i) => i === openFilter ? { query: '', values } : f))
              }}
              value={localFilters[openFilter]?.values ?? []}
              renderInput={(params) => 
                <TextField {...params} autoFocus label={"Filter by"} size={'small'} 
                  style={{ width: 400 }}
                  value={localFilters[openFilter]?.query ?? ''}
                  // onKeyUp={e => e.which === 13 && onEnterPress?.()}
                />
              }
            />
            </>
          ) : (
            <Autocomplete size={'small'}
              disablePortal
              options={(filterSuggestions?.[fields[openFilter]?.key?.toString()] || []).sort()}
              freeSolo autoSelect // allow any input and select it on change
              onChange={(e, _query) => {
                const query = _query || ''

                setLocalFilters(fs => fs.map((f, i) => i === openFilter ? { query } : f))
              }}
              value={localFilters[openFilter]?.query ?? ''}
              renderInput={(params) => 
                <TextField {...params} autoFocus label={"Filter"} size={'small'} 
                  style={{ width: 400 }}
                  value={localFilters[openFilter]?.query ?? ''}
                  // onKeyUp={e => e.which === 13 && onEnterPress?.()}
                />
              }
            />
          )
        }
        </Flex>  
      )}
    </Modal>

    <Flex alignItems="center" style={{ 
      paddingLeft: horizontalPadding, paddingRight: horizontalPadding,
      minHeight: headerHeight,
      backgroundColor: DARK_GRAY,
      ...style 
    }}>
      {selectable && 
        <Flex style={checkboxStyle}>
          {setAllSelected ? <Checkbox checked={allSelected} onChange={setAllSelected} /> : <Flex style={{ width: 42 }} />}
        </Flex>
      }
      <Flex flex={1} wrap="nowrap">
      {fields.map(({ key, label, textAlign, width, getSortValue, hidden, style, filterIsActive, filterComponent, allowWidthAdjustment, getFilterValue }, i) => {
        if (hidden) return null

        const sort = sorting.find(s => s.field === label)

        return (
          <Flex key={key} wrap="nowrap" flex={width !== undefined ? 0 : 1} style={{ 
            alignItems: 'center',
            marginLeft: i === fields.length - 1 && textAlign === 'right' ? 'auto' : undefined,
            justifyContent: textAlign === 'right' ? 'flex-end' : 'flex-start',
            ...style,
          }}
          >
            <Flex wrap="nowrap" style={{ 
              textAlign, 
              justifyContent: textAlign === 'right' ? 'flex-end' : 'flex-start',
              width: (
                typeof width === 'number'
                  ? Math.max(minColumnWidth, width + (widthOffsets[key] || 0))
                  : (width ?? defaultWidthForFields(fields.length))
              ), 
              alignItems: 'center',
            }}>
              <Typography component="h5" noWrap style={{ 
                fontWeight: 600,
                fontSize,
                // minWidth: titleWidth,
                ...textStyle 
              }}>
                {label}
              </Typography>

              <Flex wrap="nowrap">
                {getSortValue && (
                  sort?.direction === 'ascending'
                    ? <LabeledIconButton size={22} Icon={SortAscendingIcon} color="primary" label="Click to Sort Descending" 
                        onClick={() => setSorting(
                          sorting => sorting.map(s => s.field !== label ? s : {
                            ...s,
                            direction: 'descending' 
                          })
                        )}
                      />
                : sort?.direction === 'descending'
                    ? <LabeledIconButton size={22} Icon={SortDescendingIcon} color="primary" label="Click to Disable Sort" 
                        onClick={() => setSorting(
                          sorting => sorting.filter(s => s.field !== label)
                        )}
                      />
                  : <LabeledIconButton size={22} Icon={SortInactiveIcon} color="inherit" label="Click to Sort Ascending" 
                        onClick={() => setSorting(
                          sorting => [...sorting, {
                            field: label,
                            direction: 'ascending' 
                          }]
                        )}
                    />
                )}
                {filterComponent && (
                  <LabeledIconButton size={22} offsetX={getSortValue ? -7 : -4}
                    label="Filter" 
                    disabled={openFilter !== -1}
                    color={filterIsActive ? "primary" : 'inherit'}
                    Icon={filterIsActive ? FilterActiveIcon : FilterIcon}
                    onClick={() => setOpenFilter(i)}
                  />
                )}

                {!filterComponent && getFilterValue && 
                  <LabeledIconButton size={22} offsetX={getSortValue ? -7 : -4}
                    label="Filter" 
                    disabled={openFilter !== -1}
                    color={(localFilters[i]?.query || !!localFilters?.[i]?.values?.length) ? "primary" : 'inherit'}
                    Icon={(localFilters[i]?.query || !!localFilters?.[i]?.values?.length) ? FilterActiveIcon : FilterIcon}
                    onClick={() => setOpenFilter(i)}
                  />
                }
              </Flex>
            </Flex>


            {allowWidthAdjustment && memoryId &&
              <Flex flex={1} justifyContent="flex-end">
              <Draggable axis="x" position={dragPosition}
                onStart={(e, data) => {
                  setDragPosition(undefined)
                  setStartX(data.lastX - (widthOffsets[key] || 0))
                }}
                onStop={(e, data) => {
                  setWidthOffsets(o => {
                    const increment = Math.max(
                      // 0,
                      (data.lastX - startX) / 1
                    )

                    update_local_storage(`${memoryId}${key}width`, increment.toString())

                    return { ...o, [key]: increment }
                  })

                  setDragPosition({ x: 0, y: 0 }) // snaps back to appropriate spot
                }}
              >
                <div style={{ 
                  width: '3px',
                  height: '30px', 
                  backgroundColor: '#22222266', 
                  cursor: 'col-resize', 
                  zIndex: columnResizeZIndex,
                  position: 'relative', right: '6px',
                }} />
              </Draggable>
              </Flex>
            }
          </Flex>
        )
      })}
      </Flex>

      {onExport && 
        <Flex >
          <LabeledIconButton Icon={CloudDownloadIcon} label="Export Data" onClick={onExport} />
        </Flex>
      }
    </Flex>
    </>
  )
}

const ROW_DIVIDER_STYLE = `1px solid ${DARK_GRAY}` 

const get_display_value = <T extends object>(item: T, key: string | number, indices: Indices, render?: Renderer<T>, options?: RenderOptions) => {
  if (render) { return render(item, indices, options ?? {}) }

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
  widthOffsets: Record<string, number>,
  minColumnWidth?: number,
  rowHeight?: number,
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
  widthOffsets,
  allowUnselectItemsAfterSelectAll,
  setAllSelected,
  minColumnWidth=75,
  rowHeight=ROW_HEIGHT,
} : TableRowProps<T>) => (
  <WithHover hoveredColor={hoveredColor ?? GRAY} notHoveredColor={notHoveredColor} disabled={!hover} flex>
    <Flex flex={1} alignItems="center"
      onClick={() => (onClick ?? onPress)?.(item)}
      style={{ 
        paddingLeft: horizontalPadding, paddingRight: horizontalPadding, 
        minHeight: rowHeight,
        ...style,
        backgroundColor: undefined, // leave in parent component
      }}
    >
      {selectable && setSelected &&
        <Flex style={checkboxStyle}>
        <Checkbox disabled={allSelected && !allowUnselectItemsAfterSelectAll} 
          checked={allSelected || selected?.includes(item.id.toString())}
          onChange={() => {
            // if allowUnselectItemsAfterSelectAll, checking box should disable all selected
            if (allSelected) {
              setAllSelected?.(false) 
            }

            setSelected(
              selected?.includes(item.id.toString())
                ? selected.filter(s => s !== item.id.toString())
                : [...(selected ?? []), item.id.toString()]
            )
          }}
        />
        </Flex>
      }
      <Flex flex={1} wrap="nowrap">
      {fields.map(({ key, width, textAlign='left', render, hidden, style }, i) => hidden ? null : (
        <Flex key={key} flex={width !== undefined ? 0 : 1} style={{ 
          alignItems: 'center',
          marginLeft: i === fields.length - 1 && textAlign === 'right' ? 'auto' : undefined,
          justifyContent: textAlign === 'right' ? 'flex-end' : 'flex-start',
          ...style,
        }}>
          <Typography component="div" style={{ 
            textAlign, fontSize,
            width: (
              typeof width === 'number'
                ? Math.max(minColumnWidth, width + (widthOffsets[key] || 0))
                : (width ?? defaultWidthForFields(fields.length))
            ), 
            // display: flex ? 'flex' : undefined,
            // flex: flex ? 1 : undefined,
            color: DARKER_GRAY,
            ...textStyle
          }}>
            {get_display_value(item, key, indices, render, {
              adjustedWidth: (
                typeof width === 'number'
                  ? Math.max(minColumnWidth, width + (widthOffsets[key] || 0))
                  : undefined
              )
            })}
          </Typography>
        </Flex>
      ))}
      </Flex>
    </Flex>
  </WithHover>
)

export interface PaginationOptions<T> {
  paginated?: boolean; // defaults to true
  pageSize?: number;
  initialPage?: number;
  pageMemoryId?: string,
}
export interface PaginationProps<T> extends PaginationOptions<T> {
  items: T[];
  applySorting?: (items: T[]) => T[], // assume sorts in-place
}
const DEFAULT_PAGE_SIZE = 10
export const usePagination = <T,>({ paginated=true, items, pageMemoryId, pageSize=DEFAULT_PAGE_SIZE, applySorting, initialPage }: PaginationProps<T>) => {
  if (pageSize < 1) throw new Error("pageSize must be greater than 0")
  if (initialPage && initialPage < 0) throw new Error("initialPage must be a positive number")

  const count = items.length
  const numPages = Math.ceil(count / pageSize)

  const fromMemory = pageMemoryId ? parseInt(read_local_storage(pageMemoryId) ?? '') : undefined

  const [selectedPage, setSelectedPage] = useState(
    initialPage ?? (
      typeof fromMemory === 'number' && !isNaN(fromMemory)
        ? fromMemory
        : 0
    )
  )

  useEffect(() => {
    if (!pageMemoryId) return

    update_local_storage(pageMemoryId, selectedPage.toString())
  }, [pageMemoryId, selectedPage])

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
    const sorted = applySorting ? applySorting([...items]) : items // don't need to deep copy if not sorting in place
    if (!paginated) return sorted

    const mapped: R[] = []
    for (let i=selectedPage * pageSize; i < (selectedPage + 1) * pageSize && i < count; i++) {
      mapped.push(apply(sorted[i], { index: i, isLast: i === count -1 || i === (selectedPage + 1) * pageSize - 1 }))
    }
    return mapped
  }, [items, applySorting, count, selectedPage, numPages, pageSize])

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

export interface TableFooterProps <T> extends Styled, HorizontalPadded, Partial<LoadMoreFunctions<T>>, ReturnType<typeof usePagination> {
  loadMoreOptions?: LoadMoreOptions<T>,
}
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
export const TableFooterNumbered = <T,>({ horizontalPadding, loadMore, loadMoreOptions, doneLoading, style, previousDisabled, nextDisabled, selectedPage, numPages, goToNext, goToPrevious, goToPage } : TableFooterProps<T>) => {
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

    loadMore(loadMoreOptions)
  }, [loadMore, nextDisabled, doneLoading, loadMoreOptions])


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
  allowUnselectItemsAfterSelectAll: boolean,
}
export type SelectionPropsOptional = Partial<SelectionProps>

const BORDER_STYLE = `1px solid ${GRAY}`
export type WithTitle = {
  title?: React.ReactNode; 
  TitleComponent?: JSXElementConstructor<TableTitleProps>;
  renderTitleComponent?: (p: TableTitleProps) => React.ReactNode;
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
  // description?: string,
  titleActionsComponent?: React.ReactNode,
  titleComponentHeight?: number,
  noPaper?: boolean,
  emptyText?: string,
  emptyComponent?: React.ReactElement,
  fields: TableHeaderProps<T>['fields']; // make fields required
  pageOptions?: PaginationOptions<T>,
  paddingHorizontal?: number,
  headerFontSize?: CSSProperties['fontSize'],
  rowFontSize?: CSSProperties['fontSize'],
  footerStyle?: 'numbered' | 'prev-next',
  hover?: boolean,
  maxRowsHeight?: React.CSSProperties['maxHeight'],
  maxWidth?: React.CSSProperties['maxWidth'],
  noWrap?: boolean,
  memoryId?: string,
  onReorder?: (updated: { id: string, index: number }[]) => void,
  // onClearFilter?: () => void,
  filterCounts?: {
    filtered: number,
    total: number,
  }
  virtualization?: ScrollingListProps<T>['virtualization'],
  onExport?: (v: { data: (string | number)[][], labels: string[] }) => void,
  sort?: SortingField[],
  loadMoreOptions?: LoadMoreOptions<T>,
  refreshFilterSuggestionsKey?: number,
  minColumnWidth?: number,
  columnResizeZIndex?: number,
  rowHeight?: number,
  headerHeight?: number,
}
export const Table = <T extends Item>({
  items,
  emptyText,
  titleComponentHeight,
  emptyComponent,
  noPaper,
  pageOptions={ paginated: true },
  style={},
  horizontalPadding=20,
  elevation=5,
  headerFontSize,
  rowFontSize,
  onClick,
  onPress,
  loadMore,
  doneLoading,
  loadMoreOptions,
  // onClearFilter,
  filterCounts: _filterCounts,

  title,
  titleStyle,
  titleActionsComponent,
  // description,
  TitleComponent=TableTitle,
  renderTitleComponent,
  fields,
  HeaderComponent=TableHeader,
  headerHeight,
  hover,
  hoveredColor,
  RowComponent=TableRow,
  footerStyle='numbered',
  FooterComponent=footerStyle === 'numbered' ? TableFooterNumbered : TableFooter, 
  rowHeight,

  selectable,
  selected,
  setSelected,
  allSelected,
  setAllSelected,
  allowUnselectItemsAfterSelectAll,

  noWrap,
  maxWidth,
  maxRowsHeight,
  memoryId,

  paginated: _paginated,
  onReorder,
  virtualization,
  onExport,
  
  sort,
  refreshFilterSuggestionsKey,
  minColumnWidth,
  columnResizeZIndex,
}: TableProps<T> & Styled) => {
  const sortingStorageKey = (memoryId ?? '') + 'sorting'
  const cachedSortString = read_local_storage(sortingStorageKey)

  const localFilterStorageKey = (memoryId ?? '') + 'localfilter'
  const cachedLocalFilterString = read_local_storage(localFilterStorageKey)

  let loadedFilter: LocalFilter[] = [];
  try {
    loadedFilter = JSON.parse(cachedLocalFilterString)
  } catch(err) {}

  const keyString = fields.map(f => f.key).join('')
  const [localFilters, setLocalFilters] = useState<LocalFilter[]>(
    fields.map((_, i) => ({ 
      query: loadedFilter[i]?.query || '',
      values: loadedFilter[i]?.values || [],
    }))
  )

  // keep cached in local storage
  useEffect(() => update_local_storage(localFilterStorageKey, JSON.stringify(localFilters)), [localFilterStorageKey, localFilters])

  // reset when changing view
  useEffect(() => {
    const updated = (
      fields.map((_, i) => ({ 
        query: loadedFilter[i]?.query || '',
        values: loadedFilter[i]?.values || [],
      }))
    ) 
    setLocalFilters(updated)
  }, [keyString])


  const [widthOffsets, setWidthOffsets] = useState<Record<string, number>>({})
  if (memoryId) {
    for (const { key } of fields) {
      widthOffsets[key] = (
        parseInt(read_local_storage(`${memoryId ?? ''}${key}width`)) || 0
      )
    }
  }
  
  let loadedSorting;
  try {
    loadedSorting = JSON.parse(cachedSortString)
  } catch(err) {}

  const [sorting, setSorting] = useState<Sorting[]>(
    Array.isArray(loadedSorting)
      ? loadedSorting
      : []
  )

  useEffect(() => {
    if (!memoryId) return
    
    update_local_storage(sortingStorageKey, JSON.stringify(sorting))
  }, [sorting, memoryId])

  // sorts in place
  const applySorting = useCallback((items: T[]) => {
    if (items.find(i => typeof i.index === 'number')) {
      items.sort((item1, item2) => (
        // default to -1 so that new elements without index appear at the start
        (item1.index ?? -1) - (item2.index ?? -1)
      ))
    }

    for (const s of (sort || [])) {
      items.sort((itemA, itemB) => {
        try {
          const field = fields.find(f => f.label === s.field)
          const a = itemA[s.field as keyof typeof itemA] || field?.getSortValue?.(itemA)
          const b = itemB[s.field as keyof typeof itemA] || field?.getSortValue?.(itemB)

          const comparison = (
            (s.type === 'number' && typeof a === 'number' && typeof b === 'number')
              ? a - b
          : (s.type === 'string' && typeof a === 'string' && typeof b === 'string') 
              ? a.localeCompare(b)
          : (
                s.type === 'date' 
              && (typeof a === 'string' || typeof a === 'number') 
              && (typeof b === 'string' || typeof b === 'number') 
            )
              ? new Date(a).getTime() - new Date(b).getTime()
              : 0
          )

          return comparison * (s.ascending ? 1 : -1)
        } catch(err) {
          return 0
        }
      })
    }

    for (const s of sorting) {
      items.sort((itemA, itemB) => {
        const field = fields.find(f => f.label === s.field)
        if (!field?.getSortValue) return 0

        const a = field.getSortValue(itemA);
        const b = field.getSortValue(itemB);

        const comparison = (
          (typeof a === 'number' && typeof b === 'number')
            ? a - b
        : (typeof a === 'string' && typeof b === 'string') 
            ? a.localeCompare(b)
            : 0
        );

        return comparison * (s.direction === 'descending' ? -1 : 1)
      })
    }
    return items
  }, [sorting, fields, sort])

  const paginated = _paginated ?? pageOptions.paginated !== false // default to true
  const { ...paginationProps } = usePagination({ 
    items, ...pageOptions,
    applySorting: (sort?.length || sorting.length || onReorder) ? applySorting : undefined // don't sort when sorting is empty, way more efficient with time/memory
  })
  RowComponent = RowComponent ?? TableRow // don't allow to be undefined 

  const sorted = useMemo(() => paginationProps.mapSelectedItems(i => i), [paginationProps.mapSelectedItems])

  const filtered = useMemo(() => {
    if (!localFilters.find(f => f?.query || f?.values?.length)) return sorted
    if (!fields.find(f => f.getSortValue)) return sorted

    return sorted.filter(v => {
      for (let i=0; i < fields.length; i++) {
        const { getFilterValue, filterType } = fields[i]
        if (!getFilterValue) continue

        const { query, values, valuesQualifier } = localFilters[i] ?? {}

        if (filterType === 'multi') {
          if (!values?.length) continue

          const filterValueOrValues = getFilterValue(v)
          const filterValues = Array.isArray(filterValueOrValues) ? filterValueOrValues : [filterValueOrValues]
          if (valuesQualifier === 'All Of') {
            return values.every(v => filterValues.includes(v))
          }
          if (!filterValues.find(v => values.includes(v))) {
            return false
          }
        } else {
          if (!query) continue

          const filterValueOrValues = getFilterValue(v)
          const filterValues = Array.isArray(filterValueOrValues) ? filterValueOrValues : [filterValueOrValues]
          if (!filterValues.find(v => v === query)) {
            return false
          }  
        }
      }

      return true
    })
  }, [sorted, localFilters, fields])

  // make sure filterCounts incorporates column filters whose state is in Table, not parent component
  const filterCounts = (_filterCounts && !paginated) ? { ..._filterCounts, filtered: filtered.length } : undefined

  const headerFilterIsActive = (
     !!(fields.find(f => f.filterIsActive) || localFilters.find(f => f?.query))
  )
  
  const draggable = (onReorder && sorting.length === 0)
  const ListComponent = useMemo(() => (
    draggable
      ? DraggableList
      : ScrollingList
  ), [draggable])

  // don't use filtered values, otherwise reduces suggestions to only those remaining
  const filterSuggestions: Record<string, string[]> = useMemo(() => {
    const suggestions: Record<string, string[]> = {}

    for (const { key, getFilterValue, filterSuggestions=[] } of fields) {
      if (!getFilterValue) {
        suggestions[key.toString()] = []
        continue
      }

      suggestions[key.toString()] = Array.from(new Set([...filterSuggestions, ...sorted.flatMap(getFilterValue)]))
    }

    return suggestions
  }, [sorted, keyString, refreshFilterSuggestionsKey])

  const table = (
    <Flex column>
      {title && TitleComponent && !renderTitleComponent && (
        <TitleComponent title={title} actionsComponent={titleActionsComponent}  
          // description={description} 
          horizontalPadding={noPaper ? 0 : horizontalPadding}
          style={{ maxWidth, ...titleStyle }} 
        />
      )} 
      {title && renderTitleComponent && (
        renderTitleComponent({
          title, actionsComponent: titleActionsComponent, 
          horizontalPadding: noPaper ? 0 : horizontalPadding,
          style: { maxWidth, ...titleStyle }
        }) 
      )}

      {/* {onClearFilter &&
        <Typography onClick={onClearFilter}
          style={{ 
            fontSize: 14, color: PRIMARY_HEX, 
            textAlign: 'center',
            cursor: 'pointer', textDecoration: 'underline',
          }} 
        >
          Clear active filters
        </Typography>
      } */}

      {filterCounts && filterCounts.total !== filterCounts.filtered &&
        <Typography 
          style={{ 
            fontSize: 14, color: PRIMARY_HEX, 
            textAlign: 'center', textDecoration: 'underline',
          }} 
        >
          Showing {filterCounts.filtered} of {filterCounts.total} loaded records due to filters
        </Typography>
      }

      <ListComponent items={filtered} onReorder={onReorder} 
        noWrap={noWrap}
        maxHeight={maxRowsHeight} 
        maxWidth={maxWidth}
        virtualization={virtualization}
        header={fields && HeaderComponent && fields.length > 0 && (items.length > 0 || headerFilterIsActive) && (
          <HeaderComponent selectable={selectable} allSelected={allSelected} allowUnselectItemsAfterSelectAll={allowUnselectItemsAfterSelectAll}
            headerHeight={headerHeight}
            setAllSelected={v =>  {
              setAllSelected?.(v)
              if (v) {
                setSelected?.(filtered.map(v => v.id.toString()))
              } else {
                setSelected?.([])
              }
            }}
            fields={fields} horizontalPadding={horizontalPadding} fontSize={headerFontSize}
            widthOffsets={widthOffsets} setWidthOffsets={setWidthOffsets}
            sorting={sorting} setSorting={setSorting} 
            localFilters={localFilters} setLocalFilters={setLocalFilters}
            memoryId={memoryId}
            filterSuggestions={filterSuggestions}
            style={{
              flexWrap: noWrap ? 'nowrap' : undefined,
              paddingLeft: draggable ? '42px' : horizontalPadding,
            }}
            onExport={
              onExport ? () => {
                onExport({
                  // use items, not sorted, as sorted only includes first page when paginated
                  data:   (paginated ? items : filtered).map(s => fields.map(f => f.getExportData?.(s) || '')),
                  labels: fields.map(f => f.label)
                })
              }
              : undefined
            }
            minColumnWidth={minColumnWidth}
            columnResizeZIndex={columnResizeZIndex}
          />
        )}

        // handle load when scroll to bottom, when table not paginated
        doneLoading={!paginated ? doneLoading : undefined} 
        loadMore={!paginated ? loadMore : undefined}
        loadMoreOptions={loadMoreOptions}

        // renderProps={{ horizontalPadding }}
        emptyText={emptyComponent ?? (
          (emptyText || headerFilterIsActive)
            ? (
              <>
              <Typography style={{ padding: horizontalPadding }}>
                {emptyText || 'No results found the current filter'}
              </Typography> 

              {loadMore && !doneLoading?.() &&
                <div style={{ paddingLeft: horizontalPadding, paddingBottom: horizontalPadding }}>
                <LoadingButton submitText="Load Older Data" submittingText="Loading..." onClick={loadMore} 
                  variant="outlined" style={{ width: 200, textAlign: 'center', marginTop: 10 }}
                />
                </div>
              }
              </>
            )
            : undefined
          )
        }
        Item={({ item, index }) => ( // index within this list, e.g. a single page
          <RowComponent widthOffsets={widthOffsets} rowHeight={rowHeight}
            selectable={selectable} selected={selected} setSelected={setSelected} allSelected={allSelected} setAllSelected={setAllSelected} allowUnselectItemsAfterSelectAll={allowUnselectItemsAfterSelectAll}
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
            minColumnWidth={minColumnWidth}
          />
        )
      } />

      {paginated && FooterComponent && items.length > 0 && // avoid displaying footer / unnecessary border when no items
        <FooterComponent doneLoading={doneLoading} loadMore={loadMore} loadMoreOptions={loadMoreOptions} {...paginationProps } {...pageOptions} horizontalPadding={horizontalPadding}/>
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

