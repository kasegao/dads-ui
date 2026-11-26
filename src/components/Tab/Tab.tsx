import { Tabs } from '@ark-ui/react/tabs';
import { type ComponentProps, createContext, useContext } from 'react';
import { cx, sva } from '../../../styled-system/css';
import { focusRing } from '../../styles/focus';

export type TabPosition = 'top' | 'bottom' | 'left' | 'right';
export type TabActivation = 'auto' | 'manual';
export type TabChangeDetail = Tabs.ValueChangeDetails;

const tab = sva({
  slots: ['root', 'list', 'tab', 'label', 'panel'],
  base: {
    root: {
      position: 'relative',
      zIndex: '0',
      display: 'flex',
      color: 'solid-gray.800',
      textStyle: 'std-16N-170',
      overflowWrap: 'anywhere',
    },
    list: {
      position: 'relative',
      zIndex: '0',
      display: 'flex',
      // The negative margin and padding leave room for the focus ring inside `overflow: hidden`.
      margin: '-6px',
      overflow: 'hidden',
      paddingTop: '0.4375rem',
      paddingRight: '6',
      paddingBottom: '6',
      paddingLeft: '0.4375rem',
      '& > li': { display: 'contents' },
      // Extends the border of the panel along the rest of the list.
      _after: {
        content: '""',
        position: 'relative',
        flexGrow: '1',
        borderWidth: '0',
        borderStyle: 'solid',
        borderColor: 'solid-gray.420',
      },
    },
    tab: {
      isolation: 'isolate',
      display: 'flex',
      marginTop: '-1px',
      marginLeft: '-1px',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: 'solid-gray.420',
      backgroundColor: 'white',
      textAlign: 'left',
      textDecorationLine: 'none',
      '&[role=tab]': { cursor: 'default' },
      '&:not([data-selected]):hover': { backgroundColor: 'solid-gray.50' },
      _focusVisible: { ...focusRing, zIndex: '1', overflow: 'hidden', borderRadius: '4' },
      // Erases the border between the selected tab and the panel. Positioned against the list.
      '&[data-selected]:not(:focus-visible)::before': {
        content: '""',
        position: 'absolute',
        borderWidth: '0',
        borderStyle: 'solid',
        borderColor: 'white',
        _forcedColors: { borderColor: 'Canvas' },
      },
    },
    label: {
      position: 'relative',
      display: 'flex',
      flexGrow: '1',
      alignItems: 'center',
      borderWidth: '0',
      borderStyle: 'solid',
      borderColor: 'solid-gray.50',
      padding: '16',
      textStyle: 'dns-16N-120',
      _forcedColors: { borderColor: 'Canvas' },
      _before: { content: '""', position: 'absolute' },
      '[data-selected] > &': {
        fontWeight: '700',
        _before: {
          backgroundColor: 'key.900',
          _forcedColors: { backgroundColor: 'ButtonText' },
        },
      },
      ':not([data-selected]):hover > &': {
        textDecorationLine: 'underline',
        textDecorationThickness: '1px',
        textUnderlineOffset: '0.1875rem',
        _before: { backgroundColor: 'solid-gray.420' },
      },
    },
    panel: {
      borderStyle: 'solid',
      borderColor: 'solid-gray.420',
      backgroundColor: 'white',
      padding: '16',
      _focusVisible: { ...focusRing, zIndex: '1', borderRadius: '4' },
    },
  },
  variants: {
    position: {
      top: {
        root: { flexDirection: 'column' },
        list: {
          flexWrap: 'wrap',
          _after: { marginLeft: '-1px', width: '1px', borderBottomWidth: '1px' },
        },
        tab: {
          '&[data-selected]:not(:focus-visible)::before': {
            bottom: '6',
            width: 'full',
            borderBottomWidth: '1px',
          },
        },
        label: {
          borderTopWidth: '5px',
          _before: { top: '-6px', insetInline: '0', height: '6' },
        },
        panel: {
          borderTopWidth: '0',
          borderRightWidth: '1px',
          borderBottomWidth: '1px',
          borderLeftWidth: '1px',
        },
      },
      bottom: {
        root: { flexDirection: 'column' },
        list: {
          flexWrap: 'wrap-reverse',
          _after: {
            marginTop: '-1px',
            marginLeft: '-1px',
            width: '1px',
            borderTopWidth: '1px',
          },
        },
        tab: {
          '&[data-selected]:not(:focus-visible)::before': {
            top: '6',
            width: 'full',
            borderBottomWidth: '1px',
          },
        },
        label: {
          borderBottomWidth: '5px',
          _before: { bottom: '-6px', insetInline: '0', height: '6' },
        },
        panel: {
          borderTopWidth: '1px',
          borderRightWidth: '1px',
          borderBottomWidth: '0',
          borderLeftWidth: '1px',
        },
      },
      left: {
        root: { flexDirection: 'row' },
        list: {
          flexDirection: 'column',
          flexShrink: '0',
          _after: { marginTop: '-1px', height: '1px', borderRightWidth: '1px' },
        },
        tab: {
          '&[data-selected]:not(:focus-visible)::before': {
            right: '6',
            height: 'full',
            borderRightWidth: '1px',
          },
        },
        label: {
          borderLeftWidth: '5px',
          _before: { left: '-6px', insetBlock: '0', width: '6' },
        },
        panel: {
          flexGrow: '1',
          minWidth: '0',
          borderTopWidth: '1px',
          borderRightWidth: '1px',
          borderBottomWidth: '1px',
          borderLeftWidth: '0',
        },
      },
      right: {
        root: { flexDirection: 'row-reverse' },
        list: {
          flexDirection: 'column',
          flexShrink: '0',
          _after: {
            marginTop: '-1px',
            marginLeft: '-1px',
            height: '1px',
            borderLeftWidth: '1px',
          },
        },
        tab: {
          '&[data-selected]:not(:focus-visible)::before': {
            left: '6',
            height: 'full',
            borderLeftWidth: '1px',
          },
        },
        label: {
          borderRightWidth: '5px',
          _before: { right: '-6px', insetBlock: '0', width: '6' },
        },
        panel: {
          flexGrow: '1',
          minWidth: '0',
          borderTopWidth: '1px',
          borderRightWidth: '0',
          borderBottomWidth: '1px',
          borderLeftWidth: '1px',
        },
      },
    },
  },
});

const TabPositionContext = createContext<TabPosition>('top');

const useTabStyles = () => tab({ position: useContext(TabPositionContext) });

/* -------------------------------------------------------------------------- */
/* In-page tabs (WAI-ARIA Tabs pattern, arrow-key navigation) */

export type TabProps = Omit<Tabs.RootProps, 'orientation' | 'activationMode'> & {
  /** Where the tab list sits. For `bottom`, also place `TabList` after the panels. */
  position?: TabPosition;
  /** `auto` selects a tab when it receives focus, `manual` on Enter/Space or click. */
  activation?: TabActivation;
};

export const Tab = (props: TabProps) => {
  const {
    position = 'top',
    activation = 'auto',
    loopFocus = false,
    className,
    children,
    ...rest
  } = props;

  return (
    <TabPositionContext value={position}>
      <Tabs.Root
        className={cx(tab({ position }).root, className)}
        orientation={position === 'left' || position === 'right' ? 'vertical' : 'horizontal'}
        activationMode={activation === 'manual' ? 'manual' : 'automatic'}
        loopFocus={loopFocus}
        data-position={position}
        {...rest}
      >
        {children}
      </Tabs.Root>
    </TabPositionContext>
  );
};

export type TabListProps = Tabs.ListProps;

export const TabList = (props: TabListProps) => {
  const { className, children, ...rest } = props;
  const styles = useTabStyles();
  return (
    <Tabs.List className={cx(styles.list, className)} {...rest}>
      {children}
    </Tabs.List>
  );
};

export type TabItemProps = Tabs.TriggerProps;

export const TabItem = (props: TabItemProps) => {
  const { className, children, ...rest } = props;
  const styles = useTabStyles();
  return (
    <Tabs.Trigger className={cx(styles.tab, className)} {...rest}>
      <span className={styles.label}>{children}</span>
    </Tabs.Trigger>
  );
};

export type TabPanelProps = Tabs.ContentProps;

export const TabPanel = (props: TabPanelProps) => {
  const { className, children, ...rest } = props;
  const styles = useTabStyles();
  return (
    <Tabs.Content className={cx(styles.panel, className)} {...rest}>
      {children}
    </Tabs.Content>
  );
};

/* -------------------------------------------------------------------------- */
/* Link list (page navigation that looks like tabs; no JS behavior) */

export type TabNavProps = ComponentProps<'div'> & {
  position?: TabPosition;
};

export const TabNav = (props: TabNavProps) => {
  const { position = 'top', className, children, ...rest } = props;
  return (
    <TabPositionContext value={position}>
      <div className={cx(tab({ position }).root, className)} data-position={position} {...rest}>
        {children}
      </div>
    </TabPositionContext>
  );
};

export type TabNavListProps = ComponentProps<'ul'>;

export const TabNavList = (props: TabNavListProps) => {
  const { className, children, ...rest } = props;
  const styles = useTabStyles();
  return (
    <ul className={cx(styles.list, className)} {...rest}>
      {children}
    </ul>
  );
};

export type TabNavItemProps = ComponentProps<'a'>;

/** Renders `<li><a>`. Mark the link of the current page with `aria-current='page'`. */
export const TabNavItem = (props: TabNavItemProps) => {
  const { className, children, 'aria-current': ariaCurrent, ...rest } = props;
  const styles = useTabStyles();
  const isCurrent = ariaCurrent != null && ariaCurrent !== false && ariaCurrent !== 'false';
  return (
    <li>
      <a
        className={cx(styles.tab, className)}
        aria-current={ariaCurrent}
        data-selected={isCurrent ? '' : undefined}
        {...rest}
      >
        <span className={styles.label}>{children}</span>
      </a>
    </li>
  );
};

export type TabNavPanelProps = ComponentProps<'div'>;

export const TabNavPanel = (props: TabNavPanelProps) => {
  const { className, children, ...rest } = props;
  const styles = useTabStyles();
  return (
    <div className={cx(styles.panel, className)} {...rest}>
      {children}
    </div>
  );
};
