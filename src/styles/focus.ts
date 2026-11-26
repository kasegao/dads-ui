import { css } from '../../styled-system/css';

/** DADS focus indicator: 4px black outline + 2px yellow ring. */
export const focusRing = css.raw({
  outlineWidth: '4px',
  outlineStyle: 'solid',
  outlineColor: 'black',
  outlineOffset: '2',
  boxShadow: '0 0 0 {spacing.2} {colors.yellow.300}',
});
