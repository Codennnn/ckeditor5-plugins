import {
  enablePlaceholder,
  type ViewDocumentClickEvent,
  type ViewDocumentKeyDownEvent,
} from '@ckeditor/ckeditor5-engine';
import { toWidget, toWidgetEditable, Widget } from '@ckeditor/ckeditor5-widget';
import { type Editor, Plugin } from 'ckeditor5/src/core';

import { DETAILS_BLOCK } from '../constants';
import { DetailsBlockCommand } from './detailsblockcommand';
import { DetailsModel, generateDetailsId, ModelAttr, ViewAttr } from './utils';

export class DetailsBlockEditing extends Plugin {
  /**
   * @inheritDoc
   */
  public static readonly pluginName = 'DetailsBlockEditing';

  /**
   * @inheritDoc
   */
  public static get requires() {
    return [Widget] as const;
  }

  constructor(editor: Editor) {
    super(editor);

    editor.config.define(DETAILS_BLOCK, {
      placeholder: undefined,
    });
  }

  /**
   * @inheritDoc
   */
  public init(): void {
    const editor = this.editor;

    this.#defineSchema();
    this.#defineConverters();

    editor.commands.add(DETAILS_BLOCK, new DetailsBlockCommand(editor));
  }

  /**
   * @inheritDoc
   */
  public afterInit(): void {
    const editor = this.editor;
    const viewDocument = editor.editing.view.document;

    this.listenTo<ViewDocumentKeyDownEvent>(viewDocument, 'keydown', (_, data) => {
      const modelTarget = editor.editing.mapper.toModelElement(data.target);

      if (modelTarget && modelTarget.name === DetailsModel.Summary) {
        if (data.keyCode === 32) {
          // 处理空格输入，否则空格会触发 details 打开和关闭。
          data.domEvent.preventDefault();
          editor.model.change((writer) => {
            const selection = editor.model.document.selection;
            const insertPosition = selection.getFirstPosition();
            writer.insertText(' ', insertPosition || undefined);
          });
        }

        if (data.keyCode === 13) {
          // 处理回车输入。
          const detailsBlock = modelTarget.parent;

          if (detailsBlock?.is('model:element')) {
            const blockId = detailsBlock.getAttribute(ModelAttr.ID) as string;
            const detailsContent = detailsBlock.getChild(1);
            const detailsEl = document.querySelector(`[data-id='${blockId}']`);

            if (!detailsEl) {
              return;
            }

            if (detailsEl.getAttribute('open') === 'true') {
              // 如果 details 已经打开，则将光标移动到 details content 里面。
              editor.model.change((writer) => {
                if (detailsContent) {
                  writer.setSelection(detailsContent, 0);
                }
              });
            } else {
              if (detailsBlock.parent?.is('model:element')) {
                // 如果 details 未打开，则将光标移动到 details 下面新的一行。
                editor.execute('insertParagraph', {
                  position: editor.model.createPositionAfter(detailsBlock.parent),
                  attributes: {},
                });
              }
            }
          }
        }
      }
    });

    this.listenTo<ViewDocumentClickEvent>(viewDocument, 'click', (_, data) => {
      const modelTarget = editor.editing.mapper.toModelElement(data.target);

      if (modelTarget?.is('model:element')) {
        if (modelTarget.name === DetailsModel.Trigger) {
          const detailsRoot = data.target.parent?.parent;

          if (detailsRoot?.is('view:element')) {
            const isOpen = detailsRoot.getAttribute(ViewAttr.Open);

            editor.editing.view.change((viewWriter) => {
              if (isOpen === 'true') {
                viewWriter.removeAttribute(ViewAttr.Open, detailsRoot);
              } else {
                viewWriter.setAttribute(ViewAttr.Open, 'true', detailsRoot);
              }
            });
          }
        }

        if (
          modelTarget.name === DetailsModel.Summary ||
          modelTarget.parent?.name === DetailsModel.Summary
        ) {
          data.domEvent.preventDefault();
          data.domEvent.stopPropagation();
        }
      } else {
        data.domEvent.preventDefault();
        data.domEvent.stopPropagation();
      }
    });
  }

  #defineSchema() {
    const schema = this.editor.model.schema;

    schema.register(DetailsModel.Wrapper, {
      isObject: true,
      allowWhere: '$block',
    });

    schema.register(DetailsModel.Root, {
      isObject: true,
      isSelectable: false,
      allowIn: DetailsModel.Wrapper,
      allowAttributes: [ModelAttr.ID],
    });

    schema.register(DetailsModel.Summary, {
      isLimit: true,
      allowIn: DetailsModel.Root,
      allowContentOf: '$block',
    });

    schema.register(DetailsModel.Trigger, {
      isLimit: true,
      isSelectable: false,
      allowIn: DetailsModel.Summary,
    });

    schema.register(DetailsModel.Content, {
      isLimit: true,
      allowIn: DetailsModel.Root,
      allowContentOf: '$root',
    });
  }

  #defineConverters() {
    const conversion = this.editor.conversion;
    const view = this.editor.editing.view;

    // ==========
    conversion.for('upcast').elementToElement({
      model: DetailsModel.Wrapper,
      view: {
        name: 'div',
        classes: 'ck-details-wrapper',
      },
    });

    conversion.for('dataDowncast').elementToElement({
      model: DetailsModel.Wrapper,
      view: {
        name: 'div',
        classes: 'ck-details-wrapper',
      },
    });

    conversion.for('editingDowncast').elementToElement({
      model: DetailsModel.Wrapper,
      view: (_, { writer: viewWriter }) => {
        const div = viewWriter.createContainerElement('div', {
          class: 'ck-details-wrapper',
        });

        return toWidget(div, viewWriter, {
          label: '区段',
          hasSelectionHandle: true,
        });
      },
    });

    // ==========
    conversion.for('upcast').elementToElement({
      model: (viewElement, { writer: modelWriter }) => {
        const blockId = viewElement.getAttribute(ViewAttr.ID) || generateDetailsId();

        return modelWriter.createElement(DetailsModel.Root, {
          [ModelAttr.ID]: blockId,
        });
      },
      view: {
        name: 'details',
        classes: 'ck-details',
      },
    });

    conversion.for('dataDowncast').elementToElement({
      model: DetailsModel.Root,
      view: (modelElement, { writer: viewWriter }) => {
        const blockId = modelElement.getAttribute(ModelAttr.ID) as string;

        return viewWriter.createContainerElement('details', {
          class: 'ck-details',
          [ViewAttr.ID]: blockId,
        });
      },
    });

    conversion.for('editingDowncast').elementToElement({
      model: DetailsModel.Root,
      view: (modelElement, { writer: viewWriter }) => {
        const blockId = modelElement.getAttribute(ModelAttr.ID) as string;

        return viewWriter.createContainerElement('details', {
          class: 'ck-details',
          [ViewAttr.ID]: blockId,
          [ViewAttr.Open]: 'true',
        });
      },
    });

    // ==========
    conversion.for('upcast').elementToElement({
      model: DetailsModel.Summary,
      view: {
        name: 'summary',
        classes: 'ck-details-summary',
      },
    });

    conversion.for('dataDowncast').elementToElement({
      model: DetailsModel.Summary,
      view: {
        name: 'summary',
        classes: 'ck-details-summary',
      },
    });

    conversion.for('editingDowncast').elementToElement({
      model: DetailsModel.Summary,
      view: (_, { writer: viewWriter }) => {
        const summary = viewWriter.createEditableElement('summary', {
          class: 'ck-details-summary',
        });

        return toWidgetEditable(summary, viewWriter);
      },
    });

    // ==========
    conversion.for('upcast').elementToElement({
      model: DetailsModel.Trigger,
      view: {
        name: 'span',
        classes: 'ck-details-trigger',
      },
    });

    conversion.for('dataDowncast').elementToElement({
      model: DetailsModel.Trigger,
      view: {
        name: 'span',
        classes: 'ck-details-trigger',
      },
    });

    conversion.for('editingDowncast').elementToElement({
      model: DetailsModel.Trigger,
      view: {
        name: 'span',
        classes: 'ck-details-trigger',
      },
    });

    // ==========
    conversion.for('upcast').elementToElement({
      model: DetailsModel.Content,
      view: {
        name: 'div',
        classes: 'ck-details-content',
      },
    });

    conversion.for('dataDowncast').elementToElement({
      model: DetailsModel.Content,
      view: {
        name: 'div',
        classes: 'ck-details-content',
      },
    });

    conversion.for('editingDowncast').elementToElement({
      model: DetailsModel.Content,
      view: (_, { writer: viewWriter }) => {
        const placeholder = this.editor.config.get(`${DETAILS_BLOCK}.placeholder`);

        const div = viewWriter.createEditableElement('div', {
          class: 'ck-details-content',
        });

        enablePlaceholder({
          view,
          element: div,
          text: placeholder ?? '请输入区段内容...',
          keepOnFocus: true,
          isDirectHost: false,
        });

        return toWidgetEditable(div, viewWriter);
      },
    });
  }
}
