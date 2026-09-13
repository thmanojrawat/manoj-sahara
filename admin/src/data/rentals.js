export const mockTenancies = [
  {
    id: 'ten-1',
    propertyId: 'prop-106',
    propertyName: 'Commercial Retail Showroom Prime Bypass',
    unitNumber: 'G-01',
    tenantName: 'Heritage Retail Lifestyle Pvt Ltd',
    contactPerson: 'Amitava Chakraborty',
    tenantPhone: '+91 98319 00123',
    tenantEmail: 'amitava.c@heritagegroup.org',
    monthlyRent: 185000,
    securityDeposit: 1110000,
    leaseStartDate: '01/09/2026',
    leaseEndDate: '31/08/2029',
    lockInPeriodMonths: 24,
    escalationRate: '5% annual',
    paymentStatus: 'Current', // Current, Due, Arrears
    arrearsAmount: 0,
    nextRentDueDate: '05/10/2026',
    lastPaymentReceivedDate: '03/09/2026',
    notes: 'Ground & mezzanine showroom. Security deposit safely held in escrow.'
  },
  {
    id: 'ten-2',
    propertyId: 'prop-102',
    propertyName: 'Corporate Executive Suite Grade A',
    unitNumber: 'CW-501',
    tenantName: 'CloudMatrix Analytics LLP',
    contactPerson: 'Sharmila Guha',
    tenantPhone: '+91 98309 44129',
    tenantEmail: 'sharmila@cloudmatrix.io',
    monthlyRent: 125000,
    securityDeposit: 750000,
    leaseStartDate: '01/10/2024',
    leaseEndDate: '30/09/2026',
    lockInPeriodMonths: 12,
    escalationRate: '6% annual',
    paymentStatus: 'Arrears', // Current, Due, Arrears
    arrearsAmount: 250000, // 2 months overdue
    nextRentDueDate: '05/09/2026',
    lastPaymentReceivedDate: '02/07/2026',
    notes: 'Lease expiring this month. 2 months rent overdue; renewal under review pending clearance.'
  },
  {
    id: 'ten-3',
    propertyId: 'prop-101',
    propertyName: 'Solitaire Sky Residence 3 BHK',
    unitNumber: 'B-201',
    tenantName: 'Rohan Bose',
    contactPerson: 'Rohan Bose',
    tenantPhone: '+91 98314 33211',
    tenantEmail: 'rohan.bose@pwc.com',
    monthlyRent: 42000,
    securityDeposit: 126000,
    leaseStartDate: '15/03/2026',
    leaseEndDate: '14/03/2027',
    lockInPeriodMonths: 11,
    escalationRate: '5%',
    paymentStatus: 'Current',
    arrearsAmount: 0,
    nextRentDueDate: '15/09/2026',
    lastPaymentReceivedDate: '14/08/2026',
    notes: 'Corporate residential lease with PwC Kolkata. Auto-debit payment on 15th.'
  }
];

export const mockAgreements = [
  {
    id: 'agr-1',
    agreementNumber: 'AGR-SL-2026-081',
    title: 'Commercial Lease Agreement - Ruby Crossing',
    type: 'Lease Agreement', // Owner Agreement, Broker Agreement, Booking Agreement, Lease Agreement, Sale Agreement
    firstParty: 'Subhashish Bhattacharya (Owner)',
    secondParty: 'Heritage Retail Lifestyle Pvt Ltd (Tenant)',
    propertyId: 'prop-106',
    propertyName: 'Commercial Retail Showroom Prime Bypass',
    executionDate: '01/09/2026',
    expiryDate: '31/08/2029',
    status: 'Active', // Draft, Active, Expired, Terminated
    value: 6660000,
    stampDutyPaid: 45000,
    registeredOffice: 'Alipore Registrar of Assurances'
  },
  {
    id: 'agr-2',
    agreementNumber: 'AGR-SL-2026-064',
    title: 'Sole Selling Agency Agreement - Sahara Solitaire Heights',
    type: 'Owner Agreement',
    firstParty: 'Priyanka Mukherjee (Owner)',
    secondParty: 'Sahara Real Estate Management Pvt Ltd',
    propertyId: 'prop-101',
    propertyName: 'Sahara Solitaire Heights',
    executionDate: '01/01/2026',
    expiryDate: '31/12/2027',
    status: 'Active',
    value: 180000000,
    stampDutyPaid: 15000,
    registeredOffice: 'Barasat Sub-Registrar'
  },
  {
    id: 'agr-3',
    agreementNumber: 'AGR-SL-2026-092',
    title: 'Agreement for Sale - Unit A-402',
    type: 'Sale Agreement',
    firstParty: 'Sahara Real Estate / Priyanka Mukherjee',
    secondParty: 'Rajesh Kumar Agarwal (Buyer)',
    propertyId: 'prop-101',
    propertyName: 'Solitaire Sky Residence 3 BHK',
    executionDate: '15/09/2026',
    expiryDate: '30/12/2026',
    status: 'Draft',
    value: 6800000,
    stampDutyPaid: 0,
    registeredOffice: 'ADSR Bidhannagar'
  },
  {
    id: 'agr-4',
    agreementNumber: 'AGR-SL-2025-019',
    title: 'Commercial Master Lease - Tech Vista Suite CW-501',
    type: 'Lease Agreement',
    firstParty: 'Sahara Tech Vista Properties',
    secondParty: 'CloudMatrix Analytics LLP',
    propertyId: 'prop-102',
    propertyName: 'Corporate Executive Suite Grade A',
    executionDate: '01/10/2024',
    expiryDate: '30/09/2026',
    status: 'Active',
    value: 3000000,
    stampDutyPaid: 22000,
    registeredOffice: 'Salt Lake Registry'
  }
];
