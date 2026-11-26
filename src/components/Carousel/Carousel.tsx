import { Carousel as ArkCarousel, useCarouselContext } from '@ark-ui/react/carousel';
import { Children, type ComponentProps, createContext, type ReactNode, use } from 'react';
import { css, cx } from '../../../styled-system/css';
import { focusRing } from '../../styles/focus';

type CarouselSettings = { unit: string; slideCount: number };

const SettingsContext = createContext<CarouselSettings>({ unit: 'スライド', slideCount: 0 });

const root = css({ containerType: 'inline-size', display: 'block' });

const inner = css({
  position: 'relative',
  zIndex: '0',
  maxWidth: '64rem',
  color: 'solid-gray.800',
  textStyle: 'std-16N-170',
  '@container (min-width: 64rem)': { paddingInline: '48' },
});

/** Grid shared by the main panel and each row of the expanded list. */
const panel = css({
  position: 'relative',
  display: 'grid',
  gridTemplate: '"main" auto / auto',
  _before: {
    content: '""',
    gridArea: 'number',
    justifySelf: 'center',
    display: 'none',
    height: 'full',
    borderRightWidth: '1',
    borderRightStyle: 'solid',
    borderRightColor: 'black',
  },
  '@container (min-width: 64rem)': {
    marginInline: '-3rem',
    gridTemplate: '"number main next ." auto / 3rem 3fr 1fr 3rem',
    '[data-scope=carousel]:has(details[open]) &': { _before: { display: 'block' } },
  },
});

const number = css({
  gridArea: 'number',
  display: 'none',
  alignItems: 'center',
  justifyContent: 'center',
  justifySelf: 'center',
  width: '32',
  height: '32',
  borderWidth: '1',
  borderStyle: 'solid',
  borderColor: 'solid-gray.800',
  borderRadius: 'full',
  backgroundColor: 'white',
  paddingBottom: '2',
  color: 'solid-gray.800',
  textStyle: 'oln-16B-100',
  _current: {
    backgroundColor: 'solid-gray.800',
    color: 'white',
    boxShadow: '0 0 0 2px {colors.white}',
    outlineWidth: '1px',
    outlineStyle: 'solid',
    outlineColor: 'solid-gray.800',
    outlineOffset: '2px',
  },
  '@container (min-width: 64rem)': {
    '[data-scope=carousel]:has(details[open]) &': { display: 'flex' },
  },
});

const itemGroup = css({ gridArea: 'main', position: 'relative', minWidth: '0' });

const main = css({ gridArea: 'main', position: 'relative', isolation: 'isolate', minWidth: '0' });

const item = css({ position: 'relative', isolation: 'isolate', minWidth: '0' });

const slideLink = css({
  position: 'relative',
  display: 'block',
  height: 'full',
  '&:any-link': {
    _after: { content: '""', position: 'absolute', pointerEvents: 'none' },
    _hover: {
      outlineWidth: '4px',
      outlineStyle: 'solid',
      outlineColor: 'key.900',
      outlineOffset: '-2px',
      _after: { inset: '2px', boxShadow: 'inset 0 0 0 2px {colors.white}' },
    },
    _focusVisible: {
      overflow: 'hidden',
      outlineWidth: '4px',
      outlineStyle: 'solid',
      outlineColor: 'black',
      outlineOffset: '-2px',
      borderRadius: '8',
      _after: {
        inset: '2px',
        borderRadius: '6',
        boxShadow: 'inset 0 0 0 2px {colors.yellow.300}',
      },
    },
  },
});

const imageContainer = css({
  display: 'grid',
  placeContent: 'center',
  height: 'full',
  borderRadius: 'inherit',
  outlineWidth: '2px',
  outlineStyle: 'solid',
  outlineColor: 'black',
  outlineOffset: '-2px',
});

const image = css({ display: 'block', width: 'auto', maxWidth: 'full', height: 'auto' });

const background = css({
  position: 'absolute',
  inset: '0',
  zIndex: '-1',
  overflow: 'clip',
  pointerEvents: 'none',
});

const backgroundBlur = css({
  position: 'absolute',
  inset: '-50%',
  filter: 'blur(25px)',
  transform: 'translate3d(0, 0, 0)',
  _after: {
    content: '""',
    position: 'absolute',
    inset: '0',
    backgroundColor: 'white',
    mixBlendMode: 'soft-light',
  },
});

const backgroundImage = css({ width: 'full', height: 'full', objectFit: 'cover' });

const next = css({
  gridArea: 'next',
  position: 'relative',
  isolation: 'isolate',
  display: 'none',
  minWidth: '0',
  borderWidth: '1',
  borderStyle: 'solid',
  borderColor: 'solid-gray.420',
  borderLeftWidth: '0',
  padding: '24',
  '@container (min-width: 64rem)': {
    display: 'block',
    '[data-scope=carousel]:has(details[open]) &': { display: 'none' },
  },
});

const nextButton = css({
  position: 'relative',
  display: 'block',
  borderWidth: '1',
  borderStyle: 'solid',
  borderColor: 'solid-gray.420',
  backgroundColor: 'white',
  textAlign: 'left',
  textDecorationLine: 'underline',
  textDecorationThickness: '1px',
  textUnderlineOffset: '0.1875rem',
  touchAction: 'manipulation',
  cursor: 'pointer',
  '& img': { display: 'block', width: 'auto', maxWidth: 'full', height: 'auto' },
  _hover: {
    outlineWidth: '4px',
    outlineStyle: 'solid',
    outlineColor: 'key.900',
    outlineOffset: '-1px',
    textDecorationThickness: '0.1875rem',
    _after: {
      content: '""',
      position: 'absolute',
      inset: '0',
      boxShadow: 'inset 0 0 0 2px {colors.white}',
      pointerEvents: 'none',
    },
  },
  _focusVisible: {
    ...focusRing,
    borderRadius: '4',
    _after: { display: 'none' },
  },
});

const nextLabel = css({
  display: 'block',
  borderTopWidth: '1',
  borderTopStyle: 'solid',
  borderTopColor: 'solid-gray.420',
  padding: '16',
  textStyle: 'std-16B-170',
});

const controls = css({
  display: 'flex',
  alignItems: 'center',
  columnGap: '20',
  paddingBlock: '12',
  '@container (min-width: 64rem)': { columnGap: '32' },
  '[data-scope=carousel]:has(details[open]) &': { paddingBottom: '56' },
});

const pageNav = css({
  position: 'relative',
  display: 'flex',
  flexShrink: '0',
  justifyContent: 'flex-end',
  alignItems: 'center',
  columnGap: '12',
  '@container (min-width: 64rem)': { display: 'none' },
  '[data-scope=carousel]:has(details[open]) &': { display: 'none' },
});

const pageButton = css({
  position: 'relative',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '24',
  height: '24',
  borderWidth: '1',
  borderStyle: 'solid',
  borderColor: 'key.1000',
  borderRadius: 'full',
  backgroundColor: 'white',
  color: 'key.1000',
  cursor: 'pointer',
  _after: {
    content: '""',
    position: 'absolute',
    inset: '-100%',
    margin: 'auto',
    width: '44',
    height: '44',
  },
  _hover: { outlineWidth: '2px', outlineStyle: 'solid', backgroundColor: 'key.200' },
  _active: { backgroundColor: 'key.300', color: 'key.1200' },
  _focusVisible: { ...focusRing },
  _disabled: {
    borderColor: 'solid-gray.300',
    backgroundColor: 'white',
    color: 'solid-gray.300',
    outlineStyle: 'none',
    cursor: 'default',
    _forcedColors: { borderColor: 'GrayText', color: 'GrayText' },
  },
});

const pageText = css({ textBoxTrim: 'trim-both', textBoxEdge: 'cap alphabetic' });

const stepNav = css({
  position: 'relative',
  display: 'none',
  justifyContent: 'flex-end',
  columnGap: '16',
  '@container (min-width: 64rem)': {
    display: 'flex',
    '[data-scope=carousel]:has(details[open]) &': { display: 'none' },
  },
});

const step = css({
  position: 'relative',
  display: 'flex',
  flexShrink: '0',
  justifyContent: 'center',
  alignItems: 'center',
  width: '32',
  height: '32',
  borderWidth: '1',
  borderStyle: 'solid',
  borderColor: 'solid-gray.800',
  borderRadius: 'full',
  backgroundColor: 'white',
  paddingBottom: '2',
  color: 'solid-gray.800',
  textStyle: 'oln-16B-100',
  cursor: 'default',
  _before: {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: 'calc(100% + 1px)',
    width: '16',
    borderBottomWidth: '1',
    borderBottomStyle: 'solid',
    borderBottomColor: 'solid-gray.800',
  },
  _last: { _before: { display: 'none' } },
  _after: { content: '""', position: 'absolute', inset: '-0.4375rem' },
  '&:not([data-current])': {
    textDecorationLine: 'underline',
    textDecorationThickness: '1px',
    textUnderlineOffset: '0.1875rem',
    _hover: { textDecorationThickness: '0.1875rem', cursor: 'pointer' },
  },
  _current: {
    backgroundColor: 'solid-gray.800',
    color: 'white',
    boxShadow: '0 0 0 2px {colors.white}',
    outlineWidth: '1px',
    outlineStyle: 'solid',
    outlineColor: 'solid-gray.800',
    outlineOffset: '2px',
    _focusVisible: { ...focusRing },
  },
  _focusVisible: { ...focusRing },
});

const expand = css({ order: '-1', minWidth: '0', _open: { flex: '1' } });

const summary = css({
  display: 'flex',
  alignItems: 'flex-start',
  gap: '8',
  width: 'fit',
  borderWidth: '1',
  borderStyle: 'solid',
  borderColor: 'solid-gray.600',
  borderRadius: '8',
  backgroundColor: 'white',
  paddingInline: '12',
  paddingBlock: '8',
  listStyleType: 'none',
  cursor: 'pointer',
  '&::-webkit-details-marker': { display: 'none' },
  _hover: { textDecorationLine: 'underline', textUnderlineOffset: '0.1875rem' },
  _focusVisible: { ...focusRing },
});

const summaryIcon = css({
  flex: 'none',
  marginTop: 'calc((1lh - 24px) / 2)',
  color: 'key.1000',
  _forcedColors: { color: 'inherit' },
  'details[open] > summary > &': { rotate: '180deg' },
});

const summaryIconCircle = css({ fill: 'white', _forcedColors: { fill: 'Canvas' } });
const summaryIconRest = css({ 'summary:hover > svg > &': { display: 'none' } });
const summaryIconHover = css({
  display: 'none',
  'summary:hover > svg > &': { display: 'inline' },
});

const expandContent = css({ marginTop: '12' });
const expandList = css({ display: 'grid', rowGap: '24' });

const single = css({ textStyle: 'std-16N-170' });

const singleLink = css({
  position: 'relative',
  display: 'block',
  width: 'fit',
  '&:any-link': {
    _after: { content: '""', position: 'absolute', pointerEvents: 'none' },
    _hover: {
      outlineWidth: '4px',
      outlineStyle: 'solid',
      outlineColor: 'key.900',
      outlineOffset: '-2px',
      _after: { inset: '2px', boxShadow: 'inset 0 0 0 2px {colors.white}' },
    },
    _focusVisible: {
      overflow: 'hidden',
      outlineWidth: '4px',
      outlineStyle: 'solid',
      outlineColor: 'black',
      outlineOffset: '-2px',
      borderRadius: '8',
      _after: {
        inset: '2px',
        borderRadius: '6',
        boxShadow: 'inset 0 0 0 2px {colors.yellow.300}',
      },
    },
  },
});

const singleImage = css({
  display: 'block',
  maxWidth: 'full',
  height: 'auto',
  outlineWidth: '2px',
  outlineStyle: 'solid',
  outlineColor: 'black',
  outlineOffset: '-2px',
});

export type CarouselProps = ArkCarousel.RootProps & {
  /** Noun used in labels: "次の{unit}", "すべての{unit}". Defaults to `スライド`. */
  unit?: string;
};

export const Carousel = (props: CarouselProps) => {
  const { className, children, unit = 'スライド', loop = true, translations, ...rest } = props;

  return (
    <ArkCarousel.Root
      className={cx(root, className)}
      loop={loop}
      translations={{
        nextTrigger: `次の${unit}`,
        prevTrigger: `前の${unit}`,
        indicator: (index) => `${unit}${index + 1}`,
        item: (index, count) => `${unit}${index + 1} / ${count}`,
        ...translations,
      }}
      {...rest}
    >
      <SettingsContext value={{ unit, slideCount: rest.slideCount }}>
        <div className={inner}>{children}</div>
      </SettingsContext>
    </ArkCarousel.Root>
  );
};

export type CarouselPanelProps = ComponentProps<'div'>;

/** Lays out the slides, the "next" preview and (while the list is expanded) the slide number. */
export const CarouselPanel = (props: CarouselPanelProps) => {
  const { className, children, ...rest } = props;
  const carousel = useCarouselContext();

  return (
    <div className={cx(panel, className)} {...rest}>
      <p className={number} aria-current='true' aria-hidden='true'>
        {carousel.page + 1}
      </p>
      {children}
    </div>
  );
};

// zag always scrolls with `behavior: 'smooth'`, which overrides CSS `scroll-behavior`,
// so reduced motion has to be honoured where the scroll is issued.
const scrollInstantlyWhenMotionIsReduced = (element: HTMLDivElement | null) => {
  if (!element) return;

  const scrollTo = HTMLElement.prototype.scrollTo as (options?: ScrollToOptions) => void;
  const scrollToPosition = HTMLElement.prototype.scrollTo as (x: number, y: number) => void;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  element.scrollTo = ((options?: ScrollToOptions | number, y?: number) => {
    if (typeof options === 'number') {
      scrollToPosition.call(element, options, y ?? 0);
    } else {
      scrollTo.call(element, reduced.matches ? { ...options, behavior: 'instant' } : options);
    }
  }) as typeof element.scrollTo;
};

export type CarouselItemGroupProps = ArkCarousel.ItemGroupProps;

export const CarouselItemGroup = ({ className, ...rest }: CarouselItemGroupProps) => (
  <ArkCarousel.ItemGroup
    ref={scrollInstantlyWhenMotionIsReduced}
    className={cx(itemGroup, className)}
    {...rest}
  />
);

export type CarouselItemProps = ArkCarousel.ItemProps;

export const CarouselItem = ({ className, ...rest }: CarouselItemProps) => {
  const carousel = useCarouselContext();

  return (
    <ArkCarousel.Item
      className={cx(item, className)}
      inert={rest.index !== carousel.page}
      {...rest}
    />
  );
};

export type CarouselSlideLinkProps = ComponentProps<'a'>;

/** Slide content wrapper: a link when `href` is given, otherwise a plain `span`. */
export const CarouselSlideLink = (props: CarouselSlideLinkProps) => {
  const { className, href, target, rel, download, ...rest } = props;

  if (href === undefined) {
    return <span className={cx(slideLink, className)} {...(rest as ComponentProps<'span'>)} />;
  }

  return (
    <a
      className={cx(slideLink, className)}
      href={href}
      target={target}
      rel={rel}
      download={download}
      {...rest}
    />
  );
};

export type CarouselSlideImageProps = ComponentProps<'img'>;

export const CarouselSlideImage = ({ className, alt, ...rest }: CarouselSlideImageProps) => (
  <div className={imageContainer}>
    <img className={cx(image, className)} alt={alt} {...rest} />
  </div>
);

export type CarouselBackgroundProps = Pick<
  ComponentProps<'img'>,
  'className' | 'src' | 'srcSet' | 'sizes' | 'width' | 'height' | 'loading'
>;

/** Blurred copy of the slide image that fills the space around a narrower image. */
export const CarouselBackground = ({ className, ...rest }: CarouselBackgroundProps) => (
  <div className={cx(background, className)} aria-hidden='true'>
    <div className={backgroundBlur}>
      <img className={backgroundImage} alt='' {...rest} />
    </div>
  </div>
);

export type CarouselNextPreviewProps = Omit<ComponentProps<'button'>, 'children'> & {
  /** Renders the thumbnail of the slide at `index` (the one after the current slide). */
  children: (index: number) => ReactNode;
  /** Renders the backdrop behind the button, usually a `CarouselBackground`. */
  background?: (index: number) => ReactNode;
};

/** "Next slide" thumbnail button shown beside the main panel on wide containers. */
export const CarouselNextPreview = (props: CarouselNextPreviewProps) => {
  const { className, children, background: renderBackground, onClick, ...rest } = props;
  const carousel = useCarouselContext();
  const { unit, slideCount } = use(SettingsContext);
  const index = slideCount > 0 ? (carousel.page + 1) % slideCount : 0;

  return (
    <div className={next}>
      <button
        className={cx(nextButton, className)}
        type='button'
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented) carousel.scrollNext();
        }}
        {...rest}
      >
        {children(index)}
        <span className={nextLabel}>次の{unit}</span>
      </button>
      {renderBackground?.(index)}
    </div>
  );
};

export type CarouselControlsProps = ArkCarousel.ControlProps;

export const CarouselControls = ({ className, ...rest }: CarouselControlsProps) => (
  <ArkCarousel.Control className={cx(controls, className)} {...rest} />
);

export type CarouselPageNavProps = Omit<ComponentProps<'p'>, 'children'>;

/** Previous / "1 / 4" / next. Shown on narrow containers. */
export const CarouselPageNav = ({ className, ...rest }: CarouselPageNavProps) => (
  <p className={cx(pageNav, className)} {...rest}>
    <ArkCarousel.PrevTrigger className={pageButton}>
      <svg width='16' height='16' viewBox='0 0 16 16' aria-hidden='true'>
        <path d='m5.27 8 5.33-5.33-.93-.94L3.4 8l6.27 6.27.93-.94L5.27 8Z' fill='currentColor' />
      </svg>
    </ArkCarousel.PrevTrigger>
    <ArkCarousel.ProgressText className={pageText} />
    <ArkCarousel.NextTrigger className={pageButton}>
      <svg width='16' height='16' viewBox='0 0 16 16' aria-hidden='true'>
        <path d='m6 1.73-.93.94L10.4 8l-5.33 5.33.93.94L12.27 8 6 1.73Z' fill='currentColor' />
      </svg>
    </ArkCarousel.NextTrigger>
  </p>
);

export type CarouselStepNavProps = Omit<ArkCarousel.IndicatorGroupProps, 'children'>;

/** Numbered indicators with arrow-key navigation. Shown on wide containers. */
export const CarouselStepNav = ({ className, ...rest }: CarouselStepNavProps) => {
  const carousel = useCarouselContext();
  const { unit, slideCount } = use(SettingsContext);

  return (
    <ArkCarousel.IndicatorGroup
      className={cx(stepNav, className)}
      role='group'
      aria-label={`${unit}選択`}
      {...rest}
    >
      {Array.from({ length: slideCount }, (_, index) => {
        const current = index === carousel.page;

        return (
          <ArkCarousel.Indicator
            // biome-ignore lint/suspicious/noArrayIndexKey: indicators are identified by their index
            key={index}
            className={step}
            index={index}
            aria-current={current ? 'true' : undefined}
            tabIndex={current ? 0 : -1}
          >
            {index + 1}
          </ArkCarousel.Indicator>
        );
      })}
    </ArkCarousel.IndicatorGroup>
  );
};

export type CarouselExpandListProps = ComponentProps<'details'>;

/**
 * "すべてのスライド" disclosure. Pass one `CarouselExpandItem` per slide in slide order;
 * the current slide is left out and the rest follow it in rotation.
 */
export const CarouselExpandList = (props: CarouselExpandListProps) => {
  const { className, children, ...rest } = props;
  const carousel = useCarouselContext();
  const { unit } = use(SettingsContext);
  const items = Children.toArray(children);
  const others = [...items.slice(carousel.page + 1), ...items.slice(0, carousel.page)];

  return (
    <details className={cx(expand, className)} {...rest}>
      <summary className={summary}>
        <svg
          className={summaryIcon}
          width='24'
          height='24'
          viewBox='0 0 24 24'
          fill='none'
          aria-hidden='true'
        >
          <circle className={summaryIconCircle} cx='12' cy='12' r='10' />
          <path
            className={summaryIconRest}
            d='M12 15.525L16.925 10.625H7.07502L12 15.525ZM12 22.85C10.4834 22.85 9.06677 22.566 7.75027 21.998C6.43394 21.4298 5.28886 20.6588 4.31502 19.685C3.34119 18.7112 2.57019 17.5661 2.00202 16.2498C1.43402 14.9333 1.15002 13.5167 1.15002 12C1.15002 10.4833 1.43402 9.06675 2.00202 7.75025C2.57019 6.43392 3.34119 5.28883 4.31502 4.315C5.28886 3.34117 6.43394 2.57017 7.75027 2.002C9.06677 1.434 10.4834 1.15 12 1.15C13.5167 1.15 14.9333 1.434 16.2498 2.002C17.5661 2.57017 18.7112 3.34117 19.685 4.315C20.6589 5.28883 21.4299 6.43392 21.998 7.75025C22.566 9.06675 22.85 10.4833 22.85 12C22.85 13.5167 22.566 14.9333 21.998 16.2498C21.4299 17.5661 20.6589 18.7112 19.685 19.685C18.7112 20.6588 17.5661 21.4298 16.2498 21.998C14.9333 22.566 13.5167 22.85 12 22.85Z'
            fill='currentColor'
          />
          <path
            className={summaryIconHover}
            d='M12 15.525L16.925 10.625H7.07502L12 15.525ZM12 22.85C10.4834 22.85 9.06677 22.566 7.75027 21.998C6.43394 21.4298 5.28886 20.6588 4.31502 19.685C3.34119 18.7112 2.57019 17.5661 2.00202 16.2498C1.43402 14.9333 1.15002 13.5167 1.15002 12C1.15002 10.4833 1.43402 9.06675 2.00202 7.75025C2.57019 6.43392 3.34119 5.28883 4.31502 4.315C5.28886 3.34117 6.43394 2.57017 7.75027 2.002C9.06677 1.434 10.4834 1.15 12 1.15C13.5167 1.15 14.9333 1.434 16.2498 2.002C17.5661 2.57017 18.7112 3.34117 19.685 4.315C20.6589 5.28883 21.4299 6.43392 21.998 7.75025C22.566 9.06675 22.85 10.4833 22.85 12C22.85 13.5167 22.566 14.9333 21.998 16.2498C21.4299 17.5661 20.6589 18.7112 19.685 19.685C18.7112 20.6588 17.5661 21.4298 16.2498 21.998C14.9333 22.566 13.5167 22.85 12 22.85ZM12 19.7C14.1667 19.7 15.9917 18.9583 17.475 17.475C18.9584 15.9917 19.7 14.1667 19.7 12C19.7 9.83334 18.9584 8.00833 17.475 6.525C15.9917 5.04167 14.1667 4.3 12 4.3C9.83336 4.3 8.00836 5.04167 6.52502 6.525C5.04169 8.00833 4.30002 9.83334 4.30002 12C4.30002 14.1667 5.04169 15.9917 6.52502 17.475C8.00836 18.9583 9.83336 19.7 12 19.7Z'
            fill='currentColor'
          />
        </svg>
        すべての{unit}
      </summary>
      <div className={expandContent}>
        <ul className={expandList}>{others}</ul>
      </div>
    </details>
  );
};

export type CarouselExpandItemProps = ComponentProps<'li'> & {
  /** Zero-based slide index; shown as the slide number on wide containers. */
  index: number;
};

export const CarouselExpandItem = (props: CarouselExpandItemProps) => {
  const { className, children, index, ...rest } = props;

  return (
    <li className={cx(panel, className)} {...rest}>
      <p className={number} aria-hidden='true'>
        {index + 1}
      </p>
      <div className={main}>{children}</div>
    </li>
  );
};

export type CarouselSingleProps = ComponentProps<'div'>;

/** Single-image key visual (no carousel behavior). */
export const CarouselSingle = ({ className, ...rest }: CarouselSingleProps) => (
  <div className={cx(single, className)} {...rest} />
);

export type CarouselSingleLinkProps = ComponentProps<'a'>;

export const CarouselSingleLink = (props: CarouselSingleLinkProps) => {
  const { className, href, target, rel, download, ...rest } = props;

  if (href === undefined) {
    return <span className={cx(singleLink, className)} {...(rest as ComponentProps<'span'>)} />;
  }

  return (
    <a
      className={cx(singleLink, className)}
      href={href}
      target={target}
      rel={rel}
      download={download}
      {...rest}
    />
  );
};

export type CarouselSingleImageProps = ComponentProps<'img'>;

export const CarouselSingleImage = ({ className, alt, ...rest }: CarouselSingleImageProps) => (
  <img className={cx(singleImage, className)} alt={alt} {...rest} />
);
