import { css } from '../../styled-system/css';
import { focusRing } from './focus';

/** DADS text link: default, visited, hover, active and focus states. */
export const linkStyle = css.raw({
  color: 'blue.1000',
  textDecorationLine: 'underline',
  textUnderlineOffset: '0.1875rem',
  _visited: { color: 'magenta.900' },
  _hover: { color: 'blue.1000', textDecorationThickness: '0.1875rem' },
  _active: { color: 'orange.800', textDecorationThickness: '1px' },
  _focusVisible: {
    ...focusRing,
    borderRadius: '4',
    backgroundColor: 'yellow.300',
    color: 'blue.1000',
  },
});
