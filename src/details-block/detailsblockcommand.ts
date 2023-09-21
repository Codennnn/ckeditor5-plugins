import { Command } from 'ckeditor5/src/core';

import type { CommandValue } from './types';
import { DetailsModel, generateDetailsId, ModelAttr } from './utils';

export class DetailsBlockCommand extends Command {
  public declare value: CommandValue;

  /**
   * @inheritDoc
   */
  public override refresh(): void {
    const model = this.editor.model;
    const selection = model.document.selection;
    const allowedIn = model.schema.findAllowedParent(
      selection.getFirstPosition()!,
      DetailsModel.Wrapper
    );

    this.isEnabled = allowedIn !== null;
  }

  public override execute(): void {
    const model = this.editor.model;
    const selection = model.document.selection;
    const selectedContent = model.getSelectedContent(selection);

    model.change((writer) => {
      const detailsWrapper = writer.createElement(DetailsModel.Wrapper);

      const blockId = generateDetailsId();
      const detailsRoot = writer.createElement(DetailsModel.Root, {
        [ModelAttr.ID]: blockId,
      });
      writer.append(detailsRoot, detailsWrapper);

      const detailsSummary = writer.createElement(DetailsModel.Summary);
      writer.append(detailsSummary, detailsRoot);

      const detailsTrigger = writer.createElement(DetailsModel.Trigger);
      writer.append(detailsTrigger, detailsSummary);

      const detailsTitle = writer.createElement('paragraph');
      writer.append(detailsTitle, detailsSummary);

      const detailsContent = writer.createElement(DetailsModel.Content);
      writer.append(detailsContent, detailsRoot);

      if (selection.isCollapsed) {
        writer.appendElement('paragraph', detailsContent);
      }

      model.insertContent(detailsWrapper);

      if (!selection.isCollapsed) {
        // 将光标选中的内容放置到 details content 里面。
        writer.setSelection(detailsContent, 0);
        model.insertContent(selectedContent);
      }

      writer.setSelection(detailsTitle, 'in');
    });
  }
}
