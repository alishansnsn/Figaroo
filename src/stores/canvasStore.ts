import { create } from 'zustand';

// Canvas state interface
interface CanvasState {
  // Canvas view state
  zoom: number;
  canvasPosition: { x: number; y: number };
  isDragging: boolean;
  isSpacePressed: boolean;
  
  // Canvas appearance
  canvasColor: string;
  showDots: boolean;
  showColorPicker: boolean;
  
  // Actions
  setZoom: (zoom: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  
  setCanvasPosition: (position: { x: number; y: number }) => void;
  setIsDragging: (isDragging: boolean) => void;
  setIsSpacePressed: (isSpacePressed: boolean) => void;
  
  setCanvasColor: (color: string) => void;
  setShowDots: (show: boolean) => void;
  toggleDots: () => void;
  setShowColorPicker: (show: boolean) => void;
  toggleColorPicker: () => void;
  
  // Utility actions
  resetCanvas: () => void;
  centerCanvas: () => void;
}

// Create the Canvas store
export const useCanvasStore = create<CanvasState>((set, get) => ({
  // Initial state
  zoom: 80,
  canvasPosition: { x: -100, y: 0 },
  isDragging: false,
  isSpacePressed: false,
  canvasColor: '#2B2B2B',
  showDots: true,
  showColorPicker: false,
  
  // Zoom actions
  setZoom: (zoom: number) => set({ zoom: Math.max(10, Math.min(200, zoom)) }),
  zoomIn: () => set(state => ({ zoom: Math.min(state.zoom + 10, 200) })),
  zoomOut: () => set(state => ({ zoom: Math.max(state.zoom - 10, 10) })),
  
  // Position and dragging actions
  setCanvasPosition: (position: { x: number; y: number }) => set({ canvasPosition: position }),
  setIsDragging: (isDragging: boolean) => set({ isDragging }),
  setIsSpacePressed: (isSpacePressed: boolean) => set({ isSpacePressed }),
  
  // Appearance actions
  setCanvasColor: (color: string) => set({ canvasColor: color }),
  setShowDots: (show: boolean) => set({ showDots: show }),
  toggleDots: () => set(state => ({ showDots: !state.showDots })),
  setShowColorPicker: (show: boolean) => set({ showColorPicker: show }),
  toggleColorPicker: () => set(state => ({ showColorPicker: !state.showColorPicker })),
  
  // Utility actions
  resetCanvas: () => set({
    zoom: 80,
    canvasPosition: { x: -100, y: 0 },
    isDragging: false,
    isSpacePressed: false,
    canvasColor: '#2B2B2B',
    showDots: true,
    showColorPicker: false
  }),
  
  centerCanvas: () => set({
    canvasPosition: { x: 0, y: 0 }
  })
})); 