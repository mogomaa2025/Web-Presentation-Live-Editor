import React, { useState } from 'react';
import type { SlideData, TextStyle } from '../types';

interface EditToolbarProps {
  slide: SlideData;
  onUpdate: (updatedData: Partial<SlideData>) => void;
}

type TargetElement = 'titleStyle' | 'subtitleStyle' | 'pointsStyle';

const EditToolbar: React.FC<EditToolbarProps> = ({ slide, onUpdate }) => {
  const [selectedElement, setSelectedElement] = useState<TargetElement>('titleStyle');
  
  const currentStyle = slide[selectedElement] || {};

  const handleStyleChange = (property: keyof TextStyle, value: string) => {
    const newStyle = { ...currentStyle, [property]: value };
    onUpdate({ [selectedElement]: newStyle });
  };
  
  const targets: { key: TargetElement, label: string }[] = [
      { key: 'titleStyle', label: 'Title'},
      { key: 'subtitleStyle', label: 'Subtitle'},
      { key: 'pointsStyle', label: 'Points'}
  ];

  return (
    <div className="absolute top-20 right-6 z-30 bg-white p-4 rounded-lg shadow-2xl border border-gray-200 w-64 space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Target Element</label>
        <select
          value={selectedElement}
          onChange={(e) => setSelectedElement(e.target.value as TargetElement)}
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        >
          {targets.map(t => <option key={t.key} value={t.key}>{t.label}</option>)}
        </select>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="font-size" className="block text-sm font-medium text-gray-700">
            Font Size (px)
        </label>
        <input 
            type="number" 
            id="font-size"
            value={currentStyle.fontSize || ''}
            onChange={(e) => handleStyleChange('fontSize', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Default"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="font-color" className="block text-sm font-medium text-gray-700">
            Font Color
        </label>
        <div className="flex items-center gap-2">
             <input 
                type="color" 
                id="font-color"
                value={currentStyle.color || '#000000'}
                onChange={(e) => handleStyleChange('color', e.target.value)}
                className="w-10 h-10 p-1 border border-gray-300 rounded-md cursor-pointer"
            />
            <input 
                type="text"
                value={currentStyle.color || ''}
                onChange={(e) => handleStyleChange('color', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="#000000"
            />
        </div>
      </div>
    </div>
  );
};

export default EditToolbar;
