import React, { useState } from 'react';
import { Trash2, RotateCcw, AlertTriangle, Inbox } from 'lucide-react';
import { useCrm } from '../../context/CrmContext.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import DataTable from '../../components/common/DataTable.jsx';
import Button from '../../components/common/Button.jsx';
import { ConfirmDialog } from '../../components/common/Modal.jsx';

export function Trash() {
  const { trash, restoreFromTrash, permanentlyDeleteFromTrash } = useCrm();

  const [permDeleteId, setPermDeleteId] = useState(null);

  const columns = [
    {
      key: 'title',
      header: 'Deleted Record',
      render: (item) => (
        <span className="font-bold text-slate-900 dark:text-white text-xs">
          {item.title}
        </span>
      )
    },
    {
      key: 'originalEntity',
      header: 'Original Module',
      render: (item) => (
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 capitalize">
          {item.originalEntity}
        </span>
      )
    },
    {
      key: 'deletedAt',
      header: 'Deleted Date & Time',
      render: (item) => (
        <span className="text-xs text-slate-500 font-mono">
          {new Date(item.deletedAt).toLocaleString('en-GB')}
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      sortable: false,
      render: (item) => (
        <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
          <Button
            size="sm"
            variant="outline"
            icon={RotateCcw}
            onClick={() => restoreFromTrash(item.trashId)}
          >
            Restore
          </Button>
          <Button
            size="sm"
            variant="danger"
            icon={Trash2}
            onClick={() => setPermDeleteId(item.trashId)}
          >
            Purge
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Trash & System Archive"
        subtitle="Recover accidentally deleted properties, leads, deals, or payments using enterprise soft delete"
        breadcrumbs={[{ label: 'System' }, { label: 'Trash' }]}
        exportFilename="Sahara_Trash"
      />

      <DataTable
        columns={columns}
        data={trash}
        keyField="trashId"
        searchPlaceholder="Search deleted items..."
        exportFilename="Sahara_Trash"
      />

      {/* Permanent Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(permDeleteId)}
        onClose={() => setPermDeleteId(null)}
        onConfirm={() => {
          if (permDeleteId) {
            permanentlyDeleteFromTrash(permDeleteId);
            setPermDeleteId(null);
          }
        }}
        title="Permanently Purge Record?"
        message="This action CANNOT be undone. The record will be permanently eradicated from Sahara CRM storage."
        confirmText="Permanently Delete"
        confirmVariant="danger"
      />
    </div>
  );
}

export default Trash;
