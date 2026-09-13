import { getEntityList } from '../utils/storage.js';
import { formatCurrency } from '../utils/formatters.js';

export const aiService = {
  async processQuery(userInput) {
    // Artificial slight async delay for natural feel
    await new Promise(r => setTimeout(r, 450));

    const q = userInput.toLowerCase().trim();

    const properties = getEntityList('properties');
    const leads = getEntityList('leads');
    const brokers = getEntityList('brokers');
    const followUps = getEntityList('followUps');
    const payments = getEntityList('payments');
    const bookings = getEntityList('bookings');

    // 1. "3 BHK in New Town under ₹1 Cr"
    if ((q.includes('3 bhk') || q.includes('bhk')) && (q.includes('new town') || q.includes('rajarhat') || q.includes('salt lake') || q.includes('1 cr') || q.includes('crore'))) {
      const matched = properties.filter(p => {
        const matchBhk = p.bedrooms === 3 || p.type.includes('3 BHK') || p.title.includes('3 BHK');
        const matchArea = q.includes('new town') ? (p.area === 'New Town' || p.locality.includes('New Town')) : true;
        const matchPrice = p.price <= 10000000;
        return matchBhk && matchArea && matchPrice;
      });

      if (matched.length > 0) {
        return {
          type: 'properties',
          message: `Found **${matched.length} matching 3 BHK property** in New Town within ₹1.00 Cr:`,
          items: matched.map(p => ({
            id: p.id,
            title: p.title,
            price: formatCurrency(p.price),
            area: p.area,
            location: p.address,
            bedrooms: p.bedrooms,
            status: p.status,
            link: `/properties`
          }))
        };
      }
    }

    // 2. "Commercial properties in Sector V"
    if (q.includes('commercial') || (q.includes('sector v') || q.includes('office'))) {
      const matched = properties.filter(p => 
        (p.category === 'Commercial' || p.type.toLowerCase().includes('commercial') || p.type.toLowerCase().includes('office')) &&
        (p.area === 'Salt Lake' || p.locality.includes('Sector V') || p.address.includes('Sector V'))
      );

      return {
        type: 'properties',
        message: `Found **${matched.length} Grade-A commercial spaces** in Sector V, Salt Lake:`,
        items: matched.map(p => ({
          id: p.id,
          title: p.title,
          price: formatCurrency(p.price),
          area: p.area,
          location: p.address,
          status: p.status,
          link: `/properties`
        }))
      };
    }

    // 3. "Which agents generated the most revenue?"
    if (q.includes('agent') || q.includes('revenue') || q.includes('top broker') || q.includes('performance')) {
      const sortedBrokers = [...brokers].sort((a, b) => b.revenueGenerated - a.revenueGenerated);
      const topAgent = sortedBrokers[0];

      return {
        type: 'brokers',
        message: `🏆 **${topAgent.name}** is the top-performing agent with **${formatCurrency(topAgent.revenueGenerated)}** in closed revenue. Here is the leaderboard:`,
        items: sortedBrokers.slice(0, 3).map(b => ({
          id: b.id,
          name: b.name,
          role: b.role,
          revenue: formatCurrency(b.revenueGenerated),
          deals: `${b.dealsClosed} deals closed`,
          specialization: b.specializedAreas.join(', '),
          link: `/brokers`
        }))
      };
    }

    // 4. "Which leads have overdue follow-ups?"
    if (q.includes('overdue') || q.includes('follow-up') || q.includes('follow up') || q.includes('followup')) {
      const overdueList = followUps.filter(f => f.category === 'Overdue' || f.status === 'Pending' && f.dueDate < '13/09/2026');

      return {
        type: 'followUps',
        message: `⚠️ There are currently **${overdueList.length} overdue follow-up tasks** requiring immediate broker action:`,
        items: overdueList.map(f => ({
          id: f.id,
          title: `${f.type} with ${f.leadName || f.clientName}`,
          dueDate: `${f.dueDate} at ${f.dueTime}`,
          assignedTo: f.assignedBrokerName,
          notes: f.notes,
          link: `/follow-ups`
        }))
      };
    }

    // 5. "Which bookings have pending payments?"
    if (q.includes('pending payment') || q.includes('pending') || q.includes('arrears') || q.includes('outstanding')) {
      const pendingList = payments.filter(p => p.status === 'Pending' || p.status === 'Overdue');
      const totalPending = pendingList.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

      return {
        type: 'payments',
        message: `Found **${pendingList.length} pending/overdue payment records** totaling **${formatCurrency(totalPending)}**:`,
        items: pendingList.map(p => ({
          id: p.id,
          client: p.clientName,
          amount: formatCurrency(p.amount),
          status: p.status,
          dueDate: p.dueDate,
          notes: p.notes,
          link: `/payments`
        }))
      };
    }

    // Default intelligent fallback
    return {
      type: 'general',
      message: `I analyzed the Sahara ERP system for: "${userInput}".\n\n**Quick Sahara Intelligence Summary:**\n- **Properties:** ${properties.length} active units across New Town, Salt Lake & South Kolkata.\n- **Active Leads:** ${leads.filter(l => l.status !== 'Converted' && l.status !== 'Lost').length} active buyer prospects.\n- **Top Micro-Market:** New Town (Action Area I & II) leading residential inquiries.\n\n*Tip: Ask me about "overdue follow-ups", "top revenue agents", "3 BHK in New Town", or "pending payments".*`
    };
  }
};

export default aiService;
