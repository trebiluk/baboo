import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import appCss from "../styles.css?url";

const APP_NAME = "Baboo";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: APP_NAME },
      { name: "theme-color", content: "#FFFFFF" },
      { name: "color-scheme", content: "only light" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
      { rel: "stylesheet", href: "https://apps.kulibert.net/fonts/room.css?v=2026-10-02-lang" },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
    ],
  }),
  component: () => (
    <html lang="en" data-gui-theme="stark" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <PreviewHostBridge />
        <AuthProvider>
          <Outlet />
        </AuthProvider>
        <script src="https://apps.kulibert.net/shared/kulibert-prefs.js?v=2026-10-02-lang" defer />
        <script src="https://apps.kulibert.net/shared/i18n.js?v=2026-10-02-lang" defer />
        <script
          src="https://apps.kulibert.net/shared/kulibert-bar.js?v=2026-10-02-lang"
          data-app="baboo"
          data-version="v2.13.4"
          data-help="#baboo-help"
          defer
        />
        <Scripts />
      </body>
    </html>
  ),
});
