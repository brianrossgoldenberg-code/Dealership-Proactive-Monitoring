import { Search, ClipboardList, Monitor, LayoutGrid, MapPin, Shield, ArrowRightLeft, FileCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  className?: string;
}

const navItems = [
  { icon: Search, label: "Search" },
  { icon: ClipboardList, label: "Audit" },
  { icon: Monitor, label: "Monitor" },
  { icon: LayoutGrid, label: "Monitor V2" },
  { icon: MapPin, label: "Dealer Lot", active: true },
  { icon: MapPin, label: "Lot V2" },
  { icon: MapPin, label: "Lot V3" },
  { icon: Shield, label: "Police Portal" },
  { icon: ArrowRightLeft, label: "SOT Flow" },
  { icon: FileCheck, label: "Audit V2" },
];

export function Sidebar({ className }: SidebarProps) {
  return (
    <aside
      className={cn(
        "flex flex-col w-[64px] shrink-0 bg-sidebar border-r border-sidebar-border",
        className
      )}
    >
      <div className="flex flex-col items-center gap-1 pt-3 flex-1">
        {navItems.map(({ icon: Icon, label, active }) => (
          <button
            key={label}
            title={label}
            className={cn(
              "flex flex-col items-center gap-0.5 w-full py-2 px-1 cursor-pointer transition-colors",
              active
                ? "text-white"
                : "text-sidebar-foreground hover:text-white"
            )}
          >
            <div
              className={cn(
                "w-8 h-8 flex items-center justify-center rounded",
                active && "bg-sidebar-accent"
              )}
            >
              <Icon className="w-4 h-4" />
            </div>
            <span className="text-[9px] leading-tight text-center font-medium">{label}</span>
          </button>
        ))}
      </div>
    </aside>
  );
}
