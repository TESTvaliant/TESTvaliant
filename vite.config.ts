// website for testvaliant
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    // Prevent duplicate React instances
    dedupe: ["react", "react-dom", "react/jsx-runtime"],
  },
  build: {
    target: "es2020",
    minify: "esbuild",
    cssCodeSplit: true,
    sourcemap: false,
    reportCompressedSize: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;

          const normalizedId = id.replace(/\\/g, "/");
          const modulePath = normalizedId.split("/node_modules/")[1];

          if (!modulePath) return;

          const segments = modulePath.split("/");
          const packageName = segments[0]?.startsWith("@")
            ? `${segments[0]}/${segments[1]}`
            : segments[0];

          if (!packageName) return;

          if (packageName.startsWith("@tiptap/")) return "tiptap";
          if (packageName === "xlsx") return "xlsx";
          if (packageName === "framer-motion") return "motion";
          if (packageName.startsWith("@supabase/")) return "supabase";
          if (packageName.startsWith("@radix-ui/")) return "radix";
          if (
            packageName === "react-router-dom" ||
            packageName === "react-router" ||
            packageName === "@remix-run/router"
          ) {
            return "router";
          }
          if (packageName === "@tanstack/react-query" || packageName === "@tanstack/query-core") {
            return "react-query";
          }
          if (
            packageName === "react-dom" ||
            packageName === "react" ||
            packageName === "scheduler" ||
            packageName === "use-sync-external-store"
          ) {
            return "react-core";
          }
          if (packageName === "lucide-react") return "icons";
          if (packageName === "recharts" || packageName === "victory-vendor" || packageName.startsWith("d3-")) {
            return "charts";
          }
          if (packageName === "date-fns") return "date-utils";
          if (packageName === "dompurify") return "sanitize-lib";
          if (packageName === "sonner") return "toast";

          return "vendor";
        },
      },
    },
  },
}));
