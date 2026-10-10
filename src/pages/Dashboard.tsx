import { useState } from "react";
import {
  AlertTriangle,
  Clock,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Vehicle, TimeMode } from "@/types";
import { vehicles as allVehicles, dealerInfo } from "@/data/mockData";
import { VehicleModal } from "@/components/VehicleModal";
import { DealerInfoSection } from "@/components/DealerInfoSection";
import { Sidebar } from "@/components/Sidebar";
import SerramonteLogo from "@/components/SerramonteLogo";
import FordLogo from "@/components/FordLogo";

function StatusBadge({ status }: { status: Vehicle["status"] }) {
  if (status === "theft_risk") {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200">
        Theft Risk
      </span>
    );
  }
  if (status === "theft") {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200">
        Theft
      </span>
    );
  }
  return (
      <span className="inline-flex items-center whitespace-nowrap px-1.5 sm:px-2.5 py-0.5 text-[10px] sm:text-xs rounded-full font-semibold bg-teal-50 text-teal-700 border border-teal-200">
      Off Premises
    </span>
  );
}

function getVehicleDisplayName(v: Vehicle) {
  return `${v.color} ${v.year} ${v.model}`;
}

function MonitoringModeBadge({ mode }: { mode: TimeMode }) {
  if (mode === "business_hours") {
    return (
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Clock className="w-3.5 h-3.5 text-green-500" />
        <span className="font-medium text-foreground">Business Hours Monitoring</span>
        <span className="text-green-600 font-medium">Open until 9:00 PM</span>
      </div>
    );
  }
  if (mode === "nearing_close") {
    return (
      <div className="flex items-center gap-1.5 text-sm">
        <Clock className="w-3.5 h-3.5 text-amber-500" />
        <span className="font-medium text-foreground">Nearing Close</span>
        <span className="text-amber-600 font-medium">Closing in 20 minutes · 9:00 PM</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-1.5 text-sm">
      <Clock className="w-3.5 h-3.5 text-slate-400" />
      <span className="font-medium text-foreground">After-Hours Monitoring</span>
      <span className="text-muted-foreground">Closed · Opens tomorrow at 7:00 AM</span>
    </div>
  );
}

function SummaryCard({
  count,
  label,
  sub,
  color = "red",
}: {
  count: number;
  label: string;
  sub: string;
  color?: "red" | "orange";
}) {
  return (
    <div className="border border-border rounded-xl px-6 py-5 bg-card shadow-sm">
      <p
        className={cn(
          "text-3xl font-bold leading-none mb-2",
          color === "red" ? "text-red-600" : "text-amber-600"
        )}
      >
        {count}
      </p>
      <p className="text-sm font-medium text-foreground mb-0.5">{label}</p>
      <p className="text-xs text-muted-foreground whitespace-nowrap">{sub}</p>
    </div>
  );
}

function VehicleTable({
  vehicles,
  onView,
}: {
  vehicles: Vehicle[];
  onView: (v: Vehicle) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-0 text-sm table-fixed bg-white">
        <colgroup>
          <col className="w-[112px] sm:w-[160px]" />
          <col />
          <col className="w-[78px] sm:w-[150px]" />
        </colgroup>
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3.5 px-2.5 sm:px-5 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
              Status
            </th>
            <th className="text-left py-3.5 px-2.5 sm:px-5 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
              Vehicle
            </th>
            <th className="text-left py-3.5 px-2.5 sm:px-5 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map((v) => (
            <tr key={v.id} className="border-b border-border last:border-b-0 hover:bg-muted/40 transition-colors">
              <td className="py-4 px-2.5 sm:px-5">
                <StatusBadge status={v.status} />
              </td>
              <td className="py-4 px-2.5 sm:px-5 text-foreground">{getVehicleDisplayName(v)}</td>
              <td className="py-4 px-2.5 sm:px-5">
                <button
                  onClick={() => onView(v)}
                  aria-label={`View ${getVehicleDisplayName(v)}`}
                  className="px-2 sm:px-4 py-1.5 rounded-full text-xs font-semibold border border-border bg-white text-foreground hover:bg-secondary transition-colors whitespace-nowrap"
                >
                  <span className="sm:hidden">View</span>
                  <span className="hidden sm:inline">View Vehicle</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SectionHeader({ title, count }: { title: string; count: number }) {
  return (
    <div className="flex items-center gap-2">
      <AlertTriangle className="w-4 h-4 text-amber-500" />
      <span className="font-semibold text-foreground">{title}</span>
      <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full font-medium border border-border">
        {count}
      </span>
    </div>
  );
}

const MODE_LABELS: Record<TimeMode, string> = {
  business_hours: "Business Hours",
  nearing_close: "Nearing Close",
  after_hours: "Closed / After Hours",
};

export default function Dashboard() {
  const [mode, setMode] = useState<TimeMode>("business_hours");
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  const theftRiskVehicles = allVehicles.filter((v) => v.status === "theft_risk");
  const offPremisesVehicles = allVehicles.filter((v) => v.status === "off_premises");

  const nearingCloseVehicles = allVehicles.map((v) => ({
    ...v,
    status: "theft_risk" as const,
  }));

  const afterHoursVehicles = [{ ...theftRiskVehicles[0], status: "theft" as const }];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Prototype mode switcher bar */}
      <div className="bg-white/60 border-b border-dashed border-border px-4 py-2 flex items-center gap-4 shrink-0">
        <span className="font-semibold text-muted-foreground uppercase tracking-widest text-[10px]">
          For Prototyping Purposes Only
        </span>
        <div className="ml-auto flex items-center gap-2">
          {(["business_hours", "nearing_close", "after_hours"] as TimeMode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium border transition-colors",
                mode === m
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border bg-white text-foreground hover:bg-secondary"
              )}
            >
              {MODE_LABELS[m]}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* App header */}
          <header className="bg-white border-b border-border px-6 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              {mode === "after_hours" ? (
                <FordLogo size={48} />
              ) : (
                <SerramonteLogo size={36} />
              )}
              <div className="flex flex-col leading-tight border-l border-border pl-3">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest whitespace-nowrap">
                  Dealership Lot Security
                </span>
                <span className="text-sm font-semibold text-foreground">Serramonte Ford, Colma CA</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end leading-tight">
                <span className="text-sm font-semibold text-foreground">Mock User</span>
                <span className="text-xs text-muted-foreground">Admin</span>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold">
                MU
              </div>
              <button className="text-muted-foreground hover:text-foreground transition-colors ml-1">
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </header>

          {/* Monitoring mode indicator */}
          <div className="px-6 py-2.5 border-b border-border bg-white shrink-0">
            <MonitoringModeBadge mode={mode} />
          </div>

          {/* Summary cards */}
          <div className="px-6 py-5 shrink-0">
            {mode === "business_hours" && (
              <div className="flex gap-3">
                <SummaryCard
                  count={theftRiskVehicles.length}
                  label="Theft Risk"
                  sub="Requires attention"
                  color="red"
                />
                <SummaryCard
                  count={offPremisesVehicles.length}
                  label="Off Premises"
                  sub="Outside geofence"
                  color="orange"
                />
              </div>
            )}
            {mode === "nearing_close" && (
              <div className="flex gap-3">
                <SummaryCard
                  count={nearingCloseVehicles.length}
                  label="Theft Risk"
                  sub="Off premises at closing"
                  color="red"
                />
              </div>
            )}
            {mode === "after_hours" && (
              <div className="flex gap-3">
                <SummaryCard
                  count={afterHoursVehicles.length}
                  label="Potential Theft"
                  sub="Requires attention"
                  color="red"
                />
              </div>
            )}
          </div>

          {/* Vehicle sections */}
          <div className="px-6 pb-6 space-y-5 shrink-0">
            {mode === "business_hours" && (
              <>
                <div className="bg-white border border-border rounded-xl shadow-sm overflow-hidden">
                  <div className="flex items-center px-5 py-4 border-b border-border">
                    <SectionHeader title="Theft Risk" count={theftRiskVehicles.length} />
                  </div>
                  <VehicleTable vehicles={theftRiskVehicles} onView={setSelectedVehicle} />
                </div>

                <div className="bg-white border border-border rounded-xl shadow-sm overflow-hidden">
                  <div className="flex items-center px-5 py-4 border-b border-border">
                    <SectionHeader title="Off Premises" count={offPremisesVehicles.length} />
                  </div>
                  <VehicleTable vehicles={offPremisesVehicles} onView={setSelectedVehicle} />
                </div>
              </>
            )}

            {mode === "nearing_close" && (
              <div className="bg-white border border-border rounded-xl shadow-sm overflow-hidden">
                <div className="flex items-center px-5 py-4 border-b border-border">
                  <SectionHeader
                    title="Theft Risk — Off Premises at Closing"
                    count={nearingCloseVehicles.length}
                  />
                </div>
                <VehicleTable vehicles={nearingCloseVehicles} onView={setSelectedVehicle} />
              </div>
            )}

            {mode === "after_hours" && (
              <div className="bg-white border border-border rounded-xl shadow-sm overflow-hidden">
                <div className="flex items-center px-5 py-4 border-b border-border">
                  <SectionHeader title="Potential Theft" count={afterHoursVehicles.length} />
                </div>
                <VehicleTable vehicles={afterHoursVehicles} onView={setSelectedVehicle} />
              </div>
            )}
          </div>

          {/* Dealer info section */}
          <DealerInfoSection dealer={dealerInfo} />
        </div>
      </div>

      {selectedVehicle && (
        <VehicleModal
          vehicle={selectedVehicle}
          onClose={() => setSelectedVehicle(null)}
        />
      )}
    </div>
  );
}
