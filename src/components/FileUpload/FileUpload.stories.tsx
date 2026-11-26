import type { Meta, StoryObj } from '@storybook/react-vite';
import { useId } from 'react';
import { css } from '../../../styled-system/css';
import type { FileUploadProps } from './FileUpload';
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
  fileUploadDefaultMessages,
  formatFileSize,
  parseFileSize,
} from './FileUpload';

const meta = {
  title: 'Components/ファイルアップロード／ドロップエリア',
  component: FileUpload,
  tags: ['autodocs'],
  argTypes: {
    maxFiles: { control: { type: 'number', min: 1 } },
    maxFileSize: { control: 'text' },
    maxTotalSize: { control: 'text' },
    accept: { control: 'text' },
    droppable: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof FileUpload>;

export default meta;
type Story = StoryObj<typeof meta>;

const field = css({ display: 'flex', flexDirection: 'column', gap: '8' });
const label = css({ textStyle: 'std-17B-170', color: 'solid-gray.800' });
const supportText = css({ textStyle: 'std-16N-170', color: 'solid-gray.600' });
const buttonArea = css({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  columnGap: '16',
  rowGap: '8',
});
const dropHint = css({ flexGrow: '1', width: '0', minWidth: '12em' });
const summary = css({ marginTop: '8' });
const emptyText = css({ marginTop: '16' });
const expandOption = css({
  display: 'flex',
  alignItems: 'center',
  columnGap: '8',
  marginTop: '48',
  marginBottom: '-16px',
  width: 'fit',
  cursor: 'pointer',
});
const expandCheckbox = css({ width: '24', height: '24', accentColor: 'key.900' });
const inlineBlock = css({ display: 'inline-block' });

const documentAccept = '.png,.jpg,.jpeg,.gif,.xlsx,.xls,.docx,.doc,.pptx,.ppt,.pdf';

const messages = {
  ...fileUploadDefaultMessages,
  error: {
    ...fileUploadDefaultMessages.error,
    invalidType:
      'PNG/JPEG/GIF形式の画像、Excel/Word/PowerPoint/PDF形式のドキュメントだけが選択できます。',
  },
};

type ExampleProps = FileUploadProps & {
  /** Show the checkbox that widens the drop area to the whole window. */
  dropAreaExpandable?: boolean;
};

const Example = (props: ExampleProps) => {
  const { dropAreaExpandable = false, droppable = false, ...rest } = props;
  const inputId = useId();
  const supportTextId = useId();
  const summaryId = useId();
  const errorsId = useId();

  const controls = (
    <FileUploadContext>
      {({ files, errors, totalSize, isExpandedDropArea, setExpandedDropArea }) => (
        <>
          <div className={buttonArea}>
            <FileUploadTrigger aria-describedby={`${summaryId} ${errorsId} ${supportTextId}`}>
              ファイルを選択
            </FileUploadTrigger>
            {droppable && <p className={dropHint}>または、このエリア内にドラッグ＆ドロップ</p>}
          </div>
          {files.length > 0 && (
            <p id={summaryId} className={summary}>
              選択中：{files.length}個、{formatFileSize(totalSize)}（{totalSize.toLocaleString()}
              バイト）
            </p>
          )}
          {errors.length > 0 && (
            <FileUploadErrorList id={errorsId}>
              {errors.map((error) => (
                <li key={error}>＊{error}</li>
              ))}
            </FileUploadErrorList>
          )}
          {droppable && dropAreaExpandable && (
            <label className={expandOption}>
              <input
                className={expandCheckbox}
                type='checkbox'
                checked={isExpandedDropArea}
                onChange={(event) => setExpandedDropArea(event.target.checked)}
              />
              ドラッグ＆ドロップの範囲をこのブラウザウィンドウ全体に広げる
            </label>
          )}
        </>
      )}
    </FileUploadContext>
  );

  const fileList = (
    <FileUploadContext>
      {({ files }) =>
        files.length === 0 ? (
          <p className={emptyText}>ファイルが選択されていません</p>
        ) : (
          <FileUploadFileList>
            {files.map((file) => (
              <FileUploadFileItem key={file.id} file={file}>
                {file.isExisting && (
                  <input type='hidden' name='file-upload-existing' value={file.id} />
                )}
                <FileUploadFileMarker />
                <FileUploadFileInfo>
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
  );

  const maxFileSizeBytes = parseFileSize(rest.maxFileSize);
  const maxTotalSizeBytes = parseFileSize(rest.maxTotalSize);

  return (
    <div className={field}>
      <label className={label} htmlFor={inputId}>
        参照する画像・ドキュメント
      </label>
      <p id={supportTextId} className={supportText}>
        対応ファイル：PNG/JPEG/GIF形式の画像、Excel/Word/PowerPoint/PDF形式のドキュメント
        <br />
        {rest.maxFiles ?? 1}ファイルまで選択可能。
        {maxFileSizeBytes !== null &&
          `1ファイルあたり${rest.maxFileSize}（${maxFileSizeBytes.toLocaleString()}バイト）まで`}
        {maxFileSizeBytes !== null && maxTotalSizeBytes !== null && '、'}
        {maxTotalSizeBytes !== null &&
          `合計${rest.maxTotalSize}（${maxTotalSizeBytes.toLocaleString()}バイト）まで`}
      </p>
      <FileUpload {...rest} droppable={droppable} inputId={inputId} messages={messages}>
        <FileUploadInput />
        {droppable ? <FileUploadDropArea>{controls}</FileUploadDropArea> : controls}
        {fileList}
        <FileUploadViewportOverlay>
          <FileUploadViewportOverlayMessage>
            <span className={inlineBlock}>このエリア内にファイルを</span>
            <span className={inlineBlock}>ドラッグ＆ドロップ</span>
          </FileUploadViewportOverlayMessage>
        </FileUploadViewportOverlay>
      </FileUpload>
    </div>
  );
};

const limits = {
  maxFiles: 5,
  maxFileSize: '5MB',
  maxTotalSize: '10MB',
  accept: documentAccept,
  name: 'file-upload',
} satisfies FileUploadProps;

export const Playground: Story = {
  args: { ...limits, droppable: true, disabled: false },
  render: (args) => <Example {...args} dropAreaExpandable={true} />,
};

export const NonExpandable: Story = {
  name: 'ドロップエリアの拡張なし',
  args: { ...limits, droppable: true },
  render: (args) => <Example {...args} />,
};

export const WithoutDropArea: Story = {
  name: 'ドロップエリアなし',
  args: { ...limits, droppable: false },
  render: (args) => <Example {...args} />,
};

export const SingleFile: Story = {
  name: '単一ファイル',
  args: { ...limits, maxFiles: 1, maxTotalSize: undefined, droppable: true },
  render: (args) => <Example {...args} />,
};

export const WithExistingFiles: Story = {
  name: 'アップロード済みファイルあり',
  args: {
    ...limits,
    droppable: true,
    defaultExistingFiles: [
      { id: 'file-abc123', name: '運転免許証_表面.jpg', size: 1887436 },
      { id: 'file-def456', name: '健康保険証.pdf', size: 862208 },
      { id: 'file-ghi789', name: 'マイナンバーカード_両面.pdf', size: 2411724 },
    ],
  },
  render: (args) => <Example {...args} dropAreaExpandable={true} />,
};

export const WithError: Story = {
  name: 'エラー',
  args: {
    ...limits,
    maxFiles: 2,
    droppable: true,
    defaultExistingFiles: [
      { id: 'file-error-1', name: '運転免許証_表面.jpg', size: 1887436 },
      {
        id: 'file-error-2',
        name: '住民票.heic',
        size: 6501171,
        errors: [messages.error.invalidType, messages.error.maxFileSize],
      },
      { id: 'file-error-3', name: '健康保険証.pdf', size: 862208 },
    ],
  },
  render: (args) => <Example {...args} />,
};

export const Disabled: Story = {
  name: '無効',
  args: {
    ...limits,
    droppable: true,
    disabled: true,
    defaultExistingFiles: [{ id: 'file-disabled-1', name: '運転免許証_表面.jpg', size: 1887436 }],
  },
  render: (args) => <Example {...args} />,
};
