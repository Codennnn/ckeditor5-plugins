import { Plugin } from '@ckeditor/ckeditor5-core';

import { LineHeightEditing } from './line-height/lineheightediting';
import { LineHeightUI } from './line-height/lineheightui';

export default class LineHeight extends Plugin {
  /**
   * @inheritDoc
   */
  public static get requires() {
    return [LineHeightEditing, LineHeightUI] as const;
  }

  /**
   * @inheritDoc
   */
  public static readonly pluginName = 'LineHeight';
}
