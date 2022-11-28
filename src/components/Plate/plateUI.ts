import {
  createPlateUI,
  ELEMENT_PARAGRAPH,
  ELEMENT_H1,
  ELEMENT_H2,
  ELEMENT_UL,
  MARK_BOLD,
  MARK_ITALIC,
  StyledElement,
  withProps,
} from '@udecode/plate';

const plateUI = createPlateUI({
  [ELEMENT_PARAGRAPH]: withProps(StyledElement, {
    styles: {
      root: {
        margin: 0,
        padding: 0,
      },
    },
    prefixClassNames: 'p',
  }),
  [ELEMENT_H1]: withProps(StyledElement, {
    styles: {
      root: {
        margin: 0,
        padding: 0,
        fontSize: '24px',
      },
    },
    prefixClassNames: 'h1',
  }),
  [ELEMENT_H2]: withProps(StyledElement, {
    styles: {
      root: {
        margin: 0,
        padding: 0,
        fontSize: '20px',
      },
    },
    prefixClassNames: 'h2',
  }),
  // [ELEMENT_UL]: withProps(StyledElement, {
  //   styles: {
  //     root: {
  //       margin: 0,
  //       padding: 0,
  //     },
  //   },
  //   prefixClassNames: 'ul',
  // }),
  // [MARK_BOLD]: withProps(StyledElement, {
  //   styles: {
  //     root: {
  //       margin: 0,
  //       padding: 0,
  //     },
  //   },
  //   prefixClassNames: 'b',
  // }),
  // [MARK_ITALIC]: withProps(StyledElement, {
  //   styles: {
  //     root: {
  //       margin: 0,
  //       padding: 0,
  //     },
  //   },
  //   prefixClassNames: 'i',
  // }),
});

export default plateUI;
