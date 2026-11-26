import type { Meta, StoryObj } from '@storybook/react-vite';
import type { CSSProperties, ReactNode } from 'react';
import { css } from '../../../styled-system/css';
import {
  StepNavigation,
  StepNavigationDescription,
  StepNavigationList,
  StepNavigationNumber,
  StepNavigationStateIndicator,
  StepNavigationStep,
  StepNavigationStepHeader,
  type StepNavigationStepState,
  StepNavigationTitle,
} from './StepNavigation';

const meta = {
  title: 'Components/ステップナビゲーション',
  component: StepNavigation,
  tags: ['autodocs'],
} satisfies Meta<typeof StepNavigation>;

export default meta;

const srOnly = css({ srOnly: true });
const column = css({ display: 'flex', flexDirection: 'column', gap: '48' });

interface PlaygroundArgs {
  orientation: 'horizontal' | 'vertical';
  size: 'normal' | 'small';
  numberOnly: boolean;
  steps: number;
  stepWidth: number;
  stepMinWidth: number;
}

export const Playground: StoryObj<PlaygroundArgs> = {
  render: (args) => {
    const numbers = Array.from({ length: args.steps }, (_, i) => i + 1);
    const style =
      args.orientation === 'horizontal'
        ? ({
            '--step-width': String(args.stepWidth),
            '--step-min-width': String(args.stepMinWidth),
          } as CSSProperties)
        : undefined;

    return (
      <StepNavigation orientation={args.orientation} size={args.size} style={style}>
        <p className={srOnly}>全{args.steps}ステップ中、1ステップ目まで到達済み</p>
        <StepNavigationList>
          {numbers.map((n) => (
            <StepNavigationStep
              key={n}
              state={n === 1 ? 'reached' : undefined}
              first={n === 1}
              last={n === args.steps}
              aria-current={n === 1 ? 'step' : undefined}
            >
              <StepNavigationStepHeader>
                <StepNavigationNumber>{n}</StepNavigationNumber>
                {!args.numberOnly && <StepNavigationTitle>ステップのタイトル</StepNavigationTitle>}
              </StepNavigationStepHeader>
              {!args.numberOnly && (
                <StepNavigationDescription>ステップの説明が入ります。</StepNavigationDescription>
              )}
            </StepNavigationStep>
          ))}
        </StepNavigationList>
      </StepNavigation>
    );
  },
  argTypes: {
    orientation: { control: 'radio', options: ['horizontal', 'vertical'] },
    size: { control: 'radio', options: ['normal', 'small'] },
    numberOnly: { control: 'boolean' },
    steps: { control: { type: 'number', min: 1, max: 100, step: 1 } },
    stepWidth: {
      control: { type: 'number', min: 0, max: 1000, step: 8 },
      if: { arg: 'orientation', eq: 'horizontal' },
    },
    stepMinWidth: {
      control: { type: 'number', min: 0, max: 1000, step: 8 },
      if: { arg: 'orientation', eq: 'horizontal' },
    },
  },
  args: {
    orientation: 'horizontal',
    size: 'normal',
    numberOnly: false,
    steps: 3,
    stepWidth: 320,
    stepMinWidth: 160,
  },
};

interface SingleArgs {
  interaction: 'none' | 'link' | 'button';
  first: boolean;
  last: boolean;
  current: boolean;
  state: StepNavigationStepState | 'default';
  title: string;
  description: string;
}

export const Single: StoryObj<SingleArgs> = {
  name: '単一ステップ',
  render: (args) => {
    const state = args.state === 'default' ? undefined : args.state;
    const header = (
      <>
        <StepNavigationNumber>
          1
          <StepNavigationStateIndicator state={state} />
        </StepNavigationNumber>
        {args.title && <StepNavigationTitle>{args.title}</StepNavigationTitle>}
      </>
    );

    let stepHeader: ReactNode = <StepNavigationStepHeader>{header}</StepNavigationStepHeader>;
    if (args.interaction === 'link') {
      stepHeader = (
        <StepNavigationStepHeader asChild={true}>
          <a href='#step-1'>{header}</a>
        </StepNavigationStepHeader>
      );
    } else if (args.interaction === 'button') {
      stepHeader = (
        <StepNavigationStepHeader asChild={true}>
          <button type='button'>{header}</button>
        </StepNavigationStepHeader>
      );
    }

    return (
      <StepNavigation
        orientation='horizontal'
        size='normal'
        style={{ '--step-min-width': '200' } as CSSProperties}
      >
        <p className={srOnly}>全1ステップ中、1ステップ目まで到達済み</p>
        <StepNavigationList>
          <StepNavigationStep
            state={state}
            first={args.first}
            last={args.last}
            aria-current={args.current ? 'step' : undefined}
          >
            {stepHeader}
            {args.description && (
              <StepNavigationDescription>{args.description}</StepNavigationDescription>
            )}
          </StepNavigationStep>
        </StepNavigationList>
      </StepNavigation>
    );
  },
  argTypes: {
    interaction: { control: 'radio', options: ['none', 'link', 'button'] },
    first: { control: 'boolean' },
    last: { control: 'boolean' },
    current: { control: 'boolean' },
    state: {
      control: 'radio',
      options: ['default', 'reached', 'completed', 'editing', 'error', 'skipped'],
    },
    title: { control: 'text' },
    description: { control: 'text' },
  },
  args: {
    interaction: 'none',
    first: false,
    last: false,
    current: false,
    state: 'default',
    title: 'ステップのタイトル',
    description: 'ステップの説明が入ります。',
  },
};

const stateSteps: { state?: StepNavigationStepState; title: string; current?: boolean }[] = [
  { state: 'completed', title: '完了' },
  { state: 'skipped', title: 'スキップ' },
  { state: 'error', title: 'エラー' },
  { state: 'editing', title: '編集中' },
  { state: 'reached', title: '到達済み（現在）', current: true },
  { title: '未到達' },
];

const StateSteps = ({ interactive }: { interactive: boolean }) => (
  <StepNavigationList>
    {stateSteps.map((step, index) => {
      const header = (
        <>
          <StepNavigationNumber>
            {index + 1}
            <StepNavigationStateIndicator state={step.state} />
          </StepNavigationNumber>
          <StepNavigationTitle>{step.title}</StepNavigationTitle>
        </>
      );
      return (
        <StepNavigationStep
          key={step.title}
          state={step.state}
          first={index === 0}
          last={index === stateSteps.length - 1}
          aria-current={step.current ? 'step' : undefined}
        >
          {interactive && step.state ? (
            <StepNavigationStepHeader asChild={true}>
              <a href={`#step-${index + 1}`}>{header}</a>
            </StepNavigationStepHeader>
          ) : (
            <StepNavigationStepHeader>{header}</StepNavigationStepHeader>
          )}
          <StepNavigationDescription>ステップの説明が入ります。</StepNavigationDescription>
        </StepNavigationStep>
      );
    })}
  </StepNavigationList>
);

export const States: StoryObj = {
  name: '状態',
  render: () => (
    <div className={column}>
      {(['normal', 'small'] as const).map((size) => (
        <StepNavigation key={size} size={size} style={{ '--step-width': '200' } as CSSProperties}>
          <p className={srOnly}>全6ステップ中、5ステップ目まで到達済み</p>
          <StateSteps interactive={false} />
        </StepNavigation>
      ))}
    </div>
  ),
};

export const Vertical: StoryObj = {
  name: '垂直',
  render: () => (
    <div className={column}>
      {(['normal', 'small'] as const).map((size) => (
        <StepNavigation key={size} orientation='vertical' size={size}>
          <p className={srOnly}>全6ステップ中、5ステップ目まで到達済み</p>
          <StateSteps interactive={false} />
        </StepNavigation>
      ))}
    </div>
  ),
};

export const Interactive: StoryObj = {
  name: 'リンク付き（ナビゲーション）',
  render: () => (
    <StepNavigation asChild={true} style={{ '--step-width': '200' } as CSSProperties}>
      <nav aria-label='ステップ'>
        <p className={srOnly}>全6ステップ中、5ステップ目まで到達済み</p>
        <StateSteps interactive={true} />
      </nav>
    </StepNavigation>
  ),
};

export const NumberOnly: StoryObj = {
  name: '番号のみ',
  render: () => (
    <StepNavigation
      size='small'
      style={{ '--step-width': '96', '--step-min-width': '64' } as CSSProperties}
    >
      <p className={srOnly}>全4ステップ中、2ステップ目まで到達済み</p>
      <StepNavigationList>
        {[1, 2, 3, 4].map((n) => (
          <StepNavigationStep
            key={n}
            state={n === 1 ? 'completed' : n === 2 ? 'reached' : undefined}
            first={n === 1}
            last={n === 4}
            aria-current={n === 2 ? 'step' : undefined}
          >
            <StepNavigationStepHeader>
              <StepNavigationNumber>
                {n}
                <StepNavigationStateIndicator state={n === 1 ? 'completed' : undefined} />
              </StepNavigationNumber>
            </StepNavigationStepHeader>
          </StepNavigationStep>
        ))}
      </StepNavigationList>
    </StepNavigation>
  ),
};
