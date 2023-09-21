import '../theme/tabs-block.css';

import { Plugin } from '@ckeditor/ckeditor5-core';

import { TabsBlockEditing } from './tabs-block/tabsblockediting';
import { TabsBlockUI } from './tabs-block/tabsblockui';

export default class TabsBlock extends Plugin {
  /**
   * @inheritDoc
   */
  public static get requires() {
    return [TabsBlockEditing, TabsBlockUI] as const;
  }

  /**
   * @inheritDoc
   */
  public static readonly pluginName = 'TabsBlock';
}
