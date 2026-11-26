import type { Meta, StoryObj } from '@storybook/react-vite';
import { css } from '../../../styled-system/css';
import {
  LanguageSelector,
  LanguageSelectorArrowIcon,
  LanguageSelectorButton,
  LanguageSelectorGlobeIcon,
  LanguageSelectorGlobeWithLabelIcon,
  LanguageSelectorMenu,
  LanguageSelectorMenuItem,
} from './LanguageSelector';

const meta = {
  title: 'Components/ランゲージセレクター',
  component: LanguageSelector,
  tags: ['autodocs'],
} satisfies Meta<typeof LanguageSelector>;

export default meta;

const languages = [
  { name: '日本語', code: 'ja', url: 'https://www.digital.go.jp/' },
  { name: 'English', code: 'en', url: 'https://www.digital.go.jp/en' },
  { name: '简体中文', code: 'zh-cn', url: '#zh-cn' },
  { name: '繁体中文', code: 'zh-tw', url: '#zh-tw' },
  { name: '한국어', code: 'ko', url: '#ko' },
  { name: 'Español', code: 'es', url: '#es' },
  { name: 'Bahasa Indonesia', code: 'id', url: '#id' },
  { name: 'Tiếng Việt', code: 'vi', url: '#vi' },
];

const stage = css({ minHeight: '22rem' });
const stageEnd = css({ display: 'flex', justifyContent: 'flex-end', minHeight: '22rem' });
const label = css({ marginBottom: '2' });

interface PlaygroundArgs {
  isCondensed: boolean;
  languageCount: number;
}

export const Playground: StoryObj<PlaygroundArgs> = {
  render: (args) => (
    <div className={stage}>
      <LanguageSelector>
        <LanguageSelectorButton>
          <LanguageSelectorGlobeIcon />
          <span className={label}>Language</span>
          <LanguageSelectorArrowIcon />
        </LanguageSelectorButton>
        <LanguageSelectorMenu isCondensed={args.isCondensed}>
          {languages.slice(0, args.languageCount).map((lang) => (
            <LanguageSelectorMenuItem
              href={lang.url}
              hrefLang={lang.code}
              isCondensed={args.isCondensed}
              isCurrent={lang.code === 'ja'}
              key={lang.code}
              lang={lang.code}
              value={lang.code}
            >
              {lang.name}
            </LanguageSelectorMenuItem>
          ))}
        </LanguageSelectorMenu>
      </LanguageSelector>
    </div>
  ),
  argTypes: {
    isCondensed: { control: 'boolean' },
    languageCount: { control: { type: 'number', min: 2, max: languages.length } },
  },
  args: { isCondensed: false, languageCount: languages.length },
};

export const WithoutLabel: StoryObj = {
  name: 'ラベル内包アイコン（モバイル条件付き）',
  render: () => (
    <div className={stageEnd}>
      <LanguageSelector positioning={{ placement: 'bottom-end' }}>
        <LanguageSelectorButton iconOnly={true}>
          <LanguageSelectorGlobeWithLabelIcon />
          <LanguageSelectorArrowIcon />
        </LanguageSelectorButton>
        <LanguageSelectorMenu>
          {languages.slice(0, 5).map((lang) => (
            <LanguageSelectorMenuItem
              href={lang.url}
              hrefLang={lang.code}
              isCurrent={lang.code === 'ja'}
              key={lang.code}
              lang={lang.code}
              value={lang.code}
            >
              {lang.name}
            </LanguageSelectorMenuItem>
          ))}
        </LanguageSelectorMenu>
      </LanguageSelector>
    </div>
  ),
};

export const CondensedMenu: StoryObj = {
  name: 'コンデンスメニュー',
  render: () => (
    <div className={stage}>
      <LanguageSelector>
        <LanguageSelectorButton>
          <LanguageSelectorGlobeIcon />
          <span className={label}>Language</span>
          <LanguageSelectorArrowIcon />
        </LanguageSelectorButton>
        <LanguageSelectorMenu isCondensed={true}>
          {languages.map((lang) => (
            <LanguageSelectorMenuItem
              href={lang.url}
              hrefLang={lang.code}
              isCondensed={true}
              isCurrent={lang.code === 'ja'}
              key={lang.code}
              lang={lang.code}
              value={lang.code}
            >
              {lang.name}
            </LanguageSelectorMenuItem>
          ))}
        </LanguageSelectorMenu>
      </LanguageSelector>
    </div>
  ),
};

export const DefaultOpen: StoryObj = {
  name: '開いた状態',
  render: () => (
    <div className={stage}>
      <LanguageSelector defaultOpen={true}>
        <LanguageSelectorButton>
          <LanguageSelectorGlobeIcon />
          <span className={label}>Language</span>
          <LanguageSelectorArrowIcon />
        </LanguageSelectorButton>
        <LanguageSelectorMenu>
          {languages.slice(0, 3).map((lang) => (
            <LanguageSelectorMenuItem
              href={lang.url}
              hrefLang={lang.code}
              isCurrent={lang.code === 'ja'}
              key={lang.code}
              lang={lang.code}
              value={lang.code}
            >
              {lang.name}
            </LanguageSelectorMenuItem>
          ))}
        </LanguageSelectorMenu>
      </LanguageSelector>
    </div>
  ),
};
