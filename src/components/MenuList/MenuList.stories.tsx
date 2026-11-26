import type { Meta, StoryObj } from '@storybook/react-vite';
import { css } from '../../../styled-system/css';
import {
  MenuList,
  MenuListItem,
  MenuListItemButton,
  MenuListItemLink,
  type MenuListSize,
  type MenuListType,
} from './MenuList';

const meta = {
  title: 'Components/メニューリスト',
  component: MenuList,
  tags: ['autodocs'],
} satisfies Meta<typeof MenuList>;

export default meta;

const frame = css({ maxWidth: '20rem' });
const grid = css({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 20rem))',
  gap: '32',
});
const caption = css({ marginBottom: '8', textStyle: 'dns-14N-130', color: 'solid-gray.600' });
const frontIconStyle = css({ flexShrink: '0' });
const tailIconStyle = css({ display: 'inline-block', marginLeft: '4', verticalAlign: '-0.15em' });
const endIconStyle = css({
  flexShrink: '0',
  marginTop: '2',
  marginRight: '-4px',
  marginLeft: 'auto',
});

const FrontIcon = () => (
  <svg
    width={24}
    height={24}
    viewBox='0 0 24 24'
    fill='currentColor'
    aria-hidden={true}
    className={frontIconStyle}
  >
    <path d='M4.6 20.5c-.5-.1-1-.6-1.1-1l16-16c.5.1.9.6 1 1l-16 16Zm-1.1-6.4v-2L12 3.4h2.1L3.5 14.1Zm0-7.4V5.3c0-1 .8-1.8 1.8-1.8h1.4L3.5 6.7Zm13.8 13.8 3.2-3.2v1.4c0 1-.8 1.8-1.8 1.8h-1.4Zm-7.4 0L20.5 9.9v2L12 20.6H9.9Z' />
  </svg>
);

const TailIcon = () => (
  <svg
    width={16}
    height={16}
    viewBox='0 0 48 48'
    fill='none'
    role='img'
    aria-label='新規タブで開きます'
    className={tailIconStyle}
  >
    <path
      d='M22 6V9H9V39H39V26H42V42H6V6H22ZM42 6V20H39V11.2L21 29L19 27L36.8 9H28V6H42Z'
      fill='currentColor'
    />
  </svg>
);

const EndIcon = () => (
  <svg
    width={16}
    height={16}
    viewBox='0 0 24 24'
    fill='currentColor'
    aria-hidden={true}
    className={endIconStyle}
  >
    <path d='M12.5 17.1 3.5 8l1-1 8 8 8-8 1 1-9 9.1Z' />
  </svg>
);

interface PlaygroundProps {
  type: MenuListType;
  size: MenuListSize;
  current: boolean;
  hasFrontIcon: boolean;
  hasTailIcon: boolean;
  hasEndIcon: boolean;
  label: string;
  indent: number;
}

export const Playground: StoryObj<PlaygroundProps> = {
  render: (args) => (
    <div className={frame}>
      <MenuList indent={args.indent}>
        <MenuListItem>
          <MenuListItemButton
            type={args.type}
            size={args.size}
            current={args.current}
            aria-current={args.current ? 'true' : undefined}
          >
            {args.hasFrontIcon && <FrontIcon />}
            <span>
              {args.label}
              {args.hasTailIcon && <TailIcon />}
            </span>
            {args.hasEndIcon && <EndIcon />}
          </MenuListItemButton>
        </MenuListItem>
      </MenuList>
    </div>
  ),
  argTypes: {
    type: { control: 'radio', options: ['standard', 'box'] },
    size: { control: 'radio', options: ['regular', 'small'] },
    current: { control: 'boolean' },
    hasFrontIcon: { control: 'boolean' },
    hasTailIcon: { control: 'boolean' },
    hasEndIcon: { control: 'boolean' },
    label: { control: 'text' },
    indent: { control: { type: 'number', min: 0 } },
  },
  args: {
    type: 'standard',
    size: 'regular',
    current: false,
    hasFrontIcon: true,
    hasTailIcon: true,
    hasEndIcon: true,
    label: 'メニュー項目',
    indent: 0,
  },
};

export const TypesAndSizes: StoryObj = {
  name: 'タイプとサイズ',
  render: () => (
    <div className={grid}>
      {(['standard', 'box'] as const).map((type) =>
        (['regular', 'small'] as const).map((size) => (
          <div key={`${type}-${size}`}>
            <p className={caption}>
              {type} / {size}
            </p>
            <MenuList>
              <MenuListItem>
                <MenuListItemLink href='#' type={type} size={size}>
                  <span>メニュー項目1</span>
                </MenuListItemLink>
              </MenuListItem>
              <MenuListItem>
                <MenuListItemLink
                  href='#'
                  type={type}
                  size={size}
                  current={true}
                  aria-current='page'
                >
                  <span>メニュー項目2（現在位置）</span>
                </MenuListItemLink>
              </MenuListItem>
              <MenuListItem>
                <MenuListItemLink href='#' type={type} size={size}>
                  <span>メニュー項目3</span>
                </MenuListItemLink>
              </MenuListItem>
            </MenuList>
          </div>
        )),
      )}
    </div>
  ),
};

export const WithIcons: StoryObj = {
  name: 'アイコン付き',
  render: () => (
    <div className={frame}>
      <MenuList>
        <MenuListItem>
          <MenuListItemLink href='#' type='standard' size='regular'>
            <FrontIcon />
            <span>フロントアイコン</span>
          </MenuListItemLink>
        </MenuListItem>
        <MenuListItem>
          <MenuListItemLink
            href='https://www.digital.go.jp'
            target='_blank'
            rel='noreferrer'
            type='standard'
            size='regular'
          >
            <span>
              外部リンク
              <TailIcon />
            </span>
          </MenuListItemLink>
        </MenuListItem>
        <MenuListItem>
          <MenuListItemButton type='standard' size='regular' aria-expanded={false}>
            <span>エンドアイコン</span>
            <EndIcon />
          </MenuListItemButton>
        </MenuListItem>
      </MenuList>
    </div>
  ),
};

const nestedItems = ['1', '2', '3'];

export const HasChildren: StoryObj = {
  name: '子メニュー（standard）',
  render: () => (
    <div className={frame}>
      <MenuList>
        <MenuListItem>
          <MenuListItemButton type='standard' size='regular'>
            <span>メニュー項目1</span>
          </MenuListItemButton>
        </MenuListItem>
        <MenuListItem>
          <MenuListItemButton type='standard' size='regular' aria-expanded={true}>
            <span>メニュー項目2</span>
            <EndIcon />
          </MenuListItemButton>
          <MenuList indent={1}>
            {nestedItems.map((n) => (
              <MenuListItem key={n}>
                <MenuListItemButton
                  type='standard'
                  size='regular'
                  current={n === '2'}
                  aria-current={n === '2' ? 'true' : undefined}
                >
                  <span>メニュー項目2-{n}</span>
                </MenuListItemButton>
              </MenuListItem>
            ))}
          </MenuList>
        </MenuListItem>
        <MenuListItem>
          <MenuListItemButton type='standard' size='regular' aria-expanded={false}>
            <span>メニュー項目3</span>
            <EndIcon />
          </MenuListItemButton>
        </MenuListItem>
      </MenuList>
    </div>
  ),
};

export const HasChildrenBox: StoryObj = {
  name: '子メニュー（box）',
  render: () => (
    <div className={frame}>
      <MenuList>
        <MenuListItem>
          <MenuListItemButton type='box' size='small' aria-expanded={true}>
            <span>メニュー項目1</span>
            <EndIcon />
          </MenuListItemButton>
          <MenuList indent={1}>
            {nestedItems.map((n) => (
              <MenuListItem key={n}>
                <MenuListItemLink
                  href='#'
                  type='box'
                  size='small'
                  current={n === '1'}
                  aria-current={n === '1' ? 'page' : undefined}
                >
                  <span>メニュー項目1-{n}</span>
                </MenuListItemLink>
              </MenuListItem>
            ))}
          </MenuList>
        </MenuListItem>
        <MenuListItem>
          <MenuListItemLink href='#' type='box' size='small'>
            <span>メニュー項目2</span>
          </MenuListItemLink>
        </MenuListItem>
      </MenuList>
    </div>
  ),
};
