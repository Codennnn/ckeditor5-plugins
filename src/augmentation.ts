import type { DETAILS_BLOCK, LINE_HEIGHT, TABS_BLOCK } from './constants';
import type {
  DetailsBlock,
  DetailsBlockCommand,
  DetailsBlockConfig,
  DetailsBlockEditing,
  DetailsBlockUI,
  LineHeight,
  LineHeightCommand,
  LineHeightConfig,
  LineHeightEditing,
  LineHeightUI,
  TabsBlock,
  TabsBlockCommand,
  TabsBlockConfig,
  TabsBlockEditing,
  TabsBlockUI,
} from './index';

declare module '@ckeditor/ckeditor5-core' {
  interface EditorConfig {
    [LINE_HEIGHT]?: LineHeightConfig;
    [DETAILS_BLOCK]?: DetailsBlockConfig;
    [TABS_BLOCK]?: TabsBlockConfig;
  }

  interface PluginsMap {
    [LineHeight.pluginName]: LineHeight;
    [LineHeightEditing.pluginName]: LineHeightEditing;
    [LineHeightUI.pluginName]: LineHeightUI;

    [DetailsBlock.pluginName]: DetailsBlock;
    [DetailsBlockEditing.pluginName]: DetailsBlockEditing;
    [DetailsBlockUI.pluginName]: DetailsBlockUI;

    [DetailsBlock.pluginName]: TabsBlock;
    [TabsBlockEditing.pluginName]: TabsBlockEditing;
    [TabsBlockUI.pluginName]: TabsBlockUI;
  }

  interface CommandsMap {
    [LINE_HEIGHT]: LineHeightCommand;
    [DETAILS_BLOCK]: DetailsBlockCommand;
    [TABS_BLOCK]: TabsBlockCommand;
  }
}
