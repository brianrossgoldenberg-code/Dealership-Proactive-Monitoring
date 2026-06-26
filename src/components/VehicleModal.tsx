import { useState, useRef, useEffect } from "react";
import { X, MapPin, Phone, ChevronRight } from "lucide-react";
import { Vehicle } from "@/types";
import { cn } from "@/lib/utils";
import SerramonteLogo from "@/components/SerramonteLogo";

interface VehicleModalProps {
  vehicle: Vehicle;
  onClose: () => void;
}

const MARK_SAFE_REASONS = [
  "Verified in person",
  "False Alarm",
  "Customer Test Drive",
  "Loaner Vehicle",
];

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
    <span className="inline-flex items-center px-2.5 py-1.5 rounded text-xs font-bold bg-teal-100 text-teal-700">
      Off Premises
    </span>
  );
}

function VehicleIllustration({ color }: { color: string }) {
  if (color === "Grabber Blue") {
    return (
      <img
        src="/mustang-gt-blue.png"
        alt="2026 Mustang GT Grabber Blue"
        className="w-full max-w-[200px] object-contain"
      />
    );
  }

  const colorMap: Record<string, string> = {
    White: "#f0f0f0",
    "Rapid Red": "#C0392B",
    "Iconic Silver": "#9E9E9E",
    "Cactus Gray": "#78909C",
    "Oxford White": "#f5f5f5",
  };
  const fill = colorMap[color] || "#888";

  return (
    <svg viewBox="0 0 200 90" className="w-full max-w-[180px]" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="45" width="180" height="28" rx="6" fill={fill} stroke="#555" strokeWidth="1.2" />
      <path
        d="M30 45 Q50 18 80 18 L130 18 Q158 18 172 45 Z"
        fill={fill}
        stroke="#555"
        strokeWidth="1.2"
      />
      <rect x="16" y="65" width="168" height="8" rx="2" fill="#333" opacity="0.15" />
      <rect x="12" y="70" width="14" height="14" rx="7" fill="#222" />
      <circle cx="19" cy="77" r="4" fill="#555" />
      <rect x="174" y="70" width="14" height="14" rx="7" fill="#222" />
      <circle cx="181" cy="77" r="4" fill="#555" />
      <rect x="55" y="70" width="14" height="14" rx="7" fill="#222" />
      <circle cx="62" cy="77" r="4" fill="#555" />
      <rect x="131" y="70" width="14" height="14" rx="7" fill="#222" />
      <circle cx="138" cy="77" r="4" fill="#555" />
      <rect x="80" y="22" width="48" height="21" rx="3" fill="rgba(180,210,255,0.5)" stroke="#aaa" strokeWidth="0.8" />
      <rect x="130" y="22" width="30" height="21" rx="3" fill="rgba(180,210,255,0.5)" stroke="#aaa" strokeWidth="0.8" />
      <rect x="160" y="48" width="22" height="6" rx="1" fill="#f5c518" opacity="0.8" />
      <rect x="18" y="48" width="22" height="6" rx="1" fill="#f5c518" opacity="0.8" />
    </svg>
  );
}

function MapPlaceholder() {
  return (
    <div className="w-full h-full relative overflow-hidden">
      <iframe
        title="Serramonte Ford location"
        className="absolute inset-0 w-full h-full border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        src="https://maps.google.com/maps?q=707+Serramonte+Blvd,+Colma,+CA+94014&output=embed&z=14&t=m"
      />
    </div>
  );
}

export function VehicleModal({ vehicle, onClose }: VehicleModalProps) {
  const [markSafeMode, setMarkSafeMode] = useState(false);
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [reasonDropdownOpen, setReasonDropdownOpen] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setReasonDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleConfirmSafe = () => {
    if (!selectedReason) return;
    setConfirmed(true);
    setTimeout(onClose, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-2xl flex overflow-hidden w-[860px] max-w-[95vw] max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left panel */}
        <div className="w-[300px] shrink-0 p-6 border-r border-border overflow-y-auto">
          <div className="mb-3">
            <StatusBadge status={vehicle.status} />
          </div>

          <div className="mb-1">
            <span className="text-sm text-muted-foreground">{vehicle.year}</span>
          </div>
          <h2 className="text-2xl font-bold text-foreground leading-tight mb-0.5">
            {vehicle.model}
          </h2>
          <p className="text-sm text-muted-foreground mb-4">{vehicle.color}</p>

          {/* Vehicle illustration */}
          <div className="flex justify-center mb-5">
            <VehicleIllustration color={vehicle.color} />
          </div>

          {/* VIN */}
          <div className="mb-4">
            <p className="text-xs text-muted-foreground font-medium mb-0.5">VIN</p>
            <p className="text-sm font-mono text-foreground">{vehicle.vin}</p>
          </div>

          {/* Dealer info */}
          <div className="flex items-start gap-2 mb-4">
            <MapPin className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground">Serramonte Ford</p>
              <p className="text-xs text-muted-foreground">(415)555-1200</p>
            </div>
          </div>

          {/* Activity Timeline */}
          <div>
            <p className="text-sm font-semibold text-foreground mb-3">Activity Timeline</p>
            <div className="relative pl-4">
              <div className="absolute left-1.5 top-1.5 bottom-1.5 w-px bg-border" />
              <div className="space-y-4">
                {vehicle.activity.map((event, i) => (
                  <div key={i} className="relative flex gap-2">
                    <div
                      className={cn(
                        "absolute -left-3 top-1 w-2.5 h-2.5 rounded-full border-2 border-white",
                        event.active ? "bg-primary" : "bg-muted-foreground/30"
                      )}
                    />
                    <div className="ml-1">
                      <p className={cn("text-xs font-medium", event.active ? "text-foreground" : "text-muted-foreground")}>
                        {event.label}
                      </p>
                      {event.time && (
                        <p className="text-xs text-muted-foreground">{event.time}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Map header */}
          <div className="flex items-start justify-between px-5 pt-4 pb-2 border-b border-border">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Last Known Location</h3>
              <p className="text-xs text-muted-foreground">Last Updated: 2m</p>
            </div>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Map area */}
          <div className="flex-1 min-h-0 p-0">
            <MapPlaceholder />
          </div>

          {/* Bottom actions */}
          <div className="border-t border-border px-6 py-5 shrink-0">
            {!markSafeMode ? (
              <div className="flex items-center gap-2">
                <button className="flex-1 text-sm font-bold px-5 py-2 rounded-full text-white whitespace-nowrap hover:opacity-90 transition-opacity" style={{ backgroundColor: "#0066FE" }}>
                  Start Stolen Vehicles Case
                </button>
                <button className="text-sm font-bold px-5 py-2 rounded-full hover:bg-blue-50 transition-colors whitespace-nowrap" style={{ border: "1.5px solid #0066FE", color: "#0066FE" }}>
                  Escalate
                </button>
                <button
                  onClick={() => setMarkSafeMode(true)}
                  className="text-sm font-bold flex items-center gap-0.5 hover:opacity-70 transition-opacity"
                  style={{ color: "#333333" }}
                >
                  Mark Safe <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-sm text-foreground">Mark this vehicle as safe?</span>
                  <span className="text-sm text-muted-foreground">Reason:</span>
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setReasonDropdownOpen((v) => !v)}
                      className="text-sm border border-border rounded px-3 py-1.5 text-foreground hover:bg-muted transition-colors flex items-center gap-2 min-w-[160px]"
                    >
                      <span className={selectedReason ? "text-foreground" : "text-muted-foreground"}>
                        {selectedReason || "Select a reason..."}
                      </span>
                      <ChevronRight className={cn("w-3 h-3 ml-auto transition-transform", reasonDropdownOpen && "rotate-90")} />
                    </button>
                    {reasonDropdownOpen && (
                      <div className="absolute bottom-full mb-1 left-0 bg-white border border-border rounded-lg shadow-lg z-10 py-1 min-w-[200px]">
                        {MARK_SAFE_REASONS.map((reason) => (
                          <button
                            key={reason}
                            onClick={() => {
                              setSelectedReason(reason);
                              setReasonDropdownOpen(false);
                            }}
                            className={cn(
                              "w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors",
                              selectedReason === reason && "text-primary font-medium"
                            )}
                          >
                            {selectedReason === reason && (
                              <span className="mr-1.5">✓</span>
                            )}
                            {reason}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { setMarkSafeMode(false); setSelectedReason(""); }}
                    className="text-sm px-4 py-1.5 rounded border border-border hover:bg-muted transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmSafe}
                    disabled={!selectedReason}
                    className={cn(
                      "text-sm px-4 py-1.5 rounded font-semibold transition-colors",
                      selectedReason
                        ? "bg-green-600 text-white hover:bg-green-700"
                        : "bg-muted text-muted-foreground cursor-not-allowed"
                    )}
                  >
                    {confirmed ? "Confirmed!" : "✓ Confirm Safe"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
