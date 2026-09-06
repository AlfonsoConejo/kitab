import { API_URL } from "@/services/apiUrl";
const REFRESH_LOCK_NAME = "kitab-auth-refresh";
const REFRESH_LOCK_STORAGE_KEY = "kitab-auth-refresh-lock";
const REFRESH_LOCK_TTL_MS = 10_000;
const REFRESH_LOCK_RETRY_MS = 50;

type RefreshLock = {
  owner: string;
  expiresAt: number;
};

type AuthChannelMessage =
  | {
      type: "refresh-result";
      outcome: RefreshOutcome;
    }
  | {
      type: "logout";
    }
  | {
      type: "login";
    };

const notifySessionExpired = () => {
  window.dispatchEvent(new Event("kitab:session-expired"));
};

const notifyAuthUnavailable = () => {
  window.dispatchEvent(new Event("kitab:auth-unavailable"));
};

type RefreshOutcome = "refreshed" | "invalid" | "unavailable";
type AccessTokenStatus = "valid" | "invalid" | "unavailable";

const tabId = crypto.randomUUID();

const refreshChannel =
  typeof BroadcastChannel === "undefined"
    ? null
    : new BroadcastChannel("kitab-auth");

refreshChannel?.addEventListener(
  "message",
  (event: MessageEvent<AuthChannelMessage>) => {
    if (event.data?.type === "refresh-result") {
      if (event.data.outcome === "invalid") {
        notifySessionExpired();
      }

      if (event.data.outcome === "unavailable") {
        notifyAuthUnavailable();
      }
    }

    if (event.data?.type === "logout") {
      window.dispatchEvent(new Event("kitab:remote-logout"));
    }

    if (event.data?.type === "login") {
      window.dispatchEvent(new Event("kitab:remote-login"));
    }
  },
);

export const notifyOtherTabsOfLogout = (): void => {
  refreshChannel?.postMessage({ type: "logout" });
};

export const notifyOtherTabsOfLogin = (): void => {
  refreshChannel?.postMessage({ type: "login" });
};

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

const hasValidAccessToken = async (): Promise<AccessTokenStatus> => {
  try {
    const response = await fetch(`${API_URL}/api/auth/me`, {
      credentials: "include",
    });

    if (response.ok) return "valid";
    if (response.status === 401) return "invalid";

    return "unavailable";
  } catch {
    return "unavailable";
  }
};

// All requests that receive a 401 share the same refresh operation. This
// prevents concurrent requests from rotating the same refresh token twice.
let refreshPromise: Promise<RefreshOutcome> | null = null;

const requestRefresh = async (): Promise<RefreshOutcome> => {
  try {
    const response = await fetch(`${API_URL}/api/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });

    if (response.ok) return "refreshed";
    if (response.status === 401) return "invalid";

    return "unavailable";
  } catch {
    return "unavailable";
  }
};

const refreshAccessToken = (): Promise<RefreshOutcome> => {
  if (!refreshPromise) {
    refreshPromise = withRefreshLock(async () => {
      const accessTokenStatus = await hasValidAccessToken();

      if (accessTokenStatus === "valid") {
        return "refreshed";
      }

      if (accessTokenStatus === "unavailable") {
        refreshChannel?.postMessage({
          type: "refresh-result",
          outcome: "unavailable",
        });
        return "unavailable";
      }

      const outcome = await requestRefresh();
      refreshChannel?.postMessage({ type: "refresh-result", outcome });
      return outcome;
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
  let response: Response;

  try {
    response = await fetch(`${API_URL}${url}`, {
      ...options,
      credentials: "include",
    });
  } catch (error) {
    notifyAuthUnavailable();
    throw error;
  }

  if (response.status === 401) {
    const refreshOutcome = await refreshAccessToken();

    if (refreshOutcome === "invalid") {
      notifySessionExpired();
      throw new Error("SESSION_EXPIRED");
    }

    if (refreshOutcome === "unavailable") {
      notifyAuthUnavailable();
      throw new Error("AUTH_SERVICE_UNAVAILABLE");
    }

    try {
      response = await fetch(`${API_URL}${url}`, {
        ...options,
        credentials: "include",
      });
    } catch (error) {
      notifyAuthUnavailable();
      throw error;
    }

    if (response.status === 401) {
      notifySessionExpired();
      throw new Error("SESSION_EXPIRED");
    }
  }

  return response;
};
