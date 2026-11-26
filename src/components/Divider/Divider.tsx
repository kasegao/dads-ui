import type { ComponentProps } from 'react';
import { cva, cx } from '../../../styled-system/css';

export type DividerColor = 'gray-420' | 'gray-536' | 'black';
export type DividerThickness = '1' | '2' | '3' | '4';
export type DividerVariant = 'solid' | 'dashed';

const divider = cva({
  variants: {
    color: {
      'gray-420': { borderColor: 'solid-gray.420' },
      'gray-536': { borderColor: 'solid-gray.536' },
      black: { borderColor: 'black' },
    },
    thickness: {
      '1': { borderTopWidth: '1' },
      '2': { borderTopWidth: '2' },
      '3': { borderTopWidth: '3' },
      '4': { borderTopWidth: '4' },
    },
    variant: {
      solid: { borderTopStyle: 'solid' },
      dashed: { borderTopStyle: 'dashed' },
    },
  },
});

export type DividerProps = Omit<ComponentProps<'hr'>, 'color'> & {
  color?: DividerColor;
  thickness?: DividerThickness;
  variant?: DividerVariant;
};

export const Divider = (props: DividerProps) => {
  const { className, color = 'gray-420', thickness = '1', variant = 'solid', ...rest } = props;

  return <hr className={cx(divider({ color, thickness, variant }), className)} {...rest} />;
};
