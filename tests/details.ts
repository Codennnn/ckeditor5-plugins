import { ClassicEditor } from '@ckeditor/ckeditor5-editor-classic';
import { Essentials } from '@ckeditor/ckeditor5-essentials';
import { Heading } from '@ckeditor/ckeditor5-heading';
import { Paragraph } from '@ckeditor/ckeditor5-paragraph';
import { expect } from 'chai';

import { DETAILS_BLOCK } from '../src/constants';
import DetailsBlock from '../src/detailsblock';

describe('Details', () => {
  it('should be named', () => {
    expect(DetailsBlock.pluginName).to.equal('DetailsBlock');
  });

  describe('init()', () => {
    let domElement: HTMLElement, editor: ClassicEditor;

    beforeEach(async () => {
      domElement = document.createElement('div');
      document.body.appendChild(domElement);

      editor = await ClassicEditor.create(domElement, {
        plugins: [Paragraph, Heading, Essentials, DetailsBlock],
        toolbar: [DETAILS_BLOCK],
      });
    });

    afterEach(() => {
      domElement.remove();
      return editor.destroy();
    });

    it('should load Details', () => {
      const myPlugin = editor.plugins.get('DetailsBlock');

      expect(myPlugin).to.be.an.instanceof(DetailsBlock);
    });

    it('should add an icon to the toolbar', () => {
      expect(editor.ui.componentFactory.has(DETAILS_BLOCK)).to.equal(true);
    });

    // it('should add a text into the editor after clicking the icon', () => {
    //   const icon = editor.ui.componentFactory.create(DETAILS_BLOCK);

    //   expect(editor.getData()).to.equal('');

    //   icon.fire('execute');

    //   expect(editor.getData()).to.equal('<p>Hello CKEditor 5!</p>');
    // });
  });
});
