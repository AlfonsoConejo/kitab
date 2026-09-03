const renderApiUrl = process.env.RENDER_API_URL?.replace(/\/$/, "");

if (!renderApiUrl) {
  throw new Error("RENDER_API_URL must be configured in Vercel.");
}

export const config = {
  rewrites: [
    {
      source: "/api/:path*",
      destination: `${renderApiUrl}/api/:path*`,
    },
    {
      source: "/(.*)",
      destination: "/index.html",
    },
  ],
};
