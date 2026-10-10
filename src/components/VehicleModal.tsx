import { useEffect, useState } from "react";
import {
  Check,
  ChevronRight,
  MapPin,
  Phone,
  Shield,
  X,
} from "lucide-react";
import type { Vehicle } from "@/types";
import { dealerInfo } from "@/data/mockData";
import { cn } from "@/lib/utils";
import "./VehicleModal.css";

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
  const isOffPremises = status === "off_premises";
  const label = isOffPremises
    ? "Off Premises"
    : status === "theft"
      ? "Suspected Theft in Progress"
      : "Suspected Theft";

  return (
    <span
      className={cn(
        "vehicle-status-chip",
        isOffPremises ? "vehicle-status-chip--amber" : "vehicle-status-chip--red",
      )}
    >
      {label}
    </span>
  );
}

function VehicleIllustration({ color }: { color: string }) {
  if (color === "Grabber Blue") {
    return (
      <img
        src="/mustang-gt-blue.png"
        alt="Grabber Blue Ford Mustang"
        className="vehicle-illustration vehicle-illustration--photo"
      />
    );
  }

  const colorMap: Record<string, string> = {
    White: "#f0f0f0",
    "Rapid Red": "#c0392b",
    "Iconic Silver": "#9e9e9e",
    "Cactus Gray": "#78909c",
    "Oxford White": "#f5f5f5",
  };
  const fill = colorMap[color] || "#888";

  return (
    <svg
      viewBox="0 0 200 90"
      className="vehicle-illustration"
      role="img"
      aria-label={`${color} Ford vehicle`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="10" y="45" width="180" height="28" rx="6" fill={fill} stroke="#555" strokeWidth="1.2" />
      <path d="M30 45 Q50 18 80 18 L130 18 Q158 18 172 45 Z" fill={fill} stroke="#555" strokeWidth="1.2" />
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

function getTelHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

function getAlertDescription(vehicle: Vehicle) {
  return vehicle.status === "off_premises"
    ? "Outside geofence"
    : "Rapid acceleration detected";
}

function getAlertSummary(vehicle: Vehicle) {
  if (vehicle.status === "off_premises") {
    return "The vehicle moved beyond the dealership geofence and its latest signal indicates it remains off-site. Confirm the departure before closing this alert.";
  }
  return "A rapid-acceleration signal raised a suspected-theft alert. Confirm whether this vehicle movement was authorized before escalating.";
}

function getEventName(label: string) {
  return label.replace(/^SVS\s*-\s*/i, "");
}

function getEventTime(time: string) {
  return time.replace(/\s*[—–-]\s*$/, "").trim();
}

function getEventDescription(label: string) {
  const eventName = getEventName(label).toLowerCase();
  if (eventName.includes("geofence")) return "Vehicle crossed the dealership geofence.";
  if (eventName.includes("ignition")) return "Ignition signal changed.";
  if (eventName.includes("motion")) return "Vehicle motion was detected.";
  return "Vehicle event recorded.";
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="vehicle-modal-section-label">{children}</p>;
}

function VehicleDetail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="vehicle-detail">
      <SectionLabel>{label}</SectionLabel>
      <p className="vehicle-detail-value">{children}</p>
    </div>
  );
}

function MapPreview() {
  return (
    <div className="vehicle-map-frame">
      <iframe
        title="Google Maps reference preview centered on the dealership"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        src="https://maps.google.com/maps?q=707+Serramonte+Blvd,+Colma,+CA+94014&output=embed&z=14&t=m"
      />
    </div>
  );
}

export function VehicleModal({ vehicle, onClose }: VehicleModalProps) {
  const [markSafeOpen, setMarkSafeOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const alertDescription = getAlertDescription(vehicle);
  const latestEvent = vehicle.activity.find((event) => event.active) ?? vehicle.activity[0];
  const lastSignal = latestEvent?.time ? getEventTime(latestEvent.time) : "Unavailable";

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  function handleConfirmSafe() {
    if (!selectedReason) return;
    setConfirmed(true);
    window.setTimeout(onClose, 900);
  }

  return (
    <div className="vehicle-modal-backdrop" onClick={onClose}>
      <div
        className={cn("vehicle-modal", vehicle.status === "off_premises" && "vehicle-modal--off-premises")}
        role="dialog"
        aria-modal="true"
        aria-labelledby="vehicle-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="vehicle-modal-layout">
          <section className="vehicle-details-panel">
            <div className="vehicle-title-block">
              <StatusBadge status={vehicle.status} />
              <VehicleIllustration color={vehicle.color} />
              <h2 id="vehicle-modal-title" className="vehicle-modal-title">
                {vehicle.color} {vehicle.year} Ford {vehicle.model}
              </h2>
              <p className="vehicle-modal-supporting-text">
                Vehicle details, last-known location and alert timeline.
              </p>
              <div className="vehicle-modal-contacts">
                <a
                  className="vehicle-modal-contact"
                  href={getTelHref(dealerInfo.phone)}
                  aria-label="Call emergency dealership contact"
                >
                  <Phone aria-hidden="true" />
                  Emergency contact
                </a>
                <a
                  className="vehicle-modal-contact"
                  href={getTelHref(dealerInfo.lawEnforcement.nonEmergencyPhone)}
                  aria-label={`Call ${dealerInfo.lawEnforcement.department}`}
                >
                  <Shield aria-hidden="true" />
                  Local police
                </a>
              </div>
            </div>

            <section className="vehicle-identification-card" aria-labelledby="vehicle-identification-heading">
              <h3 id="vehicle-identification-heading" className="vehicle-identification-heading">
                Vehicle identification
              </h3>
              <SectionLabel>VIN</SectionLabel>
              <p className="vehicle-vin">{vehicle.vin}</p>
            </section>

            <section className="vehicle-summary-section" aria-labelledby="vehicle-summary-heading">
              <div className="vehicle-summary-heading">
                <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
                  <path d="M23 1.5 25.4 7.1 31 9.5 25.4 11.9 23 17.5 20.6 11.9 15 9.5 20.6 7.1Z" fill="currentColor" />
                  <path d="M2 17H13M2 24H28M2 31H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <h3 id="vehicle-summary-heading" className="vehicle-modal-section-label">
                  Summary
                </h3>
              </div>
              <p className="vehicle-modal-summary">{getAlertSummary(vehicle)}</p>
            </section>

            <section className="vehicle-timeline-section" aria-labelledby="vehicle-timeline-heading">
              <div className="vehicle-timeline-heading">
                <h3 id="vehicle-timeline-heading" className="vehicle-modal-section-label">
                  Alert timeline
                </h3>
                <span className="vehicle-modal-supporting-text">(dealership local time)</span>
              </div>
              <ol className="vehicle-timeline">
                {[...vehicle.activity].reverse().map((event, index) => (
                  <li className="vehicle-timeline-item" key={`${event.label}-${index}`}>
                    <span
                      className={cn("vehicle-timeline-dot", event.active && "is-active")}
                      aria-hidden="true"
                    />
                    <div className="vehicle-timeline-copy">
                      <p className="vehicle-event-time">{getEventTime(event.time) || "Earlier"}</p>
                      <p className="vehicle-event-name">{getEventName(event.label)}</p>
                      <p className="vehicle-event-description">{getEventDescription(event.label)}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          </section>

          <section className="vehicle-location-panel">
            <header className="vehicle-location-header">
              <div className="vehicle-location-heading">
                <SectionLabel>Last known location</SectionLabel>
                <p className="vehicle-modal-supporting-text">Last signal {lastSignal} · local time</p>
              </div>
              <button
                type="button"
                className="vehicle-modal-close"
                onClick={onClose}
                aria-label="Close vehicle details"
              >
                <X aria-hidden="true" />
              </button>
            </header>

            <div className="vehicle-map-area">
              <MapPreview />
              <div className="vehicle-map-note">
                <MapPin aria-hidden="true" />
                <span>Dealership reference map · vehicle GPS unavailable</span>
              </div>
            </div>

            <div className="vehicle-action-bar">
              <button type="button" className="btn-primary vehicle-case-action">
                Start Stolen Vehicles Case
              </button>
              <button type="button" className="vehicle-modal-action">
                Escalate
              </button>
              <button
                type="button"
                className="vehicle-modal-mark-safe"
                aria-expanded={markSafeOpen}
                onClick={() => {
                  setMarkSafeOpen((open) => !open);
                  setConfirmed(false);
                  setSelectedReason("");
                }}
              >
                Mark Safe <ChevronRight aria-hidden="true" />
              </button>
            </div>

            {markSafeOpen && (
              <div className="vehicle-mark-safe-panel">
                <div className="vehicle-mark-safe-content">
                  <span className="vehicle-mark-safe-title">Mark this vehicle as safe?</span>
                  <label className="vehicle-reason-field">
                    <span className="sr-only">Reason</span>
                    <select
                      value={selectedReason}
                      onChange={(event) => setSelectedReason(event.target.value)}
                    >
                      <option value="">Select a reason</option>
                      {MARK_SAFE_REASONS.map((reason) => (
                        <option key={reason} value={reason}>
                          {reason}
                        </option>
                      ))}
                    </select>
                  </label>
                  <button
                    type="button"
                    className="vehicle-confirm-safe"
                    disabled={!selectedReason}
                    onClick={handleConfirmSafe}
                  >
                    {confirmed ? <><Check aria-hidden="true" /> Confirmed</> : "Confirm Safe"}
                  </button>
                  <button
                    type="button"
                    className="vehicle-cancel-safe"
                    onClick={() => {
                      setMarkSafeOpen(false);
                      setSelectedReason("");
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="vehicle-signal-details">
              <VehicleDetail label="Signal">{alertDescription}</VehicleDetail>
              <VehicleDetail label="Alert age">≥ {vehicle.duration} min</VehicleDetail>
              <VehicleDetail label="Distance from lot">{vehicle.distance.toFixed(1)} mi</VehicleDetail>
              <VehicleDetail label="Last signal">{lastSignal}</VehicleDetail>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
