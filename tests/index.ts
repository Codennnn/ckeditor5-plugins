import { expect } from 'chai';

import { DetailsBlock as DetailsDll, icons } from '../src';
import DetailsBlock from '../src/detailsblock';
import detailsIcon from './../theme/icons/details.svg';
import lineHeightIcon from './../theme/icons/line-height.svg';
import tabsIcon from './../theme/icons/tabs.svg';

describe('CKEditor5 Details DLL', () => {
  it('exports Details', () => {
    expect(DetailsDll).to.equal(DetailsBlock);
  });

  describe('icons', () => {
    it('exports the "ckeditor" icon', () => {
      expect(icons.lineHeightIcon).to.equal(lineHeightIcon);
      expect(icons.detailsIcon).to.equal(detailsIcon);
      expect(icons.tabsIcon).to.equal(tabsIcon);
    });
  });
});
