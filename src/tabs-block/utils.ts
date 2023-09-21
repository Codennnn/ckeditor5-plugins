import { type Editor } from '@ckeditor/ckeditor5-core';
import type { Element, ViewElement, Writer } from 'ckeditor5/src/engine';

import type { TabItem } from './types';

export const VIEW_ATTR_TABS_ID = 'data-id';
export const VIEW_ATTR_TABS_ACTIVE_KEY = 'data-active-key';
export const VIEW_ATTR_TAB_KEY = 'data-key';

export const MODEL_ATTR_TABS_ID = 'tabsId';
export const MODEL_ATTR_TABS_ACTIVE_KEY = 'activeKey';
export const MODEL_ATTR_TAB_KEY = 'key';
export const MODEL_ATTR_LABEL = 'label';
export const MODEL_ATTR_PLACEHOLDER = 'placeholder';

export const enum ModelName {
  Wrapper = 'tabsWrapper',
  Root = 'tabsRoot',
  Nav = 'tabsNav',
  Title = 'tabsTitle',
  Add = 'tabsAdd',
  Remove = 'tabsRemove',
  Content = 'tabsContent',
  Panel = 'tabsPanel',
}

export const enum ClassName {
  Root = 'ck-tabs',
  RootReadOnly = 'ck-tabs-readonly',
  Nav = 'ck-tabs-nav',
  Content = 'ck-tabs-content',
  Title = 'ck-tabs-title',
  TitleActive = 'ck-tabs-title-active',
  Panel = 'ck-tabs-panel',
  PanelActive = 'ck-tabs-panel-active',
}

export const defaultTabItems = [
  { key: '1', label: '标签 1' },
  { key: '2', label: '标签 2' },
  { key: '3', label: '标签 3' },
] satisfies TabItem[];

export function generateRandomId(): string {
  const time = new Date().getTime();
  const random = Math.random().toString(36).substring(2, 5);
  return `${time}${random}`;
}

export function generateTabsId(): string {
  return `ck-tabs-id-${generateRandomId()}`;
}

/**
 * 添加一个标签页。
 */
export function appendTabItem(data: {
  writer: Writer;
  item: TabItem;
  tabsTitle?: Element;
  tabsNav: Element;
  tabsContent: Element;
}) {
  const { writer, item, tabsTitle, tabsNav, tabsContent } = data;

  const tabsTitleElement =
    tabsTitle || writer.createElement(ModelName.Title, item as unknown as Record<string, unknown>);
  const tabsPanelElement = writer.createElement(
    ModelName.Panel,
    item as unknown as Record<string, unknown>
  );

  const tabsTitleContent = writer.createElement('paragraph');
  writer.append(tabsTitleContent, tabsTitleElement);

  if (item.label) {
    writer.insertText(item.label, tabsTitleContent);
  }

  if (item.closable || item.closable === undefined) {
    const tabsRemove = writer.createElement(ModelName.Remove);
    writer.append(tabsRemove, tabsTitleElement);
  }

  writer.append(tabsTitleElement, tabsNav);
  writer.append(tabsPanelElement, tabsContent);
  writer.appendElement('paragraph', tabsPanelElement);
}

/**
 * 激活标签页。
 */
export function activeTabItem(data: {
  editor: Editor;
  tabsRoot: ViewElement;
  tabsNav: ViewElement;
  tabsContent: ViewElement;
  activeKey: TabItem['key'];
}) {
  const { editor, tabsContent, tabsRoot, tabsNav, activeKey } = data;

  editor.editing.model.change((writer) => {
    const tabsRootModel = editor.editing.mapper.toModelElement(tabsRoot);
    if (tabsRootModel) {
      writer.setAttribute(MODEL_ATTR_TABS_ACTIVE_KEY, activeKey, tabsRootModel);
    }
  });

  editor.editing.view.change((writer) => {
    writer.setAttribute(VIEW_ATTR_TABS_ACTIVE_KEY, activeKey, tabsRoot);

    Array.from(tabsNav.getChildren()).forEach((child) => {
      if (child.is('view:element')) {
        if (activeKey === child.getAttribute(VIEW_ATTR_TAB_KEY)) {
          writer.addClass(ClassName.TitleActive, child);
        } else {
          writer.removeClass(ClassName.TitleActive, child);
        }
      }
    });

    Array.from(tabsContent.getChildren()).forEach((child) => {
      if (child.is('view:element')) {
        if (activeKey === child.getAttribute(VIEW_ATTR_TAB_KEY)) {
          writer.addClass(ClassName.PanelActive, child);
        } else {
          writer.removeClass(ClassName.PanelActive, child);
        }
      }
    });
  });
}

export function findAllElementByClass(parent: ViewElement, className: string): ViewElement[] {
  const collection: ViewElement[] = [];

  const findElementByClass = (parent: ViewElement, className: string) => {
    if (parent.hasClass(className)) {
      collection.push(parent);
    } else {
      for (const child of parent.getChildren()) {
        if (child.is('view:element')) {
          findElementByClass(child, className);
        }
      }
    }
  };

  findElementByClass(parent, className);

  return collection;
}
