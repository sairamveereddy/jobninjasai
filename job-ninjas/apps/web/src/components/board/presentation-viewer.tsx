import React, { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight, Play, Pause, Maximize } from 'lucide-react';
import { Layer, SlideLayer } from '@/types/canvas';

interface PresentationViewerProps {
  layers: Record<string, Layer>;
  startLayerId: string;
  onClose: () => void;
}

export const PresentationViewer: React.FC<PresentationViewerProps> = ({ layers, startLayerId, onClose }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Determine the base filename of the clicked slide to group only its related slides
  const startLayer = layers[startLayerId] as SlideLayer;
  let baseName = startLayer?.fileName || '';
  if (baseName.includes(' - Slide ')) {
    baseName = baseName.split(' - Slide ')[0];
  }

  // Find all slide layers on the board that belong to this presentation
  // We sort them by X position to determine slide order (like Miro's horizontal layout)
  const slideLayers = Object.entries(layers)
    .filter(([_, layer]) => layer.type === 7 /* LayerType.Slide */)
    .map(([id, layer]) => ({ id, layer: layer as SlideLayer }))
    .filter(({ layer }) => {
      if (!baseName) return true;
      let layerBaseName = layer.fileName || '';
      if (layerBaseName.includes(' - Slide ')) {
        layerBaseName = layerBaseName.split(' - Slide ')[0];
      }
      return layerBaseName === baseName;
    })
    .sort((a, b) => a.layer.x - b.layer.x);

  const startIndex = slideLayers.findIndex(s => s.id === startLayerId);
  const [currentIndex, setCurrentIndex] = useState(startIndex >= 0 ? startIndex : 0);

  const currentSlide = slideLayers[currentIndex]?.layer;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' || e.key === ' ') {
        setCurrentIndex(prev => Math.min(prev + 1, slideLayers.length - 1));
      }
      if (e.key === 'ArrowLeft') {
        setCurrentIndex(prev => Math.max(prev - 1, 0));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, slideLayers.length]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentIndex(prev => {
          if (prev >= slideLayers.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, slideLayers.length]);

  if (!slideLayers.length) return null;

  return (
    <div className="fixed inset-0 z-[99999] bg-black flex flex-col pointer-events-auto">
      {/* Top Header */}
      <div className="absolute top-0 inset-x-0 z-50 h-14 bg-[#111]/90 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-4 opacity-0 hover:opacity-100 transition-opacity duration-300">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="text-slate-400 hover:text-white flex items-center gap-2 text-sm font-medium transition-colors">
            <X className="w-4 h-4" /> Back to canvas
          </button>
        </div>
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
          <h3 className="text-white font-medium text-sm">
            {currentSlide?.fileName || 'Company Presentation'}
          </h3>
          <span className="text-slate-500 text-xs px-2 py-0.5 bg-white/5 rounded-full">
            Slide {currentIndex + 1} of {slideLayers.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-sm font-medium transition-colors">
            Share
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">


        {/* Center Stage */}
        <div className="flex-1 relative flex items-center justify-center bg-black">
          <div className="relative w-full h-full flex items-center justify-center">
            {currentSlide?.fileSrc && (currentSlide.fileSrc.startsWith('data:image') || currentSlide.fileSrc.match(/\.(jpeg|jpg|gif|png)$/i)) ? (
              <img 
                src={currentSlide.fileSrc} 
                alt={`Slide ${currentIndex + 1}`} 
                className="w-full h-full object-contain"
              />
            ) : currentSlide?.fileSrc && (currentSlide.fileSrc.startsWith('data:application/pdf') || currentSlide.fileSrc.endsWith('.pdf')) ? (
              <iframe 
                src={currentSlide.fileSrc} 
                className="w-full h-full bg-white border-none" 
                title={`Presentation Viewer Slide ${currentIndex + 1}`} 
              />
            ) : (
              <div className="w-full h-full aspect-[16/9] bg-gradient-to-br from-indigo-900 via-slate-900 to-violet-900 rounded-xl flex flex-col items-center justify-center text-white border border-white/10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 to-violet-500"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent blur-2xl pointer-events-none"></div>
                <div className="z-10 flex flex-col items-center text-center p-12">
                  <h2 className="text-3xl sm:text-5xl font-black mb-4 tracking-tight drop-shadow-md bg-gradient-to-br from-white to-blue-200 bg-clip-text text-transparent">{currentSlide?.fileName?.replace(/\.[^/.]+$/, "") || 'Presentation'}</h2>
                  <p className="text-blue-200/80 text-lg font-medium">Job Ninjas Interactive Presentation</p>
                </div>
              </div>
            )}
          </div>

          {/* Floating Controls Overlay */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-[#1a1a1a]/90 backdrop-blur-md border border-white/10 p-1.5 rounded-2xl shadow-2xl opacity-10 hover:opacity-100 transition-opacity duration-500 z-50">
            <button 
              onClick={() => setCurrentIndex(prev => Math.max(prev - 1, 0))}
              disabled={currentIndex === 0}
              className="p-2 text-slate-400 hover:text-white disabled:opacity-30 transition-colors rounded-xl hover:bg-white/10"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <div className="px-4 text-sm font-medium text-slate-300 font-mono">
              {currentIndex + 1} / {slideLayers.length}
            </div>

            <button 
              onClick={() => setCurrentIndex(prev => Math.min(prev + 1, slideLayers.length - 1))}
              disabled={currentIndex === slideLayers.length - 1}
              className="p-2 text-slate-400 hover:text-white disabled:opacity-30 transition-colors rounded-xl hover:bg-white/10"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <div className="w-px h-6 bg-white/10 mx-1" />

            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className={`p-2 transition-colors rounded-xl ${isPlaying ? 'text-indigo-400 bg-indigo-500/20' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>
            <button 
              onClick={() => {
                if (!document.fullscreenElement) {
                  document.documentElement.requestFullscreen();
                  setIsFullscreen(true);
                } else {
                  document.exitFullscreen();
                  setIsFullscreen(false);
                }
              }}
              className="p-2 text-slate-400 hover:text-white transition-colors rounded-xl hover:bg-white/10"
            >
              <Maximize className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
