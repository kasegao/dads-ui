import { type ComponentProps, createContext, type ReactNode, use } from 'react';
import { css, cva, cx } from '../../../styled-system/css';
import { focusRing } from '../../styles/focus';
import { Slot } from '../../utils/Slot';
import { Button } from '../Button';

export type SearchBoxSize = 'lg' | 'md' | 'sm';

const SearchBoxSizeContext = createContext<SearchBoxSize>('lg');

const searchBox = css({
  display: 'grid',
  gridTemplateAreas: '"fields submit" "detail detail"',
  gridTemplateColumns: '1fr auto',
  columnGap: '16',
  color: 'solid-gray.900',
  fontFamily: 'sans',
  textStyle: 'oln-16N-100',
});

export type SearchBoxProps = ComponentProps<'div'> & {
  size?: SearchBoxSize;
};

export const SearchBox = (props: SearchBoxProps) => {
  const { children, className, size = 'lg', ...rest } = props;

  return (
    <div className={cx(searchBox, className)} {...rest}>
      <SearchBoxSizeContext value={size}>{children}</SearchBoxSizeContext>
    </div>
  );
};

const searchBoxFields = css({
  position: 'relative',
  zIndex: '0',
  display: 'flex',
  gridArea: 'fields',
});

export type SearchBoxFieldsProps = ComponentProps<'div'>;

export const SearchBoxFields = (props: SearchBoxFieldsProps) => {
  const { children, className, ...rest } = props;

  return (
    <div className={cx(searchBoxFields, className)} {...rest}>
      {children}
    </div>
  );
};

const selectRoot = css({
  position: 'relative',
  display: 'flex',
  flexShrink: '0',
});

const selectLabel = cva({
  base: {
    position: 'absolute',
    left: '1.0625rem',
    zIndex: '2',
    color: 'solid-gray.700',
    pointerEvents: 'none',
  },
  variants: {
    size: {
      lg: { top: 'calc(50% - 1.25rem)' },
      md: { top: 'calc(50% - 1.125rem)' },
      sm: { srOnly: true },
    },
  },
});

const select = cva({
  base: {
    appearance: 'none',
    display: 'flex',
    alignItems: 'center',
    overflow: 'hidden',
    width: '160',
    borderWidth: '1',
    borderStyle: 'solid',
    borderColor: 'solid-gray.600',
    borderTopLeftRadius: '8',
    borderBottomLeftRadius: '8',
    borderTopRightRadius: '0',
    borderBottomRightRadius: '0',
    backgroundColor: 'solid-gray.50',
    paddingRight: '40',
    paddingBottom: '0',
    paddingLeft: '16',
    color: 'solid-gray.900',
    fontFamily: 'sans',
    textStyle: 'oln-17N-100',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    _hover: { borderColor: 'black' },
    _focusVisible: { ...focusRing, position: 'relative', zIndex: '1' },
    // Progressive enhancement: a styled option list where customizable selects are supported.
    '@supports (appearance: base-select)': {
      appearance: 'base-select',
      '&::picker-icon': { display: 'none' },
      '&::picker(select)': {
        appearance: 'base-select',
        borderWidth: '1',
        borderStyle: 'solid',
        borderColor: 'solid-gray.420',
        boxShadow: '1',
        paddingBlock: '16',
        paddingInline: '0',
      },
    },
    '& option': {
      display: 'flex',
      alignItems: 'center',
      minHeight: '44',
      paddingBlock: '10',
      paddingInline: '16',
      color: 'solid-gray.900',
      '&::checkmark': { display: 'none' },
      _hoverable: {
        '&:hover': {
          backgroundColor: 'solid-gray.50',
          textDecorationLine: 'underline',
          textDecorationThickness: '0.0625rem',
          textUnderlineOffset: '0.1875rem',
        },
      },
      '&:checked': {
        backgroundColor: 'key.100',
        color: 'key.1000',
        fontWeight: '700',
        _hoverable: {
          '&:hover': { backgroundColor: 'key.50', color: 'key.900' },
        },
      },
      '&:focus-visible': {
        outlineWidth: '0.25rem',
        outlineStyle: 'solid',
        outlineColor: 'black',
        outlineOffset: '-0.25rem',
        borderRadius: '0',
        boxShadow: 'none',
      },
      '&:not(:checked):focus-visible': { backgroundColor: 'yellow.300' },
      '&:checked:focus-visible': {
        boxShadow: 'inset 0 0 0 0.375rem {colors.yellow.300}',
      },
    },
  },
  variants: {
    size: {
      lg: { paddingTop: '20' },
      md: { paddingTop: '18' },
      sm: { paddingTop: '0' },
    },
  },
});

const selectIcon = css({
  position: 'absolute',
  top: '0',
  right: '16',
  bottom: '0',
  zIndex: '1',
  marginBlock: 'auto',
  width: '16',
  height: '16',
  pointerEvents: 'none',
});

export type SearchBoxSelectProps = ComponentProps<'select'> & {
  /** Shown above the value; visually hidden at `size='sm'`. */
  label: string;
};

export const SearchBoxSelect = (props: SearchBoxSelectProps) => {
  const { children, className, label, ...rest } = props;
  const size = use(SearchBoxSizeContext);

  return (
    <label className={selectRoot}>
      <span className={selectLabel({ size })}>{label}</span>
      <select className={cx(select({ size }), className)} {...rest}>
        {children}
      </select>
      <svg aria-hidden={true} className={selectIcon} width='16' height='16' viewBox='0 0 24 24'>
        <path d='M12 17L3 8L4 7L12 15L20 7L21 8L12 17Z' fill='currentColor' />
      </svg>
    </label>
  );
};

const inputRoot = css({
  position: 'relative',
  display: 'flex',
  flexGrow: '1',
});

const inputIcon = css({
  position: 'absolute',
  top: '0',
  bottom: '0',
  left: '16',
  zIndex: '1',
  marginBlock: 'auto',
  width: '24',
  height: '24',
  color: { base: 'solid-gray.600', _forcedColors: 'CanvasText' },
  pointerEvents: 'none',
});

const inputLabel = css({ srOnly: true });

const input = cva({
  base: {
    flexGrow: '1',
    width: '8rem',
    borderWidth: '1',
    borderStyle: 'solid',
    borderColor: 'solid-gray.600',
    borderRadius: '8',
    backgroundColor: 'white',
    paddingRight: '16',
    paddingLeft: '48',
    _placeholder: { color: 'solid-gray.600' },
    _hover: { borderColor: 'black' },
    _focusVisible: { ...focusRing, position: 'relative' },
    // Joins the select on its left into one control.
    'label:not(:first-child) > &': {
      marginLeft: '-1px',
      borderTopLeftRadius: '0',
      borderBottomLeftRadius: '0',
    },
    '&::-webkit-search-cancel-button': { display: 'none' },
  },
  variants: {
    size: {
      lg: { paddingBlock: '12' },
      md: { paddingBlock: '0.6875rem' },
      sm: { paddingBlock: '0.4375rem' },
    },
  },
});

export type SearchBoxInputProps = Omit<ComponentProps<'input'>, 'aria-labelledby'> &
  (
    | { /** Visually hidden label. */ label: string; 'aria-labelledby'?: never }
    | {
        label?: never /** `id` of a visible element that labels the field. */;
        'aria-labelledby': string;
      }
  );

export const SearchBoxInput = (props: SearchBoxInputProps) => {
  const { className, label, ...rest } = props;
  const size = use(SearchBoxSizeContext);

  return (
    <label className={inputRoot}>
      <svg aria-hidden={true} className={inputIcon} width='24' height='24' viewBox='0 0 24 24'>
        <path
          d='m21 20.5-6-6a7.4 7.4 0 0 0 1.9-5A7.4 7.4 0 0 0 9.5 2 7.5 7.5 0 1 0 14 15.5l6 6 1-1ZM3.5 9.5a6 6 0 0 1 6-6 6 6 0 0 1 6 6 6 6 0 0 1-6 6 6 6 0 0 1-6-6Z'
          fill='currentColor'
        />
      </svg>
      {label !== undefined && <span className={inputLabel}>{label}</span>}
      <input className={cx(input({ size }), className)} {...rest} />
    </label>
  );
};

const detail = css({
  gridArea: 'detail',
  marginTop: '16',
  width: 'fit',
  borderWidth: '1',
  borderStyle: 'solid',
  borderColor: 'solid-gray.600',
  borderRadius: '8',
  paddingTop: '12',
  paddingBottom: '12',
  paddingInline: '16',
  color: 'solid-gray.800',
  fontFamily: 'sans',
  textStyle: 'std-16N-170',
  _open: { width: 'auto', paddingBottom: '24' },
});

const detailSummary = css({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  gap: '8',
  width: 'fit',
  marginInline: '-16',
  marginBlock: '-12',
  paddingInline: '16',
  paddingBlock: '12',
  listStyle: 'none',
  cursor: 'default',
  '&::-webkit-details-marker': { display: 'none' },
  '&::marker': { content: '""' },
  _hover: { textDecorationLine: 'underline', textUnderlineOffset: '0.1875rem' },
  _focusVisible: { ...focusRing, borderRadius: '4', backgroundColor: 'yellow.300' },
});

const detailIcon = css({
  flexShrink: '0',
  marginTop: 'calc((1lh - 24px) / 2)',
  color: { base: 'key.1000', _forcedColors: 'inherit' },
  'details[open] > summary > &': { transform: 'rotate(180deg)' },
});

const detailIconInner = css({
  fill: 'currentColor',
  'summary:hover &': { fill: 'Canvas' },
});

const detailIconArrow = css({
  fill: 'Canvas',
  'summary:hover &': { fill: 'currentColor' },
});

const detailContent = css({ marginTop: '32' });

export type SearchBoxDetailProps = ComponentProps<'details'> & {
  summary: string;
};

export const SearchBoxDetail = (props: SearchBoxDetailProps) => {
  const { children, className, summary, ...rest } = props;

  return (
    <details className={cx(detail, className)} {...rest}>
      <summary className={detailSummary}>
        <svg aria-hidden={true} className={detailIcon} width='24' height='24' viewBox='0 0 24 24'>
          <circle cx='12' cy='12' r='11' fill='currentColor' />
          <circle className={detailIconInner} cx='12' cy='12' r='8' />
          <path className={detailIconArrow} d='M17 10H7L12 15L17 10Z' />
        </svg>
        {summary}
      </summary>
      <div className={detailContent}>{children}</div>
    </details>
  );
};

const detailActions = css({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '16',
});

export type SearchBoxDetailActionsProps = ComponentProps<'div'>;

export const SearchBoxDetailActions = (props: SearchBoxDetailActionsProps) => {
  const { children, className, ...rest } = props;

  return (
    <div className={cx(detailActions, className)} {...rest}>
      {children}
    </div>
  );
};

const submitPlacement = css({
  gridArea: 'submit',
  cursor: 'pointer',
  // The open detail panel carries its own submit button.
  'div:has(> details[open]) > &': { visibility: 'hidden' },
});

export type SearchBoxSubmitProps =
  | ({
      asChild?: false;
      /** Defaults to the size of the enclosing `SearchBox`. */
      size?: SearchBoxSize;
    } & ComponentProps<'button'>)
  | { asChild: true; className?: string; children: ReactNode };

/**
 * The submit button next to the fields. Renders a solid-fill `Button` by default;
 * pass `asChild` to place any element of your own in the submit cell.
 */
export const SearchBoxSubmit = (props: SearchBoxSubmitProps) => {
  const contextSize = use(SearchBoxSizeContext);

  if (props.asChild) {
    const { asChild: _, children, className, ...rest } = props;

    return (
      <Slot className={cx(submitPlacement, className)} {...rest}>
        {children}
      </Slot>
    );
  }

  const { asChild: _, children, className, size = contextSize, ...rest } = props;

  return (
    <Button variant='solid-fill' size={size} className={cx(submitPlacement, className)} {...rest}>
      {children}
    </Button>
  );
};
