import type { Meta, StoryObj } from '@storybook/react-vite';
import { css } from '../../../styled-system/css';
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
  CarouselSingle,
  CarouselSingleImage,
  CarouselSingleLink,
  CarouselSlideImage,
  CarouselSlideLink,
  CarouselStepNav,
} from './Carousel';

type DemoArgs = {
  unit: string;
  loop: boolean;
  heading: string;
  withLinks: boolean;
};

const meta: Meta<DemoArgs> = {
  title: 'Components/カルーセル',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'コンテナ幅が64remの地点にブレークポイントを持ちます。64rem以上では次のスライドのプレビューと番号つきのステップナビゲーションを、それ未満では前後ボタンと現在位置を表示します。「すべてのスライド」を開くと、残りのスライドを一覧できます。',
      },
    },
  },
  argTypes: {
    unit: { control: 'text' },
    loop: { control: 'boolean' },
    heading: { control: 'text' },
    withLinks: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<DemoArgs>;

const headingStyle = css({
  marginBottom: '16',
  textStyle: 'std-20B-150',
  '@media (min-width: 30rem)': { textStyle: 'std-24B-150' },
  '@media (min-width: 64rem)': { textStyle: 'std-32B-150' },
});
const visuallyHidden = css({ srOnly: true });

const placeholder = (label: string, color: string, width = 696, height = 392) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="100%" height="100%" fill="${color}"/><circle cx="${width * 0.8}" cy="${height * 0.3}" r="${height * 0.18}" fill="#fff" fill-opacity=".35"/><text x="50%" y="50%" fill="#fff" font-family="sans-serif" font-size="56" font-weight="700" text-anchor="middle" dominant-baseline="middle">${label}</text></svg>`,
  )}`;

const slides = [
  { id: 'slide-1', label: 'スライド1', color: '#0017c1', alt: 'サンプル画像1：青い背景' },
  { id: 'slide-2', label: 'スライド2', color: '#197a4b', alt: 'サンプル画像2：緑の背景' },
  { id: 'slide-3', label: 'スライド3', color: '#c16800', alt: 'サンプル画像3：オレンジの背景' },
  { id: 'slide-4', label: 'スライド4', color: '#aa00aa', alt: 'サンプル画像4：紫の背景' },
].map((slide) => ({ ...slide, src: placeholder(slide.label, slide.color) }));

const Slide = ({ slide, withLinks }: { slide: (typeof slides)[number]; withLinks: boolean }) => (
  <>
    <CarouselSlideLink href={withLinks ? `#${slide.id}` : undefined}>
      <span className={visuallyHidden}>{slide.label}</span>
      <CarouselSlideImage src={slide.src} alt={slide.alt} width={696} height={392} />
    </CarouselSlideLink>
    <CarouselBackground src={slide.src} width={696} height={392} />
  </>
);

const Demo = ({ unit, loop, heading, withLinks }: DemoArgs) => (
  <Carousel
    slideCount={slides.length}
    unit={unit}
    loop={loop}
    aria-labelledby={heading ? 'carousel-heading' : undefined}
    aria-label={heading ? undefined : 'スライドショー'}
  >
    {heading && (
      <h2 className={headingStyle} id='carousel-heading'>
        {heading}
      </h2>
    )}
    <CarouselPanel>
      <CarouselItemGroup>
        {slides.map((slide, index) => (
          <CarouselItem key={slide.id} index={index}>
            <Slide slide={slide} withLinks={withLinks} />
          </CarouselItem>
        ))}
      </CarouselItemGroup>
      <CarouselNextPreview background={(index) => <CarouselBackground src={slides[index].src} />}>
        {(index) => <img src={slides[index].src} alt='' width={696} height={392} />}
      </CarouselNextPreview>
    </CarouselPanel>
    <CarouselControls>
      <CarouselPageNav />
      <CarouselStepNav />
      <CarouselExpandList>
        {slides.map((slide, index) => (
          <CarouselExpandItem key={slide.id} index={index}>
            <Slide slide={slide} withLinks={withLinks} />
          </CarouselExpandItem>
        ))}
      </CarouselExpandList>
    </CarouselControls>
  </Carousel>
);

const baseArgs: DemoArgs = {
  unit: 'スライド',
  loop: true,
  heading: '開催中のイベント',
  withLinks: true,
};

export const Playground: Story = {
  args: baseArgs,
  render: (args) => <Demo {...args} />,
};

export const Container: Story = {
  name: 'コンテナ（複数スライド・リンクあり）',
  args: baseArgs,
  render: (args) => <Demo {...args} />,
};

export const ContainerWithoutLinks: Story = {
  name: 'コンテナ（複数スライド・リンクなし）',
  args: { ...baseArgs, withLinks: false },
  render: (args) => <Demo {...args} />,
};

export const KeyVisual: Story = {
  name: '打ち出し（複数スライド・見出しなし）',
  args: { ...baseArgs, heading: '', withLinks: false },
  render: (args) => <Demo {...args} />,
};

export const WithoutLoop: Story = {
  name: '端で止まる（ループなし）',
  args: { ...baseArgs, loop: false },
  render: (args) => <Demo {...args} />,
};

export const KeyVisualSingle: Story = {
  name: '打ち出し（単一スライド）',
  args: baseArgs,
  render: () => (
    <CarouselSingle>
      <CarouselSingleLink>
        <CarouselSingleImage
          src={placeholder('キービジュアル', '#0017c1', 1024, 392)}
          alt='サンプル画像：青い背景のキービジュアル'
          width={1024}
          height={392}
        />
      </CarouselSingleLink>
    </CarouselSingle>
  ),
};

export const KeyVisualSingleWithLink: Story = {
  name: '打ち出し（単一スライド・リンクあり）',
  args: baseArgs,
  render: () => (
    <CarouselSingle>
      <CarouselSingleLink href='#key-visual'>
        <CarouselSingleImage
          src={placeholder('キービジュアル', '#197a4b', 1024, 392)}
          alt='サンプル画像：緑の背景のキービジュアル'
          width={1024}
          height={392}
        />
      </CarouselSingleLink>
    </CarouselSingle>
  ),
};
