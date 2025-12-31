import { useCallback, useEffect, useState } from 'react';

import { RichTextProvider } from 'reactjs-tiptap-editor';

// Base Kit
import { Document } from '@tiptap/extension-document';
import { HardBreak } from '@tiptap/extension-hard-break';
import { ListItem } from '@tiptap/extension-list';
import { Paragraph } from '@tiptap/extension-paragraph';
import { Text } from '@tiptap/extension-text';
import { TextStyle } from '@tiptap/extension-text-style';
import {
  Dropcursor,
  Gapcursor,
  Placeholder,
  TrailingNode,
} from '@tiptap/extensions';

// build extensions
import {
  Attachment,
  RichTextAttachment,
} from 'reactjs-tiptap-editor/attachment';
import {
  Blockquote,
  RichTextBlockquote,
} from 'reactjs-tiptap-editor/blockquote';
import { Bold, RichTextBold } from 'reactjs-tiptap-editor/bold';
import {
  BulletList,
  RichTextBulletList,
} from 'reactjs-tiptap-editor/bulletlist';
import { Clear, RichTextClear } from 'reactjs-tiptap-editor/clear';
import { Code, RichTextCode } from 'reactjs-tiptap-editor/code';
import { CodeBlock, RichTextCodeBlock } from 'reactjs-tiptap-editor/codeblock';
import { CodeView, RichTextCodeView } from 'reactjs-tiptap-editor/codeview';
import { Color, RichTextColor } from 'reactjs-tiptap-editor/color';
import {
  Column,
  ColumnNode,
  MultipleColumnNode,
  RichTextColumn,
} from 'reactjs-tiptap-editor/column';
import { Drawer, RichTextDrawer } from 'reactjs-tiptap-editor/drawer';
import { Emoji, RichTextEmoji } from 'reactjs-tiptap-editor/emoji';
import {
  Excalidraw,
  RichTextExcalidraw,
} from 'reactjs-tiptap-editor/excalidraw';
import { ExportPdf, RichTextExportPdf } from 'reactjs-tiptap-editor/exportpdf';
import {
  ExportWord,
  RichTextExportWord,
} from 'reactjs-tiptap-editor/exportword';
import {
  FontFamily,
  RichTextFontFamily,
} from 'reactjs-tiptap-editor/fontfamily';
import { FontSize, RichTextFontSize } from 'reactjs-tiptap-editor/fontsize';
import { Heading, RichTextHeading } from 'reactjs-tiptap-editor/heading';
import { Highlight, RichTextHighlight } from 'reactjs-tiptap-editor/highlight';
import {
  History,
  RichTextRedo,
  RichTextUndo,
} from 'reactjs-tiptap-editor/history';
import {
  HorizontalRule,
  RichTextHorizontalRule,
} from 'reactjs-tiptap-editor/horizontalrule';
import { Iframe, RichTextIframe } from 'reactjs-tiptap-editor/iframe';
import { Image, RichTextImage } from 'reactjs-tiptap-editor/image';
import { ImageGif, RichTextImageGif } from 'reactjs-tiptap-editor/imagegif';
import {
  ImportWord,
  RichTextImportWord,
} from 'reactjs-tiptap-editor/importword';
import { Indent, RichTextIndent } from 'reactjs-tiptap-editor/indent';
import { Italic, RichTextItalic } from 'reactjs-tiptap-editor/italic';
import { Katex, RichTextKatex } from 'reactjs-tiptap-editor/katex';
import {
  LineHeight,
  RichTextLineHeight,
} from 'reactjs-tiptap-editor/lineheight';
import { Link, RichTextLink } from 'reactjs-tiptap-editor/link';
import { Mention } from 'reactjs-tiptap-editor/mention';
import { Mermaid, RichTextMermaid } from 'reactjs-tiptap-editor/mermaid';
import { MoreMark, RichTextMoreMark } from 'reactjs-tiptap-editor/moremark';
import {
  OrderedList,
  RichTextOrderedList,
} from 'reactjs-tiptap-editor/orderedlist';
import {
  RichTextSearchAndReplace,
  SearchAndReplace,
} from 'reactjs-tiptap-editor/searchandreplace';
import { RichTextStrike, Strike } from 'reactjs-tiptap-editor/strike';
import { RichTextTable, Table } from 'reactjs-tiptap-editor/table';
import { RichTextTaskList, TaskList } from 'reactjs-tiptap-editor/tasklist';
import { RichTextAlign, TextAlign } from 'reactjs-tiptap-editor/textalign';
import {
  RichTextTextDirection,
  TextDirection,
} from 'reactjs-tiptap-editor/textdirection';
import {
  RichTextUnderline,
  TextUnderline,
} from 'reactjs-tiptap-editor/textunderline';
import { RichTextTwitter, Twitter } from 'reactjs-tiptap-editor/twitter';
import { RichTextVideo, Video } from 'reactjs-tiptap-editor/video';
import { RichTextCallout, Callout } from 'reactjs-tiptap-editor/callout';

// Slash Command
import {
  SlashCommand,
  SlashCommandList,
} from 'reactjs-tiptap-editor/slashcommand';

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
  RichTextBubbleVideo,
  RichTextBubbleMenuDragHandle,
  RichTextBubbleCallout
} from 'reactjs-tiptap-editor/bubble';

import '@excalidraw/excalidraw/index.css';
import 'easydrawer/styles.css';
import 'katex/dist/katex.min.css';
import 'prism-code-editor-lightweight/layout.css';
import 'prism-code-editor-lightweight/themes/github-dark.css';
import 'reactjs-tiptap-editor/style.css';

import { Header, NavBar } from '@/components/Editor/Header';
import { EditorContent, useEditor } from '@tiptap/react';
import 'katex/contrib/mhchem';
import { CharacterCount } from '@tiptap/extensions';
import { Count } from '@/components/Editor/extension/Count';

function convertBase64ToBlob(base64: string) {
  const arr = base64.split(',');
  const mime = arr[0].match(/:(.*?);/)![1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

// custom document to support columns
const DocumentColumn = /* @__PURE__ */ Document.extend({
  content: '(block|columns)+',
});

const MOCK_USERS = [
  {
    id: '0',
    label: 'hunghg255',
    avatar: {
      src: 'https://avatars.githubusercontent.com/u/42096908?v=4',
    },
  },
  {
    id: '1',
    label: 'benjamincanac',
    avatar: {
      src: 'https://avatars.githubusercontent.com/u/739984?v=4',
    },
  },
  {
    id: '2',
    label: 'atinux',
    avatar: {
      src: 'https://avatars.githubusercontent.com/u/904724?v=4',
    },
  },
  {
    id: '3',
    label: 'danielroe',
    avatar: {
      src: 'https://avatars.githubusercontent.com/u/28706372?v=4',
    },
  },
  {
    id: '4',
    label: 'pi0',
    avatar: {
      src: 'https://avatars.githubusercontent.com/u/5158436?v=4',
    },
  },
];

const BaseKit = [
  DocumentColumn,
  Text,
  Dropcursor.configure({
    class: 'reactjs-tiptap-editor-theme',
    color: 'hsl(var(--primary))',
    width: 2,
  }),
  Gapcursor,
  HardBreak,
  Paragraph,
  TrailingNode,
  ListItem,
  TextStyle,
  Placeholder.configure({
    placeholder: "Press '/' for commands",
  }),
];

const LIMIT = 2505;

const extensions = [
  ...BaseKit,
  CharacterCount.configure({
    limit: LIMIT,
  }),

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
          resolve(URL.createObjectURL(files));
        }, 300);
      });
    },
  }),
  Video.configure({
    upload: (files: File) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(URL.createObjectURL(files));
        }, 300);
      });
    },
  }),
  ImageGif.configure({
    provider: 'giphy',
    API_KEY: process.env.NEXT_PUBLIC_GIPHY_API_KEY as string,
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
      const reader = new FileReader();
      reader.readAsDataURL(file);

      return new Promise((resolve) => {
        setTimeout(() => {
          const blob = convertBase64ToBlob(reader.result as string);
          resolve(URL.createObjectURL(blob));
        }, 300);
      });
    },
  }),
  Katex,
  Excalidraw,
  Mermaid.configure({
    upload: (file: any) => {
      // fake upload return base 64
      const reader = new FileReader();
      reader.readAsDataURL(file);

      return new Promise((resolve) => {
        setTimeout(() => {
          const blob = convertBase64ToBlob(reader.result as string);
          resolve(URL.createObjectURL(blob));
        }, 300);
      });
    },
  }),
  Drawer.configure({
    upload: (file: any) => {
      // fake upload return base 64
      const reader = new FileReader();
      reader.readAsDataURL(file);

      return new Promise((resolve) => {
        setTimeout(() => {
          const blob = convertBase64ToBlob(reader.result as string);
          resolve(URL.createObjectURL(blob));
        }, 300);
      });
    },
  }),
  Twitter,
  Mention.configure({
    // suggestion: {
    //   char: '@',
    //   items: async ({ query }: any) => {
    //     return MOCK_USERS.filter(item => item.label.toLowerCase().startsWith(query.toLowerCase()));
    //   },
    // }
    suggestions: [
      {
        char: '@',
        items: async ({ query }: any) => {
          return MOCK_USERS.filter((item) =>
            item.label.toLowerCase().startsWith(query.toLowerCase()),
          );
        },
      },
      {
        char: '#',
        items: async ({ query }: any) => {
          return MOCK_USERS.filter((item) =>
            item.label.toLowerCase().startsWith(query.toLowerCase()),
          );
        },
      },
    ],
  }),
  SlashCommand,
  CodeView,
  Callout
];

const DEFAULT = `<h1 dir="auto" style="text-align: center">Rich Text Editor</h1><p dir="auto" style="text-align: center">A modern WYSIWYG rich text editor based on <a target="_blank" rel="noopener noreferrer nofollow" class="link" href="https://github.com/scrumpy/tiptap">tiptap</a> and <a target="_blank" rel="noopener noreferrer nofollow" class="link" href="https://ui.shadcn.com/">shadcn</a> for Reactjs</p><p dir="auto"></p><p dir="auto"><div style="text-align: center;" class="image"><img style="" dir="auto" src="https://picsum.photos/1920/1080.webp?t=1" width="303" flipx="false" flipy="false" align="center" inline="false"></div></p><p dir="auto"></p><h2 dir="auto">Features</h2><ul dir="auto"><li dir="auto"><p dir="auto">Use React, tailwindcss, <a target="_blank" rel="noopener noreferrer nofollow" class="link" href="https://ui.shadcn.com/">shadcn</a> components</p></li><li dir="auto"><p dir="auto">I18n support (vi, en, zh, pt, ...)</p></li><li dir="auto"><p dir="auto">Slash Commands (type <code>/</code> to show menu list)</p></li><li dir="auto"><p dir="auto">Multi Column</p></li><li dir="auto"><p dir="auto">Support emoji <span dir="auto" data-name="100" data-type="emoji">💯</span> (type <code>:</code> to show emoji list)</p></li><li dir="auto"><p dir="auto">Support iframe</p></li><li dir="auto"><p dir="auto">Support mermaid</p></li><li dir="auto"><p dir="auto">Support mention <span class="mention" data-type="mention" dir="auto" data-id="0" data-label="hunghg255" data-mention-suggestion-char="@">@hunghg255</span> (type <code>@</code> to show list)</p></li><li dir="auto"><p dir="auto">Suport katex math (<span class="katex" dir="auto" text="c%20%3D%20%5Cpm%5Csqrt%7Ba%5E2%20%2B%20b%5E2%7D" macros=""></span>)</p></li></ul><h2 dir="auto">Installation</h2><pre dir="auto" code="pnpm install reactjs-tiptap-editor@latest" language="bash" linenumbers="true" wordwrap="false" tabsize="2" shouldfocus="false"><code>pnpm install reactjs-tiptap-editor@latest</code></pre><p dir="auto"></p>`;

function debounce(func: any, wait: number) {
  let timeout: NodeJS.Timeout;
  return function (...args: any[]) {
    clearTimeout(timeout);
    // @ts-ignore
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

const RichTextToolbar = () => {
  return (
    <div className="flex items-center !p-1 gap-2 flex-wrap !border-b !border-solid !border-border">
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
      <RichTextCallout />
    </div>
  );
};

function App() {
  const [content, setContent] = useState(DEFAULT);

  const onValueChange = useCallback(
    debounce((value: any) => {
      setContent(value);
    }, 300),
    [],
  );

  const editor = useEditor({
    // shouldRerenderOnTransaction:  false,
    textDirection: 'auto', // global text direction
    content,
    extensions,
    // content,
    immediatelyRender: false, // error duplicate plugin key
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onValueChange(html);
    },
  });

  useEffect(() => {
    window['editor'] = editor;
  }, [editor]);

  return (
    <>
      <div className="border-b border-border shadow-md">
        <div className="w-full max-w-[1200px] p-4  mx-[auto] my-0">
          <Header editor={editor} />
        </div>
      </div>

      <div className=" w-full max-w-[1200px] mx-[auto] my-0 px-4">
        <NavBar editor={editor} />

        <RichTextProvider editor={editor}>
          <div className="overflow-hidden rounded-[0.5rem] bg-background !border !border-border">
            <div className="flex max-h-full w-full flex-col">
              <RichTextToolbar />

              <EditorContent editor={editor} />

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
              <RichTextBubbleCallout />

              {/* Command List */}
              <SlashCommandList />
              <RichTextBubbleMenuDragHandle />
            </div>

            <Count editor={editor} limit={LIMIT} />
          </div>
        </RichTextProvider>

        {typeof content === 'string' && (
          <textarea
            style={{
              marginTop: 20,
              height: 500,
            }}
            className="w-full rounded-md border border-border bg-background p-4 font-mono text-sm outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            readOnly
            value={content}
          />
        )}
      </div>
    </>
  );
}

export default App;
