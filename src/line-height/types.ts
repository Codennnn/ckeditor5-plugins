import type { MatcherPattern, ViewElementDefinition } from 'ckeditor5/src/engine';

export interface LineHeightOption {
  /**
   * The user-readable title of the option.
   */
  title: string;

  /**
   * The attribute's unique value in the model.
   */
  model?: string;

  /**
   * View element configuration.
   */
  view?: ViewElementDefinition;

  /**
   * An array with all matched elements that the view-to-model conversion should also accept.
   */
  upcastAlso?: MatcherPattern[];
}

/**
 * line height 能够接受的配置选项。
 */
export type LineHeightConfiguredOption = 'default' | number | LineHeightOption;

export type CommandValue = string;
