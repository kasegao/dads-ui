import type { Meta, StoryObj } from '@storybook/react-vite';
import { css } from '../../../styled-system/css';
import {
  PageNavigation,
  PageNavigationArrowButton,
  type PageNavigationArrowButtonSize,
  PageNavigationButton,
  PageNavigationCounter,
} from './PageNavigation';

const meta = {
  title: 'Components/ページナビゲーション',
  component: PageNavigation,
  tags: ['autodocs'],
} satisfies Meta<typeof PageNavigation>;

export default meta;

const formatCounter = (currentPage: number, totalPages: number) =>
  `${currentPage.toLocaleString('ja-JP')} / ${totalPages.toLocaleString('ja-JP')}`;

const PrevIcon = () => (
  <svg aria-hidden='true' height='24' viewBox='0 0 24 24' width='24'>
    <path d='m7.9 12 8-8-1.4-1.4L5.1 12l9.4 9.4 1.4-1.4z' fill='currentcolor' />
  </svg>
);

const NextIcon = () => (
  <svg aria-hidden='true' height='24' viewBox='0 0 24 24' width='24'>
    <path d='M9 2.6 7.6 4l8 8-8 8L9 21.4l9.4-9.4z' fill='currentcolor' />
  </svg>
);

interface PageArgs {
  currentPage: number;
  totalPages: number;
}

const pageArgTypes = {
  currentPage: { control: { type: 'number' as const, min: 1 } },
  totalPages: { control: { type: 'number' as const, min: 1 } },
};

const pageArgs = { currentPage: 5, totalPages: 9 };

const usePages = ({ currentPage, totalPages }: PageArgs) => ({
  isSinglePage: totalPages <= 1,
  isFirst: currentPage <= 1,
  isLast: currentPage >= totalPages,
  counter: formatCounter(currentPage, totalPages),
});

interface ArrowArgs extends PageArgs {
  size: PageNavigationArrowButtonSize;
}

export const Playground: StoryObj<ArrowArgs> = {
  render: (args) => {
    const { isSinglePage, isFirst, isLast, counter } = usePages(args);
    if (isSinglePage) return <>{null}</>;

    return (
      <PageNavigation aria-label='ページ'>
        {!isFirst && (
          <PageNavigationArrowButton label='前のページ' size={args.size}>
            <PrevIcon />
          </PageNavigationArrowButton>
        )}
        <PageNavigationCounter>{counter}</PageNavigationCounter>
        {!isLast && (
          <PageNavigationArrowButton label='次のページ' size={args.size}>
            <NextIcon />
          </PageNavigationArrowButton>
        )}
      </PageNavigation>
    );
  },
  argTypes: {
    ...pageArgTypes,
    size: { control: 'radio', options: ['lg', 'md', 'sm', 'xs'] },
  },
  args: { ...pageArgs, size: 'lg' },
};

export const Text: StoryObj<PageArgs> = {
  name: 'テキスト型（button）',
  render: (args) => {
    const { isSinglePage, isFirst, isLast, counter } = usePages(args);
    if (isSinglePage) return <>{null}</>;

    return (
      <PageNavigation aria-label='ページ'>
        {!isFirst && (
          <PageNavigationButton control='prev' size='md' variant='text'>
            <PrevIcon />
            前のページ
          </PageNavigationButton>
        )}
        <PageNavigationCounter>{counter}</PageNavigationCounter>
        {!isLast && (
          <PageNavigationButton control='next' size='md' variant='text'>
            次のページ
            <NextIcon />
          </PageNavigationButton>
        )}
      </PageNavigation>
    );
  },
  argTypes: pageArgTypes,
  args: pageArgs,
};

export const TextLink: StoryObj<PageArgs> = {
  name: 'テキスト型（a）',
  render: (args) => {
    const { isSinglePage, isFirst, isLast, counter } = usePages(args);
    if (isSinglePage) return <>{null}</>;

    return (
      <PageNavigation aria-label='ページ'>
        {!isFirst && (
          <PageNavigationButton control='prev' asChild={true} size='md' variant='text'>
            <a href='#prev'>
              <PrevIcon />
              前のページ
            </a>
          </PageNavigationButton>
        )}
        <PageNavigationCounter>{counter}</PageNavigationCounter>
        {!isLast && (
          <PageNavigationButton control='next' asChild={true} size='md' variant='text'>
            <a href='#next'>
              次のページ
              <NextIcon />
            </a>
          </PageNavigationButton>
        )}
      </PageNavigation>
    );
  },
  argTypes: pageArgTypes,
  args: pageArgs,
};

export const Outlined: StoryObj<PageArgs> = {
  name: 'アウトライン型（button）',
  render: (args) => {
    const { isSinglePage, isFirst, isLast, counter } = usePages(args);
    if (isSinglePage) return <>{null}</>;

    return (
      <PageNavigation aria-label='ページ'>
        {!isFirst && (
          <PageNavigationButton control='prev' size='lg' variant='outline'>
            <PrevIcon />
            前のページ
          </PageNavigationButton>
        )}
        <PageNavigationCounter>{counter}</PageNavigationCounter>
        {!isLast && (
          <PageNavigationButton control='next' size='lg' variant='outline'>
            次のページ
            <NextIcon />
          </PageNavigationButton>
        )}
      </PageNavigation>
    );
  },
  argTypes: pageArgTypes,
  args: pageArgs,
};

export const OutlinedLink: StoryObj<PageArgs> = {
  name: 'アウトライン型（a）',
  render: (args) => {
    const { isSinglePage, isFirst, isLast, counter } = usePages(args);
    if (isSinglePage) return <>{null}</>;

    return (
      <PageNavigation aria-label='ページ'>
        {!isFirst && (
          <PageNavigationButton control='prev' asChild={true} size='lg' variant='outline'>
            <a href='#prev'>
              <PrevIcon />
              前のページ
            </a>
          </PageNavigationButton>
        )}
        <PageNavigationCounter>{counter}</PageNavigationCounter>
        {!isLast && (
          <PageNavigationButton control='next' asChild={true} size='lg' variant='outline'>
            <a href='#next'>
              次のページ
              <NextIcon />
            </a>
          </PageNavigationButton>
        )}
      </PageNavigation>
    );
  },
  argTypes: pageArgTypes,
  args: pageArgs,
};

const column = css({ display: 'flex', flexDirection: 'column', gap: '24' });

export const ArrowSizes: StoryObj = {
  name: '矢印型（サイズ）',
  render: () => (
    <div className={column}>
      {(['lg', 'md', 'sm', 'xs'] as const).map((size) => (
        <PageNavigation aria-label={`ページ（${size}）`} key={size}>
          <PageNavigationArrowButton label='前のページ' size={size}>
            <PrevIcon />
          </PageNavigationArrowButton>
          <PageNavigationCounter>{formatCounter(5, 9)}</PageNavigationCounter>
          <PageNavigationArrowButton label='次のページ' size={size}>
            <NextIcon />
          </PageNavigationArrowButton>
        </PageNavigation>
      ))}
    </div>
  ),
};

export const ArrowLink: StoryObj<ArrowArgs> = {
  name: '矢印型（a）',
  render: (args) => {
    const { isSinglePage, isFirst, isLast, counter } = usePages(args);
    if (isSinglePage) return <>{null}</>;

    return (
      <PageNavigation aria-label='ページ'>
        {!isFirst && (
          <PageNavigationArrowButton asChild={true} size={args.size}>
            <a href='#prev'>
              <PrevIcon />
              <span className={css({ srOnly: true })}>前のページ</span>
            </a>
          </PageNavigationArrowButton>
        )}
        <PageNavigationCounter>{counter}</PageNavigationCounter>
        {!isLast && (
          <PageNavigationArrowButton asChild={true} size={args.size}>
            <a href='#next'>
              <NextIcon />
              <span className={css({ srOnly: true })}>次のページ</span>
            </a>
          </PageNavigationArrowButton>
        )}
      </PageNavigation>
    );
  },
  argTypes: {
    ...pageArgTypes,
    size: { control: 'radio', options: ['lg', 'md', 'sm', 'xs'] },
  },
  args: { ...pageArgs, size: 'lg' },
};

export const FirstAndLastPage: StoryObj = {
  name: '最初のページ・最後のページ',
  render: () => (
    <div className={column}>
      <PageNavigation aria-label='ページ（最初）'>
        <PageNavigationCounter>{formatCounter(1, 9)}</PageNavigationCounter>
        <PageNavigationArrowButton label='次のページ' size='lg'>
          <NextIcon />
        </PageNavigationArrowButton>
      </PageNavigation>
      <PageNavigation aria-label='ページ（最後）'>
        <PageNavigationArrowButton label='前のページ' size='lg'>
          <PrevIcon />
        </PageNavigationArrowButton>
        <PageNavigationCounter>{formatCounter(9, 9)}</PageNavigationCounter>
      </PageNavigation>
    </div>
  ),
};
