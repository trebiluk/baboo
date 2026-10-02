import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { APP_VERSION } from "@/studio/version";
import appCss from "../styles.css?url";

const APP_NAME = "Baboo";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: `${APP_NAME} ${APP_VERSION}` },
      { name: "theme-color", content: "#FFFFFF" },
      { name: "color-scheme", content: "only light" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
      { rel: "stylesheet", href: "https://apps.kulibert.net/fonts/room.css?v=2026-10-04-i18n" },
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
        <script src="https://apps.kulibert.net/shared/kulibert-i18n.js?v=2.13.10" defer />
        <script src="https://apps.kulibert.net/shared/kulibert-prefs.js?v=2.13.10" defer />
        <script
          src="https://apps.kulibert.net/shared/kulibert-bar.js?v=2.13.10"
          data-app="baboo"
          data-version="v2.13.10"
          data-help="#baboo-help"
          defer
        />
        <Scripts />
      </body>
    </html>
  ),
});
