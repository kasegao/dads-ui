import type { Meta, StoryObj } from '@storybook/react-vite';
import { css } from '../../../styled-system/css';
import { focusRing } from '../../styles/focus';
import { Button } from '../Button';
import { Link } from '../Link';
import authorIcon from './assets/card-3-1.png';
import postIllustration from './assets/card-3-2.png';

/**
 * 情報をまとめて表示し、詳細ページへの導線やアクションを提供するためのレイアウトパターンです。
 * 共通の `Card` コンポーネントは提供せず、それぞれ独立したマークアップとスタイルを持つ6つの作例として構成しています。
 */
const meta = {
  title: 'Components/カード',
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj;

const photo = (width: number, height: number, from: string, to: string) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}' viewBox='0 0 ${width} ${height}'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='${from}'/><stop offset='1' stop-color='${to}'/></linearGradient></defs><rect width='100%' height='100%' fill='url(#g)'/><circle cx='${width * 0.72}' cy='${height * 0.3}' r='${height * 0.12}' fill='#fff' fill-opacity='0.6'/><path d='M0 ${height} L${width * 0.3} ${height * 0.5} L${width * 0.5} ${height * 0.75} L${width * 0.7} ${height * 0.55} L${width} ${height} Z' fill='#fff' fill-opacity='0.35'/></svg>`,
  )}`;

const cardBase = {
  position: 'relative',
  zIndex: '0',
  borderWidth: '1',
  borderStyle: 'solid',
  borderColor: 'solid-gray.420',
  color: 'solid-gray.800',
  textStyle: 'std-16N-170',
  overflowWrap: 'anywhere',
} as const;

const wrapList = css({ display: 'flex', flexWrap: 'wrap', gap: '24' });
const flexItem = css({ display: 'flex', minWidth: '0' });
const item = css({ minWidth: '0' });
const title = css({ minWidth: '0', color: 'solid-gray.900', textStyle: 'std-20B-150' });
const titleWithMenu = css({
  minWidth: '0',
  paddingTop: '4',
  color: 'solid-gray.900',
  textStyle: 'std-20B-150',
});
const actions = css({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: '16',
});
const menuButton = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '44',
  height: '44',
  borderWidth: '1',
  borderStyle: 'solid',
  borderColor: 'transparent',
  borderRadius: '6',
  backgroundColor: 'white',
  color: 'solid-gray.800',
  cursor: 'pointer',
  _hover: { borderColor: 'black', backgroundColor: 'solid-gray.50' },
  _focusVisible: { ...focusRing },
});
const visuallyHidden = css({ srOnly: true });

const MenuButton = () => (
  <button className={menuButton} type='button'>
    <svg
      aria-label='メニュー'
      fill='currentcolor'
      height='24'
      role='img'
      viewBox='0 0 24 24'
      width='24'
    >
      <circle cx='12' cy='4.5' r='1.5' />
      <circle cx='12' cy='12' r='1.5' />
      <circle cx='12' cy='19.5' r='1.5' />
    </svg>
  </button>
);

const example1 = {
  card: css({
    position: 'relative',
    zIndex: '0',
    display: 'flex',
    flexDirection: 'column',
    minWidth: '0',
    maxWidth: 'full',
    width: '22rem',
    fontFamily: 'sans',
    textDecorationLine: 'none',
    overflowWrap: 'anywhere',
    _focusVisible: { ...focusRing, borderRadius: '16' },
  }),
  image: css({
    position: 'relative',
    boxSizing: 'content-box',
    aspectRatio: '3 / 2',
    borderWidth: '1',
    borderStyle: 'solid',
    borderColor: 'solid-gray.420',
    borderTopRadius: '16',
    background:
      'linear-gradient(0deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.1) 100%), linear-gradient(114deg, {colors.cyan.400} 0%, {colors.purple.500} 100%)',
  }),
  icon: css({
    position: 'absolute',
    inset: '0',
    zIndex: '0',
    margin: 'auto',
    transform: 'translateY(-0.75rem)',
  }),
  main: css({
    position: 'relative',
    display: 'grid',
    flexGrow: '1',
    alignContent: 'start',
    rowGap: '16',
    marginTop: '-24',
    borderWidth: '1',
    borderStyle: 'solid',
    borderColor: 'solid-gray.420',
    borderRadius: '16',
    backgroundColor: 'white',
    paddingInline: '24',
    paddingBlock: '16',
  }),
  title: css({
    minWidth: '0',
    color: 'solid-gray.900',
    textStyle: 'std-20B-150',
    textDecorationLine: 'underline',
    textDecorationThickness: '0.0625rem',
    textUnderlineOffset: '0.1875rem',
    'a:hover &': { textDecorationThickness: '0.1875rem' },
  }),
  description: css({ color: 'solid-gray.800', textStyle: 'std-16N-170' }),
};

export const Example1: Story = {
  name: 'カード作例 1（全体がリンク）',
  render: () => (
    <ul className={wrapList}>
      {[
        {
          title: '機内サービス',
          description: '快適なシートや機内食で空の旅をより快適にお過ごしいただけます',
          icon: 'M29.9 8C31.2 6.1 33 6.1 34 8c1.1 1.9 2.2 5 2.2 8.8v6.1l20.5 12.3c1 .8 1.9 2.1 1.9 3.5v4l-23-7.5-.9 12.1-3 2.6h.7l-.5.3-.3-.2-1.7 1.4 2-1.2 6.1 3.7Q39.7 55 40 57l-16 .2q.1-2 1.9-3.4l3.7-2.3L28.3 35l-23 7.8v-4q.1-2.2 1.9-3.5l20.5-12.3v-6.1c0-3.7 1.1-7 2.2-8.8',
        },
        {
          title: '乗り継ぎサポート',
          description: 'お乗り継ぎ時の際に日本人のガイドがご案内いたします',
          icon: 'M32 31.6q2 0 3.4-1.4 1.5-1.4 1.4-3.4 0-2-1.4-3.4Q34 22 32 22q-2 0-3.4 1.4-1.4 1.5-1.4 3.4 0 2 1.4 3.4 1.4 1.5 3.4 1.4m0 25.8A85 85 0 0 1 16.9 41q-5-7.5-5-13.8 0-9.1 6-15 6-5.6 14.1-5.6t14.2 5.7q6 5.7 6 15 0 6.2-5.1 13.7T32 57.4',
        },
        {
          title: '機内持ち込み手荷物検査',
          description: '機内にお持ち込みいただける手荷物について係員が検査いたします',
          icon: 'M40 5.3H24v8H13.3v40h7q-.4.7-.3 1.4c0 2.1 1.9 4 4 4s4-1.9 4-4q0-.7-.3-1.4h8.6q-.4.7-.3 1.4c0 2.1 1.9 4 4 4s4-1.9 4-4q0-.7-.3-1.4h7v-40H40zM25.3 44h-2.6V24h2.6zm8 0h-2.6V24h2.6zM36 13.3h-8v-4h8zM41.3 24v20h-2.6V24z',
        },
      ].map(({ title, description, icon }) => (
        <li key={title} className={flexItem}>
          <a className={example1.card} href='#top'>
            <div className={example1.image}>
              <svg
                aria-hidden={true}
                className={example1.icon}
                fill='none'
                height='64'
                viewBox='0 0 64 64'
                width='64'
              >
                <path d={icon} fill='white' />
              </svg>
            </div>
            <div className={example1.main}>
              <h2 className={example1.title}>{title}</h2>
              <p className={example1.description}>{description}</p>
            </div>
          </a>
        </li>
      ))}
    </ul>
  ),
};

const example2 = {
  list: css({ display: 'grid', gap: '24' }),
  card: css({
    ...cardBase,
    display: 'grid',
    gridTemplateAreas: '"image main"',
    gridTemplateColumns: 'minmax(auto, min(50%, 22rem)) 1fr',
    maxWidth: '64rem',
    backgroundColor: 'white',
  }),
  main: css({
    position: 'relative',
    display: 'grid',
    gridArea: 'main',
    rowGap: '16',
    minWidth: '0',
    paddingInline: '24',
    paddingBlock: '16',
  }),
  header: css({
    display: 'flex',
    justifyContent: 'space-between',
    columnGap: '16',
    minWidth: '0',
  }),
  menu: css({ flexShrink: '0', marginRight: '-24' }),
  divider: css({
    marginBlock: '8',
    borderTopWidth: '1',
    borderTopStyle: 'solid',
    borderTopColor: 'solid-gray.536',
  }),
  actions: css({ display: 'flex', justifyContent: 'flex-end', columnGap: '16' }),
  link: css({
    display: 'flex',
    borderWidth: '4',
    borderStyle: 'double',
    borderColor: 'transparent',
    backgroundColor: 'light-blue.900',
    paddingInline: '8',
    paddingBlock: '6',
    color: 'white',
    textStyle: 'oln-16N-100',
    textDecorationLine: 'none',
    _hover: {
      backgroundColor: 'light-blue.1000',
      textDecorationLine: 'underline',
      textDecorationThickness: '0.0625rem',
      textUnderlineOffset: '0.1875rem',
    },
    _focusVisible: { ...focusRing, borderRadius: '4' },
  }),
  image: css({
    position: 'relative',
    zIndex: '0',
    gridArea: 'image',
    minWidth: '0',
    borderRightWidth: '1',
    borderRightStyle: 'solid',
    borderRightColor: 'solid-gray.420',
  }),
  img: css({
    position: 'absolute',
    inset: '0',
    width: 'full',
    height: 'full',
    objectFit: 'cover',
  }),
};

export const Example2: Story = {
  name: 'カード作例 2（メニューボタンとリンク）',
  render: () => (
    <ul className={example2.list}>
      {[
        {
          title: '地域緑化事業',
          description:
            '住民の皆さまが参加できる地域緑化事業を行っています。地域交流を促進するとともに、地域の景観美化を目的としています。',
        },
        {
          title: '子育て支援プログラム',
          description:
            '子育て世代の皆さまを応援する包括的なサポートプログラムです。育児相談から保育サービスまで幅広い支援を提供しています。',
        },
        {
          title: 'デジタル化推進事業',
          description:
            '市民サービスのデジタル化を推進し、より便利で効率的な行政サービスの提供を目指しています。オンライン申請やAI相談など最新技術を活用しています。',
        },
      ].map(({ title: heading, description }) => (
        <li key={heading} className={item}>
          <div className={example2.card}>
            <div className={example2.main}>
              <div className={example2.header}>
                <h2 className={titleWithMenu}>{heading}</h2>
                <div className={example2.menu}>
                  <MenuButton />
                </div>
              </div>
              <p className={item}>{description}</p>
              <div className={example2.divider} />
              <div className={example2.actions}>
                <a className={example2.link} href='#top'>
                  詳しくみる
                </a>
              </div>
            </div>
            <div className={example2.image}>
              <img
                alt='淡いピンクから水色へのグラデーションのサンプル写真'
                className={example2.img}
                height='235'
                src={photo(352, 235, '#f7b6d2', '#7fc8f8')}
                width='352'
              />
            </div>
          </div>
        </li>
      ))}
    </ul>
  ),
};

const example3 = {
  list: css({
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(auto, 354px))',
    columnGap: '24',
    rowGap: '32',
  }),
  item: css({
    display: 'grid',
    gridRow: 'span 2',
    gridTemplateRows: 'subgrid',
    minWidth: '0',
  }),
  card: css({
    ...cardBase,
    display: 'grid',
    gridRow: 'span 2',
    gridTemplateRows: 'subgrid',
    rowGap: '0',
    minWidth: '0',
    borderRadius: '16',
  }),
  top: css({
    display: 'grid',
    alignContent: 'start',
    rowGap: '16',
    minWidth: '0',
    paddingInline: '24',
    paddingTop: '16',
  }),
  header: css({ display: 'flex', alignItems: 'flex-start', columnGap: '16', minWidth: '0' }),
  titles: css({ display: 'flex', flexDirection: 'column', rowGap: '8', minWidth: '0' }),
  label: css({ order: '-1' }),
  avatar: css({ order: '-1', flexShrink: '0' }),
  bottom: css({
    display: 'grid',
    gap: '16',
    minWidth: '0',
    paddingInline: '24',
    paddingBlock: '16',
  }),
  illustration: css({ display: 'block', maxWidth: 'full', height: 'auto' }),
  buttonIcon: css({ marginRight: '4' }),
};

export const Example3: Story = {
  name: 'カード作例 3（リンクとお気に入りボタン）',
  render: () => (
    <ul className={example3.list}>
      {[
        {
          title: '郵送する際のポイント',
          label: 'お役立ち情報',
          description: '重要な書類を郵送する際に注意すべきポイントをご紹介します',
        },
        {
          title: 'オンライン申請の手順',
          label: '手続きガイド',
          description:
            'マイナンバーカードを使った各種オンライン申請の基本的な手順を分かりやすく解説します',
        },
        {
          title: 'よくある質問と回答',
          label: 'FAQ',
          description: 'お客様からよくお寄せいただくご質問とその回答をまとめました',
        },
      ].map(({ title: heading, label, description }) => (
        <li key={heading} className={example3.item}>
          <div className={example3.card}>
            <div className={example3.top}>
              <div className={example3.header}>
                <div className={example3.titles}>
                  <h2 className={title}>
                    <Link href='#top'>{heading}</Link>
                  </h2>
                  <span className={example3.label}>{label}</span>
                </div>
                <img
                  alt='著者のアイコン'
                  className={example3.avatar}
                  height='64'
                  src={authorIcon}
                  width='64'
                />
              </div>
              <p>{description}</p>
            </div>
            <div className={example3.bottom}>
              <p>
                <img
                  alt='山と空のサンプル画像'
                  className={example3.illustration}
                  height='235'
                  src={postIllustration}
                  width='304'
                />
              </p>
              <ul className={actions}>
                <li>
                  <Button size='sm' variant='outline'>
                    <svg
                      aria-hidden={true}
                      className={example3.buttonIcon}
                      height='20'
                      viewBox='0 0 24 24'
                      width='20'
                    >
                      <path
                        d='m12 21-1.4-1.3a113 113 0 0 1-6.8-6.9 9 9 0 0 1-1.4-2.4Q2 9.3 2 8.2q0-2.4 1.6-4Q5 2.7 7.5 2.7a6 6 0 0 1 4.5 2 6 6 0 0 1 4.5-2q2.4 0 4 1.5 1.5 1.5 1.5 4 0 1.1-.4 2.2-.3 1-1.4 2.4t-2.6 3l-4.2 3.9zm0-2.7 6.4-6.4q.9-1 1.3-2l.3-1.7a3.4 3.4 0 0 0-3.5-3.5A4 4 0 0 0 12.9 7h-1.8q-.5-1-1.4-1.7-1-.6-2.2-.6A3.4 3.4 0 0 0 4 8.2l.3 1.7q.4 1 1.3 2 .9 1.2 2.5 2.7z'
                        fill='currentcolor'
                      />
                    </svg>
                    お気に入り
                  </Button>
                </li>
              </ul>
            </div>
          </div>
        </li>
      ))}
    </ul>
  ),
};

const example4 = {
  list: css({ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: '24' }),
  card: css({
    ...cardBase,
    display: 'grid',
    gridTemplateColumns: '1fr auto',
    rowGap: '16',
    maxWidth: 'full',
    width: '465px',
    paddingInline: '24',
    paddingBlock: '16',
  }),
  menu: css({ flexShrink: '0' }),
  image: css({ gridColumn: '1 / -1', minWidth: '0' }),
  img: css({ display: 'block', maxWidth: 'full', height: 'auto' }),
  actions: css({
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: '16',
    gridColumn: '1 / -1',
    minWidth: '0',
  }),
  // Square corners; the `li >` prefix outranks the Button recipe's own radius.
  squareButton: css({
    'li > &': { borderRadius: '0', _focusVisible: { borderRadius: '4' } },
  }),
};

export const Example4: Story = {
  name: 'カード作例 4（メニューボタンとアクションボタン）',
  render: () => (
    <ul className={example4.list}>
      {[
        'アジア地域における交通問題',
        '持続可能な都市開発の最新動向',
        'デジタル変革時代の教育改革',
      ].map((heading) => (
        <li key={heading} className={item}>
          <div className={example4.card}>
            <h2 className={titleWithMenu}>{heading}</h2>
            <div className={example4.menu}>
              <MenuButton />
            </div>
            <div className={example4.image}>
              <img
                alt='オレンジから紫へのグラデーションのサンプル写真'
                className={example4.img}
                height='235'
                src={photo(415, 235, '#ffb347', '#8e6bbf')}
                width='415'
              />
            </div>
            <ul className={example4.actions}>
              <li>
                <Button
                  asChild={true}
                  className={example4.squareButton}
                  size='sm'
                  variant='outline'
                >
                  <a href='#top'>関連情報</a>
                </Button>
              </li>
              <li>
                <Button
                  asChild={true}
                  className={example4.squareButton}
                  size='sm'
                  variant='solid-fill'
                >
                  <a href='#top'>詳しくみる</a>
                </Button>
              </li>
            </ul>
          </div>
        </li>
      ))}
    </ul>
  ),
};

const example5 = {
  card: css({
    ...cardBase,
    display: 'flex',
    flexDirection: 'column',
    maxWidth: 'full',
    width: '400px',
    borderRadius: '16',
    backgroundColor: 'white',
  }),
  link: css({
    display: 'block',
    borderTopRadius: '0.9375rem',
    paddingBottom: '16',
    color: 'inherit',
    textDecorationLine: 'none',
    _focusVisible: { ...focusRing },
  }),
  heading: css({ position: 'relative' }),
  img: css({ display: 'block', width: 'full', height: 'auto', borderTopRadius: '0.9375rem' }),
  date: css({
    position: 'absolute',
    top: '16',
    left: '16',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    rowGap: '4',
    width: '3.625rem',
    borderRadius: '8',
    backgroundColor: 'white',
    padding: '8',
  }),
  month: css({ color: 'cyan.900', textStyle: 'oln-14B-100' }),
  day: css({ textStyle: 'std-24B-150', lineHeight: '100' }),
  label: css({ display: 'block', marginInline: '24', marginTop: '16' }),
  title: css({
    display: 'block',
    marginInline: '24',
    color: 'solid-gray.900',
    textStyle: 'std-20B-150',
    textDecorationLine: 'underline',
    textDecorationThickness: '0.0625rem',
    textUnderlineOffset: '0.1875rem',
    'h2:hover &': { textDecorationThickness: '0.1875rem' },
  }),
  body: css({
    display: 'grid',
    flexGrow: '1',
    gridTemplateRows: '1fr auto',
    gap: '32',
    paddingInline: '24',
    paddingBottom: '16',
  }),
  outlineButton: css({
    borderWidth: '1',
    borderStyle: 'solid',
    borderColor: 'current',
    color: 'cyan.900',
    _hover: { backgroundColor: 'cyan.50', color: 'cyan.1000', textDecorationLine: 'underline' },
    _active: { backgroundColor: 'cyan.100', color: 'cyan.1200', textDecorationLine: 'underline' },
  }),
  solidButton: css({
    borderWidth: '4',
    borderStyle: 'double',
    borderColor: 'transparent',
    backgroundColor: 'cyan.900',
    color: 'white',
    _hover: { backgroundColor: 'cyan.1000', textDecorationLine: 'underline' },
    _active: { backgroundColor: 'cyan.1200', textDecorationLine: 'underline' },
  }),
};

export const Example5: Story = {
  name: 'カード作例 5（リンクとアクションボタン）',
  render: () => (
    <ul className={wrapList}>
      {[
        {
          month: '12月',
          date: '27',
          label: 'トラベル情報',
          title: '鳥の野鳥観察ツアー',
          description: '大自然の中で野鳥を観察できます。ガイド付きで安心してご参加いただけます。',
        },
        {
          month: '1月',
          date: '15',
          label: '宿泊情報',
          title: '温泉リゾート滞在プラン',
          description:
            '美しい山間の温泉で心身ともにリフレッシュ。地元の食材を使った料理もお楽しみいただけます。',
        },
        {
          month: '2月',
          date: '3',
          label: '文化体験',
          title: '古都散策ウォーキング',
          description:
            '歴史ある街並みをゆっくりと歩きながら、伝統文化と建築美を堪能できるコースです。',
        },
      ].map(({ month, date, label, title: heading, description }) => (
        <li key={heading} className={flexItem}>
          <div className={example5.card}>
            <a className={example5.link} href='#top'>
              <h2 className={example5.heading}>
                <img
                  alt=''
                  className={example5.img}
                  height='235'
                  src={photo(398, 235, '#8fd3a8', '#3a8fb7')}
                  width='398'
                />
                <span className={example5.date}>
                  <span className={example5.month}>{month}</span>
                  <span className={example5.day}>
                    {date}
                    <span className={visuallyHidden}>日</span>
                  </span>
                </span>
                <span className={example5.label}>{label}</span>
                <b className={example5.title}>{heading}</b>
              </h2>
            </a>
            <div className={example5.body}>
              <div className={item}>{description}</div>
              <ul className={actions}>
                <li>
                  <Button size='sm' className={example5.outlineButton}>
                    共有する
                  </Button>
                </li>
                <li>
                  <Button size='sm' className={example5.solidButton}>
                    あとで読む
                  </Button>
                </li>
              </ul>
            </div>
          </div>
        </li>
      ))}
    </ul>
  ),
};

const example6 = {
  card: css({
    ...cardBase,
    display: 'grid',
    gridTemplateAreas: '"image" "main"',
    gridTemplateRows: 'auto 1fr',
    maxWidth: 'full',
    width: '354px',
    borderRadius: '16',
    '&:has(:checked)': { backgroundColor: 'blue.50' },
  }),
  main: css({ gridArea: 'main', paddingInline: '24', paddingBlock: '16' }),
  clickArea: css({ position: 'absolute', inset: '0', zIndex: '10' }),
  description: css({ marginTop: '16' }),
  image: css({
    position: 'relative',
    gridArea: 'image',
    minWidth: '0',
    borderBottomWidth: '1',
    borderBottomStyle: 'solid',
    borderBottomColor: 'solid-gray.420',
  }),
  checkbox: css({
    position: 'absolute',
    top: '16',
    right: '16',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '48',
    height: '48',
    borderWidth: '1',
    borderStyle: 'solid',
    borderColor: 'solid-gray.420',
    borderRadius: '6',
    backgroundColor: 'white',
  }),
  input: css({
    width: '24',
    height: '24',
    accentColor: 'key.900',
    _focusVisible: { ...focusRing },
  }),
  img: css({ display: 'block', width: 'full', height: 'auto', borderTopRadius: '0.9375rem' }),
};

export const Example6: Story = {
  name: 'カード作例 6（全体がチェックボックス）',
  render: () => (
    <ul className={wrapList}>
      {[
        {
          id: 'card-6-checkbox-1',
          title: '新卒採用向けセミナー',
          description: '人事から業務内容やキャリアパスについてご説明します',
        },
        {
          id: 'card-6-checkbox-2',
          title: '中途採用者向け研修',
          description: '経験者向けのスキルアップ研修とチーム連携について学習します',
        },
        {
          id: 'card-6-checkbox-3',
          title: 'マネジメント講座',
          description: 'リーダーシップとプロジェクト管理の基礎を学ぶ実践的な講座です',
        },
      ].map(({ id, title: heading, description }) => (
        <li key={id} className={flexItem}>
          <div className={example6.card}>
            <div className={example6.main}>
              <h2 className={title}>
                <label htmlFor={id}>
                  {heading}
                  <span aria-hidden={true} className={example6.clickArea} />
                </label>
              </h2>
              <p className={example6.description}>{description}</p>
            </div>
            <div className={example6.image}>
              <span className={example6.checkbox}>
                <input className={example6.input} id={id} type='checkbox' />
              </span>
              <img
                alt=''
                className={example6.img}
                height='235'
                src={photo(352, 235, '#c7d2fe', '#6b7fd7')}
                width='352'
              />
            </div>
          </div>
        </li>
      ))}
    </ul>
  ),
};
