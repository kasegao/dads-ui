import { type RefObject, useEffect, useId, useRef } from 'react';

export type UseDrawerOptions = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export type UseDrawerResult = {
  drawerProps: {
    ref: RefObject<HTMLDialogElement | null>;
    id: string;
    'aria-labelledby': string;
  };
  headingProps: { id: string };
  triggerProps: {
    'aria-haspopup': 'dialog';
    'aria-controls': string;
    onClick: () => void;
  };
  closeButtonProps: { onClick: () => void };
};

/** Syncs `open` with the native `showModal()` / `close()` of the drawer's `<dialog>`. */
export const useDrawer = (options: UseDrawerOptions): UseDrawerResult => {
  const { open, onOpenChange } = options;
  const drawerRef = useRef<HTMLDialogElement>(null);
  const id = useId();
  const headingId = `${id}-heading`;

  useEffect(() => {
    const drawer = drawerRef.current;
    if (!drawer) return;

    if (open) {
      if (!drawer.open) drawer.showModal();
    } else if (drawer.open) {
      drawer.close();
    }
  }, [open]);

  useEffect(() => {
    const drawer = drawerRef.current;
    if (!drawer) return;

    // Esc and `<form method="dialog">` close the dialog natively; mirror that into state.
    const handleClose = () => {
      if (open) onOpenChange(false);
    };

    drawer.addEventListener('close', handleClose);
    return () => drawer.removeEventListener('close', handleClose);
  });

  return {
    drawerProps: { ref: drawerRef, id, 'aria-labelledby': headingId },
    headingProps: { id: headingId },
    triggerProps: {
      'aria-haspopup': 'dialog',
      'aria-controls': id,
      onClick: () => onOpenChange(true),
    },
    closeButtonProps: { onClick: () => onOpenChange(false) },
  };
};
