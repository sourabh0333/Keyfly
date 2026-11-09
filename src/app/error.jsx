"use client";

import { useEffect } from "react";
import { Button } from "@/components/button";
import { ErrorScreen } from "@/components/error-screen/error-screen";
import { serverError } from "@/content/errors";

// The error page: shown in place of a page that failed while rendering,
// inside the root layout (header and footer stay). `retry` re-fetches and
// re-renders the page.
export default function Error({ error, retry }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <>
      {/* React places this in the head (an error page can't export metadata). */}
      <title>{serverError.meta.title}</title>
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
    </>
  );
}
