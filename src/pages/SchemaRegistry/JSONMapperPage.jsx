import React, { useState, useMemo, useEffect } from 'react';
import { 
  FileJson, 
  ArrowRightLeft, 
  Plus, 
  Trash2, 
  Save, 
  Play, 
  ChevronRight, 
  ChevronDown, 
  Database,
  Banknote,
  Code,
  Zap
} from 'lucide-react';
import { useTheme } from '../../components/common/ThemeContext';

// Helper to flatten/get paths from a JSON object
const getJsonPaths = (obj, prefix = '') => {
  return Object.keys(obj).reduce((acc, key) => {
    const pre = prefix.length ? prefix + '.' : '';
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      Object.assign(acc, getJsonPaths(obj[key], pre + key));
    } else {
      acc[pre + key] = typeof obj[key];
    }
    return acc;
  }, {});
};

const JSONMapperPage = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  // State
  const [sourceJsonText, setSourceJsonText] = useState(JSON.stringify({
    customer: {
      customer_uuid: "CUST-UUID-001",
      customer_type: "RETAIL",
      full_name: "Mohsin Khan Pathan",
      date_of_birth: "1988-05-10",
      nationality: "IN",
      residency_country: "UAE",
      email: "mohsin@example.com",
      mobile_number: "+971501234567",
      kyc_status: "VERIFIED",
      risk_category: "LOW"
    }
  }, null, 2));

  const [profiles, setProfiles] = useState(() => {
    const saved = localStorage.getItem('json_mapper_profiles');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Basic check to see if it's the old format (source->target) or new (target->source)
      // If any mapping value is shorter than the key, it's likely source->target
      // We'll just reset if it looks suspicious or just let the user re-map
      return parsed;
    }
    return [
      {
        id: 'BANK1',
        name: 'BANK 1 (Legacy)',
        targetJsonText: JSON.stringify({
          CustID: "",
          "CSt Type": "",
          fname: "",
          dob: "",
          nationality: "",
          residencies: {
            country: ""
          },
          email: "",
          mobile_number: "",
          kyc: {
            status: "",
            risk: ""
          }
        }, null, 2),
        mappings: {
          "CustID": "customer.customer_uuid",
          "fname": "customer.full_name"
        }
      },
      {
        id: 'BANK2',
        name: 'BANK 2 (Modern)',
        targetJsonText: JSON.stringify({
          CUSTOMID: "",
          CUStomer_type: "",
          FULLName: "",
          dob: "",
          nat: "",
          country: "",
          email: "",
          mobile: "",
          status: {
            kyc: "",
            risk: ""
          }
        }, null, 2),
        mappings: {
          "CUSTOMID": "customer.customer_uuid",
          "FULLName": "customer.full_name"
        }
      }
    ];
  });

  const [activeProfileId, setActiveProfileId] = useState('BANK1');
  const [draggedSourcePath, setDraggedSourcePath] = useState(null);
  const [dropTargetHover, setDropTargetHover] = useState(null);

  useEffect(() => {
    localStorage.setItem('json_mapper_profiles', JSON.stringify(profiles));
  }, [profiles]);

  const activeProfile = profiles.find(p => p.id === activeProfileId);

  // Derived data
  const sourcePaths = useMemo(() => {
    try {
      return getJsonPaths(JSON.parse(sourceJsonText));
    } catch {
      return {};
    }
  }, [sourceJsonText]);

  const targetPaths = useMemo(() => {
    try {
      return getJsonPaths(JSON.parse(activeProfile.targetJsonText));
    } catch {
      return {};
    }
  }, [activeProfile.targetJsonText]);

  const handleMap = (srcPath, tgtPath) => {
    setProfiles(prev => prev.map(p => {
      if (p.id === activeProfileId) {
        return {
          ...p,
          mappings: {
            ...p.mappings,
            [tgtPath]: srcPath
          }
        };
      }
      return p;
    }));
  };

  const removeMapping = (tgtPath) => {
    setProfiles(prev => prev.map(p => {
      if (p.id === activeProfileId) {
        const newMappings = { ...p.mappings };
        delete newMappings[tgtPath];
        return {
          ...p,
          mappings: newMappings
        };
      }
      return p;
    }));
  };

  const getTransformedJson = () => {
    try {
      const source = JSON.parse(sourceJsonText);
      const targetStructure = JSON.parse(activeProfile.targetJsonText);
      const result = JSON.parse(activeProfile.targetJsonText); // Clone structure

      Object.entries(activeProfile.mappings).forEach(([tgtPath, srcPath]) => {
        const srcVal = srcPath.split('.').reduce((o, i) => (o ? o[i] : undefined), source);
        const keys = tgtPath.split('.');
        let current = result;
        for (let i = 0; i < keys.length - 1; i++) {
          if (!current[keys[i]]) current[keys[i]] = {};
          current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = srcVal;
      });

      return JSON.stringify(result, null, 2);
    } catch {
      return "{}";
    }
  };

  return (
    <div className={`flex flex-col h-full ${isDark ? 'text-white' : 'text-gray-900'}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-white/5">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-primary-orange/10 text-primary-orange shadow-lg shadow-primary-orange/5">
            <ArrowRightLeft size={24} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight">JSON Mapper</h1>
            <p className="text-sm text-gray-400 font-medium">Map unified CDM structures to provider-specific payloads</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-6 py-2.5 bg-primary-orange text-white rounded-xl font-bold text-xs shadow-lg shadow-primary-orange/20 hover:brightness-110 active:scale-95 transition-all">
            <Save size={14} />
            Save Mappings
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Pane: Source CDM */}
        <div className="w-1/4 border-r border-gray-100 dark:border-white/5 flex flex-col">
          <div className="p-4 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database size={16} className="text-primary-orange" />
              <span className="text-[11px] font-black uppercase tracking-wider">Source CDM</span>
            </div>
          </div>
          <div className="flex-1 p-4 overflow-auto scrollbar-hide space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Structure</span>
              <textarea
                value={sourceJsonText}
                onChange={(e) => setSourceJsonText(e.target.value)}
                className="w-full h-48 p-4 font-mono text-[10px] bg-gray-50 dark:bg-darkbg border border-gray-100 dark:border-white/5 rounded-2xl outline-none focus:ring-1 focus:ring-primary-orange/30 transition-all resize-none"
                spellCheck="false"
              />
            </div>
            
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Extractable Paths</span>
              <div className="space-y-1.5">
                {Object.entries(sourcePaths).map(([path, type]) => (
                  <div 
                    key={path}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData("sourcePath", path);
                      setDraggedSourcePath(path);
                    }}
                    onDragEnd={() => setDraggedSourcePath(null)}
                    className={`group p-3 rounded-xl border flex items-center justify-between cursor-grab active:cursor-grabbing transition-all ${
                      draggedSourcePath === path 
                        ? 'bg-primary-orange/10 border-primary-orange/30 scale-95' 
                        : 'bg-white dark:bg-white/2 border-gray-100 dark:border-white/5 hover:border-primary-orange/20 hover:shadow-md'
                    }`}
                  >
                    <div className="flex flex-col min-w-0">
                      <span className="text-[11px] font-bold font-mono truncate tracking-tight">{path}</span>
                      <span className="text-[9px] text-gray-400 font-semibold italic">{type}</span>
                    </div>
                    <ArrowRightLeft size={12} className="text-gray-300 group-hover:text-primary-orange transition-colors shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Middle Pane: Mappings */}
        <div className="flex-1 flex flex-col bg-gray-50/30 dark:bg-[#151722]/30">
          <div className="p-4 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/2 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 overflow-x-auto max-w-md scrollbar-hide">
                {profiles.map(profile => (
                  <button
                    key={profile.id}
                    onClick={() => setActiveProfileId(profile.id)}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap border ${
                      activeProfileId === profile.id
                        ? 'bg-primary-orange text-white border-primary-orange shadow-lg shadow-primary-orange/20'
                        : 'bg-white dark:bg-white/5 text-gray-400 border-gray-100 dark:border-white/5 hover:border-gray-200'
                    }`}
                  >
                    {profile.name}
                  </button>
                ))}
              </div>
              <button className="p-2 bg-white dark:bg-white/5 rounded-xl border border-dashed border-gray-200 dark:border-white/10 text-gray-400 hover:text-primary-orange transition-all">
                <Plus size={14} />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <Play size={14} className="text-green-500" />
              <span className="text-[10px] font-black uppercase tracking-wider text-green-500">Auto-Transform Active</span>
            </div>
          </div>

          <div className="flex-1 p-8 overflow-auto">
            <div className="max-w-4xl mx-auto space-y-6">
              {Object.entries(activeProfile.mappings).length > 0 ? (
                <div className="grid grid-cols-1 gap-3">
                  {Object.entries(activeProfile.mappings).map(([tgt, src]) => (
                    <div key={tgt} className="group flex items-center gap-4 animate-in fade-in slide-in-from-top-2">
                      <div className="flex-1 bg-white dark:bg-[#1e2132] p-4 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm flex items-center justify-between group-hover:shadow-md group-hover:border-primary-orange/20 transition-all">
                        <div className="flex items-center gap-4">
                          <div className="p-2 rounded-xl bg-orange-500/10 text-orange-500 shrink-0">
                            <Banknote size={14} />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Target Path</span>
                            <span className="text-xs font-mono font-bold text-primary-orange">{tgt}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 text-gray-300">
                          <ArrowRightLeft size={12} className="rotate-180" />
                        </div>
                        
                        <div className="flex items-center gap-4 text-right">
                          <div className="flex flex-col items-end">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">CDM Source</span>
                            <span className="text-xs font-mono font-bold tracking-tight">{src}</span>
                          </div>
                          <div className="p-2 rounded-xl bg-primary-orange/10 text-primary-orange shrink-0">
                            <Database size={14} />
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => removeMapping(tgt)}
                        className="p-3 rounded-xl text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-20 flex flex-col items-center justify-center text-center space-y-4 opacity-40">
                  <div className="p-6 rounded-full bg-gray-100 dark:bg-white/5">
                    <ArrowRightLeft size={48} className="text-gray-400" />
                  </div>
                  <div>
                    <p className="text-lg font-black tracking-tight">No Mappings Yet</p>
                    <p className="text-sm font-medium">Drag paths from the Left or Right to start mapping</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Pane: Target Provider */}
        <div className="w-1/4 border-l border-gray-100 dark:border-white/5 flex flex-col">
          <div className="p-4 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Banknote size={16} className="text-primary-orange" />
              <span className="text-[11px] font-black uppercase tracking-wider">Target Payload ({activeProfileId})</span>
            </div>
          </div>
          <div className="flex-1 p-4 overflow-auto scrollbar-hide space-y-6">
             <div className="space-y-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Template Structure</span>
              <textarea
                value={activeProfile.targetJsonText}
                onChange={(e) => {
                  const updated = profiles.map(p => p.id === activeProfileId ? { ...p, targetJsonText: e.target.value } : p);
                  setProfiles(updated);
                }}
                className="w-full h-48 p-4 font-mono text-[10px] bg-gray-50 dark:bg-darkbg border border-gray-100 dark:border-white/5 rounded-2xl outline-none focus:ring-1 focus:ring-primary-orange/30 transition-all resize-none"
                spellCheck="false"
              />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Available Keys</span>
              <div className="space-y-1.5">
                {Object.entries(targetPaths).map(([path, type]) => (
                  <div 
                    key={path}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDropTargetHover(path);
                    }}
                    onDragLeave={() => setDropTargetHover(null)}
                    onDrop={(e) => {
                      e.preventDefault();
                      const srcPath = e.dataTransfer.getData("sourcePath");
                      if (srcPath) handleMap(srcPath, path);
                      setDropTargetHover(null);
                    }}
                    className={`group p-3 rounded-xl border flex items-center justify-between transition-all ${
                      dropTargetHover === path 
                        ? 'bg-primary-orange/10 border-primary-orange border-solid scale-[1.02] shadow-lg' 
                        : 'bg-white dark:bg-white/2 border-gray-100 dark:border-white/5 hover:border-primary-orange/20'
                    }`}
                  >
                    <ArrowRightLeft size={12} className={`transition-colors shrink-0 ${dropTargetHover === path ? 'text-primary-orange' : 'text-gray-300'}`} />
                    <div className="flex flex-col text-right min-w-0">
                      <span className={`text-[11px] font-bold font-mono truncate tracking-tight ${dropTargetHover === path ? 'text-primary-orange' : ''}`}>{path}</span>
                      <span className="text-[9px] text-gray-400 font-semibold italic">{type}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="h-1/4 border-t border-gray-100 dark:border-white/5 flex flex-col bg-white dark:bg-[#151722]">
        <div className="p-3 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/2 flex items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <Zap size={14} className="text-yellow-500" />
            <span className="text-[10px] font-black uppercase tracking-widest">Transformation Result (Real-time)</span>
          </div>
          <button 
            onClick={() => {
              const blob = new Blob([getTransformedJson()], { type: "application/json" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `${activeProfileId}_mapped.json`;
              a.click();
            }}
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-primary-orange hover:brightness-110 transition-all"
          >
            Download Payload
          </button>
        </div>
        <div className="flex-1 p-6 overflow-auto scrollbar-hide">
          <pre className="text-[11px] font-mono leading-relaxed text-gray-500 dark:text-gray-400 bg-gray-50/30 dark:bg-black/20 p-6 rounded-2xl border border-gray-100 dark:border-white/5">
            {getTransformedJson()}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default JSONMapperPage;
