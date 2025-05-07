import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { EditorState, ContentState, convertToRaw } from 'draft-js';
import { Paper } from '@mui/material';
import { Styled } from '../mui';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const getToolbar = ({ hideEmoji } : { hideEmoji?: boolean }) => ({
  // hide image and embedded in favor of custom sections
  options: [
    // 'inline', 
    // 'blockType', 
    'fontSize', 
    // 'fontFamily', 
    'list', 
    'textAlign', 
    // 'colorPicker', 
    'link', 
    ...(hideEmoji ? [] : ['emoji']), 
    // 'remove', 
    // 'history',
    // 'image', 
    // 'embedded', 
  ],
  inline: {
    inDropdown: false,
    className: undefined,
    component: undefined,
    dropdownClassName: undefined,
    options: ['bold', 'italic', 'underline', 'strikethrough', 'monospace', 'superscript', 'subscript'],
    // bold: { icon: bold, className: undefined },
    // italic: { icon: italic, className: undefined },
    // underline: { icon: underline, className: undefined },
    // strikethrough: { icon: strikethrough, className: undefined },
    // monospace: { icon: monospace, className: undefined },
    // superscript: { icon: superscript, className: undefined },
    // subscript: { icon: subscript, className: undefined },
  },
  blockType: {
    inDropdown: true,
    options: ['Normal', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'Blockquote', 'Code'],
    className: undefined,
    component: undefined,
    dropdownClassName: undefined,
  },
  fontSize: {
    // icon: fontSize,
    options: [8, 9, 10, 11, 12, 14, 16, 18, 24, 30, 36, 48, 60, 72, 96],
    className: undefined,
    component: undefined,
    dropdownClassName: undefined,
  },
  fontFamily: {
    options: ['Arial', 'Georgia', 'Impact', 'Tahoma', 'Times New Roman', 'Verdana'],
    className: undefined,
    component: undefined,
    dropdownClassName: undefined,
  },
  list: {
    inDropdown: false,
    className: undefined,
    component: undefined,
    dropdownClassName: undefined,
    options: ['unordered', 'ordered', 'indent', 'outdent'],
    // unordered: { icon: unordered, className: undefined },
    // ordered: { icon: ordered, className: undefined },
    // indent: { icon: indent, className: undefined },
    // outdent: { icon: outdent, className: undefined },
  },
  textAlign: {
    inDropdown: false,
    className: undefined,
    component: undefined,
    dropdownClassName: undefined,
    options: ['left', 'center', 'right', 'justify'],
    // left: { icon: left, className: undefined },
    // center: { icon: center, className: undefined },
    // right: { icon: right, className: undefined },
    // justify: { icon: justify, className: undefined },
  },
  colorPicker: {
    // icon: color,
    className: undefined,
    component: undefined,
    popupClassName: undefined,
    colors: ['rgb(97,189,109)', 'rgb(26,188,156)', 'rgb(84,172,210)', 'rgb(44,130,201)',
      'rgb(147,101,184)', 'rgb(71,85,119)', 'rgb(204,204,204)', 'rgb(65,168,95)', 'rgb(0,168,133)',
      'rgb(61,142,185)', 'rgb(41,105,176)', 'rgb(85,57,130)', 'rgb(40,50,78)', 'rgb(0,0,0)',
      'rgb(247,218,100)', 'rgb(251,160,38)', 'rgb(235,107,86)', 'rgb(226,80,65)', 'rgb(163,143,132)',
      'rgb(239,239,239)', 'rgb(255,255,255)', 'rgb(250,197,28)', 'rgb(243,121,52)', 'rgb(209,72,65)',
      'rgb(184,49,47)', 'rgb(124,112,107)', 'rgb(209,213,216)'],
  },
  link: {
    inDropdown: false,
    className: undefined,
    component: undefined,
    popupClassName: undefined,
    dropdownClassName: undefined,
    showOpenOptionOnHover: true,
    defaultTargetOption: '_blank',
    options: ['link', 'unlink'],
    // link: { icon: link, className: undefined },
    // unlink: { icon: unlink, className: undefined },
    linkCallback: undefined
  },
  emoji: {
    // icon: emoji,
    className: undefined,
    component: undefined,
    popupClassName: undefined,
    emojis: [
      '😀', '😁', '😂', '😃', '😉', '😋', '😎', '😍', '😗', '🤗', '🤔', '😣', '😫', '😴', '😌', '🤓',
      '😛', '😜', '😠', '😇', '😷', '😈', '👻', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '🙈',
      '🙉', '🙊', '👼', '👮', '🕵', '💂', '👳', '🎅', '👸', '👰', '👲', '🙍', '🙇', '🚶', '🏃', '💃',
      '⛷', '🏂', '🏌', '🏄', '🚣', '🏊', '⛹', '🏋', '🚴', '👫', '💪', '👈', '👉', '👉', '👆', '🖕',
      '👇', '🖖', '🤘', '🖐', '👌', '👍', '👎', '✊', '👊', '👏', '🙌', '🙏', '🐵', '🐶', '🐇', '🐥',
      '🐸', '🐌', '🐛', '🐜', '🐝', '🍉', '🍄', '🍔', '🍤', '🍨', '🍪', '🎂', '🍰', '🍾', '🍷', '🍸',
      '🍺', '🌍', '🚑', '⏰', '🌙', '🌝', '🌞', '⭐', '🌟', '🌠', '🌨', '🌩', '⛄', '🔥', '🎄', '🎈',
      '🎉', '🎊', '🎁', '🎗', '🏀', '🏈', '🎲', '🔇', '🔈', '📣', '🔔', '🎵', '🎷', '💰', '🖊', '📅',
      '✅', '❎', '💯',
    ],
  },
  embedded: {
    // icon: embedded,
    className: undefined,
    component: undefined,
    popupClassName: undefined,
    embedCallback: undefined,
    defaultSize: {
      height: 'auto',
      width: 'auto',
    },
  },
  image: {
    // icon: image,
    className: undefined,
    component: undefined,
    popupClassName: undefined,
    urlEnabled: true,
    uploadEnabled: true,
    alignmentEnabled: true,
    // uploadCallback,
    previewImage: true,
    inputAccept: 'image/gif,image/jpeg,image/jpg,image/png,image/svg',
    alt: { present: false, mandatory: false },
    defaultSize: {
      height: 'auto',
      width: 'auto',
    },
  },
  remove: { 
    // icon: eraser, 
    className: undefined, component: undefined 
  },
  history: {
    inDropdown: false,
    className: undefined,
    component: undefined,
    dropdownClassName: undefined,
    options: ['undo', 'redo'],
    // undo: { icon: undo, className: undefined },
    // redo: { icon: redo, className: undefined },
  },
})



export const WYSIWYG = ({ stopEnterPropagation, updateHtml, initialHTML: _initialHTML='', autoFocus, onChange, style, editorStyle, hideEmoji } : { 
  initialHTML?: string, onChange: (html: string) => void, autoFocus?: boolean,
  editorStyle?: React.CSSProperties,
  hideEmoji?: boolean,
  updateHtml?: string,
  stopEnterPropagation?: boolean,
} & Styled) => {
  const trimmed = _initialHTML.trim()
  const initialHTML = (
    trimmed.startsWith('<p>') && trimmed.endsWith('</p>')
      ? trimmed
      : `<p>${trimmed}</p>`
  )

  const [editorState, setEditorState] = useState(EditorState.createWithContent(
    ContentState.createFromBlockArray(htmlToDraft(initialHTML).contentBlocks)
  ))
  const editorStateRef = useRef(editorState)

  const editorRef: React.MutableRefObject<Editor | null> = useRef(null)

  useEffect(() => {
    if (!updateHtml) return

    setEditorState(
      EditorState.createWithContent(
        ContentState.createFromBlockArray(htmlToDraft(updateHtml).contentBlocks)
      )
    )
  }, [updateHtml])

  useEffect(() => {
    if (!autoFocus) return

    if (editorRef.current) {
      editorRef.current?.focusEditor?.()
      setEditorState(es => EditorState.moveFocusToEnd(es))
    }
  }, [editorRef, autoFocus])

  useEffect(() => {
    if (editorStateRef.current === editorState) return
    editorStateRef.current = editorState

    // unbounce a bit for perf
    const t = setTimeout(() => (
      onChange(draftToHtml(convertToRaw(editorState.getCurrentContent())))
    ), 99)

    return () => { clearTimeout(t) }
  }, [onChange, editorState])

  const toolbar = useMemo(() => getToolbar({ hideEmoji }), [hideEmoji])

  return (
    <Paper sx={{ padding: 1 }} style={style}>
      <Editor spellCheck ref={editorRef} editorStyle={editorStyle}
        editorState={editorState}
        wrapperClassName="demo-wrapper"
        editorClassName="demo-editor"
        onEditorStateChange={setEditorState}
        toolbar={toolbar} 
        handleReturn={e => {
          if (stopEnterPropagation) {
            e.stopPropagation()
          }
          return false // not handled (allow editor to update)
        }}
      />
    </Paper>
  )  
}