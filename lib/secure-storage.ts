import * as SecureStore from "expo-secure-store";
import type { StateStorage } from "zustand/middleware";

/**
 * Encrypted key-value storage (iOS Keychain / Android Keystore) for secrets
 * like auth tokens. Async by design — never store tokens in plaintext (MMKV /
 * AsyncStorage).
 */
export const secureStorage: StateStorage = {
  getItem: (name) => SecureStore.getItemAsync(name),
  setItem: (name, value) => SecureStore.setItemAsync(name, value),
  removeItem: (name) => SecureStore.deleteItemAsync(name),
};
