import { useCallback, useEffect, useState } from 'react'

import { RichTextProvider } from 'reactjs-tiptap-editor'

import { localeActions } from 'reactjs-tiptap-editor/locale-bundle'

import { themeActions } from 'reactjs-tiptap-editor/theme'

// Base Kit
import { Document } from '@tiptap/extension-document'
import { HardBreak } from '@tiptap/extension-hard-break'
import { ListItem } from '@tiptap/extension-list'
import { Paragraph } from '@tiptap/extension-paragraph'
import { Text } from '@tiptap/extension-text'
import { TextStyle } from '@tiptap/extension-text-style'
import { Dropcursor, Gapcursor, Placeholder, TrailingNode } from '@tiptap/extensions'

// build extensions
import { Attachment, RichTextAttachment } from 'reactjs-tiptap-editor/attachment'
import { Blockquote, RichTextBlockquote } from 'reactjs-tiptap-editor/blockquote'
import { Bold, RichTextBold } from 'reactjs-tiptap-editor/bold'
import { BulletList, RichTextBulletList } from 'reactjs-tiptap-editor/bulletlist'
import { Clear, RichTextClear } from 'reactjs-tiptap-editor/clear'
import { Code, RichTextCode } from 'reactjs-tiptap-editor/code'
import { CodeBlock, RichTextCodeBlock } from 'reactjs-tiptap-editor/codeblock'
import { CodeView, RichTextCodeView } from 'reactjs-tiptap-editor/codeview'
import { Color, RichTextColor } from 'reactjs-tiptap-editor/color'
import { Column, ColumnNode, MultipleColumnNode, RichTextColumn } from 'reactjs-tiptap-editor/column'
import { Drawer, RichTextDrawer } from 'reactjs-tiptap-editor/drawer'
import { Emoji, RichTextEmoji } from 'reactjs-tiptap-editor/emoji'
import { Excalidraw, RichTextExcalidraw } from 'reactjs-tiptap-editor/excalidraw'
import { ExportPdf, RichTextExportPdf } from 'reactjs-tiptap-editor/exportpdf'
import { ExportWord, RichTextExportWord } from 'reactjs-tiptap-editor/exportword'
import { FontFamily, RichTextFontFamily } from 'reactjs-tiptap-editor/fontfamily'
import { FontSize, RichTextFontSize } from 'reactjs-tiptap-editor/fontsize'
import { Heading, RichTextHeading } from 'reactjs-tiptap-editor/heading'
import { Highlight, RichTextHighlight } from 'reactjs-tiptap-editor/highlight'
import { History, RichTextRedo, RichTextUndo } from 'reactjs-tiptap-editor/history'
import { HorizontalRule, RichTextHorizontalRule } from 'reactjs-tiptap-editor/horizontalrule'
import { Iframe, RichTextIframe } from 'reactjs-tiptap-editor/iframe'
import { Image, RichTextImage } from 'reactjs-tiptap-editor/image'
import { ImageGif, RichTextImageGif } from 'reactjs-tiptap-editor/imagegif'
import { ImportWord, RichTextImportWord } from 'reactjs-tiptap-editor/importword'
import { Indent, RichTextIndent } from 'reactjs-tiptap-editor/indent'
import { Italic, RichTextItalic } from 'reactjs-tiptap-editor/italic'
import { Katex, RichTextKatex } from 'reactjs-tiptap-editor/katex'
import { LineHeight, RichTextLineHeight } from 'reactjs-tiptap-editor/lineheight'
import { Link, RichTextLink } from 'reactjs-tiptap-editor/link'
import { Mention } from 'reactjs-tiptap-editor/mention'
import { Mermaid, RichTextMermaid } from 'reactjs-tiptap-editor/mermaid'
import { MoreMark, RichTextMoreMark } from 'reactjs-tiptap-editor/moremark'
import { OrderedList, RichTextOrderedList } from 'reactjs-tiptap-editor/orderedlist'
import { RichTextSearchAndReplace, SearchAndReplace } from 'reactjs-tiptap-editor/searchandreplace'
import { RichTextStrike, Strike } from 'reactjs-tiptap-editor/strike'
import { RichTextTable, Table } from 'reactjs-tiptap-editor/table'
import { RichTextTaskList, TaskList } from 'reactjs-tiptap-editor/tasklist'
import { RichTextAlign, TextAlign } from 'reactjs-tiptap-editor/textalign'
import { RichTextTextDirection, TextDirection } from 'reactjs-tiptap-editor/textdirection'
import { RichTextUnderline, TextUnderline } from 'reactjs-tiptap-editor/textunderline'
import { RichTextTwitter, Twitter } from 'reactjs-tiptap-editor/twitter'
import { RichTextVideo, Video } from 'reactjs-tiptap-editor/video'

// Slash Command
import { SlashCommand, SlashCommandList } from 'reactjs-tiptap-editor/slashcommand'


// Bubble
import {
  RichTextBubbleColumns,
  RichTextBubbleDrawer,
  RichTextBubbleExcalidraw,
  RichTextBubbleIframe,
  RichTextBubbleImage,
  RichTextBubbleImageGif,
  RichTextBubbleKatex,
  RichTextBubbleLink,
  RichTextBubbleMermaid,
  RichTextBubbleTable,
  RichTextBubbleText,
  RichTextBubbleTwitter,
  RichTextBubbleVideo
} from 'reactjs-tiptap-editor/bubble'

import "@excalidraw/excalidraw/index.css"
import 'easydrawer/styles.css'
import 'katex/dist/katex.min.css'
import 'prism-code-editor-lightweight/layout.css'
import "prism-code-editor-lightweight/themes/github-dark.css"
import 'reactjs-tiptap-editor/style.css'

import { EditorContent, useEditor } from '@tiptap/react'

function convertBase64ToBlob(base64: string) {
  const arr = base64.split(',')
  const mime = arr[0].match(/:(.*?);/)![1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new Blob([u8arr], { type: mime })
}

// custom document to support columns
const DocumentColumn = /* @__PURE__ */ Document.extend({
  content: '(block|columns)+',
  // echo editor is a block editor
});

const BaseKit = [
  DocumentColumn,
  Text,
  Dropcursor,
  Gapcursor,
  HardBreak,
  Paragraph,
  TrailingNode,
  ListItem,
  TextStyle,
  Placeholder.configure({
    placeholder: 'Press \'/\' for commands',
  })
]

const extensions = [
  ...BaseKit,

  History,
  SearchAndReplace,
  Clear,
  FontFamily,
  Heading,
  FontSize,
  Bold,
  Italic,
  TextUnderline,
  Strike,
  MoreMark,
  Emoji,
  Color,
  Highlight,
  BulletList,
  OrderedList,
  TextAlign,
  Indent,
  LineHeight,
  TaskList,
  Link,
  Image.configure({
    upload: (files: File) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(URL.createObjectURL(files))
        }, 300)
      })
    },
  }),
  Video.configure({
    upload: (files: File) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(URL.createObjectURL(files))
        }, 300)
      })
    },
  }),
  ImageGif.configure({
    provider: 'giphy',
    API_KEY: process.env.NEXT_PUBLIC_GIPHY_API_KEY as string
  }),
  Blockquote,
  HorizontalRule,
  Code,
  CodeBlock,

  Column,
  ColumnNode,
  MultipleColumnNode,
  Table,
  Iframe,
  ExportPdf,
  ImportWord,
  ExportWord,
  TextDirection,
  Attachment.configure({
    upload: (file: any) => {
      // fake upload return base 64
      const reader = new FileReader()
      reader.readAsDataURL(file)

      return new Promise((resolve) => {
        setTimeout(() => {
          const blob = convertBase64ToBlob(reader.result as string)
          resolve(URL.createObjectURL(blob))
        }, 300)
      })
    },
  }),
  Katex,
  Excalidraw,
  Mermaid.configure({
    upload: (file: any) => {
      // fake upload return base 64
      const reader = new FileReader()
      reader.readAsDataURL(file)

      return new Promise((resolve) => {
        setTimeout(() => {
          const blob = convertBase64ToBlob(reader.result as string)
          resolve(URL.createObjectURL(blob))
        }, 300)
      })
    },
  }),
  Drawer.configure({
    upload: (file: any) => {
      // fake upload return base 64
      const reader = new FileReader()
      reader.readAsDataURL(file)

      return new Promise((resolve) => {
        setTimeout(() => {
          const blob = convertBase64ToBlob(reader.result as string)
          resolve(URL.createObjectURL(blob))
        }, 300)
      })
    },
  }),
  Twitter,
  Mention,
  SlashCommand,
  CodeView,
]

const DEFAULT = `<h1 dir="auto" style="text-align: center;">Rich Text Editor</h1><p dir="auto">A modern WYSIWYG rich text editor based on <a target="_blank" rel="noopener noreferrer nofollow" class="link" href="https://github.com/scrumpy/tiptap">tiptap</a> and <a target="_blank" rel="noopener noreferrer nofollow" class="link" href="https://ui.shadcn.com/">shadcn ui</a> for Reactjs</p><p dir="auto"><div class="image" style="text-align: center;"><img src="https://picsum.photos/1920/1080.webp?t=1" width="500" flipx="false" flipy="false" align="center" inline="false" style=""></div></p><p dir="auto"></p><div data-type="horizontalRule"><hr></div><h2 dir="auto">Demo</h2><p dir="auto">👉<a target="_blank" rel="noopener noreferrer nofollow" class="link" href="https://reactjs-tiptap-editor.vercel.app/">Demo</a></p><h2 dir="auto">Features</h2><ul><li><p dir="auto">Use <a target="_blank" rel="noopener noreferrer nofollow" class="link" href="https://ui.shadcn.com/">shadcn ui</a> components</p></li><li><p dir="auto">Markdown support</p></li><li><p dir="auto">TypeScript support</p></li><li><p dir="auto">I18n support (vi, en, zh, pt)</p></li><li><p dir="auto">React support</p></li><li><p dir="auto">Slash Commands</p></li><li><p dir="auto">Multi Column</p></li><li><p dir="auto">TailwindCss</p></li><li><p dir="auto">Support emoji</p></li><li><p dir="auto">Support iframe</p></li><li><p dir="auto">Support mermaid</p></li></ul><h2 dir="auto">Installation</h2><pre code="pnpm install reactjs-tiptap-editor" language="bash" linenumbers="true" wordwrap="false" tabsize="2" shouldfocus="false"><code>pnpm install reactjs-tiptap-editor</code></pre><p dir="auto"></p>`

function debounce(func: any, wait: number) {
  let timeout: NodeJS.Timeout
  return function (...args: any[]) {
    clearTimeout(timeout)
    // @ts-ignore
    timeout = setTimeout(() => func.apply(this, args), wait)
  }
}


const Header = ({ editor }) => {
  const [theme, setTheme] = useState('light')
  const [editorEditable, setEditorEditable] = useState(true);
  const [color, setColor] = useState('default');
  const [lang, setlang] = useState('en');

  useEffect(() => {
    if (editor) {
      editor.on('update', () => {
        setEditorEditable(editor.isEditable);
      })
    }

    return () => {
      if (editor) {
        editor.off('update', () => {
          setEditorEditable(editor.isEditable);
        })
      }
    }
  }, [editor]);

  return <>
    <div className='flex items-center justify-between gap-[12px] header'>
      <div className='flex items-center gap-2'>
        <select value={lang} onChange={(e) => {
          setlang(e.target.value);
          localeActions.setLang(e.target.value)
        }}>
          <option value="vi">Vietnamese</option>
          <option value="en">English</option>
          <option value="zh_CN">Chinese</option>
          <option value="pt_BR">Português</option>
          <option value="hu_HU">Hungarian</option>
          <option value="fi">Finnish</option>
        </select>

        <button type="button" onClick={() => {
          editor?.setEditable(!editorEditable);
        }}>{editorEditable ? 'Readonly' : 'Editable'}</button>

        <button
          onClick={() => {
            window.open('https://github.com/hunghg255/reactjs-tiptap-editor-demo', '_blank');
          }}
        >
          Source Demo
        </button>

        <button
          onClick={() => {
            window.open('https://reactjs-tiptap-editor.vercel.app/', '_blank');
          }}
        >
          Documentation
        </button>
      </div>

      <div className='flex items-center gap-2'>
        <button onClick={() => {
          setTheme(theme === 'dark' ? 'light' : 'dark');
          themeActions.setTheme(theme === 'dark' ? 'light' : 'dark');
        }}>
          {theme === 'dark' ? 'Light' : 'Dark'}
        </button>

        <select value={color} onChange={(e) => {
          setColor(e.target.value);
          themeActions.setColor(e.target.value)
        }}>
          <option value="default">Default</option>
          <option value="red">Red</option>
          <option value="blue">Blue</option>
          <option value="green">Green</option>
          <option value="orange">Orange</option>
          <option value="rose">Rose</option>
          <option value="violet">Violet</option>
          <option value="yellow">Yellow</option>
        </select>
      </div>
    </div>
  </>
}

const RichTextToolbar = () => {
  return <div className="flex items-center !p-1 gap-2 flex-wrap !border-b !border-solid !border-[#a5a4a4]">
    <RichTextUndo />
    <RichTextRedo />
    <RichTextSearchAndReplace />
    <RichTextClear />
    <RichTextFontFamily />
    <RichTextHeading />
    <RichTextFontSize />
    <RichTextBold />
    <RichTextItalic />
    <RichTextUnderline />
    <RichTextStrike />
    <RichTextMoreMark />
    <RichTextEmoji />
    <RichTextColor />
    <RichTextHighlight />
    <RichTextBulletList />
    <RichTextOrderedList />
    <RichTextAlign />
    <RichTextIndent />
    <RichTextLineHeight />
    <RichTextTaskList />
    <RichTextLink />
    <RichTextImage />
    <RichTextVideo />
    <RichTextImageGif />
    <RichTextBlockquote />
    <RichTextHorizontalRule />
    <RichTextCode />
    <RichTextCodeBlock />
    <RichTextColumn />
    <RichTextTable />
    <RichTextIframe />
    <RichTextExportPdf />
    <RichTextImportWord />
    <RichTextExportWord />
    <RichTextTextDirection />
    <RichTextAttachment />
    <RichTextKatex />
    <RichTextExcalidraw />
    <RichTextMermaid />
    <RichTextDrawer />
    <RichTextTwitter />
    <RichTextCodeView />
  </div>
}

function App() {
  const [content, setContent] = useState(DEFAULT)

  const onValueChange = useCallback(
    debounce((value: any) => {
      setContent(value)
    }, 300),
    [],
  )

  const editor = useEditor({
    // shouldRerenderOnTransaction:  false,
    textDirection: 'auto', // global text direction
    content,
    extensions,
    // content,
    immediatelyRender: false, // error duplicate plugin key
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      onValueChange(html)
    },
  });

  useEffect(() => {
    window['editor'] = editor;
  }, [editor]);

  return (
    <div
      className="p-[24px] flex flex-col w-full max-w-screen-lg gap-[24px] mx-[auto] my-0"
      style={{
        maxWidth: 1200,
        margin: '40px auto',
      }}
    >
      <Header editor={editor}  />

      <RichTextProvider editor={editor}>
        <div className="overflow-hidden rounded-[0.5rem] bg-background shadow outline outline-1">
          <div className="flex max-h-full w-full flex-col">
            <RichTextToolbar />

            <EditorContent
              editor={editor}
            />

            {/* Bubble */}
            <RichTextBubbleColumns />
            <RichTextBubbleDrawer />
            <RichTextBubbleExcalidraw />
            <RichTextBubbleIframe />
            <RichTextBubbleKatex />
            <RichTextBubbleLink />

            <RichTextBubbleImage />
            <RichTextBubbleVideo />
            <RichTextBubbleImageGif />

            <RichTextBubbleMermaid />
            <RichTextBubbleTable />
            <RichTextBubbleText />
            <RichTextBubbleTwitter />

            {/* Command List */}
            <SlashCommandList />
          </div>
        </div>
      </RichTextProvider>

      {typeof content === 'string' && (
        <textarea
          style={{
            marginTop: 20,
            height: 500,
          }}
          readOnly
          value={content}
        />
      )}
    </div>
  )
}

export default App
