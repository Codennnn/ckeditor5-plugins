import { enablePlaceholder, type ViewDocumentClickEvent } from '@ckeditor/ckeditor5-engine';
import { toWidget, toWidgetEditable, Widget } from '@ckeditor/ckeditor5-widget';
import { type Editor, Plugin } from 'ckeditor5/src/core';
import { type ViewElement } from 'ckeditor5/src/engine';

import { TABS_BLOCK } from '../constants';
import { TabsBlockCommand } from './tabsblockcommand';
import type { TabItem } from './types';
import {
  activeTabItem,
  appendTabItem,
  ClassName,
  findAllElementByClass,
  generateRandomId,
  generateTabsId,
  MODEL_ATTR_LABEL,
  MODEL_ATTR_PLACEHOLDER,
  MODEL_ATTR_TAB_KEY,
  MODEL_ATTR_TABS_ACTIVE_KEY,
  MODEL_ATTR_TABS_ID,
  ModelName,
  VIEW_ATTR_TAB_KEY,
  VIEW_ATTR_TABS_ACTIVE_KEY,
  VIEW_ATTR_TABS_ID,
} from './utils';

export class TabsBlockEditing extends Plugin {
  /**
   * @inheritDoc
   */
  public static readonly pluginName = 'TabsBlockEditing';

  /**
   * @inheritDoc
   */
  public static get requires() {
    return [Widget] as const;
  }

  constructor(editor: Editor) {
    super(editor);

    editor.config.define(TABS_BLOCK, {
      template: undefined,
    });
  }

  /**
   * @inheritDoc
   */
  public init(): void {
    const editor = this.editor;

    this.#defineSchema();
    this.#defineConverters();

    editor.commands.add(TABS_BLOCK, new TabsBlockCommand(editor));
  }

  /**
   * @inheritDoc
   */
  public afterInit(): void {
    const editor = this.editor;
    const viewDocument = editor.editing.view.document;

    this.listenTo<ViewDocumentClickEvent>(viewDocument, 'click', (_, data) => {
      const viewTarget = data.target;
      const modelTarget = editor.editing.mapper.toModelElement(viewTarget);

      if (modelTarget) {
        let tabsRoot = viewTarget.parent?.parent;

        if (tabsRoot?.is('view:element')) {
          if (tabsRoot.hasClass(ClassName.Nav)) {
            tabsRoot = tabsRoot.parent;
          }

          if (tabsRoot?.is('view:element') && tabsRoot.hasClass(ClassName.Root)) {
            const tabsNav = tabsRoot.getChild(0);
            const tabsContent = tabsRoot.getChild(1);

            if (
              tabsNav?.is('view:element') &&
              tabsContent?.is('view:element') &&
              tabsNav.hasClass(ClassName.Nav) &&
              tabsContent.hasClass(ClassName.Content)
            ) {
              const titleModel =
                modelTarget.name === ModelName.Title
                  ? modelTarget
                  : modelTarget.parent?.name === ModelName.Title
                  ? modelTarget.parent
                  : null;

              if (titleModel) {
                const activeKey = titleModel.getAttribute(MODEL_ATTR_TAB_KEY) as TabItem['key'];

                if (!activeKey) {
                  return;
                }

                activeTabItem({
                  editor,
                  tabsRoot,
                  tabsNav,
                  tabsContent,
                  activeKey,
                });
              }

              if (modelTarget.name === ModelName.Add) {
                editor.editing.model.change((writer) => {
                  const tabsNavModel = editor.editing.mapper.toModelElement(tabsNav);
                  const tabsContentModel = editor.editing.mapper.toModelElement(tabsContent);

                  if (tabsNavModel && tabsContentModel) {
                    const tabKey = generateRandomId();

                    appendTabItem({
                      writer,
                      item: { key: tabKey, label: '标签名' },
                      tabsNav: tabsNavModel,
                      tabsContent: tabsContentModel,
                    });

                    setTimeout(() => {
                      activeTabItem({
                        editor,
                        tabsRoot: tabsRoot as ViewElement,
                        tabsNav,
                        tabsContent,
                        activeKey: tabKey,
                      });
                    }, 0);
                  }
                });
              }
            }
          }
        }

        if (modelTarget.name === ModelName.Remove) {
          const tabsTitle = viewTarget.parent;
          const tabsRoot = tabsTitle?.parent?.parent;
          const tabsNav = tabsRoot?.getChild(0);
          const tabsContent = tabsRoot?.getChild(1);

          if (
            tabsRoot?.is('view:element') &&
            tabsTitle?.is('view:element') &&
            tabsNav?.is('view:element') &&
            tabsContent?.is('view:element') &&
            tabsRoot.hasClass(ClassName.Root) &&
            tabsTitle.hasClass(ClassName.Title) &&
            tabsNav.hasClass(ClassName.Nav) &&
            tabsContent.hasClass(ClassName.Content)
          ) {
            editor.editing.model.change((modelWriter) => {
              const currentActiveKey = tabsRoot.getAttribute(VIEW_ATTR_TABS_ACTIVE_KEY);
              const targetTabKey = tabsTitle.getAttribute(VIEW_ATTR_TAB_KEY);

              let tabsPanel: ViewElement | null = null;

              Array.from(tabsContent.getChildren()).forEach((child) => {
                if (child.is('view:element') && child.hasClass(ClassName.Panel)) {
                  if (child.getAttribute(VIEW_ATTR_TAB_KEY) === targetTabKey) {
                    tabsPanel = child;
                  }
                }
              });

              const tabsTitleModel = editor.editing.mapper.toModelElement(tabsTitle);
              // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
              const tabsPanelModel = tabsPanel
                ? editor.editing.mapper.toModelElement(tabsPanel)
                : null;

              if (tabsTitleModel && tabsPanelModel) {
                modelWriter.remove(tabsTitleModel);
                modelWriter.remove(tabsPanelModel);

                if (currentActiveKey === targetTabKey) {
                  // 如果移除的 tab 处于 active 状态，则将首个 tab 设为 active。
                  setTimeout(() => {
                    const firstTab = Array.from(tabsContent.getChildren()).at(0);

                    if (firstTab?.is('view:element') && firstTab.hasClass(ClassName.Panel)) {
                      const activeKey = firstTab.getAttribute(VIEW_ATTR_TAB_KEY);

                      if (activeKey) {
                        activeTabItem({
                          editor,
                          tabsRoot,
                          tabsNav,
                          tabsContent,
                          activeKey,
                        });
                      }
                    }
                  }, 0);
                }
              }
            });
          }
        }
      }
    });

    editor.on('change:isReadOnly', (_, __, isReadOnly) => {
      const docRoot = editor.editing.view.document.getRoot();

      if (docRoot?.is('view:element')) {
        const targetElements = findAllElementByClass(docRoot, ClassName.Root);

        if (Array.isArray(targetElements) && targetElements.length > 0) {
          editor.editing.view.change((viewWriter) => {
            targetElements.forEach((el) => {
              if (isReadOnly) {
                viewWriter.addClass(ClassName.RootReadOnly, el);
              } else {
                viewWriter.removeClass(ClassName.RootReadOnly, el);
              }
            });
          });
        }
      }
    });
  }

  #defineSchema() {
    const schema = this.editor.model.schema;

    schema.register(ModelName.Wrapper, {
      isObject: true,
      allowWhere: '$block',
    });

    schema.register(ModelName.Root, {
      isObject: true,
      allowIn: ModelName.Wrapper,
      allowAttributes: [MODEL_ATTR_TABS_ID, MODEL_ATTR_TABS_ACTIVE_KEY],
    });

    schema.register(ModelName.Nav, {
      isObject: true,
      allowIn: ModelName.Root,
      allowContentOf: ModelName.Title,
    });

    schema.register(ModelName.Title, {
      isLimit: true,
      isInline: true,
      allowIn: ModelName.Nav,
      allowChildren: ['paragraph'],
      allowAttributes: [MODEL_ATTR_TAB_KEY, MODEL_ATTR_LABEL],
    });

    schema.register(ModelName.Add, {
      isLimit: true,
      isInline: true,
      allowIn: ModelName.Nav,
      isSelectable: false,
    });

    schema.register(ModelName.Remove, {
      isLimit: true,
      isInline: true,
      allowIn: ModelName.Title,
      isSelectable: false,
    });

    schema.register(ModelName.Content, {
      isObject: true,
      allowIn: ModelName.Root,
      allowContentOf: ModelName.Panel,
    });

    schema.register(ModelName.Panel, {
      isLimit: true,
      allowIn: ModelName.Content,
      allowContentOf: '$root',
      allowAttributes: [MODEL_ATTR_TAB_KEY, MODEL_ATTR_LABEL, MODEL_ATTR_PLACEHOLDER],
    });
  }

  #defineConverters() {
    const editor = this.editor;
    const conversion = editor.conversion;
    const view = editor.editing.view;

    // ==========
    conversion.for('upcast').elementToElement({
      model: ModelName.Wrapper,
      view: {
        name: 'div',
        classes: 'ck-tabs-wrapper',
      },
    });

    conversion.for('dataDowncast').elementToElement({
      model: ModelName.Wrapper,
      view: {
        name: 'div',
        classes: 'ck-tabs-wrapper',
      },
    });

    conversion.for('editingDowncast').elementToElement({
      model: ModelName.Wrapper,
      view: (_, { writer: viewWriter }) => {
        const div = viewWriter.createContainerElement('div', { class: 'ck-tabs-wrapper' });

        return toWidget(div, viewWriter, {
          label: '标签页',
          hasSelectionHandle: true,
        });
      },
    });

    // ==========
    conversion.for('upcast').elementToElement({
      model: (viewElement, { writer: modelWriter }) => {
        const tabsId = viewElement.getAttribute(VIEW_ATTR_TABS_ID) || generateTabsId();
        const activeKey = viewElement.getAttribute(VIEW_ATTR_TABS_ACTIVE_KEY);

        return modelWriter.createElement(ModelName.Root, {
          [MODEL_ATTR_TABS_ID]: tabsId,
          [MODEL_ATTR_TABS_ACTIVE_KEY]: activeKey,
        });
      },
      view: {
        name: 'div',
        classes: ClassName.Root,
      },
    });

    conversion.for('dataDowncast').elementToElement({
      model: ModelName.Root,
      view: (modelElement, { writer: viewWriter }) => {
        const tabsId = modelElement.getAttribute(MODEL_ATTR_TABS_ID) as string;
        const activeKey = modelElement.getAttribute(MODEL_ATTR_TABS_ACTIVE_KEY) as string;

        return viewWriter.createContainerElement('div', {
          class: ClassName.Root,
          [VIEW_ATTR_TABS_ID]: tabsId,
          [VIEW_ATTR_TABS_ACTIVE_KEY]: activeKey,
        });
      },
    });

    conversion.for('editingDowncast').elementToElement({
      model: ModelName.Root,
      view: (modelElement, { writer: viewWriter }) => {
        const tabsId = modelElement.getAttribute(MODEL_ATTR_TABS_ID) as string;
        const activeKey = modelElement.getAttribute(MODEL_ATTR_TABS_ACTIVE_KEY) as string;

        // HACK: 这里在 setTimeout 执行的原因是需要等待 view 渲染完成，否则将无法获取到 viewELement（即 toViewElement 的返回值为 undefined）。
        setTimeout(() => {
          const tabsNav = modelElement.getChild(0);
          const tabsContent = modelElement.getChild(1);

          if (
            tabsNav?.is('model:element') &&
            tabsContent?.is('model:element') &&
            tabsNav.name === ModelName.Nav &&
            tabsContent.name === ModelName.Content
          ) {
            Array.from(tabsContent.getChildren()).forEach((child) => {
              if (child.is('model:element')) {
                if (child.getAttribute(MODEL_ATTR_TAB_KEY) === activeKey) {
                  const tabsRootView = editor.editing.mapper.toViewElement(modelElement);
                  const tabsNavView = editor.editing.mapper.toViewElement(tabsNav);
                  const tabsContentView = editor.editing.mapper.toViewElement(tabsContent);

                  if (tabsRootView && tabsNavView && tabsContentView) {
                    activeTabItem({
                      editor,
                      tabsRoot: tabsRootView,
                      tabsNav: tabsNavView,
                      tabsContent: tabsContentView,
                      activeKey,
                    });
                  }
                }
              }
            });
          }
        }, 0);

        return viewWriter.createContainerElement('div', {
          class: ClassName.Root,
          [VIEW_ATTR_TABS_ID]: tabsId,
          [VIEW_ATTR_TABS_ACTIVE_KEY]: activeKey,
        });
      },
    });

    // ==========
    conversion.for('upcast').elementToElement({
      model: ModelName.Nav,
      view: {
        name: 'div',
        classes: ClassName.Nav,
      },
    });

    conversion.for('dataDowncast').elementToElement({
      model: ModelName.Nav,
      view: {
        name: 'div',
        classes: ClassName.Nav,
      },
    });

    conversion.for('editingDowncast').elementToElement({
      model: ModelName.Nav,
      view: {
        name: 'div',
        classes: ClassName.Nav,
      },
    });

    // ==========
    conversion.for('upcast').elementToElement({
      model: (viewElement, { writer: modelWriter }) => {
        const key = viewElement.getAttribute(VIEW_ATTR_TAB_KEY)!;
        return modelWriter.createElement(ModelName.Title, { [MODEL_ATTR_TAB_KEY]: key });
      },
      view: {
        name: 'div',
        classes: ClassName.Title,
      },
    });

    conversion.for('dataDowncast').elementToElement({
      model: ModelName.Title,
      view: (modelElement, { writer: viewWriter }) => {
        const key = modelElement.getAttribute(MODEL_ATTR_TAB_KEY) as TabItem['key'];

        return viewWriter.createContainerElement('div', {
          class: ClassName.Title,
          [VIEW_ATTR_TAB_KEY]: key,
        });
      },
    });

    conversion.for('editingDowncast').elementToElement({
      model: ModelName.Title,
      view: (modelElement, { writer: viewWriter }) => {
        const key = modelElement.getAttribute(MODEL_ATTR_TAB_KEY) as TabItem['key'];

        const tabsTitle = viewWriter.createEditableElement('div', {
          class: ClassName.Title,
          [VIEW_ATTR_TAB_KEY]: key,
        });

        enablePlaceholder({
          view,
          element: tabsTitle,
          text: '...',
          keepOnFocus: true,
        });

        return toWidgetEditable(tabsTitle, viewWriter);
      },
    });

    // ==========
    conversion.for('upcast').elementToElement({
      model: ModelName.Add,
      view: {
        name: 'div',
        classes: 'ck-tabs-add',
      },
    });

    conversion.for('dataDowncast').elementToElement({
      model: ModelName.Add,
      view: {
        name: 'div',
        classes: 'ck-tabs-add',
      },
    });

    conversion.for('editingDowncast').elementToElement({
      model: ModelName.Add,
      view: {
        name: 'div',
        classes: 'ck-tabs-add',
      },
    });

    // ==========
    conversion.for('upcast').elementToElement({
      model: ModelName.Remove,
      view: {
        name: 'div',
        classes: 'ck-tabs-remove',
      },
    });

    conversion.for('dataDowncast').elementToElement({
      model: ModelName.Remove,
      view: {
        name: 'div',
        classes: 'ck-tabs-remove',
      },
    });

    conversion.for('editingDowncast').elementToElement({
      model: ModelName.Remove,
      view: {
        name: 'div',
        classes: 'ck-tabs-remove',
      },
    });

    // ==========
    conversion.for('upcast').elementToElement({
      model: ModelName.Content,
      view: {
        name: 'div',
        classes: ClassName.Content,
      },
    });

    conversion.for('dataDowncast').elementToElement({
      model: ModelName.Content,
      view: {
        name: 'div',
        classes: ClassName.Content,
      },
    });

    conversion.for('editingDowncast').elementToElement({
      model: ModelName.Content,
      view: {
        name: 'div',
        classes: ClassName.Content,
      },
    });

    // ==========
    conversion.for('upcast').elementToElement({
      model: (viewElement, { writer: modelWriter }) => {
        const key = viewElement.getAttribute(VIEW_ATTR_TAB_KEY)!;
        return modelWriter.createElement(ModelName.Panel, {
          [MODEL_ATTR_TAB_KEY]: key,
        });
      },
      view: {
        name: 'div',
        classes: ClassName.Panel,
      },
    });

    conversion.for('dataDowncast').elementToElement({
      model: ModelName.Panel,
      view: (modelElement, { writer: viewWriter }) => {
        const key = modelElement.getAttribute(MODEL_ATTR_TAB_KEY) as TabItem['key'];

        return viewWriter.createContainerElement('div', {
          class: ClassName.Panel,
          [VIEW_ATTR_TAB_KEY]: key,
        });
      },
    });

    conversion.for('editingDowncast').elementToElement({
      model: ModelName.Panel,
      view: (modelElement, { writer: viewWriter }) => {
        const key = modelElement.getAttribute(MODEL_ATTR_TAB_KEY) as TabItem['key'];
        const placeholder = modelElement.getAttribute(
          MODEL_ATTR_PLACEHOLDER
        ) as TabItem['placeholder'];

        const tabsPanel = viewWriter.createEditableElement('div', {
          class: ClassName.Panel,
          [VIEW_ATTR_TAB_KEY]: key,
        });

        enablePlaceholder({
          view,
          element: tabsPanel,
          text: placeholder ?? '请输入内容...',
          keepOnFocus: true,
          isDirectHost: false,
        });

        return toWidgetEditable(tabsPanel, viewWriter);
      },
    });
  }
}
