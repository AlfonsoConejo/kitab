import { API_URL } from "@/services/apiUrl";
const REFRESH_LOCK_NAME = "kitab-auth-refresh";
const REFRESH_LOCK_STORAGE_KEY = "kitab-auth-refresh-lock";
const REFRESH_LOCK_TTL_MS = 10_000;
const REFRESH_LOCK_RETRY_MS = 50;

type RefreshLock = {
  owner: string;
  expiresAt: number;
};

type RefreshChannelMessage = {
  type: "refresh-result";
  success: boolean;
};

const notifySessionExpired = () => {
  window.dispatchEvent(new Event("kitab:session-expired"));
};

const tabId = crypto.randomUUID();

const refreshChannel =
  typeof BroadcastChannel === "undefined"
    ? null
    : new BroadcastChannel("kitab-auth");

refreshChannel?.addEventListener(
  "message",
  (event: MessageEvent<RefreshChannelMessage>) => {
    if (event.data?.type === "refresh-result" && !event.data.success) {
      notifySessionExpired();
    }
  },
);

const wait = (duration: number): Promise<void> =>
  new Promise((resolve) => window.setTimeout(resolve, duration));

const readRefreshLock = (): RefreshLock | null => {
  const rawLock = localStorage.getItem(REFRESH_LOCK_STORAGE_KEY);

  if (!rawLock) return null;

  try {
    const lock = JSON.parse(rawLock) as RefreshLock;
    return typeof lock.owner === "string" && typeof lock.expiresAt === "number"
      ? lock
      : null;
  } catch {
    return null;
  }
};

const withLocalStorageLock = async <T>(
  callback: () => Promise<T>,
): Promise<T> => {
  let ownsLock = false;

  while (!ownsLock) {
    const now = Date.now();
    const currentLock = readRefreshLock();

    if (!currentLock || currentLock.expiresAt <= now) {
      const lock: RefreshLock = {
        owner: tabId,
        expiresAt: now + REFRESH_LOCK_TTL_MS,
      };

      localStorage.setItem(REFRESH_LOCK_STORAGE_KEY, JSON.stringify(lock));
      ownsLock = readRefreshLock()?.owner === tabId;
    }

    if (!ownsLock) {
      await wait(REFRESH_LOCK_RETRY_MS);
    }
  }

  try {
    return await callback();
  } finally {
    if (readRefreshLock()?.owner === tabId) {
      localStorage.removeItem(REFRESH_LOCK_STORAGE_KEY);
    }
  }
};

const withRefreshLock = async <T>(
  callback: () => Promise<T>,
): Promise<T> => {
  if (navigator.locks) {
    return navigator.locks.request(REFRESH_LOCK_NAME, { mode: "exclusive" }, callback);
  }

  return withLocalStorageLock(callback);
};

const hasValidAccessToken = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/api/auth/me`, {
      credentials: "include",
    });

    return response.ok;
  } catch {
    return false;
  }
};

// All requests that receive a 401 share the same refresh operation. This
// prevents concurrent requests from rotating the same refresh token twice.
let refreshPromise: Promise<boolean> | null = null;

const requestRefresh = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/api/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });

    return response.ok;
  } catch {
    return false;
  }
};

const refreshAccessToken = (): Promise<boolean> => {
  if (!refreshPromise) {
    refreshPromise = withRefreshLock(async () => {
      if (await hasValidAccessToken()) {
        return true;
      }

      const refreshed = await requestRefresh();
      refreshChannel?.postMessage({ type: "refresh-result", success: refreshed });
      return refreshed;
    })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

export const apiFetch = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  let response = await fetch(`${API_URL}${url}`, {
    ...options,
    credentials: "include",
  });

  if (response.status === 401) {
    const refreshed = await refreshAccessToken();

    if (!refreshed) {
      notifySessionExpired();
      throw new Error("SESSION_EXPIRED");
    }

    response = await fetch(`${API_URL}${url}`, {
      ...options,
      credentials: "include",
    });

    if (response.status === 401) {
      notifySessionExpired();
      throw new Error("SESSION_EXPIRED");
    }
  }

  return response;
};
