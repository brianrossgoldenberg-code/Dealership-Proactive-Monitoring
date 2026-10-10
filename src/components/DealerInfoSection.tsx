import { useState } from "react";
import { Users, Shield, ChevronRight, ChevronDown, Phone } from "lucide-react";
import { DealerInfo } from "@/types";
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
        className="flex items-center gap-1.5 w-full px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-widest hover:text-foreground transition-colors"
      >
        {expanded ? (
          <ChevronDown className="w-3.5 h-3.5" />
        ) : (
          <ChevronRight className="w-3.5 h-3.5" />
        )}
        Dealership Monitoring Data
      </button>

      {expanded && (
        <div className="px-6 pb-8">
          <div className="flex items-center gap-3 mb-5">
            <SerramonteLogo size={32} />
            <div className="flex flex-col leading-tight border-l border-border pl-3">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                Dealer Information
              </span>
              <span className="text-sm font-semibold text-foreground">Serramonte Ford</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left column */}
            <div className="space-y-6">
              {/* Priority Contacts */}
              <div>
                <div className="flex items-center gap-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-3">
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
                        <span className="text-xs text-muted-foreground bg-muted px-2.5 py-0.5 rounded-full border border-border shrink-0">
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
              {/* Law Enforcement */}
              <div>
                <div className="flex items-center gap-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2">
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
