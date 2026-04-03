import { create } from 'zustand';

type AppState = {
  // Add global app state here
};

type AppActions = {
  // Add actions here
};

export const useAppStore = create<AppState & AppActions>(() => ({
  // initial state
}));
