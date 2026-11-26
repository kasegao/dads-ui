import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { renderHook } from 'vitest-browser-react';
import {
  type UseProgressIndicatorAnnouncerProps,
  useProgressIndicatorAnnouncer,
} from './useProgressIndicatorAnnouncer';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

const setup = async (initialProps: UseProgressIndicatorAnnouncerProps) => {
  const hook = await renderHook((props) => useProgressIndicatorAnnouncer(props ?? initialProps), {
    initialProps,
  });
  const advance = (ms: number) => hook.act(() => vi.advanceTimersByTime(ms));

  return { ...hook, advance };
};

test('announces nothing while inactive', async () => {
  const { result, advance } = await setup({ active: false });

  await advance(20000);

  expect(result.current).toBe('');
});

test('announces the start, then clears the text', async () => {
  const { result, advance } = await setup({ active: true });

  expect(result.current).toBe('');
  await advance(100);
  expect(result.current).toBe('読み込みを開始しました');
  await advance(1000);
  expect(result.current).toBe('');
});

test('repeats the "still loading" message every interval', async () => {
  const { result, advance } = await setup({ active: true });

  await advance(5100);
  expect(result.current).toBe('読み込み中です');
  await advance(1000);
  expect(result.current).toBe('');
  await advance(4000);
  expect(result.current).toBe('読み込み中です');
});

test('includes the latest rounded value when one is given', async () => {
  const { result, advance, rerender } = await setup({ active: true, value: 10 });

  await advance(3000);
  await rerender({ active: true, value: 41.6 });
  await advance(2100);

  expect(result.current).toBe('42% 読み込みました。');
});

test('announces completion when it becomes inactive', async () => {
  const { result, advance, rerender } = await setup({ active: true });

  await advance(2000);
  await rerender({ active: false });
  await advance(100);
  expect(result.current).toBe('読み込みが完了しました');

  await advance(20000);
  expect(result.current).toBe('');
});

test('supports a custom interval and messages', async () => {
  const { result, advance } = await setup({
    active: true,
    value: 50,
    announceInterval: 2,
    messages: { start: '開始', longWithValue: '進捗 {value} パーセント' },
  });

  await advance(100);
  expect(result.current).toBe('開始');
  await advance(2000);
  expect(result.current).toBe('進捗 50 パーセント');
});

test('stops announcing after unmount', async () => {
  const { result, advance, unmount } = await setup({ active: true });

  await unmount();
  await advance(10000);

  expect(result.current).toBe('');
});
