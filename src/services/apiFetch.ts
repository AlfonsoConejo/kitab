const API_URL = import.meta.env.VITE_API_URL;

const notifySessionExpired = () => {
  window.dispatchEvent(new Event("kitab:session-expired"));
};

// All requests that receive a 401 share the same refresh operation. This
// prevents concurrent requests from rotating the same refresh token twice.
let refreshPromise: Promise<boolean> | null = null;

const refreshAccessToken = (): Promise<boolean> => {
  if (!refreshPromise) {
    refreshPromise = fetch(`${API_URL}/api/auth/refresh`, {
      method: "POST",
      credentials: "include",
    })
      .then((response) => response.ok)
      .catch(() => false)
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
