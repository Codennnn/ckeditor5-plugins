import { type ViewElementDefinition } from 'ckeditor5/src/engine';

import { LINE_HEIGHT } from '../constants';
import type { LineHeightConfiguredOption, LineHeightOption } from './types';

export const defaultLineHeightConfiguredOptions = [1, 1.15, 1.5, 2, 2.5, 3];

export const KEY_DEFAULT = 'default';

interface LineHeightConverterDefinition {
  model: { key: string; values: string[] };
  view: Record<string, ViewElementDefinition>;
}

export function buildDefinition(options: LineHeightOption[]): LineHeightConverterDefinition {
  const def: LineHeightConverterDefinition = {
    model: {
      key: LINE_HEIGHT,
      values: [],
    },
    view: {},
  };

  for (const option of options) {
    if (option.model && option.view) {
      def.model.values.push(option.model);
      def.view[option.model] = option.view;
    }
  }

  return def;
}

export function normalizeOptions(
  configuredOptions: LineHeightConfiguredOption[]
): LineHeightOption[] {
  return configuredOptions.reduce<LineHeightOption[]>((options, option) => {
    if (option === KEY_DEFAULT) {
      options.push({
        title: '默认',
        model: KEY_DEFAULT,
      });
    } else if (typeof option === 'number') {
      if (!Number.isNaN(option)) {
        options.push({
          title: option.toFixed(1),
          model: String(option),
          view: {
            name: 'div',
            styles: {
              'line-height': String(option),
            },
          },
        });
      }
    } else {
      if (option.model) {
        options.push(option);
      }
    }

    return options;
  }, []);
}
