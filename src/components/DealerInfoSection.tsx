import { useState } from "react";
import { MapPin, Clock, Users, Shield, ChevronRight, ChevronDown, Phone, Mail } from "lucide-react";
import { DealerInfo } from "@/types";
import { cn } from "@/lib/utils";
import SerramonteLogo from "@/components/SerramonteLogo";

interface DealerInfoSectionProps {
  dealer: DealerInfo;
}

export function DealerInfoSection({ dealer }: DealerInfoSectionProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border-t border-border">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex items-center gap-1.5 w-full px-6 py-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        {expanded ? (
          <ChevronDown className="w-3.5 h-3.5" />
        ) : (
          <ChevronRight className="w-3.5 h-3.5" />
        )}
        Dealership monitoring data
      </button>

      {expanded && (
        <div className="px-6 pb-8">
          <div className="flex items-center gap-2 mb-4">
            <SerramonteLogo size={36} />
            <h2 className="text-lg font-semibold text-foreground">Dealer Information</h2>
          </div>

          <div className="grid grid-cols-2 gap-8">
            {/* Left column */}
            <div className="space-y-6">
              {/* Address */}
              <div>
                <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-2">
                  <MapPin className="w-3.5 h-3.5" />
                  Address
                </div>
                <p className="text-sm text-foreground">{dealer.address}</p>
                <p className="text-sm text-foreground">
                  {dealer.city}, {dealer.state} {dealer.zip}
                </p>
              </div>

              {/* Priority Contacts */}
              <div>
                <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-3">
                  <Users className="w-3.5 h-3.5" />
                  Priority Contacts
                </div>
                <div className="space-y-4">
                  {dealer.contacts.map((contact) => (
                    <div key={contact.rank} className="flex items-start justify-between">
                      <div className="flex items-start gap-2">
                        <span className="text-xs text-muted-foreground w-4 shrink-0 mt-0.5">
                          {contact.rank}
                        </span>
                        <div>
                          <p className="text-sm font-medium text-foreground">{contact.name}</p>
                          <p className="text-xs text-muted-foreground">{contact.phone}</p>
                          <p className="text-xs text-primary">{contact.email}</p>
                        </div>
                      </div>
                      {contact.alertsOn && (
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded shrink-0">
                          Alerts On
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-6">
              {/* Business Hours */}
              <div>
                <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-2">
                  <Clock className="w-3.5 h-3.5" />
                  Business Hours
                </div>
                <div className="space-y-1">
                  {dealer.businessHours.map((bh) => (
                    <div key={bh.day} className="flex justify-between text-sm">
                      <span className="text-foreground">{bh.day}</span>
                      <span
                        className={cn(
                          bh.hours === "Closed"
                            ? "text-muted-foreground"
                            : "text-foreground"
                        )}
                      >
                        {bh.hours}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Law Enforcement */}
              <div>
                <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-2">
                  <Shield className="w-3.5 h-3.5" />
                  Local Law Enforcement
                </div>
                <p className="text-sm font-medium text-foreground">
                  {dealer.lawEnforcement.department}
                </p>
                <p className="text-sm text-foreground">{dealer.lawEnforcement.contact}</p>
                <div className="mt-1 space-y-0.5">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    {dealer.lawEnforcement.phone}
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    {dealer.lawEnforcement.nonEmergencyPhone}
                  </p>
                  <p className="text-xs text-muted-foreground">{dealer.lawEnforcement.jurisdiction}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
