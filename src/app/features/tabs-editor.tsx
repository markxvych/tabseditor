"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { TooltipProvider } from "@/components/ui/tooltip";

import { TabBar } from "./tab-bar";
import { tabHref } from "./tab-item";
import tabData from "./tabs.json";

const initialTabs = tabData.map((tab) => ({
  ...tab,
  pinned: false,
}));

export function TabsEditor() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tabs, setTabs] = useState(initialTabs);
  const selectedId = searchParams.get("tab");
  const activeTab =
    tabs.find((tab) => tab.id === selectedId) ??
    tabs.find((tab) => tab.id === "dashboard") ??
    tabs[0];

  function togglePin(id: string) {
    setTabs((current) => {
      const tab = current.find((item) => item.id === id);
      if (!tab) return current;

      if (tab.pinned) {
        return current.map((item) =>
          item.id === id ? { ...item, pinned: false } : item,
        );
      }

      return [
        { ...tab, pinned: true },
        ...current.filter((item) => item.id !== id),
      ];
    });
  }

  function closeTab(id: string) {
    const index = tabs.findIndex((tab) => tab.id === id);
    if (index < 0) return;

    const remaining = tabs.filter((tab) => tab.id !== id);
    setTabs(remaining);

    if (id === activeTab?.id) {
      const next = remaining[index] ?? remaining[index - 1];
      router.replace(next ? tabHref(next.id) : "/", { scroll: false });
    }
  }

  return (
    <TooltipProvider delay={300}>
      <TabBar
        tabs={tabs}
        activeId={activeTab?.id}
        onTogglePin={togglePin}
        onClose={closeTab}
      />
      <section aria-live="polite" className="flex flex-1 bg-[#eef2f6] p-3">
        <div className="w-full rounded-sm bg-white p-5 sm:p-7">
          {activeTab ? (
            <h1 className="text-sm font-medium text-[#25303a]">
              {activeTab.label}
            </h1>
          ) : (
            <p className="text-sm text-[#636b73]">No open tabs.</p>
          )}
        </div>
      </section>
    </TooltipProvider>
  );
}
