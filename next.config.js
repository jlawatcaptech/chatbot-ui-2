const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true"
});

const withPWA = require("next-pwa")({
  dest: "public"
});



module.exports = withBundleAnalyzer(
  withPWA({
    reactStrictMode: true,
    images: {
      remotePatterns: [
        {
          protocol: "http",
          hostname: "localhost"
        },
        {
          protocol: "http",
          hostname: "127.0.0.1"
        },
        {
          protocol: "https",
          hostname: "**"
        }
      ]
    },
    experimental: {
      serverComponentsExternalPackages: ["sharp", "onnxruntime-node"]
    },

    webpack: (config, { isServer }) => {
      // Enable async WebAssembly
      config.experiments = {
        asyncWebAssembly: true,
        ...config.experiments, // Merge with existing experiments if any
      };

      // Add WebAssembly module rule
      config.module.rules.push({
        test: /\.wasm$/,
        type: "webassembly/async"
      });

      // Return the modified config
      return config;
    }
  })
);
