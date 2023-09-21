import { type Editor, Plugin } from '@ckeditor/ckeditor5-core';

import { LINE_HEIGHT } from '../constants';
import { LineHeightCommand } from './lineheightcommand';
import { buildDefinition, defaultLineHeightConfiguredOptions, normalizeOptions } from './utils';

export class LineHeightEditing extends Plugin {
  /**
   * @inheritDoc
   */
  public static readonly pluginName = 'LineHeightEditing';

  constructor(editor: Editor) {
    super(editor);

    // 定义默认的配置选项。
    editor.config.define(LINE_HEIGHT, {
      options: defaultLineHeightConfiguredOptions,
    });
  }

  /**
   * @inheritDoc
   */
  public init(): void {
    const editor = this.editor;
    const schema = editor.model.schema;

    schema.extend('$block', { allowAttributes: LINE_HEIGHT });

    // FIXME: 为 `listItem` 设置行高会引发错误，所以先禁止，暂时无法找到原因。
    // schema.addAttributeCheck((context, attributeName) => {
    //   const item = context.last;

    //   if (attributeName === LINE_HEIGHT && item.name === 'listItem') {
    //     return false;
    //   }
    // });

    schema.setAttributeProperties(LINE_HEIGHT, { isFormatting: true });

    const options = normalizeOptions(
      editor.config.get(`${LINE_HEIGHT}.options`) || defaultLineHeightConfiguredOptions
    );

    const definition = buildDefinition(options);
    editor.conversion.attributeToElement(definition);

    editor.commands.add(LINE_HEIGHT, new LineHeightCommand(editor));
  }
}
