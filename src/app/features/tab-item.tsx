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
      <span className={compact ? "sr-only" : "truncate"}>{tab.label}</span>
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
  active: boolean;
  onTogglePin: (id: string) => void;
  onClose: (id: string) => void;
};

export function TabItem({ tab, active, onTogglePin, onClose }: TabItemProps) {
  const link = (
    <Link
      href={tabHref(tab.id)}
      scroll={false}
      aria-current={active ? "page" : undefined}
      className={cn(
        tabLinkClass(tab.pinned),
        !tab.pinned && "w-full",
        "hover:bg-[#f0f2f4] hover:text-[#27323c] focus-visible:z-10 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#6097e7]",
        active && "border-t-[#6097e7] bg-[#edf2f7] text-[#25303a]",
      )}
    >
      <TabLabel tab={tab} compact={tab.pinned} />
    </Link>
  );

  return (
    <li
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
                className="bg-white text-[#25303a] shadow-md"
              >
                {tab.label}
              </TooltipContent>
            </Tooltip>
          ) : (
            link
          )}
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            aria-label={"Close " + tab.label}
            className={cn(
              "group/close absolute z-10 opacity-0 group-hover/tab:opacity-100 focus-visible:opacity-100 hover:bg-transparent pointer-coarse:opacity-100",
              tab.pinned ? "top-0 right-0" : "top-1/2 right-1 -translate-y-1/2",
            )}
            onClick={() => onClose(tab.id)}
          >
            <TabCloseIcon />
          </Button>
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
