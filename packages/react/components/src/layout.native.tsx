import React from "react";
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
} from "./layout.js"

import {
  ClickableNative,
  NativeStyled,
} from "./mui"
import {
  convert_CSS_to_RNStyles
} from "./mui.native"

import NativeVideo from 'react-native-video';

export const IN_REACT_WEB = false

export const Image = ({ src, alt, height, width,  ...props } : ImageProps) => (
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