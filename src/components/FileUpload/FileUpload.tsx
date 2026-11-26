import {
  FileUpload as ArkFileUpload,
  useFileUpload as useArkFileUpload,
  useFileUploadContext as useArkFileUploadContext,
} from '@ark-ui/react/file-upload';
import {
  type ComponentProps,
  createContext,
  type DragEvent,
  type MouseEvent,
  type ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { css, cva, cx } from '../../../styled-system/css';
import { Button } from '../Button';

export type FileInfo = {
  id: string;
  name: string;
  size: number;
  /** Missing for files that already exist on the server. */
  file?: File;
  isExisting?: boolean;
  errors?: string[];
};

export type FileUploadMessages = {
  error: {
    maxFiles: string;
    maxTotalSize: string;
    invalidType: string;
    maxFileSize: string;
    hasFileErrors: string;
  };
  announce: {
    dropAvailable: string;
    dropUnavailable: string;
  };
};

export const fileUploadDefaultMessages: FileUploadMessages = {
  error: {
    maxFiles: '選択できるファイル数が上限を超過しています。',
    maxTotalSize: '選択できるファイルサイズの合計が上限を超過しています。',
    invalidType: '許可されていないファイル形式です。',
    maxFileSize: 'ファイルサイズが上限を超過しています。',
    hasFileErrors: '選択したファイルにエラーがあります。該当ファイルをチェックしてください。',
  },
  announce: {
    dropAvailable: 'ここにドロップできます。',
    dropUnavailable: 'ドロップエリア外。',
  },
};

const SIZE_UNITS = ['B', 'KB', 'MB', 'GB'];

/** `1887436` → `1.8MB` */
export const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0B';
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), SIZE_UNITS.length - 1);
  return `${Number.parseFloat((bytes / 1024 ** index).toFixed(index > 0 ? 1 : 0))}${SIZE_UNITS[index]}`;
};

/** `'5MB'` → `5242880`. Numbers are taken as bytes. Returns `null` when not parseable. */
export const parseFileSize = (size: string | number | undefined) => {
  if (typeof size === 'number') return size;
  const match = size?.toLowerCase().match(/^(\d+(?:\.\d+)?)\s*(b|kb|mb|gb)?$/);
  if (!match) return null;
  return Math.floor(
    Number.parseFloat(match[1]) * 1024 ** SIZE_UNITS.indexOf((match[2] ?? 'b').toUpperCase()),
  );
};

const isFileTypeAllowed = (file: File, accept: string) => {
  const allowed = accept
    .split(',')
    .map((type) => type.trim().toLowerCase())
    .filter(Boolean);
  if (allowed.length === 0) return true;

  const extension = file.name.match(/\.([^.]+)$/)?.[1]?.toLowerCase();
  return allowed.some((type) => {
    if (type.endsWith('/*')) return file.type.startsWith(type.slice(0, -1));
    if (type.startsWith('.')) return extension !== undefined && `.${extension}` === type;
    return file.type === type;
  });
};

type ValidationOptions = {
  maxFiles: number;
  maxFileSizeBytes: number | null;
  maxTotalSizeBytes: number | null;
  accept: string;
  messages: FileUploadMessages;
};

/**
 * DADS keeps invalid files in the list and marks them, instead of rejecting them, so
 * validation runs over the whole selection rather than through Ark's accept / reject split.
 */
const validateFiles = (list: FileInfo[], options: ValidationOptions) => {
  const { maxFiles, maxFileSizeBytes, maxTotalSizeBytes, accept, messages } = options;

  const files = list.map((info) => {
    if (info.isExisting || !info.file) return info;
    const errors: string[] = [];
    if (!isFileTypeAllowed(info.file, accept)) errors.push(messages.error.invalidType);
    if (maxFileSizeBytes !== null && info.size > maxFileSizeBytes) {
      errors.push(messages.error.maxFileSize);
    }
    return { ...info, errors };
  });

  const totalSize = files.reduce((sum, file) => sum + file.size, 0);
  const errors: string[] = [];
  if (files.some((file) => file.errors && file.errors.length > 0)) {
    errors.push(messages.error.hasFileErrors);
  }
  if (files.length > maxFiles) errors.push(messages.error.maxFiles);
  if (maxTotalSizeBytes !== null && totalSize > maxTotalSizeBytes) {
    errors.push(messages.error.maxTotalSize);
  }

  return { files, errors, totalSize };
};

const fileIds = new WeakMap<File, string>();
let fileIdCount = 0;

const getFileId = (file: File) => {
  let id = fileIds.get(file);
  if (!id) {
    fileIdCount += 1;
    id = `dads-file-${fileIdCount}`;
    fileIds.set(file, id);
  }
  return id;
};

// Only one file upload at a time may use the whole window as its drop area.
let collapseActiveExpandedDropArea: (() => void) | null = null;

export type FileUploadContextValue = {
  /** Selected files (existing files first), each with its validation errors. */
  files: FileInfo[];
  /** Errors about the selection as a whole. */
  errors: string[];
  totalSize: number;
  hasError: boolean;
  isMultiple: boolean;
  maxFiles: number;
  maxFileSizeBytes: number | null;
  maxTotalSizeBytes: number | null;
  accept: string;
  droppable: boolean;
  disabled: boolean;
  isDragOver: boolean;
  isExpandedDropArea: boolean;
  setExpandedDropArea: (expanded: boolean) => void;
  showViewportOverlay: boolean;
  hideViewportOverlay: () => void;
  addFiles: (files: File[]) => void;
  removeFile: (id: string) => void;
  openFilePicker: () => void;
  messages: FileUploadMessages;
};

const FileUploadStateContext = createContext<FileUploadContextValue | null>(null);

/** State of the surrounding `FileUpload`. */
export const useFileUploadContext = () => {
  const context = useContext(FileUploadStateContext);
  if (!context) {
    throw new Error('FileUpload parts must be rendered inside <FileUpload>.');
  }
  return context;
};

export type FileUploadContextProps = {
  children: (context: FileUploadContextValue) => ReactNode;
};

/** Render prop access to the state of the surrounding `FileUpload`. */
export const FileUploadContext = (props: FileUploadContextProps) =>
  props.children(useFileUploadContext());

const root = css({
  color: 'solid-gray.800',
  textStyle: 'std-16N-170',
  overflowWrap: 'anywhere',
});

const announcer = css({ srOnly: true });

export type FileUploadProps = Omit<ComponentProps<'div'>, 'dir'> & {
  /** Maximum number of files. More than 1 enables multiple selection. */
  maxFiles?: number;
  /** Maximum size per file, e.g. `'5MB'` or a number of bytes. */
  maxFileSize?: string | number;
  /** Maximum total size, e.g. `'10MB'` or a number of bytes. */
  maxTotalSize?: string | number;
  /** Allowed file types in `accept` attribute format. */
  accept?: string;
  /** Whether a `FileUploadDropArea` is used. Without it the select button accepts drops. */
  droppable?: boolean;
  disabled?: boolean;
  required?: boolean;
  /** `name` of the file input. */
  name?: string;
  /** `id` of the file input, for `<label htmlFor>`. */
  inputId?: string;
  /** Files already uploaded to the server, shown as selected. */
  defaultExistingFiles?: FileInfo[];
  messages?: FileUploadMessages;
  onFilesChange?: (details: { files: FileInfo[]; errors: string[] }) => void;
};

/**
 * File upload with optional drag & drop. Files that break a limit stay in the list and are
 * reported through `useFileUploadContext()` / `FileUploadContext`.
 */
export const FileUpload = (props: FileUploadProps) => {
  const {
    children,
    className,
    maxFiles = 1,
    maxFileSize,
    maxTotalSize,
    accept = '',
    droppable = false,
    disabled = false,
    required,
    name,
    inputId,
    defaultExistingFiles,
    messages = fileUploadDefaultMessages,
    onFilesChange,
    ...rest
  } = props;

  const isMultiple = maxFiles > 1;
  const rootRef = useRef<HTMLDivElement>(null);
  const [existingFiles, setExistingFiles] = useState(defaultExistingFiles ?? []);
  const [isExpandedDropArea, setIsExpandedDropArea] = useState(false);
  const [showViewportOverlay, setShowViewportOverlay] = useState(false);
  const [announcement, setAnnouncement] = useState('');

  const api = useArkFileUpload({
    name,
    disabled,
    required,
    ids: inputId ? { hiddenInput: inputId } : undefined,
    // The limit is validated by `validateFiles`; Ark only needs to know single vs. multiple.
    maxFiles: isMultiple ? Number.POSITIVE_INFINITY : 1,
    onFileAccept: ({ files }) => {
      if (!isMultiple && files.length > 0) setExistingFiles([]);
    },
    onFileReject: ({ files }) => {
      // Several files dropped on a single-file upload: take the first one.
      const first = files[0];
      if (!isMultiple && first && files.every((item) => item.errors.includes('TOO_MANY_FILES'))) {
        api.setFiles([first.file]);
      }
    },
  });

  const maxFileSizeBytes = parseFileSize(maxFileSize);
  const maxTotalSizeBytes = parseFileSize(maxTotalSize);
  const { files, errors, totalSize } = validateFiles(
    [
      ...existingFiles.map((file) => ({ ...file, isExisting: true })),
      ...api.acceptedFiles.map((file) => ({
        id: getFileId(file),
        name: file.name,
        size: file.size,
        file,
      })),
    ],
    { maxFiles, maxFileSizeBytes, maxTotalSizeBytes, accept, messages },
  );

  const getTrigger = () =>
    rootRef.current?.querySelector<HTMLElement>('[data-file-upload-trigger]');

  // After a removal, focus moves to the next remove button, or to the select button.
  const focusIndexAfterRemoval = useRef<number | null>(null);
  const signature = files.map((file) => `${file.id}:${file.errors?.length ?? 0}`).join(',');
  const latest = useRef({ files, errors, onFilesChange });
  latest.current = { files, errors, onFilesChange };
  const isFirstRender = useRef(true);

  // biome-ignore lint/correctness/useExhaustiveDependencies: runs when the selection changes
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    latest.current.onFilesChange?.({
      files: latest.current.files,
      errors: latest.current.errors,
    });

    const index = focusIndexAfterRemoval.current;
    focusIndexAfterRemoval.current = null;
    if (index === null) return;
    const buttons = rootRef.current?.querySelectorAll<HTMLElement>('[data-file-upload-remove]');
    const target = buttons?.[Math.min(index, buttons.length - 1)] ?? getTrigger();
    target?.focus();
  }, [signature]);

  const isDragOver = api.dragging;
  const wasDragOver = useRef(false);
  useEffect(() => {
    if (isDragOver === wasDragOver.current) return;
    wasDragOver.current = isDragOver;
    setAnnouncement(
      isDragOver ? messages.announce.dropAvailable : messages.announce.dropUnavailable,
    );
    const timer = setTimeout(() => setAnnouncement(''), 1000);
    return () => clearTimeout(timer);
  }, [isDragOver, messages]);

  const collapse = useRef(() => setIsExpandedDropArea(false));
  useEffect(() => {
    const callback = collapse.current;
    return () => {
      if (collapseActiveExpandedDropArea === callback) collapseActiveExpandedDropArea = null;
    };
  }, []);

  useEffect(() => {
    if (!droppable || !isExpandedDropArea || disabled) return;
    const handleDragOver = (event: globalThis.DragEvent) => {
      if (!event.dataTransfer?.types.includes('Files')) return;
      event.preventDefault();
      setShowViewportOverlay(true);
    };
    document.documentElement.addEventListener('dragover', handleDragOver);
    return () => {
      document.documentElement.removeEventListener('dragover', handleDragOver);
      setShowViewportOverlay(false);
    };
  }, [droppable, isExpandedDropArea, disabled]);

  const context: FileUploadContextValue = {
    files,
    errors,
    totalSize,
    hasError: errors.length > 0,
    isMultiple,
    maxFiles,
    maxFileSizeBytes,
    maxTotalSizeBytes,
    accept,
    droppable,
    disabled,
    isDragOver,
    isExpandedDropArea,
    setExpandedDropArea: (expanded) => {
      setIsExpandedDropArea(expanded);
      if (expanded) {
        if (collapseActiveExpandedDropArea !== collapse.current) collapseActiveExpandedDropArea?.();
        collapseActiveExpandedDropArea = collapse.current;
      } else if (collapseActiveExpandedDropArea === collapse.current) {
        collapseActiveExpandedDropArea = null;
      }
    },
    showViewportOverlay,
    hideViewportOverlay: () => setShowViewportOverlay(false),
    addFiles: (added) => {
      const first = added[0];
      if (!first) return;
      api.setFiles(isMultiple ? [...api.acceptedFiles, ...added] : [first]);
      getTrigger()?.focus();
    },
    removeFile: (id) => {
      const index = files.findIndex((file) => file.id === id);
      const target = files[index];
      if (!target) return;
      focusIndexAfterRemoval.current = index;
      if (target.file) {
        api.deleteFile(target.file);
      } else {
        setExistingFiles((prev) => prev.filter((file) => file.id !== id));
      }
    },
    openFilePicker: api.openFilePicker,
    messages,
  };

  return (
    <FileUploadStateContext.Provider value={context}>
      <ArkFileUpload.RootProvider
        ref={rootRef}
        value={api}
        className={cx(root, className)}
        data-multiple={isMultiple}
        data-has-error={context.hasError || undefined}
        data-droppable={droppable || undefined}
        {...rest}
      >
        {children}
        <div className={announcer} aria-live='assertive'>
          {announcement}
        </div>
      </ArkFileUpload.RootProvider>
    </FileUploadStateContext.Provider>
  );
};

export type FileUploadInputProps = Omit<
  ComponentProps<'input'>,
  'type' | 'id' | 'name' | 'accept' | 'multiple'
>;

/** The visually hidden file input. `name`, `id` and `accept` are set through `FileUpload`. */
export const FileUploadInput = (props: FileUploadInputProps) => {
  const { accept } = useFileUploadContext();
  return <ArkFileUpload.HiddenInput accept={accept || undefined} {...props} />;
};

const dropArea = css({
  borderWidth: '1',
  borderStyle: 'solid',
  borderColor: 'solid-gray.536',
  borderRadius: '8',
  backgroundColor: 'solid-gray.50',
  padding: '32',
  '[data-has-error] &': { borderColor: 'error.1' },
  '&[data-dragging]': {
    outlineWidth: '4px',
    outlineStyle: 'solid',
    outlineColor: 'success.1',
    outlineOffset: '-4px',
    backgroundColor: 'green.50',
  },
});

export type FileUploadDropAreaProps = ComponentProps<'div'>;

/** Drag & drop area. Use together with `droppable` on `FileUpload`. */
export const FileUploadDropArea = (props: FileUploadDropAreaProps) => {
  const { className, onDrop, ...rest } = props;
  const api = useArkFileUploadContext();
  // A plain container: the select button inside is the keyboard / screen reader entry point.
  const {
    role: _role,
    'aria-label': _ariaLabel,
    tabIndex: _tabIndex,
    ...dropzoneProps
  } = api.getDropzoneProps({ disableClick: true });

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    dropzoneProps.onDrop?.(event);
    onDrop?.(event);
    event.currentTarget.querySelector<HTMLElement>('[data-file-upload-trigger]')?.focus();
  };

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: drop target; the button inside is the control
    <div {...dropzoneProps} className={cx(dropArea, className)} {...rest} onDrop={handleDrop} />
  );
};

const draggingTrigger = {
  backgroundColor: 'key.300',
  color: 'key.1200',
  textDecorationLine: 'underline',
} as const;

/** Additions to the outline `Button`: error border and the look while files are dragged over. */
const trigger = css({
  flexShrink: '0',
  '[data-has-error] &': { borderColor: 'error.1' },
  '[data-part=dropzone][data-dragging] &': { ...draggingTrigger },
  '&[data-dragging]': { ...draggingTrigger },
});

export type FileUploadTriggerProps = ComponentProps<'button'>;

/**
 * "ファイルを選択" button. Without a drop area (`droppable={false}`) files can be dropped
 * onto the button itself.
 */
export const FileUploadTrigger = (props: FileUploadTriggerProps) => {
  const { className, onClick, ...rest } = props;
  const { droppable, disabled } = useFileUploadContext();
  const api = useArkFileUploadContext();

  if (droppable) {
    return (
      <Button asChild={true} variant='outline' size='md' className={cx(trigger, className)}>
        <ArkFileUpload.Trigger data-file-upload-trigger='' onClick={onClick} {...rest} />
      </Button>
    );
  }

  // The button doubles as the drop zone, so it takes Ark's dropzone handlers. Its own
  // click already covers Enter / Space, and its content names it.
  const {
    role: _role,
    'aria-label': _ariaLabel,
    'aria-disabled': _ariaDisabled,
    tabIndex: _tabIndex,
    onKeyDown: _onKeyDown,
    onClick: openFilePicker,
    ...dropzoneProps
  } = api.getDropzoneProps();

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    openFilePicker?.(event);
  };

  return (
    <Button
      variant='outline'
      size='md'
      disabled={disabled}
      {...dropzoneProps}
      className={cx(trigger, className)}
      data-file-upload-trigger=''
      {...rest}
      onClick={handleClick}
    />
  );
};

const errorList = css({
  marginTop: '8',
  color: 'error.1',
  '[data-droppable] &': { color: 'error.2' },
});

export type FileUploadErrorListProps = ComponentProps<'ul'>;

/** List for the errors about the selection as a whole (`errors` of the context). */
export const FileUploadErrorList = (props: FileUploadErrorListProps) => {
  const { className, ...rest } = props;
  return <ul className={cx(errorList, className)} {...rest} />;
};

const fileList = css({
  marginTop: '16',
  counterReset: 'file-item',
});

export type FileUploadFileListProps = ComponentProps<'ul'>;

export const FileUploadFileList = (props: FileUploadFileListProps) => {
  const { className, ...rest } = props;
  return <ul className={cx(fileList, className)} {...rest} />;
};

const FileItemContext = createContext<FileInfo | null>(null);

const useFileItemContext = () => {
  const file = useContext(FileItemContext);
  if (!file) {
    throw new Error('This part must be rendered inside <FileUploadFileItem>.');
  }
  return file;
};

const fileItem = css({
  display: 'flex',
  alignItems: 'baseline',
  counterIncrement: 'file-item',
  '& + &': { marginTop: '4' },
});

export type FileUploadFileItemProps = ComponentProps<'li'> & {
  file: FileInfo;
};

export const FileUploadFileItem = (props: FileUploadFileItemProps) => {
  const { className, file, ...rest } = props;
  const hasError = Boolean(file.errors && file.errors.length > 0);

  return (
    <FileItemContext.Provider value={file}>
      <li
        className={cx(fileItem, className)}
        data-id={file.id}
        data-error={hasError || undefined}
        {...rest}
      />
    </FileItemContext.Provider>
  );
};

const fileMarker = cva({
  base: { flexShrink: '0' },
  variants: {
    multiple: {
      // Numbered list.
      true: {
        width: '32',
        _before: { content: 'counter(file-item) "."' },
      },
      // A single bullet.
      false: {
        display: 'flex',
        alignSelf: 'flex-start',
        alignItems: 'center',
        justifyContent: 'center',
        width: '24',
        height: '1.875rem',
        _before: {
          content: '""',
          width: '6',
          height: '6',
          borderRadius: 'full',
          backgroundColor: 'current',
          _forcedColors: { backgroundColor: 'CanvasText' },
        },
      },
    },
  },
});

export type FileUploadFileMarkerProps = ComponentProps<'div'>;

export const FileUploadFileMarker = (props: FileUploadFileMarkerProps) => {
  const { className, ...rest } = props;
  const { isMultiple } = useFileUploadContext();
  return <div className={cx(fileMarker({ multiple: isMultiple }), className)} {...rest} />;
};

const fileInfo = css({
  flex: '1',
  minWidth: '0',
  '[data-error] > &': {
    borderLeftWidth: '4',
    borderLeftStyle: 'solid',
    borderLeftColor: 'error.1',
    paddingLeft: '8',
    color: 'error.1',
  },
});

export type FileUploadFileInfoProps = ComponentProps<'div'>;

export const FileUploadFileInfo = (props: FileUploadFileInfoProps) => {
  const { className, ...rest } = props;
  return <div className={cx(fileInfo, className)} {...rest} />;
};

const fileName = css({
  marginRight: '16',
  fontWeight: '700',
});

export type FileUploadFileNameProps = ComponentProps<'span'>;

/** File name. Renders the name of the surrounding item's file when it has no children. */
export const FileUploadFileName = (props: FileUploadFileNameProps) => {
  const { className, children, ...rest } = props;
  const file = useFileItemContext();

  return (
    <span id={`${file.id}-name`} className={cx(fileName, className)} {...rest}>
      {children ?? file.name}
    </span>
  );
};

const fileMeta = css({
  color: 'solid-gray.600',
  '[data-error] &': { color: 'inherit' },
});

export type FileUploadFileMetaProps = ComponentProps<'span'>;

/** File size. Renders `1.8MB（1,887,436バイト）` when it has no children. */
export const FileUploadFileMeta = (props: FileUploadFileMetaProps) => {
  const { className, children, ...rest } = props;
  const file = useFileItemContext();

  return (
    <span className={cx(fileMeta, className)} {...rest}>
      {children ?? `${formatFileSize(file.size)}（${file.size.toLocaleString()}バイト）`}
    </span>
  );
};

/** Adjusts the xs text `Button` for the file list; `&&` wins over the Button's own size styles. */
const removeButton = css({
  order: '-1',
  flexShrink: '0',
  '&&': { minWidth: '48', minHeight: '1.875rem', fontSize: '16' },
});

export type FileUploadRemoveButtonProps = ComponentProps<'button'>;

/** "解除" button of a file item. It is named after the file, e.g. "解除 document.pdf". */
export const FileUploadRemoveButton = (props: FileUploadRemoveButtonProps) => {
  const { className, children = '解除', onClick, ...rest } = props;
  const file = useFileItemContext();
  const { removeFile, disabled } = useFileUploadContext();
  const id = `${file.id}-remove`;

  return (
    <Button
      id={id}
      variant='text'
      size='xs'
      className={cx(removeButton, className)}
      disabled={disabled}
      aria-labelledby={`${id} ${file.id}-name`}
      data-file-upload-remove=''
      {...rest}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) removeFile(file.id);
      }}
    >
      {children}
    </Button>
  );
};

const viewportOverlay = css({
  position: 'fixed',
  inset: '0',
  zIndex: '9999',
  borderWidth: '4',
  borderStyle: 'solid',
  borderColor: 'success.1',
  backgroundColor: 'green.50',
});

export type FileUploadViewportOverlayProps = ComponentProps<'div'>;

/**
 * Full-window drop area. It appears while files are dragged over the window and
 * `setExpandedDropArea(true)` is in effect.
 */
export const FileUploadViewportOverlay = (props: FileUploadViewportOverlayProps) => {
  const { className, onDragOver, onDragLeave, onDrop, ...rest } = props;
  const { showViewportOverlay, hideViewportOverlay, addFiles } = useFileUploadContext();

  if (!showViewportOverlay || typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    // biome-ignore lint/a11y/noStaticElementInteractions: drop target shown only while dragging
    <div
      className={cx(viewportOverlay, className)}
      {...rest}
      onDragOver={(event) => {
        event.preventDefault();
        event.stopPropagation();
        event.dataTransfer.dropEffect = 'copy';
        onDragOver?.(event);
      }}
      onDragLeave={(event) => {
        onDragLeave?.(event);
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          hideViewportOverlay();
        }
      }}
      onDrop={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onDrop?.(event);
        hideViewportOverlay();
        addFiles(Array.from(event.dataTransfer.files));
      }}
    />,
    document.body,
  );
};

const viewportOverlayMessage = css({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  alignContent: 'center',
  width: 'full',
  height: 'full',
  padding: 'calc(2rem - 4px)',
  fontSize: 'clamp(1.125rem, 0.75rem + 1.875vw, 3rem)',
  fontWeight: '700',
  pointerEvents: 'none',
});

export type FileUploadViewportOverlayMessageProps = ComponentProps<'div'>;

export const FileUploadViewportOverlayMessage = (props: FileUploadViewportOverlayMessageProps) => {
  const { className, ...rest } = props;
  return <div className={cx(viewportOverlayMessage, className)} {...rest} />;
};
