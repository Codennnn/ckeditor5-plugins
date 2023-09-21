import { Autoformat } from '@ckeditor/ckeditor5-autoformat';
import { Bold, Code, Italic } from '@ckeditor/ckeditor5-basic-styles';
import { BlockQuote } from '@ckeditor/ckeditor5-block-quote';
import { CodeBlock } from '@ckeditor/ckeditor5-code-block';
import { ClassicEditor } from '@ckeditor/ckeditor5-editor-classic';
import { Essentials } from '@ckeditor/ckeditor5-essentials';
import { Font } from '@ckeditor/ckeditor5-font';
import { Heading } from '@ckeditor/ckeditor5-heading';
import {
  Image,
  ImageCaption,
  ImageStyle,
  ImageToolbar,
  ImageUpload,
} from '@ckeditor/ckeditor5-image';
import { Indent } from '@ckeditor/ckeditor5-indent';
import CKEditorInspector from '@ckeditor/ckeditor5-inspector';
import { Link } from '@ckeditor/ckeditor5-link';
import { List } from '@ckeditor/ckeditor5-list';
import { MediaEmbed } from '@ckeditor/ckeditor5-media-embed';
import { Paragraph } from '@ckeditor/ckeditor5-paragraph';
import { Table, TableToolbar } from '@ckeditor/ckeditor5-table';
import { Base64UploadAdapter } from '@ckeditor/ckeditor5-upload';

import { DETAILS_BLOCK, LINE_HEIGHT, TABS_BLOCK } from '../src/constants';
import DetailsBlock from '../src/detailsblock';
import LineHeight from '../src/lineheight';
import TabsBlock from '../src/tabsblock';

declare global {
  interface Window {
    editor: ClassicEditor;
  }
}

ClassicEditor.create(document.getElementById('editor')!, {
  plugins: [
    LineHeight,
    DetailsBlock,
    TabsBlock,
    Font,
    Essentials,
    Autoformat,
    BlockQuote,
    Bold,
    Heading,
    Image,
    ImageCaption,
    ImageStyle,
    ImageToolbar,
    ImageUpload,
    Indent,
    Italic,
    Link,
    List,
    MediaEmbed,
    Paragraph,
    Table,
    TableToolbar,
    CodeBlock,
    Code,
    Base64UploadAdapter,
  ],

  toolbar: [
    LINE_HEIGHT,
    DETAILS_BLOCK,
    TABS_BLOCK,
    '|',
    'fontSize',
    '|',
    'bold',
    'italic',
    'link',
    'code',
    'bulletedList',
    'numberedList',
    '|',
    'outdent',
    'indent',
    '|',
    'blockQuote',
    'insertTable',
    'codeBlock',
    '|',
    'undo',
    'redo',
  ],

  lineHeight: {
    options: [
      NaN,
      'default',
      1,
      2,
      3,
      {
        title: '4.0',
        model: '4',
        view: {
          name: 'div',
          styles: {
            'line-height': '4',
          },
        },
      },
    ],
  },

  detailsBlock: {
    placeholder: '请输入内容...',
    buttonSetting: {
      label: '区段',
      withText: true,
      withIcon: false,
    },
  },

  tabsBlock: {
    template: {
      items: [
        {
          key: '1',
          label: '标签 1',
        },
        {
          key: '2',
          label: '标签 2',
        },
      ],
    },
    allowAdd: true,
    buttonSetting: {
      withText: true,
      withIcon: false,
    },
  },

  fontSize: {
    options: ['default', 14, 16, 18],
  },

  image: {
    toolbar: [
      'imageStyle:inline',
      'imageStyle:block',
      'imageStyle:side',
      '|',
      'imageTextAlternative',
    ],
  },

  table: {
    contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells'],
  },
})
  .then((editor) => {
    window.editor = editor;
    CKEditorInspector.attach(editor);
  })
  .catch((err) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    window.console.error(err.stack);
  });
