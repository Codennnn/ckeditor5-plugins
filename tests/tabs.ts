import { ClassicEditor } from '@ckeditor/ckeditor5-editor-classic';
import { Essentials } from '@ckeditor/ckeditor5-essentials';
import { Heading } from '@ckeditor/ckeditor5-heading';
import { Paragraph } from '@ckeditor/ckeditor5-paragraph';
import { expect } from 'chai';

import { TABS_BLOCK } from '../src/constants';
import TabsBlock from '../src/tabsblock';

describe('Tabs', () => {
  it('should be named', () => {
    expect(TabsBlock.pluginName).to.equal('TabsBlock');
  });

  describe('init()', () => {
    let domElement: HTMLElement, editor: ClassicEditor;

    beforeEach(async () => {
      domElement = document.createElement('div');
      document.body.appendChild(domElement);

      editor = await ClassicEditor.create(domElement, {
        plugins: [Paragraph, Heading, Essentials, TabsBlock],
        toolbar: [TABS_BLOCK],
      });
    });

    afterEach(() => {
      domElement.remove();
      return editor.destroy();
    });

    it('should load Tabs', () => {
      const myPlugin = editor.plugins.get('TabsBlock');

      expect(myPlugin).to.be.an.instanceof(TabsBlock);
    });

    it('should add an icon to the toolbar', () => {
      expect(editor.ui.componentFactory.has(TABS_BLOCK)).to.equal(true);
    });
  });
});
