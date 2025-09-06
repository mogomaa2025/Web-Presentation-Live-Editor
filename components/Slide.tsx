import React, { useEffect, useState } from 'react';
import type { SlideData } from '../types';
import Editable from './Editable';

interface SlideProps {
  data: SlideData;
  direction: number;
  isEditMode: boolean;
  slideIndex: number;
  onUpdate: (index: number, updatedData: Partial<SlideData>) => void;
}

const DuplicateIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 14.25V5.25C7 4.56 7.56 4 8.25 4h8.5C17.44 4 18 4.56 18 5.25v9" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.125 7.5H6.375C5.615 7.5 5 8.115 5 8.875v9.75C5 19.385 5.615 20 6.375 20h9.25c.76 0 1.375-.615 1.375-1.375V16.5" />
    </svg>
);

const TrashIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
    </svg>
);

const PlusCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);

// Helper function to read a file as a base64 Data URL.
// It returns a promise that resolves with the data URL or rejects with an error.
const readFileAsDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      return reject(new Error('Invalid file type. Please select an image.'));
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to read file as Data URL.'));
      }
    };

    reader.onerror = (error) => {
      reject(new Error('Error reading file: ' + error));
    };
    
    reader.readAsDataURL(file);
  });
};


const Slide: React.FC<SlideProps> = ({ data, direction, isEditMode, slideIndex, onUpdate }) => {
  const { title, subtitle, points, image, chart: ChartComponent, layout = 'text-left', videoUrl } = data;
  const [isAnimating, setIsAnimating] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 50);
    return () => clearTimeout(timer);
  }, [data]);

  useEffect(() => {
    setImageError(false);
  }, [image]);

  const handleTextUpdate = (field: 'title' | 'subtitle' | 'points', value: string, pointIndex?: number) => {
    if (field === 'points' && pointIndex !== undefined) {
      const newPoints = [...points];
      newPoints[pointIndex] = value;
      onUpdate(slideIndex, { points: newPoints });
    } else {
      onUpdate(slideIndex, { [field]: value });
    }
  };
  
  const handleAddPoint = () => {
    const newPoints = [...points, 'New point. Click to edit.'];
    onUpdate(slideIndex, { points: newPoints });
  };

  const handleDuplicatePoint = (index: number) => {
      const newPoints = [...points];
      newPoints.splice(index + 1, 0, points[index]);
      onUpdate(slideIndex, { points: newPoints });
  };

  const handleDeletePoint = (index: number) => {
      if(points.length === 1) { 
          alert("Cannot delete the last point.");
          return;
      }
      const newPoints = [...points];
      newPoints.splice(index, 1);
      onUpdate(slideIndex, { points: newPoints });
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target;
    const file = input.files?.[0];

    if (file) {
      try {
        const imageDataUrl = await readFileAsDataURL(file);
        // The result is a base64 Data URL. Update the slide.
        onUpdate(slideIndex, { image: imageDataUrl, videoUrl: undefined });
      } catch (error) {
        // The helper function provides descriptive error messages.
        alert(error instanceof Error ? error.message : 'An unknown error occurred.');
      }
    }

    // Resetting the input's value allows the user to re-select the same file,
    // which would otherwise not trigger the 'onChange' event.
    if (input) {
      input.value = '';
    }
  };

  const handleSetImageUrl = () => {
    const newImageUrl = prompt("Enter the full URL for the image:");
    if (newImageUrl) {
        try {
            new URL(newImageUrl);
            onUpdate(slideIndex, { image: newImageUrl, videoUrl: undefined });
        } catch (_) {
            alert("Invalid URL. Please enter a valid image URL.");
        }
    }
  };

  const handleSetVideo = () => {
    const newVideoUrl = prompt("Enter YouTube video URL (or leave blank to remove):");
    if (newVideoUrl === null) return; // User clicked cancel

    if (newVideoUrl.trim() === '') {
      onUpdate(slideIndex, { videoUrl: undefined });
      return;
    }

    const getYouTubeID = (url: string): string | null => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const videoId = getYouTubeID(newVideoUrl);

    if (videoId) {
      const embedUrl = `https://www.youtube.com/embed/${videoId}`;
      const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      onUpdate(slideIndex, { videoUrl: embedUrl, image: thumbnailUrl });
    } else {
      alert("Could not extract a valid YouTube video ID from the URL. Please try again.");
    }
  };

  const renderPoints = (isTextOnly = false) => (
    <>
      {points.map((point, index) => (
          isTextOnly ? (
             <div key={index} className="group relative">
                <Editable 
                    isEditing={isEditMode}
                    onSave={(value) => handleTextUpdate('points', value, index)}
                    style={data.pointsStyle}
                    className="block" 
                >
                    {point}
                </Editable>
                {isEditMode && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full pl-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-white p-1 rounded-md shadow z-10">
                        <button onClick={() => handleDuplicatePoint(index)} title="Duplicate Point" className="p-1 text-slate-500 hover:text-blue-600"><DuplicateIcon className="w-5 h-5" /></button>
                        <button onClick={() => handleDeletePoint(index)} title="Delete Point" className="p-1 text-slate-500 hover:text-red-600"><TrashIcon className="w-5 h-5" /></button>
                    </div>
                )}
            </div>
          ) : (
            <li key={index} className="flex items-start group relative">
                <svg className="w-6 h-6 text-blue-500 mr-3 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <Editable
                    isEditing={isEditMode}
                    onSave={(value) => handleTextUpdate('points', value, index)}
                    style={data.pointsStyle}
                    className="text-slate-700 text-lg"
                >
                    {point}
                </Editable>
                 {isEditMode && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full pl-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-white p-1 rounded-md shadow z-10">
                        <button onClick={() => handleDuplicatePoint(index)} title="Duplicate Point" className="p-1 text-slate-500 hover:text-blue-600"><DuplicateIcon className="w-5 h-5" /></button>
                        <button onClick={() => handleDeletePoint(index)} title="Delete Point" className="p-1 text-slate-500 hover:text-red-600"><TrashIcon className="w-5 h-5" /></button>
                    </div>
                )}
            </li>
          )
        ))}
        {isEditMode && (
             <li className={isTextOnly ? 'mt-4' : 'list-none mt-4'}>
                <button 
                    onClick={handleAddPoint} 
                    className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                    <PlusCircleIcon className="w-5 h-5" />
                    Add Point
                </button>
            </li>
        )}
    </>
  );

  const textContent = (
    <div className={`w-full lg:w-1/2 flex flex-col justify-center p-8 lg:p-12 ${layout === 'text-only' ? 'lg:w-full text-center' : ''}`}>
      <Editable
        isEditing={isEditMode}
        onSave={(value) => handleTextUpdate('title', value)}
        style={data.titleStyle}
        className="text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight"
      >
        {title}
      </Editable>
      {subtitle && (
         <Editable
            isEditing={isEditMode}
            onSave={(value) => handleTextUpdate('subtitle', value)}
            style={data.subtitleStyle}
            className="mt-4 text-xl lg:text-2xl text-blue-600 font-medium"
        >
            {subtitle}
        </Editable>
      )}
      <ul className="mt-6 space-y-4">
        {renderPoints()}
      </ul>
    </div>
  );

  const visualContent = (
    <div className="relative w-full lg:w-1/2 p-8 lg:p-12 flex items-center justify-center">
      <div className="relative w-full h-full">
        {ChartComponent ? <ChartComponent /> : videoUrl ? (
          <div className="aspect-video w-full">
            <iframe
              className="w-full h-full rounded-lg shadow-lg"
              src={videoUrl}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        ) : (
          <img 
            src={imageError ? 'https://picsum.photos/id/101/1200/800' : image} 
            alt={title} 
            className="w-full h-full object-cover object-center rounded-lg shadow-lg"
            onError={() => {
              if (image !== 'https://picsum.photos/id/101/1200/800') {
                setImageError(true);
              }
            }}
          />
        )}
        
        {isEditMode && !ChartComponent && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center rounded-lg z-20">
            <div className="flex flex-col sm:flex-row gap-2 bg-black/60 p-3 rounded-lg">
              <label className="bg-white text-slate-800 px-3 py-2 rounded-md text-sm font-semibold hover:bg-blue-100 whitespace-nowrap cursor-pointer">
                Upload Image
                <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                />
              </label>
              <button onClick={handleSetImageUrl} className="bg-white text-slate-800 px-3 py-2 rounded-md text-sm font-semibold hover:bg-blue-100 whitespace-nowrap">Image from URL</button>
              <button onClick={handleSetVideo} className="bg-white text-slate-800 px-3 py-2 rounded-md text-sm font-semibold hover:bg-blue-100 whitespace-nowrap">Set Video</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
  
  const slideAnimationClass = isAnimating
    ? (direction > 0 ? 'animate-[slide-in-right_0.5s_ease-out]' : 'animate-[slide-in-left_0.5s_ease-out]')
    : 'opacity-100';

  return (
    <div
      className={`absolute inset-0 flex flex-col lg:flex-row items-center justify-center h-full w-full bg-white transition-opacity duration-500 ${slideAnimationClass}`}
    >
      <div className={`relative w-full h-full flex flex-col lg:flex-row items-center justify-center ${layout === 'text-right' ? 'lg:flex-row-reverse' : ''}`}>
        {layout === 'text-only' ? (
           <div className="w-full max-w-4xl flex flex-col justify-center p-8 lg:p-12 text-center">
             <Editable
                isEditing={isEditMode}
                onSave={(value) => handleTextUpdate('title', value)}
                style={data.titleStyle}
                className="text-5xl lg:text-7xl font-extrabold text-slate-900 leading-tight"
             >
                {title}
             </Editable>
             {subtitle && (
                <Editable
                    // Corrected typo isEditingMode to isEditMode
                    isEditing={isEditMode}
                    onSave={(value) => handleTextUpdate('subtitle', value)}
                    style={data.subtitleStyle}
                    className="mt-6 text-2xl lg:text-3xl text-blue-600 font-medium"
                >
                    {subtitle}
                </Editable>
             )}
             <div className="mt-8 text-slate-700 text-xl max-w-3xl mx-auto space-y-4">
              {renderPoints(true)}
             </div>
           </div>
        ) : (
          <>
            {textContent}
            {visualContent}
          </>
        )}
      </div>
    </div>
  );
};

export default Slide;