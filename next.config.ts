import type { NextConfig } from "next";

const [owner = "", repository = ""] = (process.env.GITHUB_REPOSITORY ?? "").split("/");
const isGitHubPages = process.env.GITHUB_PAGES === "true";
const isUserSite = Boolean(owner && repository === `${owner}.github.io`);
const basePath = isGitHubPages && repository && !isUserSite ? `/${repository}` : "";
const siteOrigin = isGitHubPages && owner ? `https://${owner}.github.io` : "http://localhost:3000";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  poweredByHeader: false,
  images: {
    unoptimized: true,
  },
  basePath,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
    NEXT_PUBLIC_SITE_ORIGIN: siteOrigin,
  },
};

export default nextConfig;
