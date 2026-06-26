import { useState } from "react";
import {
  AlertTriangle,
  Settings,
  Phone,
  Shield,
  Clock,
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
      <span className="inline-flex items-center px-2.5 py-1.5 rounded text-xs font-bold bg-red-100 text-red-700">
        Theft Risk
      </span>
    );
  }
  if (status === "theft") {
    return (
      <span className="inline-flex items-center px-2.5 py-1.5 rounded text-xs font-bold bg-red-100 text-red-700">
        Theft
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2.5 py-1.5 rounded text-xs font-bold bg-teal-50 text-teal-700">
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
      <span className="text-slate-500">Closed · Opens tomorrow at 7:00 AM</span>
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
    <div className="border border-border rounded-lg px-6 py-5 bg-card">
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
    <table className="w-full text-sm table-fixed bg-white">
      <colgroup>
        <col className="w-[150px]" />
        <col className="w-[320px]" />
        <col className="w-[140px]" />
        <col className="w-[130px]" />
        <col className="w-[150px]" />
      </colgroup>
      <thead>
        <tr className="border-b border-border">
          <th className="text-left py-3.5 px-5 text-xs font-medium text-muted-foreground">
            Status
          </th>
          <th className="text-left py-3.5 px-5 text-xs font-medium text-muted-foreground">
            Vehicle
          </th>
          <th className="text-left py-3.5 px-5 text-xs font-medium text-muted-foreground">
            Duration
          </th>
          <th className="text-left py-3.5 px-5 text-xs font-medium text-muted-foreground">
            Distance
          </th>
          <th className="text-left py-3.5 px-5 text-xs font-medium text-muted-foreground">
            Actions
          </th>
        </tr>
      </thead>
      <tbody>
        {vehicles.map((v) => (
          <tr key={v.id} className="border-b border-border last:border-b-0 hover:bg-muted/40 transition-colors">
            <td className="py-4 px-5">
              <StatusBadge status={v.status} />
            </td>
            <td className="py-4 px-5 text-foreground">{getVehicleDisplayName(v)}</td>
            <td className="py-4 px-5 text-foreground">
              <span className="mr-0.5 text-muted-foreground">≥</span> {v.duration} min
            </td>
            <td className="py-4 px-5 text-foreground">{v.distance} mi</td>
            <td className="py-4 px-5">
              <button
                onClick={() => onView(v)}
                className="text-xs font-bold rounded-full px-4 py-1.5 hover:bg-blue-50 transition-colors whitespace-nowrap"
              style={{ border: "1.5px solid #0066FE", color: "#0066FE" }}
              >
                View Vehicle
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function SectionHeader({ title, count }: { title: string; count: number }) {
  return (
    <div className="flex items-center gap-2">
      <AlertTriangle className="w-4 h-4 text-amber-500" />
      <span className="font-semibold text-foreground">{title}</span>
      <span className="text-xs bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full font-medium">
        {count}
      </span>
    </div>
  );
}

function ContactActions() {
  return (
    <div className="flex items-center gap-3 text-xs text-primary">
      <button className="flex items-center gap-1 hover:underline">
        <Phone className="w-3 h-3" /> Contact Dealer
      </button>
      <button className="flex items-center gap-1 hover:underline">
        <Shield className="w-3 h-3" /> Contact Law Enforcement
      </button>
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
      <div className="bg-muted/60 border-b border-border px-4 py-2 flex items-center gap-4 text-xs text-muted-foreground shrink-0">
        <span className="font-medium text-muted-foreground/60 uppercase tracking-wide text-[10px]">
          FOR PROTOTYPING PURPOSES ONLY
        </span>
        <div className="ml-auto flex items-center bg-white border border-border rounded-lg overflow-hidden">
          {(["business_hours", "nearing_close", "after_hours"] as TimeMode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={cn(
                "px-4 py-1.5 text-xs font-medium transition-colors",
                mode === m
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-muted"
              )}
            >
              {MODE_LABELS[m]}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Main content */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* App header */}
          <header className="px-6 pt-5 pb-3 border-b border-border bg-card flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              {mode === "after_hours" ? (
                <FordLogo size={56} />
              ) : (
                <SerramonteLogo size={42} />
              )}
              <div>
                {mode === "after_hours" && (
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">
                    Dealership Lot Security
                  </p>
                )}
                <h1 className="text-xl font-bold text-foreground">Serramonte Ford, Colma CA</h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {mode === "after_hours" && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                    MU
                  </div>
                  <div>
                    <p className="text-xs font-medium text-foreground">Mock User</p>
                    <p className="text-[10px] text-muted-foreground">ADMIN</p>
                  </div>
                  <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground ml-2">
                    <Settings className="w-3.5 h-3.5" /> Settings
                  </button>
                </div>
              )}
              <button className="text-muted-foreground hover:text-foreground">
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </header>

          {/* Monitoring mode indicator */}
          <div className="px-6 py-2.5 border-b border-border bg-card shrink-0">
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
          <div className="px-6 pb-6 space-y-6 shrink-0">
            {mode === "business_hours" && (
              <>
                {/* Theft Risk section */}
                <div className="border border-border rounded-lg overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-card">
                    <SectionHeader title="Theft Risk" count={theftRiskVehicles.length} />
                    <ContactActions />
                  </div>
                  <VehicleTable vehicles={theftRiskVehicles} onView={setSelectedVehicle} />
                </div>

                {/* Off Premises section */}
                <div className="border border-border rounded-lg overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-card">
                    <SectionHeader title="Off Premises" count={offPremisesVehicles.length} />
                    <ContactActions />
                  </div>
                  <VehicleTable vehicles={offPremisesVehicles} onView={setSelectedVehicle} />
                </div>
              </>
            )}

            {mode === "nearing_close" && (
              <div className="border border-border rounded-lg overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-card">
                  <SectionHeader
                    title="Theft Risk — Off Premises at Closing"
                    count={nearingCloseVehicles.length}
                  />
                  <ContactActions />
                </div>
                <VehicleTable vehicles={nearingCloseVehicles} onView={setSelectedVehicle} />
              </div>
            )}

            {mode === "after_hours" && (
              <div className="border border-border rounded-lg overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-card">
                  <SectionHeader title="Potential Theft" count={afterHoursVehicles.length} />
                  <ContactActions />
                </div>
                <VehicleTable vehicles={afterHoursVehicles} onView={setSelectedVehicle} />
              </div>
            )}
          </div>

          {/* Dealer info section */}
          <DealerInfoSection dealer={dealerInfo} />
        </div>
      </div>

      {/* Vehicle modal */}
      {selectedVehicle && (
        <VehicleModal
          vehicle={selectedVehicle}
          onClose={() => setSelectedVehicle(null)}
        />
      )}
    </div>
  );
}
