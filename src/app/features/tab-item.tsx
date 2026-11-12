import { useSortable } from "@dnd-kit/react/sortable";
import Link from "next/link";
import {
  BookOpen,
  CalendarDays,
  ChartPie,
  ContactRound,
  FileChartColumnIncreasing,
  Landmark,
  LayoutGrid,
  ListChecks,
  Mail,
  Package,
  PhoneCall,
  Pin,
  PinOff,
  ReceiptText,
  Settings,
  ShoppingCart,
  Store,
  UserRoundCog,
  Warehouse,
  X,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const icons: Record<string, LucideIcon> = {
  warehouse: Warehouse,
  "layout-grid": LayoutGrid,
  landmark: Landmark,
  "phone-call": PhoneCall,
  "user-round-cog": UserRoundCog,
  store: Store,
  "chart-pie": ChartPie,
  mail: Mail,
  settings: Settings,
  "book-open": BookOpen,
  package: Package,
  "list-checks": ListChecks,
  "shopping-cart": ShoppingCart,
  "receipt-text": ReceiptText,
  "contact-round": ContactRound,
  "calendar-days": CalendarDays,
  "file-chart-column-increasing": FileChartColumnIncreasing,
};

export type Tab = {
  id: string;
  label: string;
  icon: string;
  pinned: boolean;
};

export function tabHref(id: string) {
  return "/?tab=" + encodeURIComponent(id);
}

export function TabLabel({
  tab,
  compact = false,
}: {
  tab: Tab;
  compact?: boolean;
}) {
  const Icon = icons[tab.icon];

  return (
    <>
      <Icon aria-hidden="true" className="size-4 shrink-0" strokeWidth={1.5} />
      <span className={cn("font-medium", compact ? "sr-only" : "truncate")}>
        {tab.label}
      </span>
    </>
  );
}

export function tabLinkClass(pinned: boolean) {
  return cn(
    "relative inline-flex h-12 shrink-0 items-center gap-2 whitespace-nowrap border-t-2 border-transparent text-sm text-[#636b73]",
    pinned ? "w-12 justify-center" : "pl-4 pr-8",
  );
}

export function TabCloseIcon() {
  return (
    <span
      aria-hidden="true"
      className="inline-flex size-3.5 shrink-0 items-center justify-center rounded-full bg-[#b9bec2] text-white group-hover/close:bg-[#ef3939]"
    >
      <X className="size-2.5" strokeWidth={2.5} />
    </span>
  );
}

type TabItemProps = {
  tab: Tab;
  index: number;
  active: boolean;
  onTogglePin: (id: string) => void;
  onClose: (id: string) => void;
};

export function TabItem({
  tab,
  index,
  active,
  onTogglePin,
  onClose,
}: TabItemProps) {
  const { ref, handleRef, isDragging } = useSortable({ id: tab.id, index });

  const link = (
    <Link
      ref={handleRef}
      role="link"
      draggable={false}
      href={tabHref(tab.id)}
      scroll={false}
      aria-current={active ? "page" : undefined}
      className={cn(
        tabLinkClass(tab.pinned),
        !tab.pinned && "w-full",
        "touch-pan-y cursor-pointer",
        isDragging
          ? "bg-[#7F858D] text-white"
          : "hover:bg-[#f0f2f4] hover:text-[#27323c] focus-visible:z-10 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#6097e7]",
        !isDragging && active && "bg-[#edf2f7] text-[#25303a]",
        !isDragging &&
          (tab.pinned ? "border-t-[#7F858D]" : active && "border-t-[#6097e7]"),
      )}
    >
      <TabLabel tab={tab} compact={tab.pinned} />
    </Link>
  );

  return (
    <li
      ref={ref}
      className={cn(
        "relative shrink-0 after:pointer-events-none after:absolute after:top-4 after:right-0 after:h-4 after:w-px after:bg-[#e5e8ec]",
        !tab.pinned && "grow",
      )}
    >
      <ContextMenu>
        <ContextMenuTrigger className="group/tab relative flex">
          {tab.pinned ? (
            <Tooltip>
              <TooltipTrigger render={link} />
              <TooltipContent
                side="bottom"
                sideOffset={8}
                showArrow={false}
                className="gap-2 border border-[#e5e8ec] bg-white px-3 py-2.5 text-sm text-[#30363d] shadow-sm"
              >
                <TabLabel tab={tab} />
              </TooltipContent>
            </Tooltip>
          ) : (
            link
          )}
          {!tab.pinned && (
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              aria-label={"Close " + tab.label}
              className="group/close absolute top-1/2 right-1 z-10 -translate-y-1/2 opacity-0 group-hover/tab:opacity-100 focus-visible:opacity-100 hover:bg-transparent pointer-coarse:opacity-100"
              onClick={() => onClose(tab.id)}
            >
              <TabCloseIcon />
            </Button>
          )}
        </ContextMenuTrigger>
        <ContextMenuContent className="min-w-40">
          <ContextMenuItem onClick={() => onTogglePin(tab.id)}>
            {tab.pinned ? <PinOff /> : <Pin />}
            {tab.pinned ? "Unpin tab" : "Pin tab"}
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </li>
  );
}
