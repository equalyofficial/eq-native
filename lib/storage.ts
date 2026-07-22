import { createMMKV } from "react-native-mmkv";
import type { StateStorage } from "zustand/middleware";

/** Fast, synchronous key-value store for non-secret data (prefs, caches). */
export const mmkv = createMMKV({ id: "equaly-app" });

/** zustand persist adapter backed by MMKV. */
export const mmkvStorage: StateStorage = {
  getItem: (name) => mmkv.getString(name) ?? null,
  setItem: (name, value) => mmkv.set(name, value),
  removeItem: (name) => mmkv.remove(name),
};

/** Synchronous Storage for the TanStack Query persister (offline cache). */
export const queryPersisterStorage = {
  getItem: (key: string) => mmkv.getString(key) ?? null,
  setItem: (key: string, value: string) => mmkv.set(key, value),
  removeItem: (key: string) => mmkv.remove(key),
};
