import React, { } from "react";
import { 
  Image as ImageNative, 
  View, 
  ViewStyle, 
  FlatList, 
  TouchableOpacity 
} from "react-native"

import {
  Flex_T,
  FormProps,
  Item,
  ImageProps,
  VideoProps,
  List_T,
  resolve_direction_for_props,
  compute_flex_direction_with_props,
  WithHoverProps,
  ScrollingListProps,
} from "./layout.js"

import {
  ClickableNative,
  NativeStyled,
  Typography,
} from "./mui"
import {
  convert_CSS_to_RNStyles
} from "./mui.native"

// @ts-ignore
import NativeVideo from 'react-native-video';

export const IN_REACT_WEB = false

// need to export for consistency with native
export const WithHTMLFormContext = React.createContext({ loading: false })

export const Image = ({ src, alt, ...props } : ImageProps) => (
  <ImageNative 
    accessibilityLabel={alt} 
    source={{ uri: src }} 
    resizeMode="contain"
    style={props}
    // {...props} 
  />
)

export const Video = ({ style, src, dimensions, ...props } : VideoProps) => (
  <NativeVideo source={{ uri: src }}   // Can be a URL or a local file.
    controls paused
    ref={(ref: any) => {
      if (this) {
        // @ts-ignore
        this.player = ref
      }
    }}                                      // Store reference
    // onBuffer={this.onBuffer}                // Callback when remote video is buffering
    // onError={this.videoError}               // Callback when video cannot be loaded
    {...props}
    style={convert_CSS_to_RNStyles(
      { ...style, ...dimensions }
    )} 
  />
)

interface Flex_Native extends Flex_T, NativeStyled, ClickableNative {}

export const Flex = (props: Flex_Native) => {
  const direction = resolve_direction_for_props(props.row, props.column)
  const flexDirection = compute_flex_direction_with_props(direction, props.reverse)
  const flex = props.flex ?? 0
  const children = props.children ?? null
  const flexShrink = props.shrink ?? 1 // same default as web
  const wrap = props.wrap  ?? 'wrap'

  const handler = props.onPress ?? props.onClick

  const style: ViewStyle = { 
    alignItems: props.alignItems, 
    alignContent: props.alignContent ?? 'stretch', // web default
    justifyContent: props.justifyContent, 
    alignSelf: props.alignSelf, 
    flex, 
    flexDirection,
    flexWrap: wrap,
    display: 'flex', 
    flexShrink,
    ...convert_CSS_to_RNStyles(props.style), 
  }
  if (handler) return (
    <TouchableOpacity onPress={handler} style={style}><>{children}</></TouchableOpacity>
  )

  return (<View style={style}>{children}</View>)
}

export const Form = ({ children, style }: FormProps) => (
  style 
    ? <View style={convert_CSS_to_RNStyles(style)}>{children}</View>
    : <>{children}</>
)
export const SUPPORTS_FORMS = false

export const List = <T extends Item>({ items, emptyComponent, render, onClick, onPress, reverse, style }: List_T<T> & NativeStyled) => {
  if (items.length === 0 && emptyComponent) return emptyComponent
  
  return (
    <FlatList 
      inverted={reverse}
      data={items}
      style={convert_CSS_to_RNStyles(style)}
      renderItem={({ item, index }) => render(item, { index, onClick: onPress ?? onClick })} 
      keyExtractor={item => item.id.toString()}
    />
  )
}

// nop since hover not relevant for native mobile views
export const WithHover = ({ children } : WithHoverProps) => <>{children}</>

export const ScrollingList = <T extends { id: string | number }>({
  title,
  maxHeight,
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
} : ScrollingListProps<T>) => {
  const titleStyleWithDefaults = { fontSize: 20, fontWeight: 'bold', marginBottom: 3, ...titleStyle }
 
  return (
    <Flex flex={1} column style={style}>
      {TitleComponent
        ? <TitleComponent title={title} titleStyle={titleStyleWithDefaults} />
        : (
          <Flex alignItems="center" justifyContent="space-between">
            <Flex>
              {typeof title === 'string'
                ? (
                  <Typography style={titleStyleWithDefaults}>
                    {title}
                  </Typography>
                )
                : title   
              } 
            </Flex>
            
            <Flex>
              {titleActionsComponent}
            </Flex>
          </Flex>
        )
      }
      {items.length === 0
        ? items.length === 0 && <Typography>{emptyText}</Typography>
        : <FlatList data={items} keyExtractor={item => item.id.toString()}
            renderItem={({ item, index }) => <Item item={item} index={index} />}
            onEndReached={() => {
              if (doneLoading?.() || !loadMore) return
              
              loadMore().catch(console.error)
            }}

            // includes conversion of vh and vw
            style={convert_CSS_to_RNStyles({ minHeight, maxHeight })} 
          />
      }
    </Flex>
  )
}