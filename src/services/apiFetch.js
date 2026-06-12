const API_URL = import.meta.env.VITE_API_URL;

export const apiFetch = async (url, options = {}) => {
  console.log("entramos");
  let response = await fetch(`${API_URL}${url}`, {
    ...options,
    credentials: "include",
  });

  console.log("Primer status:", response.status);

  if (response.status === 401) {
    const refreshResponse = await fetch(
      `${API_URL}/api/auth/refresh`,
      {
        method: "POST",
        credentials: "include",
      }
    );

    if (!refreshResponse.ok) {
      window.location.href = "/auth/login";
      throw new Error("SESSION_EXPIRED");
    }

    response = await fetch(`${API_URL}${url}`, {
      ...options,
      credentials: "include",
    });
  }

  return response;
};