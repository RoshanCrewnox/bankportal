import React from 'react';
import { FileJson } from 'lucide-react';

/**
 * JsonImpactPreview - Presentational JSON preview for applied masking policy.
 * Mandatory Rules: One responsibility, no business logic, no API calls.
 * Props: jsonPreview (string), maskedFieldName (string), isDark (bool)
 */
const JsonImpactPreview = ({ jsonPreview, maskedFieldName, isDark }) => {
  const lines = jsonPreview.split('\n');

  return (
    <div className={`h-full flex flex-col rounded-2xl border overflow-hidden ${isDark ? 'bg-secondary-dark-bg border-white/10' : 'bg-white border-gray-100 shadow-sm'}`}>
      <div className={`flex items-center justify-between p-4 border-b ${isDark ? 'border-white/10' : 'border-gray-100'}`}>
        <div className="flex items-center gap-2 text-primary-orange">
          <FileJson size={20} />
          <span className="text-xs font-bold">Json Impact Preview</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-[10px] font-bold text-green-400 uppercase tracking-widest">Live Analysis</span>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <div className={`text-right text-[9px] font-mono mb-2 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
          UTF-8 • APPLICATION/JSON
        </div>
        <pre className={`font-mono text-xs leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          {lines.map((line, i) => {
            const isMaskedLine = maskedFieldName && line.trim().startsWith(`"${maskedFieldName}"`);
            return (
              <div
                key={i}
                className={isMaskedLine ? 'bg-primary-orange/20 rounded px-1 -mx-1 text-primary-orange' : ''}
              >
                {line}
              </div>
            );
          })}
        </pre>
      </div>
    </div>
  );
};

export default JsonImpactPreview;
