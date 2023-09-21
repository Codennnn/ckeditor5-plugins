import '../theme/details-block.css';

import { Plugin } from 'ckeditor5/src/core';

import { DetailsBlockEditing } from './details-block/detailsblockediting';
import { DetailsBlockUI } from './details-block/detailsblockui';

export default class DetailsBlock extends Plugin {
  /**
   * @inheritDoc
   */
  public static get requires() {
    return [DetailsBlockEditing, DetailsBlockUI] as const;
  }

  /**
   * @inheritDoc
   */
  public static readonly pluginName = 'DetailsBlock';
}
