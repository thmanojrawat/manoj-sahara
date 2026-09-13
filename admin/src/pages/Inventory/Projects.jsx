import React, { useState } from 'react';
import { Plus, FolderGit2, Building2, Layers, CheckCircle2, Calendar, MapPin, Eye } from 'lucide-react';
import { useCrm } from '../../context/CrmContext.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import Button from '../../components/common/Button.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import Modal from '../../components/common/Modal.jsx';
import { Input, Select, Textarea } from '../../components/common/FormControls.jsx';

export function Projects() {
  const { projects } = useCrm();
  const [selectedProject, setSelectedProject] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Development Projects"
        subtitle="Master real-estate developments, high-rise towers, and commercial tech complexes in Kolkata"
        breadcrumbs={[{ label: 'Inventory' }, { label: 'Projects' }]}
        exportFilename="Sahara_Projects"
        actions={
          <Button variant="primary" size="sm" icon={Plus} onClick={() => alert('Project creation wizard available')}>
            New Project
          </Button>
        }
      />

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map(proj => (
          <div
            key={proj.id}
            onClick={() => {
              setSelectedProject(proj);
              setIsDetailOpen(true);
            }}
            className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="relative h-48 overflow-hidden">
                <img
                  src={proj.image}
                  alt={proj.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3">
                  <StatusBadge status={proj.status} />
                </div>
                <div className="absolute top-3 right-3 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-lg text-white font-mono text-xs font-bold">
                  {proj.code}
                </div>
              </div>

              <div className="p-5">
                <div className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                  {proj.type}
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1 group-hover:text-amber-600 transition-colors">
                  {proj.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  {proj.location}, {proj.city}
                </p>

                <p className="text-xs text-slate-600 dark:text-slate-300 mt-3 line-clamp-2 leading-relaxed">
                  {proj.description}
                </p>

                {/* Progress bar of sold / booked units */}
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Inventory Absorption</span>
                    <span className="text-slate-500 font-mono">
                      {proj.bookedUnits + proj.soldUnits} / {proj.totalUnits} Units
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex">
                    <div
                      className="bg-emerald-500 h-full"
                      style={{ width: `${(proj.soldUnits / proj.totalUnits) * 100}%` }}
                      title={`Sold: ${proj.soldUnits}`}
                    />
                    <div
                      className="bg-amber-500 h-full"
                      style={{ width: `${(proj.bookedUnits / proj.totalUnits) * 100}%` }}
                      title={`Booked: ${proj.bookedUnits}`}
                    />
                  </div>
                  <div className="flex items-center gap-4 text-[10px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Sold ({proj.soldUnits})
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" /> Booked ({proj.bookedUnits})
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700 inline-block" /> Available ({proj.availableUnits})
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-5 py-3 bg-slate-50 dark:bg-slate-950/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-500">RERA: <span className="font-mono text-slate-700 dark:text-slate-300">{proj.reraNumber}</span></span>
              <span className="font-extrabold text-amber-600 dark:text-amber-400">{proj.priceRange}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <Modal
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          title={selectedProject.name}
          subtitle={`RERA Reg: ${selectedProject.reraNumber}`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-4">
            <img
              src={selectedProject.image}
              alt={selectedProject.name}
              className="w-full h-52 object-cover rounded-xl border border-slate-200 dark:border-slate-800"
            />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Total Towers</span>
                <p className="text-base font-bold text-slate-900 dark:text-white mt-0.5">{selectedProject.totalTowers} Blocks</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Total Units</span>
                <p className="text-base font-bold text-slate-900 dark:text-white mt-0.5">{selectedProject.totalUnits}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Available Units</span>
                <p className="text-base font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{selectedProject.availableUnits}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Target Handover</span>
                <p className="text-base font-bold text-slate-900 dark:text-white mt-0.5">{selectedProject.completionDate}</p>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase mb-1">Architectural Scope</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {selectedProject.description}
              </p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default Projects;
