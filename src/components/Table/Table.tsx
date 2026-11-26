import { type ComponentProps, type CSSProperties, useEffect, useRef, useState } from 'react';
import { css, cva, cx } from '../../../styled-system/css';
import { focusRing } from '../../styles/focus';

export type TableSize = 'default' | 'dense';
export type TableBorderSide = 'top' | 'right' | 'bottom' | 'left';
export type TableBorderValue =
  | TableBorderSide
  | 'hidden'
  | 'top-hidden'
  | 'right-hidden'
  | 'bottom-hidden'
  | 'left-hidden';
/** `true` draws all four sides. Several values can be combined in an array. */
export type TableBorder = boolean | TableBorderValue | TableBorderValue[];
/** `true` draws all four sides of every descendant cell. */
export type TableCellBorder = boolean | TableBorderSide | TableBorderSide[];
export type TableBackground = 'white' | 'solid-gray-50' | 'solid-gray-100' | 'transparent';

const toDataValue = (value: boolean | string | string[] | undefined) => {
  if (value === undefined || value === false) return undefined;
  if (value === true) return '';
  return Array.isArray(value) ? value.join(' ') : value;
};

const borderColor = 'var(--table-border-color)';

const container = cva({
  base: {
    '--table-border-color': '{colors.solid-gray.420}',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    rowGap: '16',
    color: 'solid-gray.800',

    '& [data-cell-border=""] :where(td, th)': {
      borderWidth: '1',
      borderStyle: 'solid',
      borderColor,
    },
    '& [data-cell-border~="top"] :where(td, th)': {
      borderTopWidth: '1',
      borderTopStyle: 'solid',
      borderTopColor: borderColor,
    },
    '& [data-cell-border~="right"] :where(td, th)': {
      borderRightWidth: '1',
      borderRightStyle: 'solid',
      borderRightColor: borderColor,
    },
    '& [data-cell-border~="bottom"] :where(td, th)': {
      borderBottomWidth: '1',
      borderBottomStyle: 'solid',
      borderBottomColor: borderColor,
    },
    '& [data-cell-border~="left"] :where(td, th)': {
      borderLeftWidth: '1',
      borderLeftStyle: 'solid',
      borderLeftColor: borderColor,
    },

    '& [data-border=""]': {
      borderWidth: '1',
      borderStyle: 'solid',
      borderColor,
    },
    '& [data-border~="top"]': {
      borderTopWidth: '1',
      borderTopStyle: 'solid',
      borderTopColor: borderColor,
    },
    '& [data-border~="right"]': {
      borderRightWidth: '1',
      borderRightStyle: 'solid',
      borderRightColor: borderColor,
    },
    '& [data-border~="bottom"]': {
      borderBottomWidth: '1',
      borderBottomStyle: 'solid',
      borderBottomColor: borderColor,
    },
    '& [data-border~="left"]': {
      borderLeftWidth: '1',
      borderLeftStyle: 'solid',
      borderLeftColor: borderColor,
    },
    // The doubled attribute selector lets `hidden` win over every border rule above.
    '& [data-border][data-border="hidden"]': { borderStyle: 'hidden' },
    '& [data-border][data-border~="top-hidden"]': { borderTopStyle: 'hidden' },
    '& [data-border][data-border~="right-hidden"]': { borderRightStyle: 'hidden' },
    '& [data-border][data-border~="bottom-hidden"]': { borderBottomStyle: 'hidden' },
    '& [data-border][data-border~="left-hidden"]': { borderLeftStyle: 'hidden' },

    '& [data-bg="white"]': { backgroundColor: 'white' },
    '& [data-bg="solid-gray-50"]': {
      '--table-border-color': '{colors.solid-gray.500}',
      backgroundColor: 'solid-gray.50',
    },
    '& [data-bg="solid-gray-100"]': {
      '--table-border-color': '{colors.solid-gray.500}',
      backgroundColor: 'solid-gray.100',
    },
    '& [data-bg="transparent"]': { backgroundColor: 'transparent' },

    // Cells with a left border keep it visible while the row is highlighted as selected.
    '& [data-border=""] :is(td, th):first-child': { '--table-gap-x': '1px' },
    '& [data-border~="left"] :is(td, th):first-child': { '--table-gap-x': '1px' },
    '& [data-cell-border=""] :is(td, th)': { '--table-gap-x': '1px' },
    '& [data-cell-border~="left"] :is(td, th)': { '--table-gap-x': '1px' },
    '& [data-cell-border~="right"] :is(td, th) + :is(td, th)': { '--table-gap-x': '1px' },
    '& [data-border=""]:is(td, th)': { '--table-gap-x': '1px' },
    '& [data-border~="left"]:is(td, th)': { '--table-gap-x': '1px' },
    '& [data-border=""] + :is(td, th)': { '--table-gap-x': '1px' },
    '& [data-border~="right"] + :is(td, th)': { '--table-gap-x': '1px' },

    // A cell that only holds a checkbox or radio label becomes a 40px wide hit area.
    '& :is(td, th):has(> label:only-child input:is([type=checkbox], [type=radio]))': {
      position: 'relative',
      width: '40',
      padding: '0',
    },
    '& :is(td, th) > label:only-child:has(input:is([type=checkbox], [type=radio]))': {
      position: 'absolute',
      inset: '0',
      display: 'grid',
      justifyContent: 'center',
      width: 'auto',
      paddingTop: '10',
    },
  },
  variants: {
    size: {
      default: {
        '--table-padding': '1.25rem 1rem',
        '--table-sort-header-padding-block': '0.75rem',
        '--table-sort-label-padding-block': '0.5rem',
        '--table-sort-icon-margin-top': '0rem',
        '--table-sort-icon-padding-top': '0.125rem',
        textStyle: 'std-16N-170',
      },
      dense: {
        '--table-padding': '0.75rem 1rem',
        '--table-sort-header-padding-block': '0rem',
        '--table-sort-label-padding-block': '0.6875rem',
        '--table-sort-icon-margin-top': '-0.125rem',
        '--table-sort-icon-padding-top': '0rem',
        textStyle: 'dns-16N-130',
      },
    },
    rowStripe: {
      true: {
        '--table-border-color': '{colors.solid-gray.500}',
        '& tr:nth-child(even)': { backgroundColor: 'solid-gray.50' },
      },
    },
    rowHoverHighlight: {
      true: {
        '--table-border-color': '{colors.solid-gray.500}',
        _hoverable: {
          '& table tr:hover': { backgroundColor: 'key.50' },
        },
      },
    },
    selectable: {
      true: {
        '--table-border-color': '{colors.solid-gray.500}',
        '& tr:has(:checked) :where(td, th)': {
          backgroundColor: 'key.100',
          backgroundImage: 'linear-gradient(#fff, #fff), linear-gradient(90deg, #fff, #fff)',
          backgroundPosition: 'top, left',
          backgroundSize: '100% 1px, var(--table-gap-x, 0px) 100%',
          backgroundRepeat: 'no-repeat',
          backgroundOrigin: 'padding-box',
        },
      },
    },
  },
});

const table = cva({
  base: {
    borderCollapse: 'collapse',
    '& :is(td, th)': {
      padding: 'var(--table-padding, 1.25rem 1rem)',
      textAlign: 'left',
      verticalAlign: 'baseline',
    },
    '& th': { fontWeight: '700' },
  },
  variants: {
    width: {
      full: { width: 'full' },
    },
    layout: {
      fixed: { tableLayout: 'fixed' },
    },
  },
});

const caption = css({
  textStyle: 'std-17B-170',
});

const headerCell = {
  '--table-border-color': '{colors.solid-gray.500}',
  backgroundColor: 'solid-gray.100',
  color: 'solid-gray.900',
} as const;

const blackBottomBorder = {
  borderBottomWidth: '1',
  borderBottomStyle: 'solid',
  borderBottomColor: 'black',
} as const;

const colHeader = css({
  ...headerCell,
  'tr:last-of-type > &': blackBottomBorder,
});

const rowHeader = css({
  ...headerCell,
  '&:last-of-type:is(tr > *)': {
    borderRightWidth: '1',
    borderRightStyle: 'solid',
    borderRightColor: 'black',
  },
});

const sortHeader = css({
  ...headerCell,
  '--table-padding': 'var(--table-sort-header-padding-block, 0.75rem) 1rem',
  'tr:last-of-type > &': blackBottomBorder,
});

const sortInner = css({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  columnGap: '4',
});

const sortLabel = css({
  display: 'flex',
  alignItems: 'flex-start',
  gap: '4',
  paddingBlock: 'var(--table-sort-label-padding-block, 0.5rem)',
});

const sortButton = css({
  display: 'inline-flex',
  alignItems: 'flex-start',
  columnGap: '4',
  textAlign: 'left',
  textDecorationLine: 'underline',
  textUnderlineOffset: '0.1875rem',
  cursor: 'pointer',
  _hover: { textDecorationThickness: '0.1875rem' },
  _focusVisible: { ...focusRing, borderRadius: '4', backgroundColor: 'yellow.300' },
});

const sortIcon = css({
  flexShrink: '0',
  marginTop: 'var(--table-sort-icon-margin-top, 0rem)',
  paddingTop: 'var(--table-sort-icon-padding-top, 0.125rem)',
});

const iconSvg = css({
  display: 'block',
  width: '24',
  height: '24',
});

const sortPathNone = css({
  ':is([aria-sort=ascending], [aria-sort=descending]) &': { display: 'none' },
});

const sortPathAscending = css({
  display: 'none',
  '[aria-sort=ascending] &': { display: 'inline' },
});

const sortPathDescending = css({
  display: 'none',
  '[aria-sort=descending] &': { display: 'inline' },
});

const action = css({
  display: 'flex',
  flexShrink: '0',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: '-16',
  width: '44',
  height: '44',
  borderRadius: '4',
  cursor: 'pointer',
  _focusVisible: { ...focusRing, backgroundColor: 'yellow.300' },
});

const scrollShadow = css({
  position: 'relative',
  display: 'flex',
  marginInline: 'calc(var(--scroll-shadow-padding, 0px) * -1)',
  overflowX: 'auto',
  paddingInline: 'var(--scroll-shadow-padding, 0px)',
  paddingBottom: '8',
  _focusVisible: { ...focusRing },
});

const shadow = cva({
  base: {
    position: 'sticky',
    top: '0',
    bottom: '0',
    flexShrink: '0',
    width: '24',
    opacity: '0',
    pointerEvents: 'none',
    transition: 'opacity 0.3s ease',
    _motionReduce: { transition: 'none' },
    '&[data-visible]': { opacity: '1' },
  },
  variants: {
    side: {
      left: {
        left: 'calc(var(--scroll-shadow-padding, 0px) * -1)',
        marginRight: '-24',
        background: 'linear-gradient(to right, rgba(0, 0, 0, 0.4), transparent)',
      },
      right: {
        right: 'calc(var(--scroll-shadow-padding, 0px) * -1)',
        marginLeft: '-24',
        background: 'linear-gradient(to left, rgba(0, 0, 0, 0.4), transparent)',
      },
    },
  },
});

export type TableContainerProps = ComponentProps<'div'> & {
  /** Use `figure` together with `TableCaption`. */
  as?: 'div' | 'figure';
  /** `dense` reduces the row height (data table). */
  size?: TableSize;
  /** Tints even rows. */
  rowStripe?: boolean;
  /** Highlights the hovered row. */
  rowHoverHighlight?: boolean;
  /** Highlights rows whose checkbox or radio is checked. */
  selectable?: boolean;
};

/** Root of a table. Holds the `Table` itself and, as a `figure`, its `TableCaption`. */
export const TableContainer = (props: TableContainerProps) => {
  const {
    as: Component = 'div',
    children,
    className,
    size = 'default',
    rowStripe,
    rowHoverHighlight,
    selectable,
    ...rest
  } = props;

  return (
    <Component
      className={cx(container({ size, rowStripe, rowHoverHighlight, selectable }), className)}
      {...rest}
    >
      {children}
    </Component>
  );
};

export type TableCaptionProps = ComponentProps<'figcaption'>;

export const TableCaption = (props: TableCaptionProps) => {
  const { children, className, ...rest } = props;

  return (
    <figcaption className={cx(caption, className)} {...rest}>
      {children}
    </figcaption>
  );
};

export type TableProps = Omit<ComponentProps<'table'>, 'border' | 'width'> & {
  /** Border of the table itself. */
  border?: TableBorder;
  /** Border of every cell in the table. */
  cellBorder?: TableCellBorder;
  width?: 'full';
  layout?: 'fixed';
};

/** The `<table>` element. Must be placed inside `TableContainer`. */
export const Table = (props: TableProps) => {
  const { border, cellBorder, children, className, width, layout, ...rest } = props;

  return (
    <table
      className={cx(table({ width, layout }), className)}
      data-border={toDataValue(border)}
      data-cell-border={toDataValue(cellBorder)}
      {...rest}
    >
      {children}
    </table>
  );
};

type SectionStyleProps = {
  /** Border of this element. */
  border?: TableBorder;
  /** Border of every cell in this element. */
  cellBorder?: TableCellBorder;
  bg?: TableBackground;
};

export type TableHeadProps = ComponentProps<'thead'> & SectionStyleProps;

export const TableHead = (props: TableHeadProps) => {
  const { bg, border, cellBorder, children, ...rest } = props;

  return (
    <thead
      data-bg={bg}
      data-border={toDataValue(border)}
      data-cell-border={toDataValue(cellBorder)}
      {...rest}
    >
      {children}
    </thead>
  );
};

export type TableBodyProps = ComponentProps<'tbody'> & SectionStyleProps;

export const TableBody = (props: TableBodyProps) => {
  const { bg, border, cellBorder, children, ...rest } = props;

  return (
    <tbody
      data-bg={bg}
      data-border={toDataValue(border)}
      data-cell-border={toDataValue(cellBorder)}
      {...rest}
    >
      {children}
    </tbody>
  );
};

export type TableFootProps = ComponentProps<'tfoot'> & SectionStyleProps;

export const TableFoot = (props: TableFootProps) => {
  const { bg, border, cellBorder, children, ...rest } = props;

  return (
    <tfoot
      data-bg={bg}
      data-border={toDataValue(border)}
      data-cell-border={toDataValue(cellBorder)}
      {...rest}
    >
      {children}
    </tfoot>
  );
};

export type TableRowProps = ComponentProps<'tr'> & SectionStyleProps;

export const TableRow = (props: TableRowProps) => {
  const { bg, border, cellBorder, children, ...rest } = props;

  return (
    <tr
      data-bg={bg}
      data-border={toDataValue(border)}
      data-cell-border={toDataValue(cellBorder)}
      {...rest}
    >
      {children}
    </tr>
  );
};

type CellStyleProps = {
  /** Border of this cell. */
  border?: TableBorder;
  bg?: TableBackground;
};

export type TableColHeaderProps = ComponentProps<'th'> &
  CellStyleProps & {
    /** Use `td` for an empty header cell. */
    as?: 'th' | 'td';
  };

/** Column header cell (`<th scope='col'>`). */
export const TableColHeader = (props: TableColHeaderProps) => {
  const { as: Component = 'th', bg, border, children, className, scope, ...rest } = props;

  return (
    <Component
      className={cx(colHeader, className)}
      scope={scope ?? (Component === 'th' ? 'col' : undefined)}
      data-bg={bg}
      data-border={toDataValue(border)}
      {...rest}
    >
      {children}
    </Component>
  );
};

export type TableRowHeaderProps = ComponentProps<'th'> & CellStyleProps;

/** Row header cell (`<th scope='row'>`). */
export const TableRowHeader = (props: TableRowHeaderProps) => {
  const { bg, border, children, className, scope = 'row', ...rest } = props;

  return (
    <th
      className={cx(rowHeader, className)}
      scope={scope}
      data-bg={bg}
      data-border={toDataValue(border)}
      {...rest}
    >
      {children}
    </th>
  );
};

export type TableCellProps = ComponentProps<'td'> & CellStyleProps;

export const TableCell = (props: TableCellProps) => {
  const { bg, border, children, ...rest } = props;

  return (
    <td data-bg={bg} data-border={toDataValue(border)} {...rest}>
      {children}
    </td>
  );
};

export type TableSort = 'ascending' | 'descending' | 'none';

export type TableSortHeaderProps = Omit<ComponentProps<'th'>, 'aria-sort'> &
  CellStyleProps & {
    /** Current sort state of the column, exposed as `aria-sort`. */
    sort?: TableSort;
  };

/** Sortable column header. Holds a `TableSortButton` and optionally a `TableActionButton`. */
export const TableSortHeader = (props: TableSortHeaderProps) => {
  const { bg, border, children, className, scope = 'col', sort = 'none', ...rest } = props;

  return (
    <th
      className={cx(sortHeader, className)}
      scope={scope}
      aria-sort={sort}
      data-bg={bg}
      data-border={toDataValue(border)}
      {...rest}
    >
      <div className={sortInner}>{children}</div>
    </th>
  );
};

export type TableSortButtonProps = ComponentProps<'button'>;

/** Button that toggles the sort order. Its icon follows the `sort` of the `TableSortHeader`. */
export const TableSortButton = (props: TableSortButtonProps) => {
  const { children, className, type = 'button', ...rest } = props;

  return (
    <div className={sortLabel}>
      <button className={cx(sortButton, className)} type={type} {...rest}>
        {children}
        <span className={sortIcon}>
          <svg
            className={iconSvg}
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='currentcolor'
            aria-hidden={true}
          >
            <path
              className={sortPathNone}
              d='M17 18.11L21.27 14L22 14.7L16.5 20L11 14.7L11.73 14L16 18.12V4H17V18.12ZM8 5.88L12.27 10L13 9.3L7.5 4L2 9.3L2.73 10L7 5.88V20H8V5.88Z'
            />
            <path
              className={sortPathAscending}
              d='M17 18.12L21.27 14L22 14.7L16.5 20L11 14.7L11.73 14L16 18.12V4H17V18.12ZM14 8.92L11.73 11L9 8.52V20H6V8.52L3.27 11L1 8.93L7.5 3L14 8.93Z'
            />
            <path
              className={sortPathDescending}
              d='M7 5.88L2.73 10L2 9.3L7.5 4L13 9.3L12.27 10L8 5.88V20H7V5.88ZM10 15.08L12.27 13L15 15.48V4H18V15.48L20.73 13L23 15.07L16.5 21L10 15.07Z'
            />
          </svg>
        </span>
      </button>
    </div>
  );
};

export type TableActionButtonProps = Omit<ComponentProps<'button'>, 'children'> & {
  /** Accessible name of the button. */
  'aria-label': string;
};

/** Column menu button (vertical ellipsis) for a `TableSortHeader`. */
export const TableActionButton = (props: TableActionButtonProps) => {
  const { 'aria-label': ariaLabel, className, type = 'button', ...rest } = props;

  return (
    <button className={cx(action, className)} type={type} {...rest}>
      <svg
        className={iconSvg}
        width='24'
        height='24'
        viewBox='0 0 24 24'
        fill='currentcolor'
        role='img'
        aria-label={ariaLabel}
      >
        <circle cx='12' cy='4.5' r='1.5' />
        <circle cx='12' cy='12' r='1.5' />
        <circle cx='12' cy='19.5' r='1.5' />
      </svg>
    </button>
  );
};

export type TableScrollShadowProps = Omit<ComponentProps<'div'>, 'ref'> & {
  /**
   * Horizontal padding of the surrounding layout (CSS length). The scroll area bleeds into it
   * so the table can scroll up to the screen edge.
   */
  padding?: string;
};

/** Horizontally scrollable area that shows a shadow on each side that can be scrolled to. */
export const TableScrollShadow = (props: TableScrollShadowProps) => {
  const { children, className, padding, style, tabIndex = 0, ...rest } = props;
  const ref = useRef<HTMLDivElement>(null);
  const [hasLeftShadow, setHasLeftShadow] = useState(false);
  const [hasRightShadow, setHasRightShadow] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const update = () => {
      const paddingValue = Number.parseFloat(getComputedStyle(element).paddingLeft) || 0;
      const { scrollLeft, scrollWidth, clientWidth } = element;
      setHasLeftShadow(scrollLeft > paddingValue);
      setHasRightShadow(scrollLeft + clientWidth < scrollWidth - paddingValue);
    };

    update();
    element.addEventListener('scroll', update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(element);
    for (const child of element.children) {
      observer.observe(child);
    }

    return () => {
      element.removeEventListener('scroll', update);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={ref}
      className={cx(scrollShadow, className)}
      style={
        padding === undefined
          ? style
          : ({ '--scroll-shadow-padding': padding, ...style } as CSSProperties)
      }
      tabIndex={tabIndex}
      {...rest}
    >
      <div className={shadow({ side: 'left' })} data-visible={hasLeftShadow ? '' : undefined} />
      {children}
      <div className={shadow({ side: 'right' })} data-visible={hasRightShadow ? '' : undefined} />
    </div>
  );
};
