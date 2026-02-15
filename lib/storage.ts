// lib/storage.ts
import type { WebStorage } from "redux-persist";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";

const createNoopStorage = (): WebStorage => ({
  getItem: async () => null,
  setItem: async () => {},
  removeItem: async () => {},
});

export const storage =
  typeof window !== "undefined"
    ? createWebStorage("local")
    : createNoopStorage();
