import { Plugin } from 'ckeditor5/src/core';
import { ButtonView } from 'ckeditor5/src/ui';

import detailsIcon from '../../theme/icons/details.svg';
import { DETAILS_BLOCK } from '../constants';

export class DetailsBlockUI extends Plugin {
  /**
   * @inheritDoc
   */
  public static readonly pluginName = 'DetailsBlockUI';

  /**
   * @inheritDoc
   */
  public init(): void {
    const editor = this.editor;

    const command = editor.commands.get(DETAILS_BLOCK)!;

    const buttonSetting = editor.config.get(`${DETAILS_BLOCK}.buttonSetting`);

    editor.ui.componentFactory.add(DETAILS_BLOCK, (locale) => {
      const buttonView = new ButtonView(locale);

      buttonView.set({
        label: buttonSetting?.label ?? '分块区段',
        icon: buttonSetting?.withIcon === false ? undefined : detailsIcon,
        tooltip: buttonSetting?.tooltip ?? true,
        withText: buttonSetting?.withText ?? false,
      });

      buttonView.bind('isEnabled').to(command);

      this.listenTo(buttonView, 'execute', () => {
        editor.execute(DETAILS_BLOCK);
        editor.editing.view.focus();
      });

      return buttonView;
    });
  }
}
