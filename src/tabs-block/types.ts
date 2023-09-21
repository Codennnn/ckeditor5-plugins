import type { MODEL_ATTR_LABEL, MODEL_ATTR_PLACEHOLDER, MODEL_ATTR_TAB_KEY } from './utils';

export interface TabItem {
  [MODEL_ATTR_TAB_KEY]: string;
  [MODEL_ATTR_LABEL]?: string;
  [MODEL_ATTR_PLACEHOLDER]?: string;
  closable?: boolean;
}
