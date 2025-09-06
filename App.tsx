import React, { useState, useCallback } from 'react';
import { PRESENTATION_DATA } from './constants';
import Slide from './components/Slide';
import EditToolbar from './components/EditToolbar';
import type { SlideData } from './types';
import { getExportableHtml } from './export-template';
import ExportModal from './components/ExportModal';
import ImportModal from './components/ImportModal';

// Chart components for re-hydrating slides on import
import MentalHealthChart from './components/charts/MentalHealthChart';
import GlobalUsageChart from './components/charts/GlobalUsageChart';
import CreatorEconomyChart from './components/charts/CreatorEconomyChart';
import PlatformGrowthChart from './components/charts/PlatformGrowthChart';
import TimeSpentChart from './components/charts/TimeSpentChart';


const chartComponentMap: { [key: string]: React.ComponentType } = {
  MentalHealthChart,
  GlobalUsageChart,
  CreatorEconomyChart,
  PlatformGrowthChart,
  TimeSpentChart,
};

const ArrowLeftIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
  </svg>
);

const ArrowRightIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
  </svg>
);

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

const UploadIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
  </svg>
);


const App: React.FC = () => {
  const [slides, setSlides] = useState<SlideData[]>(PRESENTATION_DATA);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [slidesToImport, setSlidesToImport] = useState<SlideData[]>([]);


  const handleNext = useCallback(() => {
    setDirection(1);
    setCurrentSlideIndex((prevIndex) => (prevIndex + 1) % slides.length);
  }, [slides.length]);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setCurrentSlideIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const handleUpdateSlide = (index: number, updatedData: Partial<SlideData>) => {
    const newSlides = [...slides];
    newSlides[index] = { ...newSlides[index], ...updatedData };
    setSlides(newSlides);
  };

  const handleDuplicateSlide = () => {
    const slideToDuplicate = slides[currentSlideIndex];
    const newSlide = JSON.parse(JSON.stringify(slideToDuplicate));

    const newSlides = [...slides];
    newSlides.splice(currentSlideIndex + 1, 0, newSlide);
    
    setSlides(newSlides);
    setDirection(1);
    setCurrentSlideIndex(currentSlideIndex + 1);
  };
  
  const handleDeleteSlide = () => {
    if (slides.length <= 1) {
      alert("Cannot delete the last slide.");
      return;
    }
    if (window.confirm("Are you sure you want to delete this slide? This action cannot be undone.")) {
      const newSlides = slides.filter((_, index) => index !== currentSlideIndex);
      setSlides(newSlides);
      setCurrentSlideIndex(prevIndex => Math.min(prevIndex, newSlides.length - 1));
    }
  };


  const performExport = (startIndex: number, endIndex: number) => {
    const slidesToExport = slides.slice(startIndex, endIndex + 1);
    
    const exportableSlides = slidesToExport.map(s => {
      // Use the component's function name for serialization
      const chartName = s.chart ? (s.chart as any).name : undefined;
      return {
        ...s,
        chartName,
        chart: undefined,
      };
    });

    const htmlContent = getExportableHtml(exportableSlides);
    
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'presentation.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setIsExportModalOpen(false);
  };
  
  const handleImportFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !file.type.includes('html')) {
        if(file) alert("Please select a valid HTML file.");
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        const content = e.target?.result as string;
        try {
            const match = content.match(/const PRESENTATION_DATA = (\[[\s\S]*?\]);/s);
            if (match && match[1]) {
                const parsedSlides = JSON.parse(match[1]);
                if (Array.isArray(parsedSlides)) {
                    const processedSlides = parsedSlides.map(slide => {
                        if (slide.chartName && chartComponentMap[slide.chartName]) {
                            return { ...slide, chart: chartComponentMap[slide.chartName] };
                        }
                        return slide;
                    });
                    setSlidesToImport(processedSlides);
                    setIsImportModalOpen(true);
                } else {
                    throw new Error("Parsed slide data is not an array.");
                }
            } else {
                throw new Error("Could not find presentation data in the selected file.");
            }
        } catch (error) {
            alert(`Failed to import presentation: ${error instanceof Error ? error.message : String(error)}`);
        }
    };
    reader.readAsText(file);
    event.target.value = '';
  };
  
  const handlePerformImport = (selectedSlides: SlideData[], mode: 'append' | 'replace', targetIndex?: number) => {
    if (mode === 'replace' && targetIndex !== undefined && targetIndex >= 0 && targetIndex < slides.length) {
      const newSlides = [...slides];
      // Replace 1 element at targetIndex with all the selectedSlides
      newSlides.splice(targetIndex, 1, ...selectedSlides);
      setSlides(newSlides);
      setCurrentSlideIndex(targetIndex); // Go to the first new slide
    } else { // 'append' is the default/fallback
      setSlides(prevSlides => [...prevSlides, ...selectedSlides]);
    }

    setIsImportModalOpen(false);
    setSlidesToImport([]);
  };


  const currentSlide = slides[currentSlideIndex];

  const presenterColors: { [key: number]: string } = {
    1: 'bg-blue-100 border border-blue-200 text-blue-800',
    2: 'bg-green-100 border border-green-200 text-green-800',
    3: 'bg-indigo-100 border border-indigo-200 text-indigo-800',
  };

  const presenterColorClass = currentSlide.presenter ? presenterColors[currentSlide.presenter] : '';

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-slate-800 p-4 font-sans antialiased overflow-hidden">
      <div className="w-full max-w-6xl mx-auto aspect-[16/9] bg-white rounded-2xl shadow-xl shadow-gray-200 flex flex-col relative overflow-hidden border border-gray-200">
        <header className="absolute top-0 left-0 w-full p-6 z-20 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-900">The Evolution of Social Media</h1>
           <div className="flex items-center space-x-2">
            <label className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer">
              <UploadIcon className="w-4 h-4" />
              <span>Import HTML</span>
              <input type="file" className="hidden" accept=".html" onChange={handleImportFileSelect} />
            </label>
            <button
                onClick={() => setIsExportModalOpen(true)}
                className="px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Export HTML
              </button>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-600">Edit Mode</span>
              <button
                onClick={() => setIsEditMode(!isEditMode)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isEditMode ? 'bg-blue-600' : 'bg-gray-300'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isEditMode ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>
        </header>

        {isEditMode && (
          <EditToolbar 
            slide={currentSlide}
            onUpdate={(updatedData) => handleUpdateSlide(currentSlideIndex, updatedData)}
          />
        )}

        <div className="flex-grow">
            <Slide 
              key={currentSlideIndex} 
              slideIndex={currentSlideIndex}
              data={currentSlide} 
              direction={direction}
              isEditMode={isEditMode}
              onUpdate={handleUpdateSlide}
            />
        </div>
        
        <footer className="absolute bottom-0 left-0 w-full p-6 flex justify-between items-center z-10">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-500">
              Slide {currentSlideIndex + 1} of {slides.length}
            </span>
             {currentSlide.presenter && (
              <span className={`px-3 py-1 text-xs font-semibold rounded-full ${presenterColorClass}`}>
                Presenter {currentSlide.presenter}
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handlePrev}
              className="p-3 rounded-full bg-white border border-slate-300 text-slate-600 hover:bg-blue-500 hover:text-white transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              aria-label="Previous Slide"
            >
              <ArrowLeftIcon className="w-6 h-6" />
            </button>
            {isEditMode && (
              <>
                <button
                  onClick={handleDuplicateSlide}
                  className="p-3 rounded-full bg-white border border-slate-300 text-slate-600 hover:bg-blue-500 hover:text-white transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  aria-label="Duplicate Slide"
                  title="Duplicate Slide"
                >
                  <DuplicateIcon className="w-6 h-6" />
                </button>
                <button
                  onClick={handleDeleteSlide}
                  className="p-3 rounded-full bg-white border border-slate-300 text-slate-600 hover:bg-red-500 hover:text-white transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  aria-label="Delete Slide"
                  title="Delete Slide"
                >
                  <TrashIcon className="w-6 h-6" />
                </button>
              </>
            )}
            <button
              onClick={handleNext}
              className="p-3 rounded-full bg-white border border-slate-300 text-slate-600 hover:bg-blue-500 hover:text-white transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              aria-label="Next Slide"
            >
              <ArrowRightIcon className="w-6 h-6" />
            </button>
          </div>
        </footer>
      </div>
      <ExportModal 
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={performExport}
        slideCount={slides.length}
      />
      <ImportModal 
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handlePerformImport}
        slides={slidesToImport}
        slideCount={slides.length}
      />
    </main>
  );
};

export default App;