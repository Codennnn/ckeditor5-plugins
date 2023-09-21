import { ClassicEditor } from '@ckeditor/ckeditor5-editor-classic';
import { Essentials } from '@ckeditor/ckeditor5-essentials';
import { Heading } from '@ckeditor/ckeditor5-heading';
import { Paragraph } from '@ckeditor/ckeditor5-paragraph';
import { expect } from 'chai';

import { LINE_HEIGHT } from '../src/constants';
import LineHeight from '../src/lineheight';

describe('LineHeight', () => {
  it('should be named', () => {
    expect(LineHeight.pluginName).to.equal('LineHeight');
  });

  describe('init()', () => {
    let domElement: HTMLElement, editor: ClassicEditor;

    beforeEach(async () => {
      domElement = document.createElement('div');
      document.body.appendChild(domElement);

      editor = await ClassicEditor.create(domElement, {
        plugins: [Paragraph, Heading, Essentials, LineHeight],
        toolbar: [LINE_HEIGHT],
      });
    });

    afterEach(() => {
      domElement.remove();
      return editor.destroy();
    });

    it('should load LineHeight', () => {
      const myPlugin = editor.plugins.get('LineHeight');

      expect(myPlugin).to.be.an.instanceof(LineHeight);
    });

    it('should add an icon to the toolbar', () => {
      expect(editor.ui.componentFactory.has(LINE_HEIGHT)).to.equal(true);
    });
  });
});
