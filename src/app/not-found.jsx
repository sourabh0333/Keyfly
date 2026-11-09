import { Button } from "@/components/button";
import { ErrorScreen } from "@/components/error-screen/error-screen";
import { notFound } from "@/content/errors";

// The 404 page, for any URL that matches no page (and for notFound()).
// It renders inside the root layout, so the header and footer stay, and
// Next adds a noindex robots tag to it.
export const metadata = notFound.meta;

export default function NotFound() {
  return (
    <ErrorScreen
      kind="missing"
      content={notFound}
      pages={notFound.pages}
      pagesLabel={notFound.pagesLabel}
      actions={
        <>
          <Button href={notFound.primary.href} arrow>
            {notFound.primary.label}
          </Button>
          <Button href={notFound.secondary.href} variant="ghost">
            {notFound.secondary.label}
          </Button>
        </>
      }
    />
  );
}
