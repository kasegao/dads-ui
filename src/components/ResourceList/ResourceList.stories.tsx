import type { Meta, StoryObj } from '@storybook/react-vite';
import { useId } from 'react';
import { css } from '../../../styled-system/css';
import {
  ResourceList,
  ResourceListAction,
  ResourceListActionButton,
  ResourceListBody,
  ResourceListContents,
  ResourceListControl,
  ResourceListLabel,
  ResourceListSub,
  ResourceListSupport,
  ResourceListTitle,
  type ResourceListVariant,
} from './ResourceList';

const meta = {
  title: 'Components/リソースリスト',
  component: ResourceList,
  tags: ['autodocs'],
} satisfies Meta<typeof ResourceList>;

export default meta;

const stack = css({ display: 'grid', gap: '16' });
const sections = css({ display: 'grid', gap: '64' });
const frontIcon = css({ flexShrink: '0' });
const nativeControl = css({ width: '24', height: '24', accentColor: 'key.900' });

const FrontIcon = () => (
  <svg
    className={frontIcon}
    width={32}
    height={32}
    viewBox='0 0 24 24'
    fill='currentcolor'
    aria-hidden={true}
  >
    <path d='M4.6 20.5c-.5-.1-1-.6-1.1-1l16-16c.5.1.9.6 1 1l-16 16Zm-1.1-6.4v-2L12 3.4h2.1L3.5 14.1Zm0-7.4V5.3c0-1 .8-1.8 1.8-1.8h1.4L3.5 6.7Zm13.8 13.8 3.2-3.2v1.4c0 1-.8 1.8-1.8 1.8h-1.4Zm-7.4 0L20.5 9.9v2L12 20.6H9.9Z' />
  </svg>
);

const MenuIcon = () => (
  <svg
    width={24}
    height={24}
    viewBox='0 0 24 24'
    fill='currentcolor'
    role='img'
    aria-label='メニュー'
  >
    <circle cx='12' cy='4.5' r='1.5' />
    <circle cx='12' cy='12' r='1.5' />
    <circle cx='12' cy='19.5' r='1.5' />
  </svg>
);

const DownloadIcon = () => (
  <svg
    width={24}
    height={24}
    viewBox='0 0 24 24'
    fill='currentcolor'
    role='img'
    aria-label='ダウンロード'
  >
    <path d='m12 15.8-4.3-4.3 1-1 2.6 2.4V4.5h1.4v8.4l2.5-2.5 1 1.1-4.2 4.3Zm-5.7 3.7c-.5 0-1-.2-1.3-.5-.3-.4-.5-.8-.5-1.3V15H6v2.7l.1.2.2.1h11.4l.2-.1.1-.2V15h1.5v2.7c0 .5-.2 1-.5 1.3-.4.3-.8.5-1.3.5H6.3Z' />
  </svg>
);

interface PlaygroundArgs {
  variant: ResourceListVariant;
  bodyAsLink: boolean;
  hasFrontIcon: boolean;
  hasLabel: boolean;
  hasSupportText: boolean;
  hasSubLabel: boolean;
  hasAction: boolean;
}

export const Playground: StoryObj<PlaygroundArgs> = {
  render: (args) => {
    const body = (
      <>
        {args.hasFrontIcon && <FrontIcon />}
        <ResourceListContents>
          <ResourceListTitle as='h2'>リストタイトル</ResourceListTitle>
          {args.hasLabel && (
            <ResourceListLabel>
              <p>ラベル</p>
            </ResourceListLabel>
          )}
          {args.hasSupportText && (
            <ResourceListSupport>
              <p>サポートテキスト</p>
            </ResourceListSupport>
          )}
        </ResourceListContents>
        {args.hasSubLabel && (
          <ResourceListSub>
            <p>サブラベル</p>
          </ResourceListSub>
        )}
      </>
    );

    return (
      <ul>
        <li>
          <ResourceList variant={args.variant}>
            {args.bodyAsLink ? (
              <ResourceListBody asChild={true}>
                <a href='#detail'>{body}</a>
              </ResourceListBody>
            ) : (
              <ResourceListBody>{body}</ResourceListBody>
            )}
            {args.hasAction && (
              <ResourceListAction>
                <ResourceListActionButton>
                  <MenuIcon />
                </ResourceListActionButton>
              </ResourceListAction>
            )}
          </ResourceList>
        </li>
      </ul>
    );
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['list', 'frame'] },
    bodyAsLink: { control: 'boolean' },
    hasFrontIcon: { control: 'boolean' },
    hasLabel: { control: 'boolean' },
    hasSupportText: { control: 'boolean' },
    hasSubLabel: { control: 'boolean' },
    hasAction: { control: 'boolean' },
  },
  args: {
    variant: 'list',
    bodyAsLink: false,
    hasFrontIcon: true,
    hasLabel: true,
    hasSupportText: true,
    hasSubLabel: true,
    hasAction: true,
  },
};

interface WithControlArgs {
  variant: ResourceListVariant;
  control: 'checkbox' | 'radio';
  interactionType: 'inline' | 'whole';
  disabled: boolean;
  hasAction: boolean;
}

export const WithControl: StoryObj<WithControlArgs> = {
  name: 'コントロール付き',
  render: (args) => {
    const controlId = useId();
    const isWhole = args.interactionType === 'whole';
    return (
      <ul>
        <li>
          <ResourceList variant={args.variant} interaction={isWhole ? 'whole' : undefined}>
            <ResourceListBody>
              <ResourceListControl>
                <input
                  className={nativeControl}
                  id={controlId}
                  type={args.control}
                  name='resource-list-control'
                  disabled={args.disabled}
                />
              </ResourceListControl>
              <ResourceListContents>
                <ResourceListTitle as='p'>
                  <label htmlFor={controlId}>リストタイトル</label>
                </ResourceListTitle>
                <ResourceListLabel>
                  <p>ラベル</p>
                </ResourceListLabel>
                <ResourceListSupport>
                  <p>サポートテキスト</p>
                </ResourceListSupport>
              </ResourceListContents>
              <ResourceListSub>
                <p>サブラベル</p>
              </ResourceListSub>
            </ResourceListBody>
            {args.hasAction && (
              <ResourceListAction>
                <ResourceListActionButton disabled={isWhole && args.disabled}>
                  <MenuIcon />
                </ResourceListActionButton>
              </ResourceListAction>
            )}
          </ResourceList>
        </li>
      </ul>
    );
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['list', 'frame'] },
    control: { control: 'inline-radio', options: ['checkbox', 'radio'] },
    interactionType: { control: 'inline-radio', options: ['inline', 'whole'] },
    disabled: { control: 'boolean' },
    hasAction: { control: 'boolean' },
  },
  args: {
    variant: 'list',
    control: 'checkbox',
    interactionType: 'inline',
    disabled: false,
    hasAction: true,
  },
};

const checkups = [
  { year: '2025年度', date: '2025/04/30' },
  { year: '2024年度', date: '2024/11/24' },
  { year: '2023年度', date: '2023/10/13' },
];

const payslips = [
  { month: '2025年10月分', date: '2025/11/14' },
  { month: '2025年9月分', date: '2025/10/15' },
  { month: '2025年8月分', date: '2025/9/15' },
];

const members = [
  { name: 'デジ田 太郎', mail: 'taro-dejita@example.com', status: '招待中' },
  { name: 'デジ山 ひかり', mail: 'hikari-dejiyama@example.com' },
  { name: '出而足 長一郎', mail: 'choichiro-dejitaru@example.com' },
];

const payments = [
  {
    id: 'card',
    title: 'クレジットカード払い',
    label: 'おすすめ',
    support: 'Visa、Master、JCB対応',
  },
  { id: 'bank', title: '銀行振込', support: '入金確認後の商品発送となります。' },
  { id: 'store', title: 'コンビニ決済', support: '全国のコンビニで利用可能です。', disabled: true },
];

export const MultipleItems: StoryObj = {
  name: '複数アイテム',
  render: () => (
    <div className={sections}>
      <ul className={stack}>
        {checkups.map((item) => (
          <li key={item.year}>
            <ResourceList variant='frame'>
              <ResourceListBody>
                <ResourceListContents>
                  <ResourceListTitle as='h2'>健康診断</ResourceListTitle>
                  <ResourceListSupport>
                    <p>{item.year}</p>
                  </ResourceListSupport>
                </ResourceListContents>
                <ResourceListSub>
                  <p>受診日：{item.date}</p>
                </ResourceListSub>
              </ResourceListBody>
            </ResourceList>
          </li>
        ))}
      </ul>

      <ul className={stack}>
        {payslips.map((item) => (
          <li key={item.month}>
            <ResourceList variant='frame' style={{ borderRadius: 0 }}>
              <ResourceListBody>
                <ResourceListContents>
                  <ResourceListTitle as='h2'>給与明細</ResourceListTitle>
                  <ResourceListSupport>
                    <p>{item.month}</p>
                  </ResourceListSupport>
                </ResourceListContents>
                <ResourceListSub>
                  <p>支給日：{item.date}</p>
                </ResourceListSub>
              </ResourceListBody>
              <ResourceListAction>
                <ResourceListActionButton>
                  <DownloadIcon />
                </ResourceListActionButton>
              </ResourceListAction>
            </ResourceList>
          </li>
        ))}
      </ul>

      <ul>
        {members.map((member) => (
          <li key={member.mail}>
            <ResourceList variant='list'>
              <ResourceListBody>
                <ResourceListContents>
                  <ResourceListTitle as='h2'>
                    <a href='#member'>{member.name}</a>
                  </ResourceListTitle>
                  <ResourceListSupport>
                    <p>{member.mail}</p>
                  </ResourceListSupport>
                </ResourceListContents>
                {member.status && (
                  <ResourceListSub>
                    <p>{member.status}</p>
                  </ResourceListSub>
                )}
              </ResourceListBody>
              <ResourceListAction>
                <ResourceListActionButton>
                  <MenuIcon />
                </ResourceListActionButton>
              </ResourceListAction>
            </ResourceList>
          </li>
        ))}
      </ul>

      <ul>
        {checkups.map((item) => (
          <li key={item.year}>
            <ResourceList variant='list'>
              <ResourceListBody asChild={true}>
                <a href='#checkup'>
                  <ResourceListContents>
                    <ResourceListTitle as='h2'>健康診断（{item.year}）</ResourceListTitle>
                    <ResourceListSupport>
                      <p>行全体がリンクになります</p>
                    </ResourceListSupport>
                  </ResourceListContents>
                  <ResourceListSub>
                    <p>受診日：{item.date}</p>
                  </ResourceListSub>
                </a>
              </ResourceListBody>
            </ResourceList>
          </li>
        ))}
      </ul>

      <ul className={stack}>
        {payments.map((payment, index) => (
          <li key={payment.id}>
            <ResourceList variant='frame' interaction='whole'>
              <ResourceListBody>
                <ResourceListControl>
                  <input
                    className={nativeControl}
                    id={`payment-method-${payment.id}`}
                    type='radio'
                    name='payment-method'
                    defaultChecked={index === 0}
                    disabled={payment.disabled}
                  />
                </ResourceListControl>
                <ResourceListContents>
                  <ResourceListTitle as='p'>
                    <label htmlFor={`payment-method-${payment.id}`}>{payment.title}</label>
                  </ResourceListTitle>
                  {payment.label && (
                    <ResourceListLabel>
                      <p>{payment.label}</p>
                    </ResourceListLabel>
                  )}
                  <ResourceListSupport>
                    <p>{payment.support}</p>
                  </ResourceListSupport>
                </ResourceListContents>
              </ResourceListBody>
            </ResourceList>
          </li>
        ))}
      </ul>
    </div>
  ),
};
