import { create } from 'zustand';

// UI state interface for modals and sidebar
interface UIState {
  // Sidebar state
  isSidebarOpen: boolean;
  
  // Modal states
  showComponentModal: boolean;
  showSettingsModal: boolean;
  showInspectorPanel: boolean;
  showDesignSystemPopover: boolean;
  showComponentDropdown: boolean;
  
  // Actions
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  
  // Modal actions
  setComponentModal: (show: boolean) => void;
  setSettingsModal: (show: boolean) => void;
  setInspectorPanel: (show: boolean) => void;
  setDesignSystemPopover: (show: boolean) => void;
  setComponentDropdown: (show: boolean) => void;
  
  // Utility actions
  closeAllModals: () => void;
  closeAllPanels: () => void;
}

// Create the UI store
export const useUIStore = create<UIState>((set, get) => ({
  // Initial state
  isSidebarOpen: false,
  showComponentModal: false,
  showSettingsModal: false,
  showInspectorPanel: false,
  showDesignSystemPopover: false,
  showComponentDropdown: false,
  
  // Sidebar actions
  toggleSidebar: () => set(state => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (open: boolean) => set({ isSidebarOpen: open }),
  
  // Modal actions
  setComponentModal: (show: boolean) => set({ showComponentModal: show }),
  setSettingsModal: (show: boolean) => set({ showSettingsModal: show }),
  setInspectorPanel: (show: boolean) => set({ showInspectorPanel: show }),
  setDesignSystemPopover: (show: boolean) => set({ showDesignSystemPopover: show }),
  setComponentDropdown: (show: boolean) => set({ showComponentDropdown: show }),
  
  // Utility actions
  closeAllModals: () => set({
    showComponentModal: false,
    showSettingsModal: false,
    showDesignSystemPopover: false,
    showComponentDropdown: false
  }),
  
  closeAllPanels: () => set({
    showInspectorPanel: false
  })
})); 