import React, { useState, useEffect } from 'react';
import type { SlideData } from '../types';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (slides: SlideData[], mode: 'append' | 'replace', targetIndex?: number) => void;
  slides: SlideData[];
  slideCount: number;
}

const ImportModal: React.FC<ImportModalProps> = ({ isOpen, onClose, onImport, slides, slideCount }) => {
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set());
  const [importMode, setImportMode] = useState<'append' | 'replace'>('append');
  const [replaceIndex, setReplaceIndex] = useState(1);

  useEffect(() => {
    // Reset state when modal is opened or slides change
    if (isOpen) {
      setSelectedIndices(new Set());
      setImportMode('append');
      setReplaceIndex(1);
    }
  }, [isOpen, slides]);

  if (!isOpen) return null;

  const handleToggle = (index: number) => {
    const newSelection = new Set(selectedIndices);
    if (newSelection.has(index)) {
      newSelection.delete(index);
    } else {
      newSelection.add(index);
    }
    setSelectedIndices(newSelection);
  };
  
  const handleSelectAll = () => {
    const allIndices = new Set(slides.map((_, i) => i));
    setSelectedIndices(allIndices);
  };
  
  const handleDeselectAll = () => {
    setSelectedIndices(new Set());
  };

  const handleImport = () => {
    const slidesToImport = slides.filter((_, index) => selectedIndices.has(index));
    if (slidesToImport.length > 0) {
      if (importMode === 'replace') {
         if (replaceIndex < 1 || replaceIndex > slideCount) {
          alert(`Invalid slide number to replace. Please enter a number between 1 and ${slideCount}.`);
          return;
        }
        onImport(slidesToImport, 'replace', replaceIndex - 1);
      } else {
        onImport(slidesToImport, 'append');
      }
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg flex flex-col" style={{ height: '80vh' }}>
        <h2 className="text-xl font-bold mb-4">Import Slides</h2>
        <p className="text-sm text-gray-600 mb-2">Select the slides you want to add to your presentation.</p>
        
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-medium">{selectedIndices.size} of {slides.length} selected</span>
          <div className="space-x-2">
            <button onClick={handleSelectAll} className="text-sm text-blue-600 hover:underline">Select All</button>
            <button onClick={handleDeselectAll} className="text-sm text-blue-600 hover:underline">Deselect All</button>
          </div>
        </div>
        
        <div className="flex-grow overflow-y-auto border rounded-md p-2 space-y-2 bg-gray-50">
          {slides.map((slide, index) => (
            <label key={index} className="flex items-center p-2 border-b last:border-b-0 hover:bg-blue-50 cursor-pointer rounded">
              <input
                type="checkbox"
                checked={selectedIndices.has(index)}
                onChange={() => handleToggle(index)}
                className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-3 text-gray-800 select-none">{index + 1}. {slide.title}</span>
            </label>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t">
            <h3 className="text-sm font-medium text-gray-700">Import Option</h3>
            <div className="flex gap-6 mt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="import-mode" value="append" checked={importMode === 'append'} onChange={() => setImportMode('append')} className="h-4 w-4 text-blue-600"/>
                    Append to end
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="import-mode" value="replace" checked={importMode === 'replace'} onChange={() => setImportMode('replace')} className="h-4 w-4 text-blue-600"/>
                    Replace slide
                </label>
            </div>
            {importMode === 'replace' && (
              <div className="mt-3">
                <label htmlFor="replace-index" className="block text-xs font-medium text-gray-600 mb-1">Slide number to replace:</label>
                <input
                  id="replace-index"
                  type="number"
                  value={replaceIndex}
                  onChange={(e) => setReplaceIndex(Math.max(1, parseInt(e.target.value, 10) || 1))}
                  min="1"
                  max={slideCount}
                  className="p-2 border border-gray-300 rounded-md w-24"
                />
              </div>
            )}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-semibold bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">
            Cancel
          </button>
          <button onClick={handleImport} disabled={selectedIndices.size === 0} className="px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400">
            Import ({selectedIndices.size})
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImportModal;