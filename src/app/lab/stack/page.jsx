import { notFound } from "next/navigation";
import { StackDemo } from "@/components/lab/stack-demo";
import { LabBar } from "@/components/lab/lab-bar";

// Development only: the production build serves a 404 here.
export const metadata = {
  title: "Lab · B · Stack",
  robots: { index: false, follow: false },
};

export default function Page() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <>
      <StackDemo />
      <LabBar current="/lab/stack" />
    </>
  );
}
