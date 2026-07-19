import { create } from 'zustand';

export type SplitType = 'equal' | 'percentage' | 'custom';

export type SliceFlowState = {
  amount: string;
  category: string;
  description: string;
  date: Date;
  groupId: string | null;
  selectedMemberIds: string[];
  splitType: SplitType;
  percentages: Record<string, number>;
  customAmounts: Record<string, number>;
  billImageUri: string | null;
};

type SliceFlowActions = {
  initFlow: (amount: string, category: string) => void;
  setCategory: (category: string) => void;
  setDescription: (description: string) => void;
  setDate: (date: Date) => void;
  setGroupId: (groupId: string | null) => void;
  toggleMember: (memberId: string) => void;
  setSelectedMembers: (memberIds: string[]) => void;
  setSplitType: (type: SplitType) => void;
  setPercentage: (memberId: string, percentage: number) => void;
  setCustomAmount: (memberId: string, amount: number) => void;
  setBillImage: (uri: string | null) => void;
  resetFlow: () => void;
};

const initialState: SliceFlowState = {
  amount: '0',
  category: 'food_and_dining',
  description: '',
  date: new Date(),
  groupId: null,
  selectedMemberIds: [],
  splitType: 'equal',
  percentages: {},
  customAmounts: {},
  billImageUri: null,
};

export const useSliceFlowStore = create<SliceFlowState & SliceFlowActions>(
  (set) => ({
    ...initialState,

    initFlow: (amount, category) =>
      set({ ...initialState, amount, category, date: new Date() }),

    setCategory: (category) => set({ category }),
    setDescription: (description) => set({ description }),
    setDate: (date) => set({ date }),
    setGroupId: (groupId) => set({ groupId }),
    toggleMember: (memberId) =>
      set((s) => ({
        selectedMemberIds: s.selectedMemberIds.includes(memberId)
          ? s.selectedMemberIds.filter((id) => id !== memberId)
          : [...s.selectedMemberIds, memberId],
      })),
    setSelectedMembers: (memberIds) => set({ selectedMemberIds: memberIds }),
    setSplitType: (splitType) => set({ splitType }),
    setPercentage: (memberId, percentage) =>
      set((s) => ({ percentages: { ...s.percentages, [memberId]: percentage } })),
    setCustomAmount: (memberId, amount) =>
      set((s) => ({ customAmounts: { ...s.customAmounts, [memberId]: amount } })),
    setBillImage: (uri) => set({ billImageUri: uri }),
    resetFlow: () => set({ ...initialState, date: new Date() }),
  }),
);
