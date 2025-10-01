export interface Agent {
  name: string;
  title: string;
  phone: string;
  email: string;
  photoUrl: string;
}

export interface FamilyMember {
  id: number;
  name: string;
  relationship: string;
  dob: string;
  age: number;
}

export interface ActivityLogItem {
  id: number;
  date: string;
  product: string;
  activity: string;
  remarks: string;
}

export interface LeadDetails {
  suggestedInsurer: string;
  suggestedPlan: string;
  suggestedSumInsured: number;
}

export interface ActivePolicy {
  id: string;
  insurer: string;
  plan: string;
  sumInsured: number;
  renewalDate: string;
}

export interface ActiveHealthPolicy extends ActivePolicy {
  premium: number;
}

export interface ActiveLifePolicy extends ActivePolicy {
  planType: string;
  insuredName: string;
}

export interface ActiveVehiclePolicy {
  id: string;
  regNo: string;
  mmv: string;
  premium: number;
  idv: number;
  expiryDate: string;
  insurer: string;
}

export interface PolicyDetails<T> {
  status: 'Active' | 'Opportunity' | 'Declined' | 'OutOfScope';
  reason?: string;
  tentativePremium?: number;
  potentialPayout?: number;
  followUpDate?: string;
  isDeclined?: boolean;
  declineReason?: string;
  leadDetails?: LeadDetails;
  cjLink?: string;
  policies?: T[];
  vehicles?: ActiveVehiclePolicy[];
}

export interface Policies {
  health: PolicyDetails<ActiveHealthPolicy>;
  life: PolicyDetails<ActiveLifePolicy>;
  motor: PolicyDetails<never>; // vehicles are handled separately
}

export interface Customer {
  id: number;
  name: string;
  contact: string;
  alternateContact?: string | null;
  email?: string | null;
  city: string;
  area: string;
  fullAddress?: string | null;
  dob?: string | null;
  occupation?: string | null;
  leadSource?: string | null;
  vehicleCount: number;
  familyMembers: FamilyMember[];
  activityLog: ActivityLogItem[];
  policies: Policies;
}

export const mockAgentData: Agent = {
  name: "Rajesh Kumar",
  title: "Certified Insurance Advisor",
  phone: "+919876512345",
  email: "rajesh.k@gmail.com",
  photoUrl: "https://i.pravatar.cc/150?u=rajeshkumar",
};

export const mockCustomers: Customer[] = [
  {
    id: 1, name: "Rohan Sharma", contact: "+919876543210", alternateContact: "+919876511111", email: "rohan.s@example.com",
    city: "Mumbai", area: "Andheri", fullAddress: "12B, Skyline Apartments, Andheri West", dob: "1988-05-15", occupation: "Software Engineer",
    leadSource: "Referral by Ankit Kumar", vehicleCount: 1,
    familyMembers: [{ id: 101, name: "Priya Sharma", relationship: "Spouse", dob: "1990-03-22", age: 34 }, { id: 102, name: "Aarav Sharma", relationship: "Son", dob: "2018-09-10", age: 6 }],
    activityLog: [{ id: 101, date: "2024-09-18", product: "Health", activity: "Quote Sent", remarks: "Sent quote for Family Floater Plan A." }, { id: 102, date: "2024-09-16", product: "General", activity: "Initial Call", remarks: "Discussed needs." }],
    policies: {
      health: { status: "Opportunity", reason: "Family health cover needed.", tentativePremium: 18000, potentialPayout: 2700, followUpDate: "2024-10-25", leadDetails: { suggestedInsurer: "HDFC Ergo", suggestedPlan: "Optima Restore", suggestedSumInsured: 1000000 }, cjLink: "#" },
      life: { status: "Active", policies: [{ id: "L1", insurer: "LIC", plan: "Jeevan Anand", planType: "Endowment", sumInsured: 5000000, insuredName: "Rohan Sharma", renewalDate: "2025-07-20" }] },
      motor: { status: "Active", vehicles: [{ id: "V1", regNo: "MH02AB1234", mmv: "Honda City VX", premium: 22000, idv: 850000, expiryDate: "2025-03-15", insurer: "Bajaj Allianz" }] }
    }
  },
  {
    id: 2, name: "Priya Verma", contact: "+918765432109", alternateContact: null, email: "priya.v@example.com",
    city: "Delhi", area: "Saket", fullAddress: "A-45, First Floor, Saket", dob: "1992-11-20", occupation: "Graphic Designer",
    leadSource: "Website Inquiry", vehicleCount: 0, familyMembers: [],
    activityLog: [{ id: 201, date: "2024-09-19", product: "Life", activity: "Follow-up Scheduled", remarks: "Set reminder for Oct 5th." }],
    policies: {
      health: { status: "Active", policies: [{ id: "H2", insurer: "Star Health", plan: "Young Star", sumInsured: 500000, premium: 25000, renewalDate: "2024-10-15" }] },
      life: { status: "Opportunity", reason: "Underinsured, needs term plan.", tentativePremium: 15000, potentialPayout: 2250, followUpDate: "2024-10-05", leadDetails: { suggestedInsurer: "Max Life", suggestedPlan: "Smart Secure Plus", suggestedSumInsured: 10000000 } },
      motor: { status: "OutOfScope", reason: "Does not own a vehicle." }
    }
  },
  {
    id: 3, name: "Amit Patel", contact: "+917654321098", alternateContact: null, email: "a.patel@example.com",
    city: "Ahmedabad", area: "Navrangpura", fullAddress: "7, Ashirwad Bunglows", dob: "1984-02-10", occupation: "Business Owner",
    leadSource: "Walk-in", vehicleCount: 2, familyMembers: [{ id: 301, name: "Mina Patel", relationship: "Spouse", dob: "1986-04-15", age: 38 }],
    activityLog: [{ id: 301, date: "2024-09-12", product: "Health", activity: "Marked Declined", remarks: "Has corporate coverage." }],
    policies: {
      health: { status: "Declined", isDeclined: true, declineReason: "Has corporate health cover." },
      life: { status: "Opportunity", reason: "Retirement plan.", tentativePremium: 50000, potentialPayout: 7500, leadDetails: { suggestedInsurer: "ICICI Prudential", suggestedPlan: "Signature Elite", suggestedSumInsured: 20000000 }, cjLink: "#" },
      motor: { status: "Active", vehicles: [{ id: "V3A", regNo: "GJ01CD5678", mmv: "Toyota Fortuner", premium: 45000, idv: 3200000, expiryDate: "2024-10-15", insurer: "HDFC Ergo" }, { id: "V3B", regNo: "GJ01EF9012", mmv: "Maruti Swift", premium: 12000, idv: 550000, expiryDate: "2025-05-10", insurer: "Go Digit" }] }
    }
  },
  {
    id: 4, name: "Shah Rukh Khan", contact: "+919988776655", email: "srk.actor@example.com", city: "Mumbai", area: "Bandra", occupation: "Actor", leadSource: "High Net Worth Referral", vehicleCount: 5,
    familyMembers: [{id: 401, name: "Gauri Khan", relationship: "Spouse", dob: "1970-10-08", age: 53}],
    activityLog: [{id: 401, date: "2024-09-20", product: "Motor", activity: "Fleet renewal discussion", remarks: "Discussed renewal for 3 cars."}],
    policies: {
      health: { status: "Active", policies: [{id: "H4", insurer: "Aditya Birla", plan: "Activ Assure Diamond", sumInsured: 20000000, premium: 150000, renewalDate: "2025-08-01"}] },
      life: { status: "Opportunity", reason: "Portfolio review for additional cover.", tentativePremium: 500000, potentialPayout: 75000, followUpDate: "2024-10-10", leadDetails: {suggestedInsurer: "Tata AIA", suggestedPlan: "Param Rakshak Plus", suggestedSumInsured: 500000000}},
      motor: { status: "Active", vehicles: [{id: "V4A", regNo: "MH01SRK001", mmv: "Rolls-Royce Cullinan", premium: 350000, idv: 50000000, expiryDate: "2025-04-20", insurer: "HDFC Ergo"}]}
    }
  },
  {
    id: 5, name: "Deepika Padukone", contact: "+919898989898", email: "deepika.p@example.com", city: "Mumbai", area: "Prabhadevi", occupation: "Actress", leadSource: "Social Media Inquiry", vehicleCount: 2,
    familyMembers: [],
    activityLog: [{id: 501, date: "2024-09-15", product: "Health", activity: "Initial consultation", remarks: "Looking for a comprehensive global health plan."}],
    policies: {
      health: { status: "Opportunity", reason: "Requires global health coverage.", tentativePremium: 120000, potentialPayout: 18000, followUpDate: "2024-10-08", leadDetails: {suggestedInsurer: "Niva Bupa", suggestedPlan: "Health Premia Platinum", suggestedSumInsured: 30000000}},
      life: { status: "Declined", isDeclined: true, declineReason: "Already has sufficient coverage through another advisor."},
      motor: { status: "Active", vehicles: [{id: "V5A", regNo: "MH02DP1234", mmv: "Mercedes-Maybach S580", premium: 280000, idv: 25000000, expiryDate: "2025-06-12", insurer: "ICICI Lombard"}] }
    }
  },
  {
    id: 6, name: "Akshay Kumar", contact: "+919192939495", email: "akshay.k@example.com", city: "Mumbai", area: "Juhu", occupation: "Actor", leadSource: "Existing Client", vehicleCount: 3,
    familyMembers: [{id: 601, name: "Twinkle Khanna", relationship: "Spouse", dob: "1974-12-29", age: 49}],
    activityLog: [{id: 601, date: "2024-09-05", product: "Life", activity: "Policy issued", remarks: "Jeevan Amar policy issued."}],
    policies: {
      health: { status: "Active", policies: [{id: "H6", insurer: "Care Health", plan: "Care Supreme", sumInsured: 10000000, premium: 95000, renewalDate: "2025-01-25"}] },
      life: { status: "Active", policies: [{id: "L6", insurer: "LIC", plan: "Jeevan Amar", planType: "Term", sumInsured: 100000000, insuredName: "Akshay Kumar", renewalDate: "2025-09-01"}] },
      motor: { status: "Opportunity", reason: "New Porsche Cayenne added to fleet, needs insurance.", tentativePremium: 250000, potentialPayout: 12500, leadDetails: {suggestedInsurer: "Royal Sundaram", suggestedPlan: "Private Car Package Policy", suggestedSumInsured: 18000000}}
    }
  },
  {
    id: 7, name: "Alia Bhatt", contact: "+919000011111", email: "alia.b@example.com", city: "Mumbai", area: "Juhu", occupation: "Actress", leadSource: "Referral", vehicleCount: 1,
    familyMembers: [],
    activityLog: [{id: 701, date: "2024-09-21", product: "General", activity: "New Client Onboarding", remarks: "First meeting, discussed overall needs."}],
    policies: {
      health: { status: "Opportunity", reason: "First-time health insurance buyer", tentativePremium: 45000, potentialPayout: 6750, followUpDate: "2024-10-15", leadDetails: {suggestedInsurer: "Star Health", suggestedPlan: "Comprehensive", suggestedSumInsured: 10000000}},
      life: { status: "Opportunity", reason: "Needs to start investment planning with ULIP.", tentativePremium: 200000, potentialPayout: 30000, followUpDate: "2024-10-18", leadDetails: {suggestedInsurer: "HDFC Life", suggestedPlan: "Click 2 Wealth", suggestedSumInsured: 20000000}},
      motor: { status: "Active", vehicles: [{id: "V7A", regNo: "MH01AB0001", mmv: "Range Rover Vogue", premium: 200000, idv: 15000000, expiryDate: "2025-07-30", insurer: "Go Digit"}] }
    }
  }
];