import React, { useContext, useMemo, useState } from 'react';
import Button from '../../common/Button';
import EmptyState from '../../common/EmptyState';
import { ThemeContext } from '../../common/ThemeContext';
import { Layers, Plus, ArrowLeft, FolderOpen, ChevronDown, ChevronRight, Users, Search, FolderPlus, Pencil } from 'lucide-react';



/**
 * GroupsList
 * Shows all groups (default + custom from fields) with their member fields.
 * Props:
 *   fields       - all registered fields from CDM_FIELD_REGISTRY
 *   onCreateGroup - callback to open GroupingForm
 *   onBack        - callback to return to the registry list
 */
const GroupsList = ({ fields, groups = [], onCreateGroup, onEditGroup, onBack }) => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';
  const [expandedGroups, setExpandedGroups] = useState({});
  const [searchTerm, setSearchTerm]         = useState('');

  // Build: { groupName: [field, field, ...] }
  const groupMap = useMemo(() => {
    const map = {};
    // 1. Initialize with all registered group names (to support empty groups)
    groups.forEach(g => {
      if (!map[g.name]) map[g.name] = [];
    });

    // 2. Fill with actual fields
    fields.forEach((f) => {
      const g = f.group_name;
      if (!g) return;
      if (!map[g]) map[g] = [];
      map[g].push(f);
    });
    return map;
  }, [fields, groups]);

  const allGroupNames = Object.keys(groupMap).sort();
  const groupCount = allGroupNames.length;

  const filteredGroups = allGroupNames.filter((g) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      g.toLowerCase().includes(term) ||
      groupMap[g].some((f) => (f.field_name || f.name || '').toLowerCase().includes(term))
    );
  });

  const toggleGroup = (groupName) => {
    setExpandedGroups((prev) => ({ ...prev, [groupName]: !prev[groupName] }));
  };

  const totalAssigned = fields.filter((f) => f.group_name).length;

  return (
    <div className={`space-y-6 animate-in fade-in duration-300 w-full ${isDark ? 'text-white' : 'text-gray-800'}`}>

      {/* ── Header ── */}
      <div className={`flex items-center justify-between border-b pb-4 ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
        <div>
          <h2 className={`text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Field Groups
          </h2>
          <p className="text-xs font-semibold text-gray-500 mt-0.5 tracking-wide">
            {allGroupNames.length} groups · {totalAssigned} fields assigned
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className={`flex items-center gap-2 px-4 py-2 border rounded-xl transition-all text-xs font-bold ${
              isDark
                ? 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
                : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-gray-900 shadow-sm'
            }`}
          >
            <ArrowLeft size={14} />
            Back to Registry
          </button>
          <Button variant="primary" icon={<Plus size={16} />} onClick={onCreateGroup}>
            Create Group
          </Button>
        </div>
      </div>

      {/* ── Stats Bar ── */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Groups',    value: groupCount,      sub: 'created groups' },
          { label: 'Fields Assigned', value: totalAssigned,   sub: `of ${fields.length} registered` },
        ].map(({ label, value, sub }) => (
          <div key={label} className={`p-4 rounded-2xl border ${isDark ? 'bg-white/3 border-white/10' : 'bg-white border-gray-200 shadow-sm'}`}>
            <div className="text-2xl font-extrabold text-primary-orange">{value}</div>
            <div className={`text-xs font-semibold mt-0.5 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>{label}</div>
            <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{sub}</div>
          </div>
        ))}
      </div>

      {/* ── Search ── */}
      <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border max-w-sm ${
        isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-sm'
      }`}>
        <Search size={15} className={isDark ? 'text-gray-500' : 'text-gray-400'} />
        <input
          type="text"
          placeholder="Search groups or fields…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`flex-1 bg-transparent text-sm outline-none ${isDark ? 'text-white placeholder:text-gray-600' : 'text-gray-800 placeholder:text-gray-400'}`}
        />
      </div>

      {/* ── Groups List ── */}
      {filteredGroups.length === 0 ? (
        <EmptyState 
          searchTerm={searchTerm}
          icon={FolderPlus}
          title="No Field Groups Yet"
          description="Grouping fields allows you to manage security and maskings in bulk. Create your first group to get started."
          action={{
            label: "Create Group",
            icon: Plus,
            onClick: onCreateGroup
          }}
          className="mt-8 border border-dashed rounded-3xl border-white/5 bg-white/2"
        />
      ) : (
        <div className="flex flex-col gap-3">
          {filteredGroups.map((groupName) => {
            const memberFields = groupMap[groupName];
            const isExpanded   = expandedGroups[groupName] ?? false;

            return (
              <div
                key={groupName}
                className={`rounded-2xl border overflow-hidden transition-all duration-200 ${
                  isDark ? 'bg-white/3 border-white/10' : 'bg-white border-gray-200 shadow-sm'
                }`}
              >
                {/* Group Header */}
                <button
                  onClick={() => toggleGroup(groupName)}
                  className={`w-full flex items-center justify-between px-5 py-4 text-left transition-colors ${
                    isDark ? 'bg-white/5 hover:bg-white/8' : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      memberFields.length > 0
                        ? 'bg-primary-orange/10 text-primary-orange'
                        : isDark ? 'bg-white/5 text-gray-500' : 'bg-gray-100 text-gray-400'
                    }`}>
                      <FolderOpen size={16} />
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {groupName}
                        </span>
                      </div>
                      <div className={`flex items-center gap-1 text-xs mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                        <Users size={11} />
                        {memberFields.length} field{memberFields.length !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>

                  {memberFields.length > 0 && (
                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditGroup(groupName);
                        }}
                        className={`p-1.5 rounded-lg transition-colors ${
                          isDark ? 'text-gray-500 hover:text-primary-orange hover:bg-white/5' : 'text-gray-400 hover:text-primary-orange hover:bg-gray-100'
                        }`}
                        title="Edit Group"
                      >
                        <Pencil size={14} />
                      </button>
                      <div className={isDark ? 'text-gray-500' : 'text-gray-400'}>
                        {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      </div>
                    </div>
                  )}

                  {memberFields.length === 0 && (
                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditGroup(groupName);
                        }}
                        className={`p-1.5 rounded-lg transition-colors ${
                          isDark ? 'text-gray-500 hover:text-primary-orange hover:bg-white/5' : 'text-gray-400 hover:text-primary-orange hover:bg-gray-100'
                        }`}
                        title="Edit Group"
                      >
                        <Pencil size={14} />
                      </button>
                    </div>
                  )}
                </button>

                {/* Fields inside group */}
                {isExpanded && memberFields.length > 0 && (
                  <div className={`divide-y ${isDark ? 'divide-white/5' : 'divide-gray-100'}`}>
                    {memberFields.map((f) => (
                      <div
                        key={f.field_uuid}
                        className={`flex items-center justify-between px-6 py-3 pl-14 ${
                          isDark ? 'hover:bg-white/3' : 'hover:bg-gray-50'
                        } transition-colors`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary-orange shrink-0" />
                          <span className={`text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                            {f.field_name || f.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            isDark ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'
                          }`}>
                            {f.type || f.data_type || '—'}
                          </span>
                          <span className={`text-xs ${isDark ? 'text-gray-600' : 'text-gray-300'}`}>
                            {f.cdm_name || 'Manual'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Empty group hint */}
                {isExpanded && memberFields.length === 0 && (
                  <div className={`px-6 py-4 text-xs text-center ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                    No fields assigned to this group yet.
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default GroupsList;
