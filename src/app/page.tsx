import { Suspense } from "react";

import { TabsEditor } from "./features/tabs-editor";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-dvh w-full flex-col px-3 pt-10 sm:px-8 sm:pt-16">
      <Suspense
        fallback={
          <div
            aria-busy="true"
            className="flex-1 border-t-48 border-[#fafbfc] bg-[#eef2f6]"
          />
        }
      >
        <TabsEditor />
      </Suspense>
    </main>
  );
}
