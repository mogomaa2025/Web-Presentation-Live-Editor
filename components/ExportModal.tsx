import React, { useState, useEffect } from 'react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (start: number, end: number) => void;
  slideCount: number;
}

const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, onExport, slideCount }) => {
  const [from, setFrom] = useState(1);
  const [to, setTo] = useState(slideCount);
  
  useEffect(() => {
    setTo(slideCount);
  }, [slideCount]);

  if (!isOpen) return null;

  const handleExport = () => {
    if (from < 1 || to > slideCount || from > to) {
      alert("Invalid slide range selected.");
      return;
    }
    onExport(from - 1, to - 1);
  };
  
  const handleExportAll = () => {
    onExport(0, slideCount - 1);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Export Slides</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Select Range</label>
            <div className="flex items-center gap-4 mt-1">
              <input
                type="number"
                value={from}
                onChange={(e) => setFrom(Math.max(1, parseInt(e.target.value, 10) || 1))}
                min="1"
                max={slideCount}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              <span>to</span>
              <input
                type="number"
                value={to}
                onChange={(e) => setTo(Math.min(slideCount, parseInt(e.target.value, 10) || slideCount))}
                min="1"
                max={slideCount}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-semibold bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">
            Cancel
          </button>
          <button onClick={handleExportAll} className="px-4 py-2 text-sm font-semibold bg-gray-600 text-white rounded-lg hover:bg-gray-700">
            Export All
          </button>
          <button onClick={handleExport} className="px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Export Range
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;
