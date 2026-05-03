import { create } from "zustand";

export interface ConfirmOptions {
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
}

interface PendingConfirm extends ConfirmOptions {
  id: string;
  resolve: (value: boolean) => void;
}

interface ConfirmStore {
  pending: PendingConfirm | null;
  open: (opts: ConfirmOptions) => Promise<boolean>;
  resolve: (value: boolean) => void;
}

export const useConfirmStore = create<ConfirmStore>((set, get) => ({
  pending: null,
  open: (opts) =>
    new Promise<boolean>((resolve) => {
      set({
        pending: {
          ...opts,
          id: `c-${Date.now().toString(36)}`,
          resolve,
        },
      });
    }),
  resolve: (value) => {
    const p = get().pending;
    if (!p) return;
    p.resolve(value);
    set({ pending: null });
  },
}));

export function confirmDialog(opts: ConfirmOptions): Promise<boolean> {
  return useConfirmStore.getState().open(opts);
}
