'use client';

/* eslint-disable unicorn/no-null */
/* eslint-disable quotes */
import React, { useCallback, useState } from 'react';

import RcTiptapEditor from 'reactjs-tiptap-editor';

import { locale } from 'reactjs-tiptap-editor/locale-bundle';

import {
  BaseKit,
  Blockquote,
  Bold,
  BulletList,
  Clear,
  Code,
  CodeBlock,
  Color,
  ColumnActionButton,
  Emoji,
  ExportPdf,
  ExportWord,
  FontFamily,
  FontSize,
  FormatPainter,
  Heading,
  Highlight,
  History,
  HorizontalRule,
  Iframe,
  Image,
  ImportWord,
  Indent,
  Italic,
  Katex,
  LineHeight,
  Link,
  MoreMark,
  OrderedList,
  SearchAndReplace,
  SlashCommand,
  Strike,
  Table,
  TaskList,
  TextAlign,
  Underline,
  Video,
  TableOfContents,
  Excalidraw,
  TextDirection,
  Mention,
  Attachment,
  ImageGif,
  Mermaid,
  Twitter
} from 'reactjs-tiptap-editor/extension-bundle';

import 'katex/dist/katex.min.css';

import 'reactjs-tiptap-editor/style.css';


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
    multiColumn: true,
    placeholder: {
      showOnlyCurrent: true,
    },
    characterCount: {
      limit: 50_000,
    },
  }),
  History,
  SearchAndReplace,
  TextDirection,
  TableOfContents,
  FormatPainter.configure({ spacer: true }),
  Clear,
  FontFamily,
  Heading.configure({ spacer: true }),
  FontSize,
  Bold,
  Italic,
  Underline,
  Strike,
  MoreMark,
  Katex,
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
    GIPHY_API_KEY: process.env.NEXT_PUBLIC_GIPHY_API_KEY
  }),
  Blockquote.configure({ spacer: true }),
  SlashCommand,
  HorizontalRule,
  Code.configure({
    toolbar: false,
  }),
  CodeBlock.configure({ defaultTheme: 'dracula' }),
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
  Excalidraw,
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
  Twitter,
];

const DEFAULT = `<ul><li><p dir="auto">12321323</p></li><li><p dir="auto">45678</p></li></ul><p dir="auto"></p>`;

function debounce(func: any, wait: number) {
  let timeout: NodeJS.Timeout;
  return function (...args: any[]) {
    clearTimeout(timeout);
    // @ts-ignore
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

function Editor() {
  const [content, setContent] = useState(DEFAULT);
  const refEditor = React.useRef<any>(null);

  const [theme, setTheme] = useState('light');
  const [disable, setDisable] = useState(false);

  const onValueChange = useCallback(
    debounce((value: any) => {
      setContent(value);
    }, 300),
    [],
  );

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
          <button onClick={() => locale.setLang('vi')}>Vietnamese</button>
          <button onClick={() => locale.setLang('en')}>English</button>
          <button onClick={() => locale.setLang('zh_CN')}>Chinese</button>
          <button type="button" onClick={() => locale.setLang('pt_BR')}>Português</button>
          <button type="button" onClick={() => locale.setLang('hu_HU')}>Hungarian</button>
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
        <RcTiptapEditor
        ref={refEditor}
          output='html'
          content={DEFAULT}
          onChangeContent={onValueChange}
          extensions={extensions}
          dark={theme === 'dark'}
          disabled={disable}
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
  );
}

export default Editor;
