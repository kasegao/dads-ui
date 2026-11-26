import { type RefObject, useEffect, useId, useRef } from 'react';

export type ModalDialogRequestCloseEvent = {
  defaultPrevented: boolean;
  preventDefault: () => void;
};

export type UseModalDialogOptions = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Called on Esc and on the close button. Call `event.preventDefault()` to keep it open. */
  onRequestClose?: (event: ModalDialogRequestCloseEvent) => void;
};

export type UseModalDialogResult = {
  dialogProps: {
    ref: RefObject<HTMLDialogElement | null>;
    'aria-labelledby': string;
  };
  headingProps: {
    ref: RefObject<HTMLHeadingElement | null>;
    id: string;
  };
  closeButtonProps: {
    onClick: () => void;
  };
};

/** Syncs `open` with the native `showModal()` / `close()` and routes Esc through `onRequestClose`. */
export const useModalDialog = (options: UseModalDialogOptions): UseModalDialogResult => {
  const { open, onOpenChange, onRequestClose } = options;
  const dialogRef = useRef<HTMLDialogElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const headingId = useId();

  const requestClose = () => {
    const event: ModalDialogRequestCloseEvent = {
      defaultPrevented: false,
      preventDefault() {
        this.defaultPrevented = true;
      },
    };
    onRequestClose?.(event);
    if (!event.defaultPrevented) onOpenChange(false);
  };

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      if (!dialog.open) {
        dialog.showModal();
        headingRef.current?.focus();
      }
    } else if (dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleCancel = (event: Event) => {
      event.preventDefault();
      requestClose();
    };
    // Covers closes that bypass the hook, e.g. `<form method="dialog">`.
    const handleClose = () => {
      if (open) onOpenChange(false);
    };

    dialog.addEventListener('cancel', handleCancel);
    dialog.addEventListener('close', handleClose);
    return () => {
      dialog.removeEventListener('cancel', handleCancel);
      dialog.removeEventListener('close', handleClose);
    };
  });

  return {
    dialogProps: { ref: dialogRef, 'aria-labelledby': headingId },
    headingProps: { ref: headingRef, id: headingId },
    closeButtonProps: { onClick: requestClose },
  };
};
