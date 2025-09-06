import React, { useRef, useEffect } from 'react';
import type { TextStyle } from '../types';

interface EditableProps {
  children: React.ReactNode;
  isEditing: boolean;
  onSave: (value: string) => void;
  className?: string;
  style?: TextStyle;
}

const Editable: React.FC<EditableProps> = ({ children, isEditing, onSave, className, style }) => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (elementRef.current) {
        elementRef.current.textContent = children as string;
    }
  }, [children]);

  const handleBlur = () => {
    if (elementRef.current) {
      const newValue = elementRef.current.textContent || '';
      if(newValue !== children) {
          onSave(newValue);
      }
    }
  };
  
  const combinedStyle: React.CSSProperties = {
    color: style?.color,
    fontSize: style?.fontSize ? `${style.fontSize}px` : undefined,
  };

  return (
    <div
      ref={elementRef}
      contentEditable={isEditing}
      suppressContentEditableWarning={true}
      onBlur={handleBlur}
      className={`${className} ${isEditing ? 'outline-none ring-2 ring-blue-500 ring-offset-2 rounded-sm cursor-text' : ''}`}
      style={combinedStyle}
    >
      {children}
    </div>
  );
};

export default Editable;
