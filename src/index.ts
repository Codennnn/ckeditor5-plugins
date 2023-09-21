import './augmentation';

import detailsIcon from './../theme/icons/details.svg';
import lineHeightIcon from './../theme/icons/line-height.svg';
import tabsIcon from './../theme/icons/tabs.svg';

export { DetailsBlockCommand } from './details-block/detailsblockcommand';
export { type DetailsBlockConfig } from './details-block/detailsblockconfig';
export { DetailsBlockEditing } from './details-block/detailsblockediting';
export { DetailsBlockUI } from './details-block/detailsblockui';
export { default as DetailsBlock } from './detailsblock';
//
export { LineHeightCommand } from './line-height/lineheightcommand';
export { type LineHeightConfig } from './line-height/lineheightconfig';
export { LineHeightEditing } from './line-height/lineheightediting';
export { LineHeightUI } from './line-height/lineheightui';
export { default as LineHeight } from './lineheight';
//
export { TabsBlockCommand } from './tabs-block/tabsblockcommand';
export { type TabsBlockConfig } from './tabs-block/tabsblockconfig';
export { TabsBlockEditing } from './tabs-block/tabsblockediting';
export { TabsBlockUI } from './tabs-block/tabsblockui';
export { default as TabsBlock } from './tabsblock';

export const icons = {
  lineHeightIcon,
  detailsIcon,
  tabsIcon,
};
