import React, { useContext } from 'react';
import ReactDOM from 'react-dom';
import { ThemeContext } from '../../../components/common/ThemeContext';

const ChangeComparisonModal = ({ isOpen, onClose, onConfirm, changedFields, hasChanges }) => {
  const { theme } = useContext(ThemeContext);
  
  if (!isOpen) return null;

  const formatValue = (value) => {
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (value === null || value === undefined || value === '') return '-';
    return String(value);
  };

  const getFieldLabel = (fieldName) => {
    const labels = {
      amount: 'Amount',
      api_visibility: 'API Visibility',
      api_category_type: 'API Category Type',
      commercial_type: 'Commercial Type',
    };
    return labels[fieldName] || fieldName;
  };

  const isDark = theme === 'dark' || theme === 'dark-theme'; // Handling potential theme naming variations
  const bgColor = isDark ? 'bg-[#2F3349]' : 'bg-white';
  const textColor = isDark ? 'text-white' : 'text-gray-900';
  const subTextColor = isDark ? 'text-gray-300' : 'text-gray-600';
  const borderColor = isDark ? 'border-gray-600' : 'border-gray-200';
  const headerBg = isDark ? 'bg-[#25293C]' : 'bg-gray-50';
  const hoverColor = isDark ? 'hover:bg-[#363b49]' : 'hover:bg-gray-50';

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className={`${bgColor} rounded-lg shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col border ${borderColor}`}>
        {/* Header */}
        <div className={`px-6 py-4 border-b ${borderColor}`}>
          <h2 className={`text-xl font-semibold ${textColor}`}>
            {hasChanges ? 'Confirm Changes' : 'Confirm Launch'}
          </h2>
        </div>

        {/* Content */}
        <div className="px-6 py-6 overflow-y-auto flex-1">
          {hasChanges ? (
            <div>
              <p className={`text-sm ${subTextColor} mb-4`}>
                The following fields will be updated:
              </p>
              <div className={`overflow-x-auto rounded-lg border ${borderColor}`}>
                <table className="w-full border-collapse">
                  <thead>
                    <tr className={headerBg}>
                      <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider border-b ${borderColor} ${subTextColor}`}>
                        Field Name
                      </th>
                      <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider border-b ${borderColor} ${subTextColor}`}>
                        Old Value
                      </th>
                      <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider border-b ${borderColor} ${subTextColor}`}>
                        New Value
                      </th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isDark ? 'divide-gray-600' : 'divide-gray-200'} ${bgColor}`}>
                    {changedFields.map((field, index) => (
                      <tr key={index} className={`${hoverColor} transition-colors`}>
                        <td className={`px-4 py-3 text-sm font-medium ${textColor}`}>
                          {getFieldLabel(field.field)}
                        </td>
                        <td className={`px-4 py-3 text-sm ${subTextColor}`}>
                          {formatValue(field.oldValue)}
                        </td>
                        <td className="px-4 py-3 text-sm text-green-600 font-medium">
                          {formatValue(field.newValue)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className={`text-lg font-medium mb-2 ${textColor}`}>
                You are launching this API without any changes.
              </p>
              <p className={`text-sm ${subTextColor}`}>
                Would you like to proceed?
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`px-6 py-4 border-t ${borderColor} flex justify-end gap-3 ${isDark ? 'bg-[#2F3349]' : 'bg-gray-50'}`}>
          <button
            onClick={onClose}
            className={`px-6 py-2 rounded-lg border ${borderColor} ${textColor} ${hoverColor} transition-colors font-medium`}
          >
            No
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium transition-colors shadow-md hover:shadow-lg"
          >
            Yes
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ChangeComparisonModal;
