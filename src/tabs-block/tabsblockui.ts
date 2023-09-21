import { Plugin } from 'ckeditor5/src/core';
import { ButtonView } from 'ckeditor5/src/ui';

import tabsIcon from '../../theme/icons/tabs.svg';
import { TABS_BLOCK } from '../constants';

export class TabsBlockUI extends Plugin {
  /**
   * @inheritDoc
   */
  public static readonly pluginName = 'TabsBlockUI';

  /**
   * @inheritDoc
   */
  public init(): void {
    const editor = this.editor;

    const command = editor.commands.get(TABS_BLOCK)!;

    const buttonSetting = editor.config.get(`${TABS_BLOCK}.buttonSetting`);

    editor.ui.componentFactory.add(TABS_BLOCK, (locale) => {
      const buttonView = new ButtonView(locale);

      buttonView.set({
        label: buttonSetting?.label ?? '页签',
        icon: buttonSetting?.withIcon === false ? undefined : tabsIcon,
        tooltip: buttonSetting?.tooltip ?? true,
        withText: buttonSetting?.withText ?? false,
      });

      buttonView.bind('isEnabled').to(command);

      this.listenTo(buttonView, 'execute', () => {
        editor.execute(TABS_BLOCK);
        editor.editing.view.focus();
      });

      return buttonView;
    });
  }
}
