import { useLayoutEffect, useRef, useState } from "react";

import { TabItem, TabLabel, tabLinkClass, type Tab } from "./tab-item";
import { overflowTriggerClass, TabOverflowMenu } from "./tab-overflow-menu";

type TabBarProps = {
  tabs: Tab[];
  activeId: string | undefined;
  onTogglePin: (id: string) => void;
  onClose: (id: string) => void;
};

export function TabBar({ tabs, activeId, onTogglePin, onClose }: TabBarProps) {
  const barRef = useRef<HTMLElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(0);

  useLayoutEffect(() => {
    const bar = barRef.current;
    const measurements = measureRef.current;
    if (!bar || !measurements) return;

    const elements = Array.from(measurements.children);
    const overflowTrigger = elements.pop();
    if (!overflowTrigger) return;

    const observer = new ResizeObserver(() => {
      const available = bar.getBoundingClientRect().width;
      const widths = elements.map(
        (element) => element.getBoundingClientRect().width,
      );
      const total = widths.reduce((sum, width) => sum + width, 0);

      if (total <= available) {
        setVisibleCount(widths.length);
        return;
      }

      const limit = available - overflowTrigger.getBoundingClientRect().width;
      let used = 0;
      let count = 0;
      for (const width of widths) {
        if (used + width > limit) break;
        used += width;
        count += 1;
      }
      setVisibleCount(count);
    });

    observer.observe(bar);
    observer.observe(overflowTrigger);
    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [tabs]);

  const visibleTabs = tabs.slice(0, visibleCount);
  const hiddenTabs = tabs.slice(visibleCount);

  return (
    <nav
      ref={barRef}
      aria-label="Tabs"
      className="relative flex min-h-12 min-w-0 bg-[#fafbfc]"
    >
      <ul
        className={
          hiddenTabs.length > 0
            ? "flex min-w-0 flex-1 flex-nowrap"
            : "flex min-w-0 flex-nowrap"
        }
      >
        {visibleTabs.map((tab) => (
          <TabItem
            key={tab.id}
            tab={tab}
            active={tab.id === activeId}
            onTogglePin={onTogglePin}
            onClose={onClose}
          />
        ))}
      </ul>

      {hiddenTabs.length > 0 && (
        <TabOverflowMenu
          tabs={hiddenTabs}
          activeId={activeId}
          onClose={onClose}
        />
      )}

      <div
        aria-hidden="true"
        className="invisible pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div ref={measureRef} className="flex w-max">
          {tabs.map((tab) => (
            <span key={tab.id} className={tabLinkClass(tab.pinned)}>
              <TabLabel tab={tab} compact={tab.pinned} />
            </span>
          ))}
          <span className={overflowTriggerClass} />
        </div>
      </div>
    </nav>
  );
}
