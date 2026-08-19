import { createMMKV } from "react-native-mmkv";

export const storage = createMMKV();

export const KEYS = {
  ACCESS_TOKEN: "auth_access_token",
  REFRESH_TOKEN: "auth_refresh_token",
  USER: "auth_user_data",
} as const;

export const setAccessToken = (token: string) => {
  try {
    storage.set(KEYS.ACCESS_TOKEN, token);
  } catch (error) {
    console.error("[MMKV Error - setAccessToken]:", error);
  }
};

export const getAccessToken = (): string | undefined => {
  try {
    return storage.getString(KEYS.ACCESS_TOKEN);
  } catch (error) {
    console.error("[MMKV Error - getAccessToken]:", error);
    return undefined;
  }
};

export const setRefreshToken = (token: string) => {
  try {
    storage.set(KEYS.REFRESH_TOKEN, token);
  } catch (error) {
    console.error("[MMKV Error - setRefreshToken]:", error);
  }
};

export const getRefreshToken = (): string | undefined => {
  try {
    return storage.getString(KEYS.REFRESH_TOKEN);
  } catch (error) {
    console.error("[MMKV Error - getRefreshToken]:", error);
    return undefined;
  }
};

export const setUserData = (user: any) => {
  try {
    storage.set(KEYS.USER, JSON.stringify(user));
  } catch (error) {
    console.error("[MMKV Error - setUserData]:", error);
  }
};

export const getUserData = (): any | null => {
  try {
    const data = storage.getString(KEYS.USER);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("[MMKV Error - getUserData]:", error);
    return null;
  }
};

export const clearAuthStorage = () => {
  try {
    storage.remove(KEYS.ACCESS_TOKEN);
    storage.remove(KEYS.REFRESH_TOKEN);
    storage.remove(KEYS.USER);
  } catch (error) {
    console.error("[MMKV Error - clearAuthStorage]:", error);
  }
};
