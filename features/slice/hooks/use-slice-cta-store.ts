import { create } from 'zustand';

type SliceCTAStore = {
  isActive: boolean;
  onPress: (() => void) | null;
  activate: (onPress: () => void) => void;
  deactivate: () => void;
};

export const useSliceCTAStore = create<SliceCTAStore>((set) => ({
  isActive: false,
  onPress: null,
  activate: (onPress) => set({ isActive: true, onPress }),
  deactivate: () => set({ isActive: false, onPress: null }),
}));
