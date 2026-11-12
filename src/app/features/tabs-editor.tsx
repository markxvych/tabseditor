"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";

import { TabBar } from "./tab-bar";
import { tabHref } from "./tab-item";
import tabData from "./tabs.json";

const initialTabs = tabData.map((tab) => ({
  ...tab,
  pinned: false,
}));

const STORAGE_KEY = "tabs-order";

type StoredTabs = {
  order: string[];
  pinnedIds: string[];
  closedIds: string[];
};

function readStoredTabs() {
  if (typeof window === "undefined") return initialTabs;

  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null") as
      Partial<StoredTabs> | string[] | null;

    const order = Array.isArray(saved) ? saved : saved?.order;
    if (!Array.isArray(order)) return initialTabs;

    const pinnedIds = Array.isArray(saved) ? [] : saved?.pinnedIds;
    const closedIds = Array.isArray(saved) ? [] : saved?.closedIds;
    const pinned = new Set(Array.isArray(pinnedIds) ? pinnedIds : []);
    const closed = new Set(Array.isArray(closedIds) ? closedIds : []);
    const positions = new Map(order.map((id, index) => [id, index]));

    return initialTabs
      .filter((tab) => !closed.has(tab.id))
      .sort(
        (a, b) =>
          (positions.get(a.id) ?? order.length) -
          (positions.get(b.id) ?? order.length),
      )
      .map((tab) => ({ ...tab, pinned: pinned.has(tab.id) }));
  } catch {
    return initialTabs;
  }
}

export function TabsEditor() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tabs, setTabs] = useState(readStoredTabs);
  const selectedId = searchParams.get("tab");
  const activeTab =
    tabs.find((tab) => tab.id === selectedId) ??
    tabs.find((tab) => tab.id === "dashboard") ??
    tabs[0];

  useEffect(() => {
    try {
      const order = tabs.map((tab) => tab.id);
      const openIds = new Set(order);
      const saved: StoredTabs = {
        order,
        pinnedIds: tabs.filter((tab) => tab.pinned).map((tab) => tab.id),
        closedIds: initialTabs
          .filter((tab) => !openIds.has(tab.id))
          .map((tab) => tab.id),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    } catch {
      // Keep tab interactions available if browser storage is blocked.
    }
  }, [tabs]);

  function moveTab(from: number, to: number) {
    setTabs((current) => {
      const tab = current[from];
      if (!tab || to < 0 || to >= current.length) return current;

      const next = [...current];
      next.splice(from, 1);
      next.splice(to, 0, tab);
      return next;
    });
  }

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
        onMoveTab={moveTab}
      />
      <section aria-live="polite" className="flex flex-1 bg-[#eef2f6] p-3">
        <div className="w-full rounded-sm bg-white p-5 sm:p-7">
          {activeTab ? (
            <h1 className="text-sm font-medium text-[#25303a]">
              {activeTab.label}
            </h1>
          ) : (
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-sm text-[#636b73]">No open tabs.</p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setTabs(initialTabs)}
              >
                Restore tabs
              </Button>
            </div>
          )}
        </div>
      </section>
    </TooltipProvider>
  );
}
