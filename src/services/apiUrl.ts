// Production requests go through the Vercel /api rewrite so cookies are
// first-party. Local development continues to call the local API directly.
export const API_URL = import.meta.env.PROD ? "" : import.meta.env.VITE_API_URL;
