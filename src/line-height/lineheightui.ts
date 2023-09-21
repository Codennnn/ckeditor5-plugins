import { Plugin } from 'ckeditor5/src/core';
import {
  addListToDropdown,
  createDropdown,
  type ListDropdownItemDefinition,
  Model,
} from 'ckeditor5/src/ui';
import { Collection } from 'ckeditor5/src/utils';

import lineHeightIcon from '../../theme/icons/line-height.svg';
import { LINE_HEIGHT } from '../constants';
import type { LineHeightCommand } from './lineheightcommand';
import type { LineHeightOption } from './types';
import { defaultLineHeightConfiguredOptions, normalizeOptions } from './utils';

/** 构建下拉选项。 */
function prepareListOptions(
  options: LineHeightOption[],
  command: LineHeightCommand
): Collection<ListDropdownItemDefinition> {
  const itemDefinitions = new Collection<ListDropdownItemDefinition>();

  for (const option of options) {
    // 定义每个选项的属性。
    const def = {
      type: 'button' as const,
      model: new Model({
        commandName: LINE_HEIGHT,
        commandParam: option.model,
        label: option.title,
        class: 'ck-line-height-option',
        role: 'menuitemradio',
        withText: true,
      }),
    };

    def.model.bind('isOn').to(command, 'value', (value) => {
      return value === option.model;
    });

    itemDefinitions.add(def);
  }

  return itemDefinitions;
}

export class LineHeightUI extends Plugin {
  /**
   * @inheritDoc
   */
  public static readonly pluginName = 'LineHeightUI';

  /**
   * @inheritDoc
   */
  public init(): void {
    const editor = this.editor;

    const options = normalizeOptions(
      editor.config.get(`${LINE_HEIGHT}.options`) || defaultLineHeightConfiguredOptions
    );

    const command = editor.commands.get(LINE_HEIGHT)!;

    editor.ui.componentFactory.add(LINE_HEIGHT, (locale) => {
      const dropdownView = createDropdown(locale);

      addListToDropdown(dropdownView, () => prepareListOptions(options, command), {
        role: 'menu',
      });

      dropdownView.buttonView.set({
        label: '行距',
        icon: lineHeightIcon,
        tooltip: true,
      });

      dropdownView.extendTemplate({
        attributes: {
          class: ['ck-line-height-dropdown'],
        },
      });

      dropdownView.bind('isEnabled').to(command);

      // 选中 dropdown item 时执行 command。
      this.listenTo(dropdownView, 'execute', (ev) => {
        if (
          'commandName' in ev.source &&
          typeof ev.source.commandName === 'string' &&
          'commandParam' in ev.source
        ) {
          editor.execute(ev.source.commandName, {
            value: ev.source.commandParam,
          });
          editor.editing.view.focus();
        }
      });

      return dropdownView;
    });
  }
}
