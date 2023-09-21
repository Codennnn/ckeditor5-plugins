import { Command } from '@ckeditor/ckeditor5-core';
import type { Element } from 'ckeditor5/src/engine';
import { first } from 'ckeditor5/src/utils';

import { LINE_HEIGHT } from '../constants';
import type { CommandValue } from './types';
import { KEY_DEFAULT } from './utils';

export class LineHeightCommand extends Command {
  public declare value: CommandValue;

  /**
   * @inheritDoc
   */
  public override refresh(): void {
    const firstBlock = first(this.editor.model.document.selection.getSelectedBlocks());

    this.isEnabled = !!firstBlock && this.#canSetLineHeight(firstBlock);

    if (this.isEnabled && !!firstBlock && firstBlock.hasAttribute(LINE_HEIGHT)) {
      this.value = firstBlock.getAttribute(LINE_HEIGHT) as CommandValue;
    } else {
      this.value = KEY_DEFAULT;
    }
  }

  public override execute(options: { value?: CommandValue } = {}): void {
    const editor = this.editor;
    const model = editor.model;
    const doc = model.document;

    const value = options.value;

    model.change((writer) => {
      const blocks = Array.from(doc.selection.getSelectedBlocks()).filter((block) =>
        this.#canSetLineHeight(block)
      );

      for (const block of blocks) {
        writer.setAttribute(LINE_HEIGHT, value, block);
      }
    });
  }

  #canSetLineHeight(block: Element) {
    return this.editor.model.schema.checkAttribute(block, LINE_HEIGHT);
  }
}
