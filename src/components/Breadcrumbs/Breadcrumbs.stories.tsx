import type { Meta, StoryObj } from '@storybook/react-vite';
import { useId } from 'react';
import { css } from '../../../styled-system/css';
import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  Breadcrumbs,
  BreadcrumbsLabel,
} from './Breadcrumbs';

const meta = {
  title: 'Components/パンくずナビゲーション',
  component: Breadcrumbs,
  tags: ['autodocs'],
} satisfies Meta<typeof Breadcrumbs>;

export default meta;
type Story = StoryObj<typeof meta>;

const srOnly = css({ srOnly: true });
const longTitle = '長いページタイトルが入ります長いページタイトルが入ります';

export const Playground: Story = {
  render: () => {
    const labelId = useId();
    return (
      <Breadcrumbs aria-labelledby={labelId}>
        <BreadcrumbsLabel className={srOnly} id={labelId}>
          現在位置
        </BreadcrumbsLabel>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href='#'>ホーム</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href='#'>組織情報</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href='#'>{longTitle}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href='#'>{longTitle}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrent={true}>{longTitle}</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumbs>
    );
  },
};

export const WithHomeIcon: Story = {
  name: 'ホームアイコン付き',
  render: () => {
    const labelId = useId();
    return (
      <Breadcrumbs aria-labelledby={labelId}>
        <BreadcrumbsLabel className={srOnly} id={labelId}>
          現在位置
        </BreadcrumbsLabel>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              className={css({ display: 'inline-flex', alignItems: 'center', gap: '4' })}
              href='#'
            >
              <svg aria-hidden={true} fill='none' height='16' viewBox='0 0 16 16' width='16'>
                <path
                  d='M3 13.6666V6.16667L7.99998 2.40387L13 6.16667V13.6666H9.26922V9.2051H6.73075V13.6666H3Z'
                  fill='currentColor'
                />
              </svg>
              ホーム
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href='#'>組織情報</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href='#'>{longTitle}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrent={true}>{longTitle}</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumbs>
    );
  },
};

export const WithVisibleLabel: Story = {
  name: 'ラベルを表示',
  render: () => {
    const labelId = useId();
    return (
      <Breadcrumbs
        aria-labelledby={labelId}
        className={css({ display: 'flex', gap: '4', alignItems: 'baseline' })}
      >
        <div className={css({ flex: 'none', textStyle: 'dns-16N-120' })}>
          <BreadcrumbsLabel id={labelId}>現在位置</BreadcrumbsLabel>
          <span>：</span>
        </div>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href='#'>ホーム</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href='#'>組織情報</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href='#'>{longTitle}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrent={true}>{longTitle}</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumbs>
    );
  },
};

export const WithSlot: Story = {
  name: 'asChild で任意のリンク要素を使う',
  render: () => {
    const labelId = useId();
    return (
      <Breadcrumbs aria-labelledby={labelId}>
        <BreadcrumbsLabel className={srOnly} id={labelId}>
          現在位置
        </BreadcrumbsLabel>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild={true}>
              <a href='#home'>ホーム</a>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink asChild={true}>
              <a href='#organization'>組織情報</a>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrent={true}>{longTitle}</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumbs>
    );
  },
};
