import React, { useState } from 'react';
import { ArrowRightLeft, Plus, Layers, Eye, Edit3, Trash2, Database } from 'lucide-react';
import Button from '../common/Button';
import EmptyState from '../common/EmptyState';
import StatusBadge from '../common/StatusBadge';
import NewAlertBox from '../common/NewAlertBox';

const MappingProfileList = ({ 
  isDark, 
  profiles, 
  handleCreateNew, 
  setActiveProfileId, 
  setActiveTargetIndex, 
  setCurrentView, 
  setProfiles 
}) => {
  const [deleteId, setDeleteId] = useState(null);

  const handleDelete = () => {
    if (deleteId) {
      setProfiles(prev => prev.filter(p => p.id !== deleteId));
      setDeleteId(null);
    }
  };

  return (
    <div className={`space-y-6 animate-in fade-in duration-500 pb-10 ${isDark ? 'text-white' : 'text-gray-800'}`}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-2xl font-bold">Transformation</h1>
           <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
             Manage API transformation profiles and field mappings.
           </p>
         </div>
        <Button 
           variant="primary"
           onClick={handleCreateNew}
           icon={<Plus size={18} />}
         >
           Create New Transformation
         </Button>
      </div>

      {/* Content */}
      {profiles.length === 0 ? (
        <EmptyState 
          icon={ArrowRightLeft}
          title="No Transformation Profiles"
          description="Create your first transformation profile to transform data between different API schemas."
          action={{
            label: "Create Transformation",
            icon: Plus,
            onClick: handleCreateNew
          }}
          className="mt-10"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {profiles.map(p => (
            <div 
              key={p.id} 
              className={`group p-5 rounded-2xl border transition-all duration-200 hover:shadow-lg ${
                isDark 
                  ? 'bg-white/5 border-white/10 hover:border-white/10' 
                  : 'bg-white border-gray-100 hover:border-gray-300'
              }`}
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${isDark ? 'bg-primary-orange/10' : 'bg-orange-50'}`}>
                    <Layers size={18} className="text-primary-orange" />
                  </div>
                  <div>
                    <h3 className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {p.name || 'Untitled Transformation'}
                    </h3>
                    <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                      {p.id}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => { setActiveProfileId(p.id); setActiveTargetIndex(0); setCurrentView('MAPPING'); }}
                    className={`p-1.5 rounded-md transition-colors ${
                      isDark 
                        ? 'text-gray-500 hover:text-white hover:bg-white/5' 
                        : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'
                    }`}
                    title="View Mapping"
                  >
                    <Eye size={15} />
                  </button>
                  <button 
                    onClick={() => { setActiveProfileId(p.id); setActiveTargetIndex(0); setCurrentView('SETUP'); }}
                    className={`p-1.5 rounded-md transition-colors ${
                      isDark 
                        ? 'text-gray-500 hover:text-white hover:bg-white/5' 
                        : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'
                    }`}
                    title="Edit Setup"
                  >
                    <Edit3 size={15} />
                  </button>
                  <button 
                    onClick={() => setDeleteId(p.id)}
                    className={`p-1.5 rounded-md transition-colors ${
                      isDark 
                        ? 'text-gray-500 hover:text-red-400 hover:bg-red-400/10' 
                        : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                    }`}
                    title="Delete"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              {/* Description */}
              <p className={`text-xs mb-4 line-clamp-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {p.description || 'No description provided.'}
              </p>

              {/* Footer */}
              <div className={`flex items-center justify-between pt-4 border-t ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
                <div className="flex items-center gap-2">
                  <Database size={14} className="text-primary-orange" />
                  <span className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {p.targets?.length || 0} Providers
                  </span>
                </div>
                <StatusBadge status={p.status || 'DRAFT'} />
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Delete Confirmation Alert */}
      <NewAlertBox 
      showAlert={!!deleteId}
      title="Delete Transformation"
      message="Are you sure you want to delete this transformation? This action cannot be undone."
      onConfirm={handleDelete}
      onCancel={() => setDeleteId(null)}
      type="error"
      confirmText="Delete"
      />
    </div>
  );
};

export default MappingProfileList;