import { afterEach, expect, test, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import {
  Carousel,
  CarouselBackground,
  CarouselControls,
  CarouselExpandItem,
  CarouselExpandList,
  CarouselItem,
  CarouselItemGroup,
  CarouselNextPreview,
  CarouselPageNav,
  CarouselPanel,
  type CarouselProps,
  CarouselSingle,
  CarouselSingleImage,
  CarouselSingleLink,
  CarouselSlideImage,
  CarouselSlideLink,
  CarouselStepNav,
} from './Carousel';

const image = (color: string) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="696" height="392"><rect width="100%" height="100%" fill="${color}"/></svg>`,
  )}`;

const slides = ['#0017c1', '#197a4b', '#c16800', '#aa00aa'].map((color, index) => ({
  src: image(color),
  alt: `画像${index + 1}`,
}));

const TestCarousel = (props: Partial<CarouselProps>) => (
  <Carousel slideCount={slides.length} aria-label='お知らせ' {...props}>
    <CarouselPanel>
      <CarouselItemGroup>
        {slides.map((slide, index) => (
          <CarouselItem key={slide.alt} index={index}>
            <CarouselSlideLink href={`#slide-${index + 1}`}>
              <CarouselSlideImage src={slide.src} alt={slide.alt} width={696} height={392} />
            </CarouselSlideLink>
            <CarouselBackground src={slide.src} />
          </CarouselItem>
        ))}
      </CarouselItemGroup>
      <CarouselNextPreview>
        {(index) => <img src={slides[index].src} alt='' data-testid='next-thumbnail' />}
      </CarouselNextPreview>
    </CarouselPanel>
    <CarouselControls>
      <CarouselPageNav />
      <CarouselStepNav />
      <CarouselExpandList>
        {slides.map((slide, index) => (
          <CarouselExpandItem key={slide.alt} index={index}>
            <CarouselSlideLink href={`#slide-${index + 1}`}>
              <CarouselSlideImage src={slide.src} alt={`一覧の${slide.alt}`} />
            </CarouselSlideLink>
          </CarouselExpandItem>
        ))}
      </CarouselExpandList>
    </CarouselControls>
  </Carousel>
);

const NARROW = [414, 896] as const;
const WIDE = [1280, 900] as const;

afterEach(async () => {
  vi.restoreAllMocks();
  await page.viewport(...NARROW);
});

const slideLocator = (screen: Awaited<ReturnType<typeof render>>, n: number) =>
  screen.getByRole('link', { name: `画像${n}`, exact: true });

const viewportOf = (screen: Awaited<ReturnType<typeof render>>) =>
  screen.getByRole('region').element().querySelector('[data-part="item-group"]') as HTMLElement;

test('exposes a labelled carousel region with labelled slides', async () => {
  await page.viewport(...NARROW);
  const screen = await render(<TestCarousel />);

  const region = screen.getByRole('region', { name: 'お知らせ' });
  await expect.element(region).toHaveAttribute('aria-roledescription', 'carousel');
  await expect
    .element(screen.getByRole('group', { name: 'スライド1 / 4' }))
    .toHaveAttribute('aria-roledescription', 'slide');
  await expect.element(slideLocator(screen, 1)).toBeVisible();
  await expect.element(screen.getByText('1 / 4')).toBeVisible();
});

test('navigates with the previous / next buttons and loops', async () => {
  await page.viewport(...NARROW);
  const onPageChange = vi.fn();
  const screen = await render(<TestCarousel onPageChange={onPageChange} />);
  const nextButton = screen.getByRole('button', { name: '次のスライド' });
  const prevButton = screen.getByRole('button', { name: '前のスライド' });

  await nextButton.click();
  await expect.element(screen.getByText('2 / 4')).toBeVisible();
  await expect.element(slideLocator(screen, 2)).toBeInViewport();
  expect(onPageChange).toHaveBeenLastCalledWith(expect.objectContaining({ page: 1 }));

  await prevButton.click();
  await expect.element(screen.getByText('1 / 4')).toBeVisible();
  await prevButton.click();
  await expect.element(screen.getByText('4 / 4')).toBeVisible();
  await expect.element(slideLocator(screen, 4)).toBeInViewport();
  await nextButton.click();
  await expect.element(screen.getByText('1 / 4')).toBeVisible();
});

test('only the current slide is reachable', async () => {
  await page.viewport(...NARROW);
  const screen = await render(<TestCarousel />);
  const group = viewportOf(screen);
  const inert = () =>
    Array.from(group.querySelectorAll<HTMLElement>('[data-part="item"]'), (el) => el.inert);

  await expect.poll(inert).toEqual([false, true, true, true]);
  await screen.getByRole('button', { name: '次のスライド' }).click();
  await expect.poll(inert).toEqual([true, false, true, true]);
});

test('stops at the ends when loop is disabled', async () => {
  await page.viewport(...NARROW);
  const screen = await render(<TestCarousel loop={false} defaultPage={3} />);

  await expect.element(screen.getByText('4 / 4')).toBeVisible();
  await expect.element(screen.getByRole('button', { name: '次のスライド' })).toBeDisabled();
  await expect.element(screen.getByRole('button', { name: '前のスライド' })).toBeEnabled();
});

test('uses the unit in every label', async () => {
  await page.viewport(...NARROW);
  const screen = await render(<TestCarousel unit='ページ' />);

  await expect.element(screen.getByRole('button', { name: '次のページ' })).toBeVisible();
  await expect.element(screen.getByRole('button', { name: '前のページ' })).toBeVisible();
  await expect.element(screen.getByText('すべてのページ')).toBeVisible();
});

test('narrow containers show the page nav and hide the step nav and preview', async () => {
  await page.viewport(...NARROW);
  const screen = await render(<TestCarousel />);

  await expect.element(screen.getByRole('button', { name: '次のスライド' })).toBeVisible();
  await expect.element(screen.getByRole('group', { name: 'スライド選択' })).not.toBeInTheDocument();
  await expect.element(screen.getByTestId('next-thumbnail')).not.toBeVisible();
});

test('wide containers navigate with the numbered steps and arrow keys', async () => {
  await page.viewport(...WIDE);
  const screen = await render(<TestCarousel />);
  const steps = screen.getByRole('group', { name: 'スライド選択' });
  const stepButton = (n: number) => steps.getByRole('button', { name: `スライド${n}` });

  await expect.element(steps).toBeVisible();
  await expect.element(screen.getByText('1 / 4')).not.toBeVisible();
  await expect.element(stepButton(1)).toHaveAttribute('aria-current', 'true');
  await expect.element(stepButton(1)).toHaveAttribute('tabindex', '0');
  await expect.element(stepButton(2)).toHaveAttribute('tabindex', '-1');

  const current = getComputedStyle(stepButton(1).element());
  expect(current.backgroundColor).toBe('rgb(51, 51, 51)');
  expect(current.color).toBe('rgb(255, 255, 255)');
  expect(current.width).toBe('32px');
  expect(getComputedStyle(stepButton(2).element()).backgroundColor).toBe('rgb(255, 255, 255)');

  await stepButton(3).click();
  await expect.element(stepButton(3)).toHaveAttribute('aria-current', 'true');
  await expect.element(stepButton(1)).not.toHaveAttribute('aria-current');
  await expect.element(slideLocator(screen, 3)).toBeInViewport();

  await userEvent.keyboard('{ArrowRight}');
  await expect.element(stepButton(4)).toHaveAttribute('aria-current', 'true');
  await expect.element(stepButton(4)).toHaveFocus();
  await userEvent.keyboard('{ArrowRight}');
  await expect.element(stepButton(1)).toHaveFocus();
  await userEvent.keyboard('{ArrowLeft}');
  await expect.element(stepButton(4)).toHaveFocus();
  await userEvent.keyboard('{Home}');
  await expect.element(stepButton(1)).toHaveAttribute('aria-current', 'true');
});

test('the next preview shows the following slide and advances', async () => {
  await page.viewport(...WIDE);
  const screen = await render(<TestCarousel />);
  const preview = screen.getByRole('button', { name: '次のスライド' });
  const thumbnail = screen.getByTestId('next-thumbnail');

  await expect.element(preview).toBeVisible();
  await expect.element(thumbnail).toHaveAttribute('src', slides[1].src);

  await preview.click();
  await expect.element(thumbnail).toHaveAttribute('src', slides[2].src);
  await expect.element(slideLocator(screen, 2)).toBeInViewport();

  const panel = viewportOf(screen).parentElement as HTMLElement;
  expect(getComputedStyle(panel).gridTemplateColumns.split(' ')).toHaveLength(4);
});

test('the expanded list shows the other slides in rotation and hides the navigation', async () => {
  await page.viewport(...WIDE);
  const screen = await render(<TestCarousel defaultPage={1} />);
  const listed = () =>
    Array.from(
      screen.getByRole('region').element().querySelectorAll('details img'),
      (img) => (img as HTMLImageElement).alt,
    );

  await screen.getByText('すべてのスライド').click();

  await expect.element(screen.getByRole('link', { name: '一覧の画像3' })).toBeVisible();
  expect(listed()).toEqual(['一覧の画像3', '一覧の画像4', '一覧の画像1']);
  await expect.element(screen.getByRole('group', { name: 'スライド選択' })).not.toBeInTheDocument();
  await expect.element(screen.getByTestId('next-thumbnail')).not.toBeVisible();

  const panel = viewportOf(screen).parentElement as HTMLElement;
  const panelNumber = panel.querySelector('p') as HTMLElement;
  expect(panelNumber.textContent).toBe('2');
  expect(getComputedStyle(panelNumber).display).toBe('flex');
  expect(getComputedStyle(panelNumber).backgroundColor).toBe('rgb(51, 51, 51)');

  await screen.getByText('すべてのスライド').click();
  await expect.element(screen.getByRole('group', { name: 'スライド選択' })).toBeVisible();
});

test('scrolls instantly when reduced motion is requested', async () => {
  await page.viewport(...NARROW);
  const matchMedia = window.matchMedia.bind(window);
  vi.spyOn(window, 'matchMedia').mockImplementation((query) =>
    query.includes('prefers-reduced-motion')
      ? ({ ...matchMedia(query), matches: true, media: query } as MediaQueryList)
      : matchMedia(query),
  );
  const scrollTo = vi.spyOn(HTMLElement.prototype, 'scrollTo');
  const screen = await render(<TestCarousel />);

  await expect.element(screen.getByText('1 / 4')).toBeVisible();
  scrollTo.mockClear();
  await screen.getByRole('button', { name: '次のスライド' }).click();

  await expect.element(screen.getByText('2 / 4')).toBeVisible();
  await expect.poll(() => scrollTo.mock.calls.length).toBeGreaterThan(0);
  for (const [options] of scrollTo.mock.calls) {
    expect(options).toMatchObject({ behavior: 'instant' });
  }
  await expect.element(slideLocator(screen, 2)).toBeInViewport();
});

test('single key visual renders a link only when href is given', async () => {
  const screen = await render(
    <>
      <CarouselSingle>
        <CarouselSingleLink href='/campaign'>
          <CarouselSingleImage src={slides[0].src} alt='リンクあり' width={696} height={392} />
        </CarouselSingleLink>
      </CarouselSingle>
      <CarouselSingle>
        <CarouselSingleLink>
          <CarouselSingleImage src={slides[1].src} alt='リンクなし' width={696} height={392} />
        </CarouselSingleLink>
      </CarouselSingle>
    </>,
  );

  await expect
    .element(screen.getByRole('link', { name: 'リンクあり' }))
    .toHaveAttribute('href', '/campaign');
  await expect.element(screen.getByRole('img', { name: 'リンクなし' })).toBeVisible();
  expect(screen.getByRole('link').elements()).toHaveLength(1);

  const style = getComputedStyle(screen.getByRole('img', { name: 'リンクなし' }).element());
  expect(style.outlineWidth).toBe('2px');
  expect(style.outlineColor).toBe('rgb(0, 0, 0)');
});
