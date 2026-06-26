export type VehicleStatus = "theft_risk" | "off_premises" | "theft";

export interface ActivityEvent {
  label: string;
  time: string;
  active?: boolean;
}

export interface Vehicle {
  id: string;
  year: number;
  model: string;
  trim: string;
  color: string;
  vin: string;
  status: VehicleStatus;
  duration: number; // minutes
  distance: number; // miles
  imageUrl?: string;
  activity: ActivityEvent[];
}

export interface PriorityContact {
  rank: number;
  name: string;
  phone: string;
  email: string;
  alertsOn: boolean;
}

export interface LawEnforcement {
  department: string;
  contact: string;
  phone: string;
  nonEmergencyPhone: string;
  jurisdiction: string;
}

export interface BusinessHours {
  day: string;
  hours: string;
}

export interface DealerInfo {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  businessHours: BusinessHours[];
  contacts: PriorityContact[];
  lawEnforcement: LawEnforcement;
}

export type TimeMode = "business_hours" | "nearing_close" | "after_hours";
