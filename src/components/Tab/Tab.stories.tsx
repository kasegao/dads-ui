import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { css } from '../../../styled-system/css';
import {
  Tab,
  type TabActivation,
  TabItem,
  TabList,
  TabNav,
  TabNavItem,
  TabNavList,
  TabNavPanel,
  TabPanel,
  type TabPosition,
} from './Tab';

const meta = {
  title: 'Components/タブ',
  component: Tab,
  tags: ['autodocs'],
} satisfies Meta<typeof Tab>;

export default meta;

const column = css({ display: 'flex', flexDirection: 'column', gap: '48' });
const caption = css({ marginBottom: '16', textStyle: 'std-16B-170' });
const paragraphs = css({ display: 'grid', gap: '8' });

const tabs = [
  { value: 'overview', label: '概要', body: 'サービスの概要を説明します。' },
  { value: 'target', label: '対象となる方', body: '対象となる方の条件を説明します。' },
  { value: 'documents', label: '必要な書類', body: '申請に必要な書類を説明します。' },
  { value: 'flow', label: '手続きの流れ', body: '申請から完了までの流れを説明します。' },
  { value: 'contact', label: 'お問い合わせ', body: 'お問い合わせ先を案内します。' },
];

const renderTabs = (position: TabPosition) => {
  const list = (
    <TabList key='list' aria-label='手続きの案内'>
      {tabs.map((item) => (
        <TabItem key={item.value} value={item.value}>
          {item.label}
        </TabItem>
      ))}
    </TabList>
  );
  const panels = tabs.map((item) => (
    <TabPanel key={item.value} value={item.value}>
      <div className={paragraphs}>
        <p>{item.body}</p>
        <p>
          <a href='#detail'>詳しく見る</a>
        </p>
      </div>
    </TabPanel>
  ));
  return position === 'bottom' ? [...panels, list] : [list, ...panels];
};

interface PlaygroundArgs {
  position: TabPosition;
  activation: TabActivation;
}

export const Playground: StoryObj<PlaygroundArgs> = {
  render: (args) => (
    <Tab
      key={args.position}
      defaultValue='overview'
      position={args.position}
      activation={args.activation}
    >
      {renderTabs(args.position)}
    </Tab>
  ),
  argTypes: {
    position: { control: 'radio', options: ['top', 'bottom', 'left', 'right'] },
    activation: { control: 'radio', options: ['auto', 'manual'] },
  },
  args: { position: 'top', activation: 'auto' },
};

export const Positions: StoryObj = {
  name: 'タブリストの位置',
  render: () => (
    <div className={column}>
      {(['top', 'bottom', 'left', 'right'] as const).map((position) => (
        <section key={position}>
          <h3 className={caption}>{position}</h3>
          <Tab defaultValue='overview' position={position}>
            {renderTabs(position)}
          </Tab>
        </section>
      ))}
    </div>
  ),
};

export const ManualActivation: StoryObj = {
  name: '手動で選択（activation="manual"）',
  render: () => (
    <Tab defaultValue='overview' activation='manual'>
      {renderTabs('top')}
    </Tab>
  ),
};

export const Controlled: StoryObj = {
  name: '選択状態を制御する',
  render: () => {
    const [value, setValue] = useState('target');
    return (
      <div className={paragraphs}>
        <p>選択中: {tabs.find((item) => item.value === value)?.label}</p>
        <Tab value={value} onValueChange={(detail) => setValue(detail.value)}>
          {renderTabs('top')}
        </Tab>
      </div>
    );
  },
};

export const Wrapping: StoryObj = {
  name: '折り返し',
  render: () => (
    <div className={css({ maxWidth: '25rem' })}>
      <Tab defaultValue='overview'>{renderTabs('top')}</Tab>
    </div>
  ),
};

interface LinkListArgs {
  position: TabPosition;
}

export const LinkList: StoryObj<LinkListArgs> = {
  name: 'リンクリスト（ページ遷移）',
  render: (args) => {
    const list = (
      <TabNavList key='list'>
        {tabs.map((item, index) => (
          <TabNavItem
            key={item.value}
            href={`#${item.value}`}
            aria-current={index === 0 ? 'page' : undefined}
          >
            {item.label}
          </TabNavItem>
        ))}
      </TabNavList>
    );
    const panel = <TabNavPanel key='panel'>{tabs[0].body}</TabNavPanel>;
    return (
      <TabNav position={args.position}>
        {args.position === 'bottom' ? [panel, list] : [list, panel]}
      </TabNav>
    );
  },
  argTypes: {
    position: { control: 'radio', options: ['top', 'bottom', 'left', 'right'] },
  },
  args: { position: 'top' },
};
