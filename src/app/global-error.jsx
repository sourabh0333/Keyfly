"use client";

import { Button } from "@/components/button";
import { ErrorScreen } from "@/components/error-screen/error-screen";
import { serverError } from "@/content/errors";
import { instrumentSerif, inter, syne } from "./fonts";
import "./globals.css";

// The last resort: shown when the root layout itself fails, so it renders
// its own document (no header or footer) and brings the site's styles and
// fonts with it. `retry` re-fetches and re-renders the app.
export default function GlobalError({ retry }) {
  return (
    <html lang="en" className={`${syne.variable} ${inter.variable} ${instrumentSerif.variable}`}>
      <body data-tone="night">
        <title>{serverError.meta.title}</title>
        <main>
          <ErrorScreen
            kind="failed"
            content={serverError}
            actions={
              <>
                <Button onClick={() => retry()} arrow>
                  {serverError.retry}
                </Button>
                <Button href={serverError.home.href} variant="ghost">
                  {serverError.home.label}
                </Button>
              </>
            }
          />
        </main>
      </body>
    </html>
  );
}
