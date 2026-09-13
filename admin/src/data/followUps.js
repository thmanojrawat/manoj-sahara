export const mockFollowUps = [
  {
    id: 'fup-1',
    leadId: 'lead-102',
    leadName: 'Anirban Sengupta',
    clientId: null,
    clientName: null,
    type: 'Meeting',
    dueDate: '13/09/2026', // Today
    dueTime: '03:30 PM',
    assignedBrokerId: 'brk-4',
    assignedBrokerName: 'Tanushree Paul',
    priority: 'High',
    status: 'Pending', // Pending, Completed
    category: 'Today', // Today, Overdue, Upcoming, Completed
    notes: 'Present commercial floorplate customization draft and revised per-sq-ft quotation for Sector V office.',
    createdAt: '10/09/2026'
  },
  {
    id: 'fup-2',
    leadId: 'lead-105',
    leadName: 'Rituparna Bose',
    clientId: null,
    clientName: null,
    type: 'Call',
    dueDate: '13/09/2026', // Today
    dueTime: '11:00 AM',
    assignedBrokerId: 'brk-1',
    assignedBrokerName: 'Arijit Sen',
    priority: 'Medium',
    status: 'Pending',
    category: 'Today',
    notes: 'First discovery call following Facebook Ad lead generation. Understand budget and preferred BHK format.',
    createdAt: '12/09/2026'
  },
  {
    id: 'fup-3',
    leadId: 'lead-103',
    leadName: 'Indrani Dasgupta',
    clientId: null,
    clientName: null,
    type: 'WhatsApp',
    dueDate: '11/09/2026', // Overdue
    dueTime: '05:00 PM',
    assignedBrokerId: 'brk-2',
    assignedBrokerName: 'Sohini Ghosh',
    priority: 'High',
    status: 'Pending',
    category: 'Overdue',
    notes: 'Share walkthrough brochure and video tour of the Ballygunge Circular Rd heritage mansion.',
    createdAt: '08/09/2026'
  },
  {
    id: 'fup-4',
    leadId: null,
    leadName: null,
    clientId: 'cli-2',
    clientName: 'Dr. Debanjan Mitra',
    type: 'Call',
    dueDate: '10/09/2026', // Overdue
    dueTime: '02:00 PM',
    assignedBrokerId: 'brk-1',
    assignedBrokerName: 'Arijit Sen',
    priority: 'High',
    status: 'Pending',
    category: 'Overdue',
    notes: 'Follow up on SBI loan sanction letter copy for Unit A-801 reservation.',
    createdAt: '07/09/2026'
  },
  {
    id: 'fup-5',
    leadId: 'lead-101',
    leadName: 'Soumyajit Chatterjee',
    clientId: null,
    clientName: null,
    type: 'Site Visit',
    dueDate: '14/09/2026', // Upcoming
    dueTime: '11:30 AM',
    assignedBrokerId: 'brk-1',
    assignedBrokerName: 'Arijit Sen',
    priority: 'High',
    status: 'Pending',
    category: 'Upcoming',
    notes: 'Second inspection visit with spouse at Sahara Solitaire Heights Tower A.',
    createdAt: '11/09/2026'
  },
  {
    id: 'fup-6',
    leadId: 'lead-104',
    leadName: 'Pratik Mukherjee',
    clientId: null,
    clientName: null,
    type: 'Email',
    dueDate: '14/09/2026', // Upcoming
    dueTime: '10:00 AM',
    assignedBrokerId: 'brk-3',
    assignedBrokerName: 'Vikramjit Das',
    priority: 'Low',
    status: 'Pending',
    category: 'Upcoming',
    notes: 'Email payment schedule options for 2 BHK Emerald Grand Rajarhat.',
    createdAt: '11/09/2026'
  },
  {
    id: 'fup-7',
    leadId: null,
    leadName: null,
    clientId: 'cli-1',
    clientName: 'Rajesh Kumar Agarwal',
    type: 'Call',
    dueDate: '08/09/2026',
    dueTime: '04:00 PM',
    assignedBrokerId: 'brk-1',
    assignedBrokerName: 'Arijit Sen',
    priority: 'Medium',
    status: 'Completed',
    category: 'Completed',
    notes: 'Confirmed token receipt of ₹10,00,000 for Unit A-402. Dispatched official receipt.',
    createdAt: '06/09/2026'
  }
];
