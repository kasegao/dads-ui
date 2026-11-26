import type { Meta, StoryObj } from '@storybook/react-vite';
import sample from './assets/sample.png';
import sampleMobile from './assets/sample-mobile.png';
import { Image, ImageArea, ImageAreaLink, ImageCaption, type ImageCaptionStyle } from './Image';

const meta = {
  title: 'Components/画像',
  component: Image,
  tags: ['autodocs'],
} satisfies Meta<typeof Image>;

export default meta;
type Story = StoryObj<typeof meta>;

const captionText =
  'これはダミーの画像キャプションです。ダミーの画像キャプションは、デザインやレイアウトの作成時に使用される仮の文章です。';

type PlaygroundArgs = {
  bordered: boolean;
  fullWidth: boolean;
  showCaption: boolean;
  captionStyle: ImageCaptionStyle | undefined;
  captionText: string;
  alt: string;
};

export const Playground: StoryObj<PlaygroundArgs> = {
  args: {
    bordered: true,
    fullWidth: false,
    showCaption: true,
    captionStyle: 'dashed',
    captionText,
    alt: '山と空のサンプル画像',
  },
  argTypes: {
    bordered: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    showCaption: { control: 'boolean' },
    captionStyle: {
      if: { arg: 'showCaption' },
      control: 'radio',
      options: [undefined, 'dashed', 'solid'],
    },
    captionText: { if: { arg: 'showCaption' }, control: 'text' },
    alt: { control: 'text' },
  },
  render: (args) => (
    <Image fullWidth={args.fullWidth}>
      <ImageArea bordered={args.bordered}>
        <img src={sample} alt={args.alt} width='696' height='392' />
      </ImageArea>
      {args.showCaption && (
        <ImageCaption captionStyle={args.captionStyle}>{args.captionText}</ImageCaption>
      )}
    </Image>
  ),
};

export const CaptionStyles: Story = {
  name: 'キャプションのスタイル',
  render: () => (
    <>
      <Image>
        <ImageArea bordered={true}>
          <img src={sample} alt='山と空のサンプル画像' width='696' height='392' />
        </ImageArea>
        <ImageCaption captionStyle='dashed'>破線のキャプション。{captionText}</ImageCaption>
      </Image>
      <Image>
        <ImageArea bordered={true}>
          <img src={sample} alt='山と空のサンプル画像' width='696' height='392' />
        </ImageArea>
        <ImageCaption captionStyle='solid'>実線のキャプション。{captionText}</ImageCaption>
      </Image>
      <Image>
        <ImageArea>
          <img src={sample} alt='山と空のサンプル画像' width='696' height='392' />
        </ImageArea>
        <ImageCaption>枠線なしのキャプション。{captionText}</ImageCaption>
      </Image>
    </>
  ),
};

export const WithLink: Story = {
  name: 'リンク付き',
  render: () => (
    <Image>
      <ImageAreaLink href='#'>
        <img src={sample} alt='山と空のサンプル画像' width='696' height='392' />
      </ImageAreaLink>
      <ImageCaption captionStyle='dashed'>{captionText}</ImageCaption>
    </Image>
  ),
};

export const FullWidth: Story = {
  name: '幅100%で表示する',
  render: () => (
    <Image fullWidth={true}>
      <ImageArea bordered={true}>
        <img src={sample} alt='山と空のサンプル画像' width='696' height='392' />
      </ImageArea>
      <ImageCaption captionStyle='dashed'>{captionText}</ImageCaption>
    </Image>
  ),
};

export const WithPictureElement: Story = {
  name: 'picture 要素を使う',
  render: () => (
    <Image>
      <ImageArea bordered={true}>
        <picture>
          <source srcSet={sampleMobile} media='(max-width: 40rem)' />
          <img src={sample} alt='山と空のサンプル画像' width='696' height='392' />
        </picture>
      </ImageArea>
      <ImageCaption captionStyle='dashed'>{captionText}</ImageCaption>
    </Image>
  ),
};
