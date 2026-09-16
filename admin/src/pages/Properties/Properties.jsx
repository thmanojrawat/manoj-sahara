import React, { useState, useMemo } from 'react';
import {
  Plus,
  Grid,
  List,
  Eye,
  Edit2,
  Copy,
  Trash2,
  Building2,
  MapPin,
  Bed,
  Bath,
  Maximize,
  Filter,
  Check
} from 'lucide-react';
import { useCrm } from '../../context/CrmContext.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import DataTable from '../../components/common/DataTable.jsx';
import Button from '../../components/common/Button.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import Modal, { ConfirmDialog } from '../../components/common/Modal.jsx';
import { Input, Select, Textarea } from '../../components/common/FormControls.jsx';
import { formatCurrency } from '../../utils/formatters.js';

export function Properties() {
  const {
    properties,
    vendors,
    brokers,
    locations,
    amenities,
    addProperty,
    updateProperty,
    deleteProperty,
    duplicateProperty
  } = useCrm();

  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'
  const [filterType, setFilterType] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterArea, setFilterArea] = useState('ALL');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Form State
  const initialFormState = {
    title: '',
    code: '',
    type: 'Apartment',
    category: 'Residential',
    purpose: 'Sale',
    price: '',
    areaSqFt: '',
    bedrooms: '3',
    bathrooms: '3',
    floor: '4',
    totalFloors: '18',
    address: '',
    locality: 'Action Area II',
    area: 'New Town',
    city: 'Kolkata',
    pincode: '700156',
    status: 'Active',
    availability: 'Ready to Move',
    listingStatus: 'Published',
    ownerId: vendors[0]?.id || '',
    brokerId: brokers[0]?.id || '',
    description: '',
    amenities: ['24x7 Security & CCTV', 'Covered Car Parking', '100% DG Power Backup']
  };

  const [formData, setFormData] = useState(initialFormState);

  // Filtered dataset
  const filteredProperties = useMemo(() => {
    return properties.filter(prop => {
      if (filterType !== 'ALL' && prop.type !== filterType) return false;
      if (filterStatus !== 'ALL' && prop.status !== filterStatus) return false;
      if (filterArea !== 'ALL' && prop.area !== filterArea) return false;
      return true;
    });
  }, [properties, filterType, filterStatus, filterArea]);

  // Open Edit Modal
  const handleOpenEdit = (prop) => {
    setSelectedProperty(prop);
    setFormData({
      ...prop,
      price: String(prop.price),
      areaSqFt: String(prop.areaSqFt),
      bedrooms: String(prop.bedrooms),
      bathrooms: String(prop.bathrooms),
      floor: String(prop.floor || 1),
      totalFloors: String(prop.totalFloors || 10)
    });
    setIsEditModalOpen(true);
  };

  // Open Detail Modal
  const handleOpenDetail = (prop) => {
    setSelectedProperty(prop);
    setIsDetailModalOpen(true);
  };

  // Save Add
  const handleSaveAdd = async (e) => {
    e.preventDefault();
    const resolvedOwnerId = formData.ownerId || vendors[0]?.id;
    const resolvedBrokerId = formData.brokerId || brokers[0]?.id;
    const owner = vendors.find(v => v.id === resolvedOwnerId);
    const broker = brokers.find(b => b.id === resolvedBrokerId);

    await addProperty({
      ...formData,
      ownerId: resolvedOwnerId,
      vendor: resolvedOwnerId,
      brokerId: resolvedBrokerId,
      broker: resolvedBrokerId,
      price: Number(formData.price) || 0,
      areaSqFt: Number(formData.areaSqFt) || 0,
      bedrooms: Number(formData.bedrooms) || 0,
      bathrooms: Number(formData.bathrooms) || 0,
      floor: Number(formData.floor) || 1,
      totalFloors: Number(formData.totalFloors) || 10,
      ownerName: owner?.name || 'Private Owner',
      brokerName: broker?.name || 'Assigned Agent',
      code: formData.code || `PROP-KOL-${Date.now().toString().slice(-4)}`,
      images: [
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80'
      ],
      createdAt: new Date().toLocaleDateString('en-GB'),
      viewsCount: 0,
      inquiryCount: 0
    });

    setIsAddModalOpen(false);
    setFormData(initialFormState);
  };

  // Save Edit
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!selectedProperty) return;

    const resolvedOwnerId = formData.ownerId || selectedProperty.ownerId || vendors[0]?.id;
    const resolvedBrokerId = formData.brokerId || selectedProperty.brokerId || brokers[0]?.id;
    const owner = vendors.find(v => v.id === resolvedOwnerId);
    const broker = brokers.find(b => b.id === resolvedBrokerId);

    await updateProperty(selectedProperty.id, {
      ...formData,
      ownerId: resolvedOwnerId,
      vendor: resolvedOwnerId,
      brokerId: resolvedBrokerId,
      broker: resolvedBrokerId,
      price: Number(formData.price) || 0,
      areaSqFt: Number(formData.areaSqFt) || 0,
      bedrooms: Number(formData.bedrooms) || 0,
      bathrooms: Number(formData.bathrooms) || 0,
      floor: Number(formData.floor) || 1,
      totalFloors: Number(formData.totalFloors) || 10,
      ownerName: owner?.name || selectedProperty.ownerName,
      brokerName: broker?.name || selectedProperty.brokerName
    });

    setIsEditModalOpen(false);
  };

  // Table Columns Definition
  const columns = [
    {
      key: 'title',
      header: 'Property Details',
      render: (item) => (
        <div className="flex items-center gap-3">
          <img
            src={item.images?.[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=200&q=80'}
            alt={item.title}
            className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
          />
          <div>
            <div className="font-bold text-slate-900 dark:text-white leading-snug">
              {item.title}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 text-amber-600" />
              {item.locality}, {item.area}
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'type',
      header: 'Type & Specs',
      render: (item) => (
        <div>
          <span className="font-semibold text-slate-800 dark:text-slate-200 block text-xs">
            {item.type}
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            {item.bedrooms ? `${item.bedrooms} BHK • ` : ''}{item.areaSqFt} sq ft
          </span>
        </div>
      )
    },
    {
      key: 'price',
      header: 'Price / Valuation',
      render: (item) => (
        <div>
          <span className="font-extrabold text-slate-900 dark:text-white block text-sm">
            {formatCurrency(item.price)}
          </span>
          <span className="text-[10px] text-slate-400">
            ₹{Math.round(item.price / Math.max(1, item.areaSqFt))} / sq ft
          </span>
        </div>
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: (item) => <StatusBadge status={item.status} />
    },
    {
      key: 'ownerName',
      header: 'Owner',
      accessor: 'ownerName'
    },
    {
      key: 'brokerName',
      header: 'Assigned Broker',
      accessor: 'brokerName'
    },
    {
      key: 'actions',
      header: 'Actions',
      sortable: false,
      className: 'text-right actions-column',
      cellClassName: 'text-right actions-column',
      render: (item) => (
        <div className="flex items-center justify-end gap-1.5" onClick={e => e.stopPropagation()}>
          <button
            onClick={() => handleOpenDetail(item)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleOpenEdit(item)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Edit Property"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => duplicateProperty(item.id)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Duplicate Listing"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeleteConfirmId(item.id)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Move to Trash"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Properties & Inventory"
        subtitle="Manage Sahara residential apartments, commercial corporate towers, and luxury villas across Kolkata"
        breadcrumbs={[{ label: 'Properties' }]}
        exportFilename="Sahara_Properties"
        actions={
          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center rounded-xl border border-slate-300 dark:border-slate-700 p-1 bg-white dark:bg-slate-900">
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                  viewMode === 'table' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-500'
                }`}
                title="Table View"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                  viewMode === 'grid' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-500'
                }`}
                title="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
            </div>

            <Button
              variant="primary"
              size="sm"
              icon={Plus}
              onClick={() => {
                setFormData(initialFormState);
                setIsAddModalOpen(true);
              }}
            >
              Add Property
            </Button>
          </div>
        }
      />

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-3 no-print">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          <Filter className="w-3.5 h-3.5 text-amber-600" />
          Filter:
        </div>

        <select
          value={filterArea}
          onChange={e => setFilterArea(e.target.value)}
          className="rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-1.5 text-xs text-slate-800 dark:text-slate-200"
        >
          <option value="ALL">All Micro-Markets</option>
          {locations.map(loc => (
            <option key={loc.id} value={loc.area}>{loc.area}</option>
          ))}
        </select>

        <select
          value={filterType}
          onChange={e => setFilterType(e.target.value)}
          className="rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-1.5 text-xs text-slate-800 dark:text-slate-200"
        >
          <option value="ALL">All Property Types</option>
          <option value="Apartment">Apartment</option>
          <option value="Commercial Office">Commercial Office</option>
          <option value="Luxury Villa / Duplex">Luxury Villa / Duplex</option>
          <option value="Penthouse">Penthouse</option>
          <option value="Retail Showroom">Retail Showroom</option>
        </select>

        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-1.5 text-xs text-slate-800 dark:text-slate-200"
        >
          <option value="ALL">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Reserved">Reserved</option>
          <option value="Booked">Booked</option>
          <option value="Sold">Sold</option>
        </select>

        {(filterType !== 'ALL' || filterStatus !== 'ALL' || filterArea !== 'ALL') && (
          <button
            onClick={() => {
              setFilterType('ALL');
              setFilterStatus('ALL');
              setFilterArea('ALL');
            }}
            className="text-xs text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Main View Mode Render */}
      {viewMode === 'table' ? (
        <DataTable
          columns={columns}
          data={filteredProperties}
          keyField="id"
          searchPlaceholder="Search properties by title, locality, code, owner..."
          onRowClick={handleOpenDetail}
          exportFilename="Sahara_Properties"
          bulkActions={(selectedIds, clearSelection) => (
            <Button
              size="sm"
              variant="danger"
              icon={Trash2}
              onClick={async () => {
                for (const id of selectedIds) {
                  await deleteProperty(id);
                }
                clearSelection();
              }}
            >
              Move {selectedIds.length} to Trash
            </Button>
          )}
        />
      ) : (
        /* Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map(prop => (
            <div
              key={prop.id}
              onClick={() => handleOpenDetail(prop)}
              className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col cursor-pointer group"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={prop.images?.[0]}
                  alt={prop.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3">
                  <StatusBadge status={prop.status} />
                </div>
                <div className="absolute top-3 right-3 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-lg text-white font-extrabold text-xs">
                  {formatCurrency(prop.price)}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                    {prop.type} • {prop.area}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1 group-hover:text-amber-600 transition-colors">
                    {prop.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    {prop.address}
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-3">
                    {prop.bedrooms > 0 && (
                      <span className="flex items-center gap-1">
                        <Bed className="w-3.5 h-3.5 text-slate-400" />
                        {prop.bedrooms} Beds
                      </span>
                    )}
                    {prop.bathrooms > 0 && (
                      <span className="flex items-center gap-1">
                        <Bath className="w-3.5 h-3.5 text-slate-400" />
                        {prop.bathrooms} Baths
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Maximize className="w-3.5 h-3.5 text-slate-400" />
                      {prop.areaSqFt} sq ft
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Property Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Property Listing"
        subtitle="Register a residential, commercial, or luxury villa asset in Sahara CRM"
        maxWidth="max-w-3xl"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSaveAdd}>Save Property</Button>
          </>
        }
      >
        <form className="space-y-4" onSubmit={handleSaveAdd}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Property Title"
              required
              placeholder="e.g. Solitaire Sky Residence 3 BHK"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
            />
            <Input
              label="Asset Code / ID"
              placeholder="e.g. PROP-NT-01"
              value={formData.code}
              onChange={e => setFormData({ ...formData, code: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select
              label="Property Type"
              value={formData.type}
              onChange={e => setFormData({ ...formData, type: e.target.value })}
              options={['Apartment', 'Commercial Office', 'Retail Showroom', 'Luxury Villa / Duplex', 'Penthouse', 'Plotted Land']}
            />
            <Input
              label="Price (₹ INR)"
              type="number"
              required
              placeholder="e.g. 9500000"
              value={formData.price}
              onChange={e => setFormData({ ...formData, price: e.target.value })}
            />
            <Input
              label="Super Built-up Area (Sq Ft)"
              type="number"
              required
              placeholder="e.g. 1820"
              value={formData.areaSqFt}
              onChange={e => setFormData({ ...formData, areaSqFt: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <Input
              label="Bedrooms"
              type="number"
              value={formData.bedrooms}
              onChange={e => setFormData({ ...formData, bedrooms: e.target.value })}
            />
            <Input
              label="Bathrooms"
              type="number"
              value={formData.bathrooms}
              onChange={e => setFormData({ ...formData, bathrooms: e.target.value })}
            />
            <Input
              label="Floor Level"
              type="number"
              value={formData.floor}
              onChange={e => setFormData({ ...formData, floor: e.target.value })}
            />
            <Select
              label="Status"
              value={formData.status}
              onChange={e => setFormData({ ...formData, status: e.target.value })}
              options={['Active', 'Reserved', 'Booked', 'Sold']}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Kolkata Micro-Market"
              value={formData.area}
              onChange={e => setFormData({ ...formData, area: e.target.value })}
              options={locations.map(l => l.area)}
            />
            <Input
              label="Locality / Sector"
              placeholder="e.g. Action Area II / Sector V"
              value={formData.locality}
              onChange={e => setFormData({ ...formData, locality: e.target.value })}
            />
          </div>

          <Input
            label="Full Physical Address"
            placeholder="e.g. Tower A, Sahara Solitaire Heights, Action Area II, New Town, Kolkata"
            value={formData.address}
            onChange={e => setFormData({ ...formData, address: e.target.value })}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Property Owner / Landlord"
              value={formData.ownerId}
              onChange={e => setFormData({ ...formData, ownerId: e.target.value })}
              options={vendors.map(v => ({ value: v.id, label: `${v.name} (${v.company})` }))}
            />
            <Select
              label="Assigned Lead Broker"
              value={formData.brokerId}
              onChange={e => setFormData({ ...formData, brokerId: e.target.value })}
              options={brokers.map(b => ({ value: b.id, label: `${b.name} (${b.role})` }))}
            />
          </div>

          <Textarea
            label="Description & Highlights"
            placeholder="Key architectural highlights, panoramic views, connectivity..."
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
          />
        </form>
      </Modal>

      {/* Edit Property Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Property Listing"
        subtitle={`Updating ${selectedProperty?.title || 'Property'}`}
        maxWidth="max-w-3xl"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSaveEdit}>Update Property</Button>
          </>
        }
      >
        <form className="space-y-4" onSubmit={handleSaveEdit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Property Title"
              required
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
            />
            <Input
              label="Price (₹ INR)"
              type="number"
              required
              value={formData.price}
              onChange={e => setFormData({ ...formData, price: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select
              label="Status"
              value={formData.status}
              onChange={e => setFormData({ ...formData, status: e.target.value })}
              options={['Active', 'Reserved', 'Booked', 'Sold']}
            />
            <Select
              label="Owner"
              value={formData.ownerId}
              onChange={e => setFormData({ ...formData, ownerId: e.target.value })}
              options={vendors.map(v => ({ value: v.id, label: v.name }))}
            />
            <Select
              label="Assigned Broker"
              value={formData.brokerId}
              onChange={e => setFormData({ ...formData, brokerId: e.target.value })}
              options={brokers.map(b => ({ value: b.id, label: b.name }))}
            />
          </div>

          <Textarea
            label="Description"
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
          />
        </form>
      </Modal>

      {/* View Details Modal */}
      {selectedProperty && (
        <Modal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          title={selectedProperty.title}
          subtitle={`Asset Code: ${selectedProperty.code} • Listed on ${selectedProperty.createdAt}`}
          maxWidth="max-w-3xl"
        >
          <div className="space-y-6">
            {/* Gallery Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(selectedProperty.images || []).map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`View ${idx}`}
                  className="w-full h-36 object-cover rounded-xl border border-slate-200 dark:border-slate-800"
                />
              ))}
            </div>

            {/* Key Specs Card */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Total Price</span>
                <p className="text-base font-extrabold text-amber-600 dark:text-amber-400 mt-0.5">
                  {formatCurrency(selectedProperty.price)}
                </p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Super Built-Up</span>
                <p className="text-base font-bold text-slate-800 dark:text-slate-100 mt-0.5">
                  {selectedProperty.areaSqFt} sq ft
                </p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Configuration</span>
                <p className="text-base font-bold text-slate-800 dark:text-slate-100 mt-0.5">
                  {selectedProperty.bedrooms ? `${selectedProperty.bedrooms} BHK` : selectedProperty.type}
                </p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Status</span>
                <div className="mt-1">
                  <StatusBadge status={selectedProperty.status} />
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-1.5">
                Overview & Description
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {selectedProperty.description || 'No description provided for this listing.'}
              </p>
            </div>

            {/* Amenities Badges */}
            {selectedProperty.amenities && (
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">
                  Key Amenities
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedProperty.amenities.map((am, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                    >
                      <Check className="w-3 h-3 text-emerald-500" />
                      {am}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Ownership & Brokerage Linkage */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs">
              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Property Owner</span>
                <p className="font-bold text-slate-900 dark:text-white mt-0.5">{selectedProperty.ownerName}</p>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">Direct title owner</span>
              </div>
              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Assigned Broker</span>
                <p className="font-bold text-slate-900 dark:text-white mt-0.5">{selectedProperty.brokerName}</p>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">Conducts client site tours</span>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteConfirmId)}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={() => {
          if (deleteConfirmId) {
            deleteProperty(deleteConfirmId);
            setDeleteConfirmId(null);
          }
        }}
        title="Move Property to Trash?"
        message="This property will be removed from active listings and moved to Trash. You can restore it anytime from the Trash module."
        confirmText="Move to Trash"
      />
    </div>
  );
}

export default Properties;
