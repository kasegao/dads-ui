import type { Meta, StoryObj } from '@storybook/react-vite';
import { css } from '../../../styled-system/css';
import { Accordion, AccordionBackLink, AccordionContent, AccordionSummary } from './Accordion';

const meta = {
  title: 'Components/アコーディオン',
  component: Accordion,
  tags: ['autodocs'],
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

const list = css({ display: 'flex', flexDirection: 'column' });
const item = css({ textStyle: 'std-16N-170' });
const summary = css({ desktop: { textStyle: 'std-18N-160' } });
const paragraph = css({ marginBottom: '16' });
const backLink = css({ marginTop: '16' });

export const Playground: Story = {
  args: { open: false },
  render: (args) => (
    <Accordion className={item} {...args}>
      <AccordionSummary className={summary} id='accordion-playground-summary'>
        <h3>ダミーテキストとは何ですか？</h3>
      </AccordionSummary>
      <AccordionContent>
        <p>
          ダミーテキストは、デザインやレイアウトの作成時に使用される仮の文章です。ダミーテキストは実際の文章ではないので、内容には意味がありません。
        </p>
        <AccordionBackLink className={backLink} href='#accordion-playground-summary'>
          「ダミーテキストとは何ですか？」の先頭に戻る
        </AccordionBackLink>
      </AccordionContent>
    </Accordion>
  ),
};

export const Multiple: Story = {
  name: '複数のアコーディオン',
  render: () => (
    <div className={list}>
      <Accordion className={item}>
        <AccordionSummary className={summary} id='accordion-example-summary-1'>
          <h3>ダミーテキストとは何ですか？</h3>
        </AccordionSummary>
        <AccordionContent>
          <p className={paragraph}>これはダミーテキストです。</p>
          <p>
            ダミーテキストは、デザインやレイアウトの作成時に使用される仮の文章です。ダミーテキストを使用すると、デザインの全体像を評価したり、テキストの配置や長さを確認したりすることができます。ダミーテキストは実際の文章ではないので、内容には意味がありません。
          </p>
          <AccordionBackLink className={backLink} href='#accordion-example-summary-1'>
            「ダミーテキストとは何ですか？」の先頭に戻る
          </AccordionBackLink>
        </AccordionContent>
      </Accordion>

      <Accordion className={item}>
        <AccordionSummary className={summary} id='accordion-example-summary-2'>
          <h3>
            ダミーテキストがデザインやレイアウトに使用されていることがよくありますが、どのような目的や意味で使用されているのでしょうか？
          </h3>
        </AccordionSummary>
        <AccordionContent>
          これはダミーテキストです。ダミーテキストは、デザインやレイアウトの作成時に使用される仮の文章です。ダミーテキストを使用すると、デザインの全体像を評価したり、テキストの配置や長さを確認したりすることができます。ダミーテキストは実際の文章ではないので、内容には意味がありません。
          <AccordionBackLink className={backLink} href='#accordion-example-summary-2'>
            「ダミーテキストがデザインやレイアウトに使用されていることがよくありますが、どのような目的や意味で使用されているのでしょうか？」の先頭に戻る
          </AccordionBackLink>
        </AccordionContent>
      </Accordion>

      <Accordion className={item}>
        <AccordionSummary className={summary} id='accordion-example-summary-3'>
          <h3>ダミーテキストはどのような場合に使用されますか？</h3>
        </AccordionSummary>
        <AccordionContent>
          <p className={paragraph}>これはダミーテキストです。</p>
          <p className={paragraph}>
            ダミーテキストは、デザインやレイアウトの作成時に使用される仮の文章です。
          </p>
          <p>
            ダミーテキストを使用すると、デザインの全体像を評価したり、テキストの配置や長さを確認したりすることができます。
          </p>
          <AccordionBackLink className={backLink} href='#accordion-example-summary-3'>
            「ダミーテキストはどのような場合に使用されますか？」の先頭に戻る
          </AccordionBackLink>
        </AccordionContent>
      </Accordion>
    </div>
  ),
};

export const Open: Story = {
  name: '開いた状態',
  render: () => (
    <Accordion className={item} open={true}>
      <AccordionSummary className={summary}>
        <h3>ダミーテキストとは何ですか？</h3>
      </AccordionSummary>
      <AccordionContent>
        ダミーテキストは、デザインやレイアウトの作成時に使用される仮の文章です。
      </AccordionContent>
    </Accordion>
  ),
};
