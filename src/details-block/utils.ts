export const enum DetailsModel {
  Wrapper = 'detailsWrapper',
  Root = 'detailsRoot',
  Summary = 'detailsSummary',
  Trigger = 'detailsTrigger',
  Content = 'detailsContent',
}

export const enum ModelAttr {
  ID = 'id',
}

export const enum ViewAttr {
  ID = 'data-id',
  Open = 'open',
}

export function generateDetailsId() {
  const time = new Date().getTime();
  const random = Math.random().toString(36).substring(2, 5);
  return `ckeditor5-accordion-${time}-${random}`;
}
