import { useEffect, useRef, useState } from 'react';

const DEFAULT_ANNOUNCE_INTERVAL_SEC = 5;

export type ProgressIndicatorAnnouncerMessages = {
  start?: string;
  end?: string;
  long?: string;
  /** `{value}` is replaced with the rounded progress value. */
  longWithValue?: string;
};

const defaultMessages: Required<ProgressIndicatorAnnouncerMessages> = {
  start: '読み込みを開始しました',
  end: '読み込みが完了しました',
  long: '読み込み中です',
  longWithValue: '{value}% 読み込みました。',
};

export type UseProgressIndicatorAnnouncerProps = {
  active: boolean;
  value?: number;
  /** Seconds until the first "still loading" announcement and between repeats. Defaults to 5. */
  announceInterval?: number;
  messages?: ProgressIndicatorAnnouncerMessages;
};

const format = (template: string, variables: Record<string, string | number>) =>
  template.replace(/\{(\w+)\}/g, (match, key) =>
    variables[key] !== undefined ? String(variables[key]) : match,
  );

/**
 * Returns the text to announce to screen readers while a progress indicator is active.
 * Render it inside a visually hidden `role="status"` element.
 */
export const useProgressIndicatorAnnouncer = (props: UseProgressIndicatorAnnouncerProps) => {
  const { active, value, announceInterval, messages } = props;
  const [text, setText] = useState('');

  const valueRef = useRef(value);
  valueRef.current = value;

  const messagesRef = useRef(messages);
  messagesRef.current = messages;

  const previousActiveRef = useRef(false);

  useEffect(() => {
    const getMessage = (key: keyof ProgressIndicatorAnnouncerMessages) =>
      messagesRef.current?.[key] ?? defaultMessages[key];

    const timers: number[] = [];

    // Set the text after a tick and clear it again so repeated messages are re-announced.
    const announce = (nextText: string) => {
      const showTimer = window.setTimeout(() => {
        setText(nextText);
        timers.push(window.setTimeout(() => setText(''), 1000));
      }, 100);
      timers.push(showTimer);
    };

    const announceLong = () => {
      const currentValue = valueRef.current;
      if (currentValue !== undefined && Number.isFinite(currentValue)) {
        announce(format(getMessage('longWithValue'), { value: Math.round(currentValue) }));
      } else {
        announce(getMessage('long'));
      }
    };

    const wasActive = previousActiveRef.current;
    previousActiveRef.current = active;

    if (active) {
      if (!wasActive) announce(getMessage('start'));

      const intervalMs =
        (announceInterval && announceInterval > 0
          ? announceInterval
          : DEFAULT_ANNOUNCE_INTERVAL_SEC) * 1000;

      const longTimer = window.setTimeout(() => {
        announceLong();
        timers.push(window.setInterval(announceLong, intervalMs));
      }, intervalMs);
      timers.push(longTimer);
    } else if (wasActive) {
      announce(getMessage('end'));
    }

    return () => {
      for (const id of timers) {
        window.clearTimeout(id);
        window.clearInterval(id);
      }
    };
  }, [active, announceInterval]);

  return text;
};
