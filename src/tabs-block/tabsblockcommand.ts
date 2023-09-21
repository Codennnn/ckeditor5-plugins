import { Command } from 'ckeditor5/src/core';

import { TABS_BLOCK } from '../constants';
import {
  appendTabItem,
  defaultTabItems,
  generateTabsId,
  MODEL_ATTR_TABS_ACTIVE_KEY,
  MODEL_ATTR_TABS_ID,
  ModelName,
} from './utils';

export class TabsBlockCommand extends Command {
  /**
   * @inheritDoc
   */
  public override refresh(): void {
    const model = this.editor.model;
    const selection = model.document.selection;
    const allowedIn = model.schema.findAllowedParent(
      selection.getFirstPosition()!,
      ModelName.Wrapper
    );

    this.isEnabled = allowedIn !== null;
  }

  public override execute(): void {
    const editor = this.editor;
    const model = editor.model;

    model.change((writer) => {
      const tabsId = generateTabsId();

      const tabsWrapper = writer.createElement(ModelName.Wrapper);
      const tabsRoot = writer.createElement(ModelName.Root, {
        [MODEL_ATTR_TABS_ID]: tabsId,
      });
      const tabsNav = writer.createElement(ModelName.Nav);
      const tabsContent = writer.createElement(ModelName.Content);

      writer.append(tabsRoot, tabsWrapper);
      writer.append(tabsNav, tabsRoot);
      writer.append(tabsContent, tabsRoot);

      const tbasItems = editor.config.get(`${TABS_BLOCK}.template.items`) || defaultTabItems;
      const allowAdd = editor.config.get(`${TABS_BLOCK}.allowAdd`) ?? true;

      if (allowAdd) {
        const tabsAdd = writer.createElement(ModelName.Add);
        writer.append(tabsAdd, tabsNav);
      }

      tbasItems.forEach((item, idx) => {
        appendTabItem({ writer, item, tabsNav, tabsContent });

        if (idx === 0) {
          writer.setAttribute(MODEL_ATTR_TABS_ACTIVE_KEY, item.key, tabsRoot);
        }
      });

      model.insertContent(tabsWrapper);
    });
  }
}
