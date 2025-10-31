import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Proxy agora é feito via API Route em app/api/[...path]/route.ts
  // Isso mantém os cookies de autenticação
};

export default nextConfig;
