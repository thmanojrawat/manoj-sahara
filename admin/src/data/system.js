export const mockUsers = [
  {
    id: 'usr-1',
    name: 'Siddhartha Bannerjee',
    email: 'admin@sahararealty.com',
    role: 'Super Admin',
    status: 'Active',
    lastLogin: '13/09/2026, 09:45 AM',
    createdDate: '01/01/2024',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'usr-2',
    name: 'Arijit Sen',
    email: 'arijit.sen@sahararealty.com',
    role: 'Sales Manager',
    status: 'Active',
    lastLogin: '13/09/2026, 10:15 AM',
    createdDate: '15/02/2024',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'usr-3',
    name: 'Sohini Ghosh',
    email: 'sohini.ghosh@sahararealty.com',
    role: 'Agent',
    status: 'Active',
    lastLogin: '12/09/2026, 06:20 PM',
    createdDate: '10/03/2024',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'usr-4',
    name: 'Tanushree Paul',
    email: 'tanushree.p@sahararealty.com',
    role: 'Agent',
    status: 'Active',
    lastLogin: '13/09/2026, 08:30 AM',
    createdDate: '01/04/2024',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'usr-5',
    name: 'Debmalya Mukherjee',
    email: 'accounts@sahararealty.com',
    role: 'Accountant',
    status: 'Active',
    lastLogin: '12/09/2026, 05:00 PM',
    createdDate: '01/02/2024',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80'
  }
];

export const mockRoles = [
  {
    id: 'role-1',
    name: 'Super Admin',
    description: 'Full unconstrained system authority, audit access, financial approval and settings configuration.',
    userCount: 1,
    permissions: {
      properties: { view: true, create: true, edit: true, delete: true },
      leads: { view: true, create: true, edit: true, delete: true, assign: true },
      deals: { view: true, create: true, edit: true, approve: true },
      payments: { view: true, create: true, edit: true, approve: true },
      reports: { view: true, export: true },
      system: { view: true, edit: true }
    }
  },
  {
    id: 'role-2',
    name: 'Sales Manager',
    description: 'Lead distribution, broker supervision, deal structuring and site visit coordination.',
    userCount: 2,
    permissions: {
      properties: { view: true, create: true, edit: true, delete: false },
      leads: { view: true, create: true, edit: true, delete: true, assign: true },
      deals: { view: true, create: true, edit: true, approve: true },
      payments: { view: true, create: true, edit: false, approve: false },
      reports: { view: true, export: true },
      system: { view: false, edit: false }
    }
  },
  {
    id: 'role-3',
    name: 'Agent / Broker',
    description: 'Assigned lead follow-ups, conducting site visits, registering client requirements and drafting deals.',
    userCount: 6,
    permissions: {
      properties: { view: true, create: false, edit: false, delete: false },
      leads: { view: true, create: true, edit: true, delete: false, assign: false },
      deals: { view: true, create: true, edit: false, approve: false },
      payments: { view: false, create: false, edit: false, approve: false },
      reports: { view: false, export: false },
      system: { view: false, edit: false }
    }
  },
  {
    id: 'role-4',
    name: 'Accountant',
    description: 'Booking payment ledger, tracking overdue installments, commission verification and tax invoices.',
    userCount: 1,
    permissions: {
      properties: { view: true, create: false, edit: false, delete: false },
      leads: { view: false, create: false, edit: false, delete: false, assign: false },
      deals: { view: true, create: false, edit: false, approve: false },
      payments: { view: true, create: true, edit: true, approve: true },
      reports: { view: true, export: true },
      system: { view: false, edit: false }
    }
  }
];

export const mockNotifications = [
  {
    id: 'notif-1',
    type: 'deal',
    title: 'Booking Confirmed for Unit A-402',
    message: 'Rajesh Kumar Agarwal finalized booking token of ₹10,00,000 for Sahara Solitaire Heights.',
    timestamp: '10 mins ago',
    read: false,
    link: '/bookings'
  },
  {
    id: 'notif-2',
    type: 'visit',
    title: 'Site Visit Tomorrow at New Town',
    message: 'Inspection scheduled with Soumyajit Chatterjee at 11:30 AM by Arijit Sen.',
    timestamp: '1 hour ago',
    read: false,
    link: '/site-visits'
  },
  {
    id: 'notif-3',
    type: 'payment',
    title: 'Milestone Payment Overdue',
    message: 'Vikram Singhania plinth milestone payment ₹48,00,000 is overdue by 3 days.',
    timestamp: '3 hours ago',
    read: false,
    link: '/payments'
  },
  {
    id: 'notif-4',
    type: 'lead',
    title: 'New High-Value Inquiry',
    message: 'Commercial office inquiry in Sector V Salt Lake assigned to Tanushree Paul.',
    timestamp: 'Yesterday',
    read: true,
    link: '/leads'
  },
  {
    id: 'notif-5',
    type: 'tenancy',
    title: 'Commercial Lease Renewal Due',
    message: 'CloudMatrix Analytics lease for Tech Vista Suite CW-501 expires on 30/09/2026.',
    timestamp: '2 days ago',
    read: true,
    link: '/tenancies'
  }
];

export const mockActivities = [
  {
    id: 'act-1',
    user: 'Siddhartha Bannerjee',
    action: 'Payment Approved',
    entity: 'Payment #RCP-2026-00341 (₹10,00,000)',
    timestamp: '13/09/2026, 10:14 AM',
    details: 'Verified bank clearance of NEFT transaction from HDFC Bank.'
  },
  {
    id: 'act-2',
    user: 'Arijit Sen',
    action: 'Lead Converted',
    entity: 'Lead Soumyajit Chatterjee → Client',
    timestamp: '12/09/2026, 04:30 PM',
    details: 'Converted lead following positive site inspection and unit preference confirmation.'
  },
  {
    id: 'act-3',
    user: 'Tanushree Paul',
    action: 'Deal Stage Updated',
    entity: 'Deal Sector V Cyber Wing Commercial Sale',
    timestamp: '12/09/2026, 02:15 PM',
    details: 'Advanced deal stage to Negotiation with expected value of ₹1.70 Cr.'
  },
  {
    id: 'act-4',
    user: 'Sohini Ghosh',
    action: 'Site Visit Completed',
    entity: 'Site Visit with Indrani Dasgupta',
    timestamp: '11/09/2026, 05:45 PM',
    details: 'Conducted guided showing of Ballygunge Circular Rd luxury mansion.'
  },
  {
    id: 'act-5',
    user: 'Siddhartha Bannerjee',
    action: 'Property Listed',
    entity: 'Property Solitaire Sky Residence 3 BHK',
    timestamp: '10/09/2026, 11:20 AM',
    details: 'Approved public listing and assigned broker Arijit Sen.'
  }
];

export const mockSettings = {
  company: {
    name: 'Sahara Real Estate Management Platform',
    legalName: 'Sahara Infra-Realty Private Limited',
    reraReg: 'WBRERA/A/KOL/2023/000108',
    cin: 'U70109WB2023PTC261900',
    email: 'contact@sahararealty.com',
    supportPhone: '+91 33 2357 8800',
    officeAddress: 'Level 14, Sahara Tech Vista Towers, Block EP & GP, Sector V, Bidhannagar, Kolkata 700091, West Bengal, India'
  },
  localization: {
    currency: 'INR (₹)',
    currencySymbol: '₹',
    numberSystem: 'Indian (Lakhs & Crores)',
    dateFormat: 'DD/MM/YYYY',
    timeZone: 'Asia/Kolkata (IST)'
  },
  leadSources: ['Website Inquiry', 'MagicBricks', '99acres', 'Referral', 'Walk-in', 'Billboard', 'Facebook Ad', 'Direct Outreach'],
  propertyTypes: ['Apartment', 'Commercial Office', 'Retail Showroom', 'Luxury Villa / Duplex', 'Penthouse', 'Plotted Land', 'Warehouse'],
  dealStages: ['Lead', 'Qualified', 'Negotiation', 'Agreement', 'Booking', 'Closed Won', 'Closed Lost'],
  commissionRules: {
    standardResidentialRate: 2.0,
    luxuryResidentialRate: 2.5,
    commercialSaleRate: 2.0,
    commercialLeaseRate: 100, // 1 month rent
    minimumPayoutThreshold: 25000
  }
};
