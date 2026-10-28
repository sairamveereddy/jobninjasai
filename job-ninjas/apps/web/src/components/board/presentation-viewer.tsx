"use client";

import React, { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight, Play, Pause, Maximize, ArrowLeft, ExternalLink, Download } from 'lucide-react';
import { Layer, LayerType, SlideLayer } from '@/types/canvas';
import { cleanDocTitle, getPdfViewerSrc } from '@/lib/document-utils';

interface PresentationViewerProps {
  layers: Record<string, Layer>;
  startLayerId: string;
  onClose: () => void;
}

export const PresentationViewer: React.FC<PresentationViewerProps> = ({ layers, startLayerId, onClose }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const startLayer = layers[startLayerId] as any;
  let baseName = startLayer?.fileName || '';
  if (baseName.includes(' - Slide ')) {
    baseName = baseName.split(' - Slide ')[0];
  }

  // Find all viewable slides, PDFs, and images
  const viewableLayers = Object.entries(layers)
    .filter(([id, layer]) => {
      if (id === startLayerId) return true;
      const isSlide = layer.type === LayerType.Slide || (layer as any).fileSrc;
      const isImg = layer.type === LayerType.Image || (layer as any).src;
      return isSlide || isImg;
    })
    .map(([id, layer]) => ({ id, layer: layer as any }))
    .filter(({ layer }) => {
      if (!baseName) return true;
      let layerBaseName = layer.fileName || '';
      if (layerBaseName.includes(' - Slide ')) {
        layerBaseName = layerBaseName.split(' - Slide ')[0];
      }
      return layerBaseName === baseName || (!layerBaseName && !baseName);
    })
    .sort((a, b) => a.layer.x - b.layer.x);

  const startIndex = viewableLayers.findIndex(s => s.id === startLayerId);
  const [currentIndex, setCurrentIndex] = useState(startIndex >= 0 ? startIndex : 0);

  const currentLayer = viewableLayers[currentIndex]?.layer || startLayer;
  const currentSrc = currentLayer?.fileSrc || currentLayer?.src;
  const currentTitle = cleanDocTitle(currentLayer?.fileName || currentLayer?.value || 'Document');

  const isImage = currentSrc && (
    currentSrc.startsWith('data:image') ||
    currentSrc.match(/\.(jpeg|jpg|gif|png|webp|svg)$/i) ||
    currentLayer?.type === LayerType.Image
  );

  const isPdf = currentSrc && (
    currentSrc.startsWith('data:application/pdf') ||
    currentSrc.includes('.pdf')
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' || e.key === ' ') {
        setCurrentIndex(prev => Math.min(prev + 1, viewableLayers.length - 1));
      }
      if (e.key === 'ArrowLeft') {
        setCurrentIndex(prev => Math.max(prev - 1, 0));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, viewableLayers.length]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && viewableLayers.length > 1) {
      interval = setInterval(() => {
        setCurrentIndex(prev => {
          if (prev >= viewableLayers.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, viewableLayers.length]);

  if (!currentLayer) return null;

  return (
    <div 
      className="fixed inset-0 z-[99999] bg-slate-950/95 backdrop-blur-md flex flex-col pointer-events-auto font-sans" 
      role="dialog" 
      aria-modal="true" 
      aria-label="JobNinjas presentation"
    >
      {/* Top Header - Always clearly visible and easy to navigate */}
      <header className="relative z-50 h-16 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between px-6 shadow-md">
        <div className="flex items-center gap-3">
          <button 
            type="button"
            onClick={onClose} 
            className="flex items-center gap-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 px-3.5 py-2 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors cursor-pointer"
            title="Back to board (Esc)"
          >
            <ArrowLeft className="w-4 h-4 text-indigo-400" />
            <span>Back to board</span>
          </button>
        </div>

        <div className="flex items-center gap-3 max-w-[50vw]">
          <h2 className="text-white font-bold text-sm truncate" title={currentTitle}>
            {currentTitle}
          </h2>
          {viewableLayers.length > 1 && (
            <span className="text-slate-400 text-xs px-2.5 py-0.5 bg-slate-800 rounded-full border border-slate-700 font-medium shrink-0">
              {currentIndex + 1} of {viewableLayers.length}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {currentSrc && (
            <a
              href={currentSrc}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 px-3 py-2 text-xs font-medium text-slate-300 border border-slate-700 transition-colors"
              title="Open document in new tab"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Open in new tab</span>
            </a>
          )}
          <button 
            type="button"
            onClick={onClose}
            className="flex items-center justify-center w-9 h-9 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close fullscreen"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Stage */}
      <main className="flex-1 relative flex items-center justify-center p-4 sm:p-6 overflow-hidden">
        <div className="relative w-full h-full max-w-6xl max-h-[calc(100vh-6rem)] flex items-center justify-center rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl">
          {isImage ? (
            <img 
              src={currentSrc} 
              alt={currentTitle} 
              className="w-full h-full object-contain bg-slate-950 p-2"
            />
          ) : isPdf ? (
            <iframe 
              src={getPdfViewerSrc(currentSrc, { hideNavPanes: true, hideToolbar: false })} 
              className="w-full h-full bg-white border-none" 
              title={currentTitle} 
            />
          ) : (
            <div className="w-full h-full aspect-[16/9] bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 rounded-2xl flex flex-col items-center justify-center text-white border border-slate-800 shadow-2xl p-12 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-blue-400" />
              <h3 className="text-3xl sm:text-4xl font-extrabold mb-3 tracking-tight text-white">{currentTitle}</h3>
              <p className="text-slate-400 text-sm max-w-md">Document preview</p>
              {currentSrc && (
                <a
                  href={currentSrc}
                  download={currentTitle}
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-2.5 text-xs font-semibold text-white shadow-md transition-colors"
                >
                  <Download className="w-4 h-4" /> Download document
                </a>
              )}
            </div>
          )}
        </div>

        {/* Floating Controls Overlay for Multi-Slide / Multi-Page Decks */}
        {viewableLayers.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-2 rounded-2xl shadow-2xl z-50">
            <button 
              type="button"
              onClick={() => setCurrentIndex(prev => Math.max(prev - 1, 0))}
              disabled={currentIndex === 0}
              className="p-2 text-slate-400 hover:text-white disabled:opacity-30 transition-colors rounded-xl hover:bg-slate-800 cursor-pointer"
              title="Previous slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <div className="px-3 text-xs font-semibold text-slate-300 font-mono">
              {currentIndex + 1} / {viewableLayers.length}
            </div>

            <button 
              type="button"
              onClick={() => setCurrentIndex(prev => Math.min(prev + 1, viewableLayers.length - 1))}
              disabled={currentIndex === viewableLayers.length - 1}
              className="p-2 text-slate-400 hover:text-white disabled:opacity-30 transition-colors rounded-xl hover:bg-slate-800 cursor-pointer"
              title="Next slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <div className="w-px h-5 bg-slate-700 mx-1" />

            <button 
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className={`p-2 transition-colors rounded-xl cursor-pointer ${isPlaying ? 'text-indigo-400 bg-indigo-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
              title={isPlaying ? "Pause slideshow" : "Play slideshow"}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button 
              type="button"
              onClick={() => {
                if (!document.fullscreenElement) {
                  document.documentElement.requestFullscreen().catch(() => {});
                  setIsFullscreen(true);
                } else {
                  document.exitFullscreen().catch(() => {});
                  setIsFullscreen(false);
                }
              }}
              className="p-2 text-slate-400 hover:text-white transition-colors rounded-xl hover:bg-slate-800 cursor-pointer"
              title="Toggle fullscreen"
            >
              <Maximize className="w-4 h-4" />
            </button>
          </div>
        )}
      </main>
    </div>
  );
};
