import { notFound } from "next/navigation";
import { MorphDemo } from "@/components/lab/morph-demo";
import { LabBar } from "@/components/lab/lab-bar";

// Development only: the production build serves a 404 here.
export const metadata = {
  title: "Lab · A · Transform",
  robots: { index: false, follow: false },
};

export default function Page() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <>
      <MorphDemo />
      <LabBar current="/lab/morph" />
    </>
  );
}
