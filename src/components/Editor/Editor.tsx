'use client';

/* eslint-disable unicorn/no-null */
/* eslint-disable quotes */
import { useCallback, useState } from 'react'

import RichTextEditor from 'reactjs-tiptap-editor'

import { locale } from 'reactjs-tiptap-editor/locale-bundle'
import {
  BubbleMenuTwitter,
  BubbleMenuKatex,
  BubbleMenuExcalidraw,
  BubbleMenuMermaid,
  BubbleMenuDrawer
} from 'reactjs-tiptap-editor/bubble-extra';

import { BaseKit } from 'reactjs-tiptap-editor/base-kit';
import { Attachment } from 'reactjs-tiptap-editor/attachment';
import { Blockquote } from 'reactjs-tiptap-editor/blockquote';
import { Bold } from 'reactjs-tiptap-editor/bold';
import { BulletList } from 'reactjs-tiptap-editor/bulletlist';
import { Clear } from 'reactjs-tiptap-editor/clear';
import { Code } from 'reactjs-tiptap-editor/code';
import { CodeBlock } from 'reactjs-tiptap-editor/codeblock';
import { Color } from 'reactjs-tiptap-editor/color';
import { ColumnActionButton } from 'reactjs-tiptap-editor/multicolumn';
import { Emoji } from 'reactjs-tiptap-editor/emoji';
import { ExportPdf } from 'reactjs-tiptap-editor/exportpdf';
import { ExportWord } from 'reactjs-tiptap-editor/exportword';
import { FontFamily } from 'reactjs-tiptap-editor/fontfamily';
import { FontSize } from 'reactjs-tiptap-editor/fontsize';
import { FormatPainter } from 'reactjs-tiptap-editor/formatpainter';
import { Heading } from 'reactjs-tiptap-editor/heading';
import { Highlight } from 'reactjs-tiptap-editor/highlight';
import { History } from 'reactjs-tiptap-editor/history';
import { HorizontalRule } from 'reactjs-tiptap-editor/horizontalrule';
import { Iframe } from 'reactjs-tiptap-editor/iframe';
import { Image } from 'reactjs-tiptap-editor/image';
import { ImageGif } from 'reactjs-tiptap-editor/imagegif';
import { ImportWord } from 'reactjs-tiptap-editor/importword';
import { Indent } from 'reactjs-tiptap-editor/indent';
import { Italic } from 'reactjs-tiptap-editor/italic';
import { LineHeight } from 'reactjs-tiptap-editor/lineheight';
import { Link } from 'reactjs-tiptap-editor/link';
import { Mention } from 'reactjs-tiptap-editor/mention';
import { MoreMark } from 'reactjs-tiptap-editor/moremark';
import { OrderedList } from 'reactjs-tiptap-editor/orderedlist';
import { SearchAndReplace } from 'reactjs-tiptap-editor/searchandreplace';
import { SlashCommand } from 'reactjs-tiptap-editor/slashcommand';
import { Strike } from 'reactjs-tiptap-editor/strike';
import { Table } from 'reactjs-tiptap-editor/table';
import { TableOfContents } from 'reactjs-tiptap-editor/tableofcontent';
import { TaskList } from 'reactjs-tiptap-editor/tasklist';
import { TextAlign } from 'reactjs-tiptap-editor/textalign';
import { TextUnderline } from 'reactjs-tiptap-editor/textunderline';
import { Video } from 'reactjs-tiptap-editor/video';
import { TextDirection } from 'reactjs-tiptap-editor/textdirection';
import { Katex } from 'reactjs-tiptap-editor/katex';
import { Drawer } from 'reactjs-tiptap-editor/drawer';
import { Excalidraw } from 'reactjs-tiptap-editor/excalidraw';
import { Twitter } from 'reactjs-tiptap-editor/twitter';
import { Mermaid } from 'reactjs-tiptap-editor/mermaid';

import 'reactjs-tiptap-editor/style.css'
import 'prism-code-editor-lightweight/layout.css';
import "prism-code-editor-lightweight/themes/github-dark.css"

import 'katex/dist/katex.min.css'
import 'easydrawer/styles.css'
import 'react-image-crop/dist/ReactCrop.css';
import "@excalidraw/excalidraw/index.css";

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

const extensions = [
  BaseKit.configure({
    placeholder: {
      showOnlyCurrent: true,
    },
    characterCount: {
      limit: 50_000,
    },
  }),
  History,
  SearchAndReplace,
  TableOfContents,
  FormatPainter.configure({ spacer: true }),
  Clear,
  FontFamily,
  Heading.configure({ spacer: true }),
  FontSize,
  Bold,
  Italic,
  TextUnderline,
  Strike,
  MoreMark,
  Emoji,
  Color.configure({ spacer: true }),
  Highlight,
  BulletList,
  OrderedList,
  TextAlign.configure({ types: ['heading', 'paragraph'], spacer: true }),
  Indent,
  LineHeight,
  TaskList.configure({
    spacer: true,
    taskItem: {
      nested: true,
    },
  }),
  Link,
  Image.configure({
    upload: (files: File) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(URL.createObjectURL(files))
        }, 500)
      })
    },
  }),
  Video.configure({
    upload: (files: File) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(URL.createObjectURL(files))
        }, 500)
      })
    },
  }),
  ImageGif.configure({
    provider: 'giphy',
    API_KEY: process.env.NEXT_PUBLIC_GIPHY_API_KEY as string,
  }),
  Blockquote,
  SlashCommand,
  HorizontalRule,
  Code.configure({
    toolbar: false,
  }),
  CodeBlock,
  ColumnActionButton,
  Table,
  Iframe,
  ExportPdf.configure({ spacer: true }),
  ImportWord.configure({
    upload: (files: File[]) => {
      const f = files.map(file => ({
        src: URL.createObjectURL(file),
        alt: file.name,
      }))
      return Promise.resolve(f)
    },
  }),
  ExportWord,
  TextDirection,
  Mention,
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

function Editor() {
  const [content, setContent] = useState(DEFAULT)
  const [theme, setTheme] = useState('light')
  const [disable, setDisable] = useState(false)
  const [lang, setlang] = useState('vi');

  const onValueChange = useCallback(
    debounce((value: any) => {
      setContent(value)
    }, 300),
    [],
  )


  return (
    <main
      style={{
        padding: '0 20px',
      }}
    >
      <div
        style={{
          maxWidth: 1024,
          margin: '88px auto 120px',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: '12px',
            marginBottom: 10,
          }}
          className="buttonWrap"
        >

          <select value={lang} onChange={(e) => {
            setlang(e.target.value);
            locale.setLang(e.target.value)
          }}>
            <option value="vi">Vietnamese</option>
            <option value="en">English</option>
            <option value="zh_CN">Chinese</option>
            <option value="pt_BR">Português</option>
            <option value="hu_HU">Hungarian</option>
            <option value="fi">Finnish</option>
          </select>
          <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            {theme === 'dark' ? 'Light' : 'Dark'}
          </button>
          <button onClick={() => setDisable(!disable)}>{disable ? 'Editable' : 'Readonly'}</button>
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

        <RichTextEditor
          output="html"
          content={content as any}
          onChangeContent={onValueChange}
          extensions={extensions}
          dark={theme === 'dark'}
          disabled={disable}
          bubbleMenu={{
            render({ extensionsNames, editor, disabled }, bubbleDefaultDom) {
              return <>
                {bubbleDefaultDom}

                {extensionsNames.includes('twitter') ? <BubbleMenuTwitter disabled={disabled}
                  editor={editor}
                  key="twitter"
                /> : null}
                {extensionsNames.includes('katex') ? <BubbleMenuKatex disabled={disabled}
                  editor={editor}
                  key="katex"
                /> : null}
                {extensionsNames.includes('excalidraw') ? <BubbleMenuExcalidraw disabled={disabled}
                  editor={editor}
                  key="excalidraw"
                /> : null}
                {extensionsNames.includes('mermaid') ? <BubbleMenuMermaid disabled={disabled}
                  editor={editor}
                  key="mermaid"
                /> : null}
                {extensionsNames.includes('drawer') ? <BubbleMenuDrawer disabled={disabled}
                  editor={editor}
                  key="drawer"
                /> : null}
              </>
            },
          }}
        />

        {typeof content === 'string' && (
          <textarea
            className="textarea"
            readOnly
            style={{
              marginTop: 20,
              height: 500,
              width: '100%',
              borderRadius: 4,
              padding: 10,
            }}
            value={content}
          />
        )}
      </div>
    </main>
  )
}

export default Editor

