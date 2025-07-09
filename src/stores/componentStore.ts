import { create } from 'zustand';

// Component interface
interface Component {
  id: string;
  code: string;
  name?: string;
  prompt: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  autoResize?: boolean;
}

// Component state interface
interface ComponentState {
  // Component data
  components: Component[];
  selectedComponentId: string | null;
  editingComponentId: string | null;
  editModeComponentId: string | null;
  selectedElement: any | null;
  
  // Actions
  // Component CRUD operations
  addComponent: (component: Component) => void;
  updateComponent: (id: string, updates: Partial<Component>) => void;
  deleteComponent: (id: string) => void;
  duplicateComponent: (id: string) => void;
  
  // Component selection and editing
  selectComponent: (id: string | null) => void;
  setEditingComponent: (id: string | null) => void;
  setEditModeComponent: (id: string | null) => void;
  setSelectedElement: (element: any | null) => void;
  
  // Component positioning and sizing
  moveComponent: (id: string, x: number, y: number) => void;
  resizeComponent: (id: string, width: number, height: number) => void;
  renameComponent: (id: string, newName: string) => void;
  
  // Element operations
  updateElementInComponent: (componentId: string, elementInfo: any, updates: any) => void;
  
  // Utility actions
  clearSelection: () => void;
  getComponentById: (id: string) => Component | undefined;
  getSelectedComponent: () => Component | undefined;
  getEditingComponent: () => Component | undefined;
  getEditModeComponent: () => Component | undefined;
  
  // Bulk operations
  clearAllComponents: () => void;
  loadComponents: (components: Component[]) => void;
}

// Create the component store
export const useComponentStore = create<ComponentState>((set, get) => ({
  // Initial state
  components: [],
  selectedComponentId: null,
  editingComponentId: null,
  editModeComponentId: null,
  selectedElement: null,
  
  // Component CRUD operations
  addComponent: (component: Component) => {
    set(state => ({
      components: [...state.components, component],
      selectedComponentId: component.id
    }));
  },
  
  updateComponent: (id: string, updates: Partial<Component>) => {
    set(state => ({
      components: state.components.map(comp => 
        comp.id === id ? { ...comp, ...updates } : comp
      )
    }));
  },
  
  deleteComponent: (id: string) => {
    set(state => {
      const newComponents = state.components.filter(comp => comp.id !== id);
      let newSelectedId = state.selectedComponentId;
      
      // If deleted component was selected, clear selection
      if (state.selectedComponentId === id) {
        newSelectedId = null;
      }
      
      // If deleted component was being edited, clear editing state
      let newEditingId = state.editingComponentId;
      if (state.editingComponentId === id) {
        newEditingId = null;
      }
      
      // If deleted component was in edit mode, clear edit mode
      let newEditModeId = state.editModeComponentId;
      if (state.editModeComponentId === id) {
        newEditModeId = null;
      }
      
      return {
        components: newComponents,
        selectedComponentId: newSelectedId,
        editingComponentId: newEditingId,
        editModeComponentId: newEditModeId
      };
    });
  },
  
  duplicateComponent: (id: string) => {
    const { components } = get();
    const component = components.find(comp => comp.id === id);
    
    if (component) {
      const newComponent: Component = {
        ...component,
        id: Date.now().toString(),
        position: { 
          x: component.position.x + 20, 
          y: component.position.y + 20 
        },
        autoResize: false // Disable auto-resize for duplicated components
      };
      
      get().addComponent(newComponent);
    }
  },
  
  // Component selection and editing
  selectComponent: (id: string | null) => {
    set({ selectedComponentId: id });
  },
  
  setEditingComponent: (id: string | null) => {
    set({ editingComponentId: id });
  },
  
  setEditModeComponent: (id: string | null) => {
    set({ editModeComponentId: id });
  },
  
  setSelectedElement: (element: any | null) => {
    set({ selectedElement: element });
  },
  
  // Component positioning and sizing
  moveComponent: (id: string, x: number, y: number) => {
    get().updateComponent(id, { position: { x, y } });
  },
  
  resizeComponent: (id: string, width: number, height: number) => {
    get().updateComponent(id, { size: { width, height } });
  },
  
  renameComponent: (id: string, newName: string) => {
    get().updateComponent(id, { name: newName });
  },
  
  // Element operations
  updateElementInComponent: (componentId: string, elementInfo: any, updates: any) => {
    const { components } = get();
    const component = components.find(comp => comp.id === componentId);
    
    if (!component) return;
    
    // Create a temporary DOM element to manipulate the HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = component.code;
    
    // Find the selected element in the temporary DOM
    const elements = tempDiv.querySelectorAll('*');
    let targetElement: HTMLElement | null = null;
    
    // Find matching element by comparing properties
    for (let i = 0; i < elements.length; i++) {
      const el = elements[i] as HTMLElement;
      if (el.tagName.toLowerCase() === elementInfo.tagName &&
          el.textContent === elementInfo.textContent) {
        targetElement = el;
        break;
      }
    }
    
    if (targetElement) {
      // Apply updates
      if (updates.textContent !== undefined) {
        targetElement.textContent = updates.textContent;
      }
      
      if (updates.styles) {
        Object.keys(updates.styles).forEach(property => {
          const value = updates.styles[property];
          targetElement!.style.setProperty(property, value);
        });
      }
      
      // Update the component code
      const updatedCode = tempDiv.innerHTML;
      get().updateComponent(componentId, { code: updatedCode });
      
      // Update selected element info
      const updatedElementInfo = {
        ...elementInfo,
        textContent: updates.textContent || elementInfo.textContent,
        styles: { ...elementInfo.styles, ...updates.styles }
      };
      
      set({ selectedElement: updatedElementInfo });
    }
  },
  
  // Utility actions
  clearSelection: () => {
    set({ 
      selectedComponentId: null,
      editingComponentId: null,
      editModeComponentId: null,
      selectedElement: null
    });
  },
  
  getComponentById: (id: string) => {
    const { components } = get();
    return components.find(comp => comp.id === id);
  },
  
  getSelectedComponent: () => {
    const { components, selectedComponentId } = get();
    return selectedComponentId ? components.find(comp => comp.id === selectedComponentId) : undefined;
  },
  
  getEditingComponent: () => {
    const { components, editingComponentId } = get();
    return editingComponentId ? components.find(comp => comp.id === editingComponentId) : undefined;
  },
  
  getEditModeComponent: () => {
    const { components, editModeComponentId } = get();
    return editModeComponentId ? components.find(comp => comp.id === editModeComponentId) : undefined;
  },
  
  // Bulk operations
  clearAllComponents: () => {
    set({
      components: [],
      selectedComponentId: null,
      editingComponentId: null,
      editModeComponentId: null,
      selectedElement: null
    });
  },
  
  loadComponents: (components: Component[]) => {
    set({ components });
  }
})); 