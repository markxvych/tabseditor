import Link from "next/link";
import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

import { TabCloseIcon, TabLabel, tabHref, type Tab } from "./tab-item";

export const overflowTriggerClass = "ml-auto h-12 w-10 shrink-0";

type TabOverflowMenuProps = {
  tabs: Tab[];
  activeId: string | undefined;
  onClose: (id: string) => void;
};

export function TabOverflowMenu({
  tabs,
  activeId,
  onClose,
}: TabOverflowMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="More tabs"
        render={<Button variant="ghost" size="icon" />}
        className={cn(
          overflowTriggerClass,
          "group/overflow rounded-none text-[#636b73] data-popup-open:bg-[#6097e7] data-popup-open:text-white",
          tabs.some((tab) => tab.id === activeId) &&
            "bg-[#edf2f7] text-[#305eaa]",
        )}
      >
        <ChevronDown
          aria-hidden="true"
          className="group-data-popup-open/overflow:rotate-180"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={0}
        className="w-56 rounded-sm p-0"
      >
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className="flex items-center border-b border-[#edf0f2] px-1 last:border-b-0"
          >
            <DropdownMenuItem
              render={<Link href={tabHref(tab.id)} scroll={false} />}
              aria-current={tab.id === activeId ? "page" : undefined}
              className="min-w-0 flex-1 cursor-pointer gap-2 px-2 py-2.5 text-[#636b73] aria-[current=page]:bg-[#edf2f7] aria-[current=page]:text-[#25303a]"
            >
              <TabLabel tab={tab} />
            </DropdownMenuItem>
            <DropdownMenuItem
              aria-label={"Close " + tab.label}
              onClick={() => onClose(tab.id)}
              className="group/close shrink-0 cursor-pointer justify-center"
            >
              <TabCloseIcon />
            </DropdownMenuItem>
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
