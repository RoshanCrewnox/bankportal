import React, { useState, useEffect } from 'react';
import { ChevronRight, Braces, Square, Database } from 'lucide-react';

const JsonTreeView = ({ 
  data, 
  onMap, 
  isSource = false,
  mappings = {},
  dragInfo,
  onSelect,
  selectedPath,
  isDark
}) => {
  // Helper to get all object paths for initial expansion
  const getAllObjectPaths = (obj, path = '') => {
    let paths = {};
    Object.entries(obj).forEach(([key, value]) => {
      const currentPath = path ? `${path}.${key}` : key;
      if (typeof value === 'object' && value !== null) {
        paths[currentPath] = true;
        if (!Array.isArray(value)) {
          paths = { ...paths, ...getAllObjectPaths(value, currentPath) };
        } else if (value[0] && typeof value[0] === 'object') {
          paths = { ...paths, ...getAllObjectPaths(value[0], currentPath) };
        }
      }
    });
    return paths;
  };

  const [expanded, setExpanded] = useState(() => getAllObjectPaths(data));

  // Update expanded when data changes
  useEffect(() => {
    setExpanded(getAllObjectPaths(data));
  }, [data]);

  const toggleExpand = (path) => {
    setExpanded(prev => ({ ...prev, [path]: !prev[path] }));
  };

  const renderNode = (obj, path = '', depth = 0) => {
    return Object.entries(obj).map(([key, value]) => {
      const currentPath = path ? `${path}.${key}` : key;
      const isObject = typeof value === 'object' && value !== null && !Array.isArray(value);
      const isArray = Array.isArray(value);
      const isExpanded = expanded[currentPath];
      const isMapped = isSource 
        ? Object.values(mappings).includes(currentPath)
        : !!mappings[currentPath];
      const isSelected = selectedPath === currentPath;

      const getTypeIcon = () => {
        if (isObject) return <ChevronRight size={14} className={`transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''} text-gray-400`} />;
        if (isArray) return <Braces size={14} className="text-blue-500" />;
        return <div className="w-3 h-3 rounded bg-gray-300 dark:bg-gray-600" />;
      };

      const getValIcon = () => {
        if (isObject) return <Braces size={12} className="text-primary-orange" />;
        if (isArray) return <Square size={12} className="text-blue-500" />;
        return <Database size={12} className="text-primary-orange/70" />;
      };

      return (
        <div key={currentPath} className="flex flex-col">
          <div 
            draggable={!isObject && !isArray}
            onDragStart={(e) => {
              if (isSource) {
                e.dataTransfer.setData("sourcePath", currentPath);
                e.dataTransfer.effectAllowed = "move";
                dragInfo.setDragged(currentPath);
              }
            }}
            onDragEnd={() => dragInfo.setDragged(null)}
            onDragOver={(e) => {
              if (!isSource && !isObject && !isArray) {
                e.preventDefault();
                e.dataTransfer.dropEffect = "move";
                dragInfo.setHover(currentPath);
              }
            }}
            onDragLeave={() => !isSource && dragInfo.setHover(null)}
            onDrop={(e) => {
              if (!isSource && !isObject && !isArray) {
                e.preventDefault();
                const src = e.dataTransfer.getData("sourcePath");
                if (src) onMap(src, currentPath);
                dragInfo.setHover(null);
              }
            }}
            onClick={() => {
              if (isObject || isArray) {
                toggleExpand(currentPath);
              } else {
                onSelect(currentPath);
              }
            }}
            className={`
              group flex items-center gap-2 py-2 px-3 rounded-lg cursor-pointer transition-all
              ${isSelected 
                ? 'bg-primary-orange/15 border-2 border-primary-orange shadow-sm' 
                : isMapped 
                  ? 'border-l-2 border-l-primary-orange bg-primary-orange/5'
                  : `hover:bg-gray-100 dark:hover:bg-white/5 border border-transparent`}
              ${dragInfo.hover === currentPath ? 'bg-primary-orange/20 border-2 border-primary-orange scale-[1.02]' : ''}
            `}
            style={{ marginLeft: `${depth * 14}px` }}
          >
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <span>{getTypeIcon()}</span>
              <span className="shrink-0">{getValIcon()}</span>
              <span className={`text-xs font-semibold font-mono truncate ${
                isSelected || isMapped
                  ? 'text-primary-orange' 
                  : isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {key}
              </span>
            </div>
            {!isObject && !isArray && (
              <div className="flex items-center gap-2">
                {isSelected && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-primary-orange/20 text-primary-orange font-medium">
                    selected
                  </span>
                )}
                <span className="text-[10px] text-gray-400 italic opacity-0 group-hover:opacity-100 transition-opacity">
                  {typeof value}
                </span>
              </div>
            )}
          </div>
          
          {(isObject || isArray) && isExpanded && (
            <div className="flex flex-col">
              {renderNode(isArray ? value[0] || {} : value, currentPath, depth + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="flex flex-col gap-0.5 py-2">
      {renderNode(data)}
    </div>
  );
};

export default JsonTreeView;