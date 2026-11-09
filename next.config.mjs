/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,

  // Basic security headers on every response. None of them blocks anything
  // the site uses: it isn't framed, uses no camera, microphone or location,
  // and loads its own fonts, videos and scripts. (A static export ignores
  // this; there, set the same headers in Cloudflare.)
  headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
