import { beforeAll, expect, test, vi } from 'vitest';
import { type Locator, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import type { FileInfo, FileUploadProps } from './FileUpload';
import {
  FileUpload,
  FileUploadContext,
  FileUploadDropArea,
  FileUploadErrorList,
  FileUploadFileInfo,
  FileUploadFileItem,
  FileUploadFileList,
  FileUploadFileMarker,
  FileUploadFileMeta,
  FileUploadFileName,
  FileUploadInput,
  FileUploadRemoveButton,
  FileUploadTrigger,
  FileUploadViewportOverlay,
  FileUploadViewportOverlayMessage,
  formatFileSize,
  parseFileSize,
} from './FileUpload';

const Example = (props: FileUploadProps) => {
  const body = (
    <FileUploadContext>
      {({ files, errors, totalSize, isExpandedDropArea, setExpandedDropArea }) => (
        <>
          <FileUploadTrigger>ファイルを選択</FileUploadTrigger>
          {files.length > 0 && (
            <p data-testid='summary'>
              選択中：{files.length}個、{formatFileSize(totalSize)}
            </p>
          )}
          {errors.length > 0 && (
            <FileUploadErrorList data-testid='errors'>
              {errors.map((error) => (
                <li key={error}>＊{error}</li>
              ))}
            </FileUploadErrorList>
          )}
          {props.droppable && (
            <label>
              <input
                type='checkbox'
                checked={isExpandedDropArea}
                onChange={(event) => setExpandedDropArea(event.target.checked)}
              />
              範囲を広げる
            </label>
          )}
        </>
      )}
    </FileUploadContext>
  );

  return (
    <FileUpload data-testid='root' name='files' {...props}>
      <FileUploadInput data-testid='input' />
      {props.droppable ? (
        <FileUploadDropArea data-testid='drop-area'>{body}</FileUploadDropArea>
      ) : (
        body
      )}
      <FileUploadContext>
        {({ files }) =>
          files.length === 0 ? (
            <p>ファイルが選択されていません</p>
          ) : (
            <FileUploadFileList data-testid='file-list'>
              {files.map((file) => (
                <FileUploadFileItem key={file.id} file={file}>
                  <FileUploadFileMarker data-testid='marker' />
                  <FileUploadFileInfo data-testid='info'>
                    <p>
                      <FileUploadFileName />
                      <FileUploadFileMeta />
                    </p>
                    {file.errors?.map((error) => (
                      <p key={error}>＊{error}</p>
                    ))}
                  </FileUploadFileInfo>
                  <FileUploadRemoveButton />
                </FileUploadFileItem>
              ))}
            </FileUploadFileList>
          )
        }
      </FileUploadContext>
      <FileUploadViewportOverlay data-testid='overlay'>
        <FileUploadViewportOverlayMessage>
          このエリア内にファイルをドラッグ＆ドロップ
        </FileUploadViewportOverlayMessage>
      </FileUploadViewportOverlay>
    </FileUpload>
  );
};

const textOf = (locator: Locator) => locator.query()?.textContent ?? '';
const expectText = (locator: Locator, text: string) =>
  expect.poll(() => textOf(locator)).toContain(text);
const expectNoText = (locator: Locator, text: string) =>
  expect.poll(() => textOf(locator)).not.toContain(text);

// Chromium gives script-created DataTransfer items no file system entry, which Ark UI reads
// on drop. Real drops have one, so the tests supply a minimal file entry.
beforeAll(() => {
  const original = DataTransferItem.prototype.webkitGetAsEntry;
  DataTransferItem.prototype.webkitGetAsEntry = function () {
    return original.call(this) ?? ({ isFile: true, isDirectory: false } as FileSystemEntry);
  };
  return () => {
    DataTransferItem.prototype.webkitGetAsEntry = original;
  };
});

const createFile = (name: string, size: number, type = 'application/pdf') =>
  new File([new Uint8Array(size)], name, { type });

const fileItems = (screen: { getByTestId: (id: string) => Locator }) =>
  screen.getByTestId('file-list').getByRole('listitem');

const dataTransferOf = (files: File[]) => {
  const dataTransfer = new DataTransfer();
  for (const file of files) dataTransfer.items.add(file);
  return dataTransfer;
};

const dispatchDrag = (target: Element, type: string, files: File[]) => {
  target.dispatchEvent(
    new DragEvent(type, { bubbles: true, cancelable: true, dataTransfer: dataTransferOf(files) }),
  );
};

const drop = (target: Element, files: File[]) => {
  dispatchDrag(target, 'dragover', files);
  dispatchDrag(target, 'drop', files);
};

test('adds files through the file input and lists them', async () => {
  const onFilesChange = vi.fn();
  const screen = await render(<Example maxFiles={3} onFilesChange={onFilesChange} />);

  await expect.element(screen.getByText('ファイルが選択されていません')).toBeInTheDocument();
  const input = screen.getByTestId('input');
  await expect.element(input).toHaveAttribute('multiple');
  await expect.element(input).toHaveAttribute('name', 'files');

  await userEvent.upload(input, [createFile('a.pdf', 1024), createFile('b.pdf', 2048)]);

  await expectText(fileItems(screen).nth(0), 'a.pdf');
  await expectText(fileItems(screen).nth(0), '1KB（1,024バイト）');
  await expectText(fileItems(screen).nth(1), 'b.pdf');
  await expectText(screen.getByTestId('summary'), '選択中：2個、3KB');
  await expect.element(screen.getByText('ファイルが選択されていません')).not.toBeInTheDocument();
  await expect.element(screen.getByRole('button', { name: '解除 a.pdf' })).toBeInTheDocument();
  expect((input.element() as HTMLInputElement).files).toHaveLength(2);

  await vi.waitFor(() => expect(onFilesChange).toHaveBeenCalled());
  const details = onFilesChange.mock.lastCall?.[0];
  expect(details.files.map((file: FileInfo) => file.name)).toEqual(['a.pdf', 'b.pdf']);
  expect(details.errors).toEqual([]);
});

test('opens the file picker from the select button', async () => {
  const screen = await render(<Example droppable={true} maxFiles={3} />);
  const input = screen.getByTestId('input').element() as HTMLInputElement;
  const onClick = vi.fn((event: MouseEvent) => event.preventDefault());
  input.addEventListener('click', onClick);

  await screen.getByRole('button', { name: 'ファイルを選択' }).click();

  await vi.waitFor(() => expect(onClick).toHaveBeenCalledOnce());
});

test('removes files and moves focus to the next remove button, then to the select button', async () => {
  const screen = await render(<Example maxFiles={3} />);
  await userEvent.upload(screen.getByTestId('input'), [
    createFile('a.pdf', 1),
    createFile('b.pdf', 2),
    createFile('c.pdf', 3),
  ]);

  await screen.getByRole('button', { name: '解除 b.pdf' }).click();
  await expect.element(screen.getByRole('button', { name: '解除 b.pdf' })).not.toBeInTheDocument();
  await expect.element(screen.getByRole('button', { name: '解除 c.pdf' })).toHaveFocus();

  await userEvent.keyboard('{Enter}');
  await expect.element(screen.getByRole('button', { name: '解除 a.pdf' })).toHaveFocus();

  await userEvent.keyboard('{Enter}');
  await expect.element(screen.getByText('ファイルが選択されていません')).toBeInTheDocument();
  await expect.element(screen.getByRole('button', { name: 'ファイルを選択' })).toHaveFocus();
});

test('replaces the file in single-file mode', async () => {
  const screen = await render(<Example />);
  const input = screen.getByTestId('input');
  await expect.element(input).not.toHaveAttribute('multiple');

  await userEvent.upload(input, createFile('first.pdf', 10));
  await expectText(fileItems(screen), 'first.pdf');

  await userEvent.upload(input, createFile('second.pdf', 20));
  await expectText(fileItems(screen), 'second.pdf');
  expect(fileItems(screen).elements()).toHaveLength(1);
});

test('keeps invalid files in the list and reports errors', async () => {
  const screen = await render(
    <Example maxFiles={2} maxFileSize='1KB' maxTotalSize='3KB' accept='.pdf,image/*' />,
  );

  await userEvent.upload(screen.getByTestId('input'), [
    createFile('ok.pdf', 512),
    createFile('photo.png', 100, 'image/png'),
    createFile('big.pdf', 2048),
    createFile('note.txt', 1024, 'text/plain'),
  ]);

  const items = fileItems(screen);
  await expectText(items.nth(2), 'big.pdf');
  await expectText(items.nth(2), '＊ファイルサイズが上限を超過しています。');
  await expectText(items.nth(3), '＊許可されていないファイル形式です。');
  await expectNoText(items.nth(0), '＊');
  await expectNoText(items.nth(1), '＊');

  const errors = screen.getByTestId('errors');
  await expectText(
    errors,
    '＊選択したファイルにエラーがあります。該当ファイルをチェックしてください。',
  );
  await expectText(errors, '＊選択できるファイル数が上限を超過しています。');
  await expectText(errors, '＊選択できるファイルサイズの合計が上限を超過しています。');
  await expect.element(screen.getByTestId('root')).toHaveAttribute('data-has-error');

  await screen.getByRole('button', { name: '解除 big.pdf' }).click();
  await screen.getByRole('button', { name: '解除 note.txt' }).click();
  await expect.element(screen.getByTestId('errors')).not.toBeInTheDocument();
  await expect.element(screen.getByTestId('root')).not.toHaveAttribute('data-has-error');
});

test('applies the DADS error design', async () => {
  const screen = await render(<Example maxFiles={3} maxFileSize='1KB' droppable={true} />);
  await userEvent.upload(screen.getByTestId('input'), [
    createFile('ok.pdf', 10),
    createFile('big.pdf', 2048),
  ]);

  const info = getComputedStyle(screen.getByTestId('info').nth(1).element());
  expect(info.borderLeftWidth).toBe('4px');
  expect(info.borderLeftColor).toBe('rgb(236, 0, 0)');
  expect(info.color).toBe('rgb(236, 0, 0)');
  expect(getComputedStyle(screen.getByTestId('info').nth(0).element()).borderLeftWidth).toBe('0px');

  expect(getComputedStyle(screen.getByTestId('drop-area').element()).borderTopColor).toBe(
    'rgb(236, 0, 0)',
  );
  expect(
    getComputedStyle(screen.getByRole('button', { name: 'ファイルを選択' }).element())
      .borderTopColor,
  ).toBe('rgb(236, 0, 0)');
  expect(getComputedStyle(screen.getByTestId('errors').element()).color).toBe('rgb(206, 0, 0)');
});

test('applies the DADS drop area, button and list design', async () => {
  const screen = await render(<Example maxFiles={3} droppable={true} />);

  const area = getComputedStyle(screen.getByTestId('drop-area').element());
  expect(area.backgroundColor).toBe('rgb(242, 242, 242)');
  expect(area.borderTopColor).toBe('rgb(118, 118, 118)');
  expect(area.borderRadius).toBe('8px');
  expect(area.paddingTop).toBe('32px');

  const button = getComputedStyle(screen.getByRole('button', { name: 'ファイルを選択' }).element());
  expect(button.minHeight).toBe('48px');
  expect(button.color).toBe('rgb(0, 23, 193)');
  expect(button.borderTopColor).toBe('rgb(0, 23, 193)');
  expect(button.backgroundColor).toBe('rgb(255, 255, 255)');

  await userEvent.upload(screen.getByTestId('input'), createFile('a.pdf', 10));
  const marker = screen.getByTestId('marker').element();
  expect(getComputedStyle(marker).width).toBe('32px');
  expect(getComputedStyle(marker, '::before').content).toContain('counter(file-item)');
  const remove = getComputedStyle(screen.getByRole('button', { name: '解除 a.pdf' }).element());
  expect(remove.order).toBe('-1');
  expect(remove.minHeight).toBe('30px');
  expect(remove.minWidth).toBe('48px');
  expect(remove.fontSize).toBe('16px');
  expect(remove.textDecorationLine).toBe('underline');
});

test('uses a bullet marker in single-file mode', async () => {
  const screen = await render(<Example />);
  await userEvent.upload(screen.getByTestId('input'), createFile('a.pdf', 10));

  const marker = screen.getByTestId('marker').element();
  expect(getComputedStyle(marker).width).toBe('24px');
  expect(getComputedStyle(marker, '::before').width).toBe('6px');
  await expect.element(screen.getByTestId('root')).toHaveAttribute('data-multiple', 'false');
});

test('accepts files dropped on the drop area and highlights it while dragging', async () => {
  const screen = await render(<Example maxFiles={3} droppable={true} />);
  const area = screen.getByTestId('drop-area');
  const files = [createFile('dropped.pdf', 100)];

  dispatchDrag(area.element(), 'dragover', files);
  await expect.element(area).toHaveAttribute('data-dragging');
  await expect.element(screen.getByText('ここにドロップできます。')).toBeInTheDocument();
  const dragging = getComputedStyle(area.element());
  expect(dragging.backgroundColor).toBe('rgb(230, 245, 236)');
  expect(dragging.outlineWidth).toBe('4px');
  expect(
    getComputedStyle(screen.getByRole('button', { name: 'ファイルを選択' }).element())
      .backgroundColor,
  ).not.toBe('rgb(255, 255, 255)');

  dispatchDrag(area.element(), 'drop', files);
  await expectText(fileItems(screen), 'dropped.pdf');
  await expect.element(area).not.toHaveAttribute('data-dragging');
  await expect.element(screen.getByRole('button', { name: 'ファイルを選択' })).toHaveFocus();
});

test('accepts files dropped on the select button when there is no drop area', async () => {
  const screen = await render(<Example maxFiles={3} />);
  const button = screen.getByRole('button', { name: 'ファイルを選択' });

  drop(button.element(), [createFile('a.pdf', 1), createFile('b.pdf', 2)]);

  await expectText(fileItems(screen).nth(1), 'b.pdf');
});

test('takes the first file when several are dropped in single-file mode', async () => {
  const screen = await render(<Example droppable={true} />);

  drop(screen.getByTestId('drop-area').element(), [createFile('a.pdf', 1), createFile('b.pdf', 2)]);

  await expectText(fileItems(screen), 'a.pdf');
  expect(fileItems(screen).elements()).toHaveLength(1);
});

test('shows existing files and validates them together with new ones', async () => {
  const existing: FileInfo[] = [
    { id: 'file-abc', name: '運転免許証.jpg', size: 1887436 },
    {
      id: 'file-def',
      name: '健康保険証.pdf',
      size: 862208,
      errors: ['再アップロードが必要です。'],
    },
  ];
  const screen = await render(
    <Example maxFiles={3} maxTotalSize='3MB' defaultExistingFiles={existing} />,
  );

  await expectText(fileItems(screen).nth(0), '運転免許証.jpg');
  await expectText(fileItems(screen).nth(0), '1.8MB（1,887,436バイト）');
  await expectText(fileItems(screen).nth(1), '＊再アップロードが必要です。');

  await userEvent.upload(screen.getByTestId('input'), createFile('new.pdf', 1024 * 1024));
  await expectText(
    screen.getByTestId('errors'),
    '＊選択できるファイルサイズの合計が上限を超過しています。',
  );

  await screen.getByRole('button', { name: '解除 運転免許証.jpg' }).click();
  await expectText(fileItems(screen).nth(0), '健康保険証.pdf');
  await expectText(fileItems(screen).nth(1), 'new.pdf');
  await expect.element(screen.getByRole('button', { name: '解除 健康保険証.pdf' })).toHaveFocus();
});

test('expands the drop area to the whole window', async () => {
  const screen = await render(<Example maxFiles={3} droppable={true} />);
  const files = [createFile('anywhere.pdf', 10)];

  dispatchDrag(document.body, 'dragover', files);
  await expect.element(screen.getByTestId('overlay')).not.toBeInTheDocument();

  await screen.getByRole('checkbox', { name: '範囲を広げる' }).click();
  dispatchDrag(document.body, 'dragover', files);

  const overlay = screen.getByTestId('overlay');
  await expect.element(overlay).toBeVisible();
  const style = getComputedStyle(overlay.element());
  expect(style.position).toBe('fixed');
  expect(style.backgroundColor).toBe('rgb(230, 245, 236)');
  expect(style.borderTopWidth).toBe('4px');

  drop(overlay.element(), files);
  await expectText(fileItems(screen), 'anywhere.pdf');
  await expect.element(screen.getByTestId('overlay')).not.toBeInTheDocument();
});

test('disables the controls', async () => {
  const screen = await render(
    <Example
      maxFiles={3}
      disabled={true}
      defaultExistingFiles={[{ id: 'x', name: 'x.pdf', size: 1 }]}
    />,
  );

  await expect.element(screen.getByRole('button', { name: 'ファイルを選択' })).toBeDisabled();
  await expect.element(screen.getByRole('button', { name: '解除 x.pdf' })).toBeDisabled();
  await expect.element(screen.getByTestId('input')).toBeDisabled();
});

test('parses and formats file sizes', () => {
  expect(parseFileSize('5MB')).toBe(5 * 1024 * 1024);
  expect(parseFileSize('1.5kb')).toBe(1536);
  expect(parseFileSize(300)).toBe(300);
  expect(parseFileSize('abc')).toBeNull();
  expect(parseFileSize(undefined)).toBeNull();
  expect(formatFileSize(0)).toBe('0B');
  expect(formatFileSize(1023)).toBe('1023B');
  expect(formatFileSize(1887436)).toBe('1.8MB');
});
