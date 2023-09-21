import type { TabItem } from './types';

export interface TabsBlockConfig {
  /** 插入到编辑器的模板。 */
  template?: {
    activeKey?: TabItem['key'];
    items?: TabItem[];
  };
  /** 是否允许添加新页签。 */
  allowAdd?: boolean;
  buttonSetting?: {
    label?: string;
    tooltip?: boolean;
    withText?: boolean;
    withIcon?: boolean;
  };
}
