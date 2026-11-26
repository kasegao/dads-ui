import type { Meta, StoryObj } from '@storybook/react-vite';
import { type ReactNode, useEffect, useId, useRef, useState } from 'react';
import { css } from '../../../styled-system/css';
import { Button } from '../Button';
import {
  ProgressIndicator,
  ProgressIndicatorLinear,
  type ProgressIndicatorSize,
  ProgressIndicatorSpinner,
  ProgressIndicatorStatic,
  type ProgressIndicatorType,
} from './ProgressIndicator';
import { useProgressIndicatorAnnouncer } from './useProgressIndicatorAnnouncer';

type Indicator = 'spinner' | 'linear' | 'static';

type DemoArgs = {
  type: ProgressIndicatorType;
  indicator: Indicator;
  size: ProgressIndicatorSize;
  label: string;
  value?: number;
};

const meta: Meta<DemoArgs> = {
  title: 'Components/プログレスインジケーター',
  tags: ['autodocs'],
  argTypes: {
    type: { control: 'radio', options: ['stacked', 'inlined', 'stacked-underlay'] },
    indicator: { control: 'radio', options: ['spinner', 'linear', 'static'] },
    size: { control: 'radio', options: ['lg', 'sm'] },
    label: { control: 'text' },
    value: { control: { type: 'range', min: 0, max: 100, step: 5 } },
  },
};

export default meta;
type Story = StoryObj<DemoArgs>;

const grid = css({ display: 'grid', gap: '64' });
const frame = css({ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '32' });
const paused = css({ '& *': { animationPlayState: 'paused' } });
const percent = css({
  display: 'inline-block',
  minWidth: '2ch',
  textAlign: 'right',
  fontVariantNumeric: 'tabular-nums',
});
const demos = css({ display: 'flex', flexDirection: 'column', gap: '48' });
const section = css({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '16',
});
const sectionHeading = css({ textStyle: 'std-20B-150', color: 'solid-gray.900' });
const sectionText = css({ textStyle: 'std-16N-170', color: 'solid-gray.700' });
const visuallyHidden = css({ srOnly: true });

const Glyph = ({ indicator, size }: { indicator: Indicator; size: ProgressIndicatorSize }) => {
  if (indicator === 'linear') return <ProgressIndicatorLinear size={size} />;
  if (indicator === 'static') return <ProgressIndicatorStatic size={size} />;
  return <ProgressIndicatorSpinner size={size} />;
};

const Demo = ({ type, indicator, size, label, value }: DemoArgs) => {
  const labelId = useId();
  const hasLabel = label.trim() !== '';

  return (
    <ProgressIndicator
      type={type}
      value={value}
      aria-labelledby={hasLabel ? labelId : undefined}
      aria-label={hasLabel ? undefined : '読み込み中'}
    >
      <Glyph indicator={indicator} size={size} />
      {hasLabel && (
        <span id={labelId}>
          {label}
          {value !== undefined && (
            <>
              {' '}
              (<span className={percent}>{Math.round(value)}</span>%)
            </>
          )}
        </span>
      )}
    </ProgressIndicator>
  );
};

const AllTypes = ({ indicator, label, value }: Pick<DemoArgs, 'indicator' | 'label' | 'value'>) => (
  <div className={grid}>
    <Demo type='stacked' indicator={indicator} size='lg' label={label} value={value} />
    <Demo type='inlined' indicator={indicator} size='sm' label={label} value={value} />
    <Demo type='stacked-underlay' indicator={indicator} size='lg' label={label} value={value} />
  </div>
);

/** Lets viewers pause the looping animation (WCAG 2.2.2); Storybook-only helper. */
const PausableLoopFrame = ({ children }: { children: ReactNode }) => {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <div className={frame}>
      <Button size='sm' variant='outline' onClick={() => setIsPaused((p) => !p)}>
        {isPaused ? 'アニメーションを再生' : 'アニメーションを一時停止'}
      </Button>
      <div className={isPaused ? paused : undefined}>{children}</div>
    </div>
  );
};

const baseArgs: DemoArgs = {
  type: 'stacked',
  indicator: 'spinner',
  size: 'lg',
  label: '読み込み中',
};

export const Playground: Story = {
  args: baseArgs,
  render: (args) => <Demo {...args} />,
};

export const SpinnerLoop: Story = {
  name: 'スピナー（ループ）',
  args: baseArgs,
  render: ({ label }) => (
    <PausableLoopFrame>
      <AllTypes indicator='spinner' label={label} />
    </PausableLoopFrame>
  ),
};

export const SpinnerFill: Story = {
  name: 'スピナー（進捗率）',
  args: { ...baseArgs, value: 35 },
  render: ({ label, value }) => <AllTypes indicator='spinner' label={label} value={value} />,
};

export const LinearLoop: Story = {
  name: 'リニア（ループ）',
  args: { ...baseArgs, indicator: 'linear' },
  render: ({ label }) => (
    <PausableLoopFrame>
      <AllTypes indicator='linear' label={label} />
    </PausableLoopFrame>
  ),
};

export const LinearFill: Story = {
  name: 'リニア（進捗率）',
  args: { ...baseArgs, indicator: 'linear', value: 35 },
  render: ({ label, value }) => <AllTypes indicator='linear' label={label} value={value} />,
};

export const Static: Story = {
  name: '静止アイコン',
  args: { ...baseArgs, indicator: 'static' },
  render: ({ label }) => <AllTypes indicator='static' label={label} />,
};

export const WithoutLabel: Story = {
  name: 'ラベルなし',
  args: { ...baseArgs, label: '' },
  render: ({ label }) => <AllTypes indicator='spinner' label={label} />,
};

const LoopDemo = () => {
  const labelId = useId();
  const [active, setActive] = useState(false);
  const timerRef = useRef<number | undefined>(undefined);
  const announceText = useProgressIndicatorAnnouncer({ active });

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  const handleStart = () => {
    window.clearTimeout(timerRef.current);
    setActive(true);
    timerRef.current = window.setTimeout(() => setActive(false), 15000);
  };

  return (
    <section className={section}>
      <h3 className={sectionHeading}>ループ（進捗率が不明）</h3>
      <p className={sectionText}>
        処理時間が不明な場合に使用します。15秒後に自動的に完了します。5秒経過ごとに読み込み中であることをスクリーンリーダーに通知します。
      </p>
      <Button size='md' variant='solid-fill' onClick={handleStart}>
        ローディング開始
      </Button>
      <ProgressIndicator type='stacked' active={active} aria-labelledby={labelId}>
        <ProgressIndicatorSpinner size='lg' />
        <span id={labelId}>読み込み中</span>
      </ProgressIndicator>
      <span role='status' className={visuallyHidden}>
        {announceText}
      </span>
    </section>
  );
};

const FillDemo = () => {
  const labelId = useId();
  const [active, setActive] = useState(false);
  const [value, setValue] = useState(0);
  const timerRef = useRef<number | undefined>(undefined);
  const announceText = useProgressIndicatorAnnouncer({ active, value });

  useEffect(() => () => window.clearInterval(timerRef.current), []);

  const handleStart = () => {
    window.clearInterval(timerRef.current);
    setValue(0);
    setActive(true);

    const steps = 15000 / 200;
    let currentStep = 0;

    timerRef.current = window.setInterval(() => {
      currentStep++;
      const next = Math.min(100, Math.round((currentStep / steps) * 100));
      setValue(next);
      if (next >= 100) {
        window.clearInterval(timerRef.current);
        setActive(false);
      }
    }, 200);
  };

  return (
    <section className={section}>
      <h3 className={sectionHeading}>進捗率を表示する</h3>
      <p className={sectionText}>
        進捗率が把握できる場合に使用します。15秒かけて100%まで進行します。5秒経過ごとに進捗状況をスクリーンリーダーに通知します。
      </p>
      <Button size='md' variant='solid-fill' onClick={handleStart}>
        ローディング開始
      </Button>
      <ProgressIndicator type='stacked' value={value} active={active} aria-labelledby={labelId}>
        <ProgressIndicatorLinear size='lg' />
        <span id={labelId}>
          読み込み中 (<span className={percent}>{Math.round(value)}</span>%)
        </span>
      </ProgressIndicator>
      <span role='status' className={visuallyHidden}>
        {announceText}
      </span>
    </section>
  );
};

const PassiveDemo = () => {
  const labelId = useId();
  const [active, setActive] = useState(false);
  const timerRef = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  const handleStart = () => {
    window.clearTimeout(timerRef.current);
    setActive(true);
    timerRef.current = window.setTimeout(() => setActive(false), 5000);
  };

  return (
    <section className={section}>
      <h3 className={sectionHeading}>通知なし</h3>
      <p className={sectionText}>
        スクロール等の暗黙的な操作で起動するローディングです。スクリーンリーダーへの通知は行いません。5秒後に完了します。
      </p>
      <Button size='md' variant='solid-fill' onClick={handleStart}>
        ローディング開始
      </Button>
      <ProgressIndicator type='inlined' active={active} aria-labelledby={labelId}>
        <ProgressIndicatorSpinner size='sm' />
        <span id={labelId}>読み込み中</span>
      </ProgressIndicator>
    </section>
  );
};

export const InteractiveDemo: Story = {
  name: 'スクリーンリーダーへの通知',
  args: baseArgs,
  render: () => (
    <div className={demos}>
      <LoopDemo />
      <FillDemo />
      <PassiveDemo />
    </div>
  ),
};
