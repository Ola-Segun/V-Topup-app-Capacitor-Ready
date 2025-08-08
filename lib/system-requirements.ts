export interface SystemRequirement {
  category: string
  priority: 'High' | 'Medium' | 'Low'
  status: 'Complete' | 'Partial' | 'Missing'
  estimatedHours: number
  dependencies: string[]
  description: string
}

export const adminRequirements: SystemRequirement[] = [
  {
    category: "Service Provider Management",
    priority: "High",
    status: "Missing",
    estimatedHours: 40,
    dependencies: ["Database Schema", "API Integration"],
    description: "System to manage multiple service providers (VTPass, Baxi, etc.) with failover capabilities"
  },
  {
    category: "Real-time Transaction Monitoring",
    priority: "High", 
    status: "Partial",
    estimatedHours: 32,
    dependencies: ["WebSocket Implementation", "Database Triggers"],
    description: "Live dashboard showing transaction status, success rates, and system health"
  },
  {
    category: "Commission & Fee Management",
    priority: "High",
    status: "Missing", 
    estimatedHours: 24,
    dependencies: ["Admin Interface", "Database Schema"],
    description: "Dynamic configuration of commission rates and fees per service type"
  },
  {
    category: "User KYC Workflow",
    priority: "High",
    status: "Partial",
    estimatedHours: 48,
    dependencies: ["File Upload", "Document Verification API"],
    description: "Complete KYC verification process with document upload and approval workflow"
  },
  {
    category: "Advanced Analytics",
    priority: "Medium",
    status: "Partial",
    estimatedHours: 56,
    dependencies: ["Data Warehouse", "Reporting Engine"],
    description: "Revenue forecasting, user behavior analytics, and custom report generation"
  }
]

export const userRequirements: SystemRequirement[] = [
  {
    category: "Multiple Funding Methods",
    priority: "High",
    status: "Partial",
    estimatedHours: 40,
    dependencies: ["Payment Gateway Integration", "Bank API"],
    description: "Support for bank transfer, card payments, USSD, and mobile money"
  },
  {
    category: "Transaction Scheduling",
    priority: "High",
    status: "Missing",
    estimatedHours: 32,
    dependencies: ["Cron Jobs", "Notification System"],
    description: "Recurring payments and scheduled transactions with notifications"
  },
  {
    category: "Enhanced Security",
    priority: "High",
    status: "Partial", 
    estimatedHours: 36,
    dependencies: ["2FA Service", "Device Management"],
    description: "Two-factor authentication, transaction PINs, and device management"
  },
  {
    category: "Wallet-to-Wallet Transfer",
    priority: "Medium",
    status: "Missing",
    estimatedHours: 28,
    dependencies: ["User Search", "Transfer Limits"],
    description: "P2P transfers between app users with limits and verification"
  },
  {
    category: "Budget Management",
    priority: "Medium",
    status: "Missing",
    estimatedHours: 24,
    dependencies: ["Analytics Engine", "Notification System"],
    description: "Spending limits, budget tracking, and financial insights"
  }
]

export const additionalServices = {
  financial: [
    "Bank Transfer",
    "Mobile Money (MTN MoMo, Airtel Money, etc.)",
    "Wallet Top-up via USSD",
    "Bill Splitting",
    "Micro-savings/Investment"
  ],
  government: [
    "Tax Payments (FIRS, State IGR)",
    "Vehicle Registration Renewal", 
    "Driver's License Renewal",
    "Passport Application Fees",
    "Court Fines and Penalties"
  ],
  education: [
    "School Fees Payment",
    "WAEC/NECO Registration",
    "JAMB Registration and Result Checking",
    "University Application Fees",
    "Online Course Subscriptions"
  ],
  entertainment: [
    "Gaming Credits (Steam, PlayStation, Xbox)",
    "Streaming Services (Netflix, Spotify, Apple Music)",
    "Event and Concert Tickets",
    "Movie Cinema Tickets",
    "Sports Betting Top-up"
  ],
  transportation: [
    "Fuel Station Payments",
    "Toll Gate Payments",
    "Parking Fees",
    "Public Transport Cards (BRT, Metro)",
    "Ride-hailing Credits (Uber, Bolt)"
  ],
  healthcare: [
    "Hospital Bill Payments",
    "Health Insurance Premiums",
    "Pharmacy Payments",
    "Telemedicine Consultations",
    "Medical Test Packages"
  ],
  travel: [
    "Flight Booking Payments",
    "Hotel Reservations",
    "Travel Insurance",
    "Visa Application Fees",
    "Car Rental Services"
  ],
  ecommerce: [
    "Online Shopping Payments",
    "Gift Card Purchases",
    "Loyalty Points Top-up",
    "Marketplace Vendor Payments",
    "Subscription Box Services"
  ]
}

export function calculateTotalImplementationTime(): number {
  const adminHours = adminRequirements.reduce((total, req) => total + req.estimatedHours, 0)
  const userHours = userRequirements.reduce((total, req) => total + req.estimatedHours, 0)
  return adminHours + userHours
}

export function getHighPriorityRequirements(): SystemRequirement[] {
  return [...adminRequirements, ...userRequirements].filter(req => req.priority === 'High')
}

export function getRequirementsByStatus(status: SystemRequirement['status']): SystemRequirement[] {
  return [...adminRequirements, ...userRequirements].filter(req => req.status === status)
}
