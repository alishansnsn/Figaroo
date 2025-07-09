import React, { useState, useRef, useEffect, useCallback } from 'react';
import './GeneratedComponent.css';
import { 
  Edit3, Copy, Trash2, Move, RotateCcw, Settings, 
  Wand2, Eye, ArrowRight, MoreHorizontal, RefreshCw, 
  Tag, ExternalLink, Layers 
} from 'lucide-react';
import { HTMLSanitizer } from '../utils/sanitizer';
import { COMPONENT_CONSTRAINTS, MESSAGES } from '../constants';
import { ComponentToolbar } from './GeneratedComponent/ComponentToolbar';
import { ComponentResizeHandles } from './GeneratedComponent/ComponentResizeHandles';
import { ErrorHandler } from '../utils/errorHandler';

interface GeneratedComponentProps {
  id: string;
  code: string;
  name?: string;
  prompt?: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  isSelected: boolean;
  isEditMode?: boolean;
  onSelect: (id: string) => void;
  onResize: (id: string, width: number, height: number) => void;
  onMove: (id: string, x: number, y: number) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onDuplicate?: (id: string) => void;
  onEditMode?: (id: string, isEditMode: boolean) => void;
  onElementSelect?: (elementInfo: any) => void;
  onRename?: (id: string, newName: string) => void;
  autoResize?: boolean;
}

type ResizeDirection = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';

interface DragState {
  isDragging: boolean;
  isResizing: boolean;
  resizeDirection?: ResizeDirection;
  startPos: { x: number; y: number };
  startSize: { width: number; height: number };
  startMouse: { x: number; y: number };
}

const GeneratedComponent: React.FC<GeneratedComponentProps> = ({
  id,
  code,
  name,
  prompt,
  position,
  size,
  isSelected,
  isEditMode = false,
  onSelect,
  onResize,
  onMove,
  onEdit,
  onDelete,
  onDuplicate,
  onEditMode,
  onElementSelect,
  onRename,
  autoResize = false
}) => {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    isResizing: false,
    startPos: { x: 0, y: 0 },
    startSize: { width: 0, height: 0 },
    startMouse: { x: 0, y: 0 }
  });
  
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [showMoreOptionsMenu, setShowMoreOptionsMenu] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [editingName, setEditingName] = useState('');
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(null);
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  // Generate a meaningful component name from prompt or use provided name
  const generateComponentName = (prompt?: string, name?: string): string => {
    if (name) return name;
    if (prompt) {
      // Clean up the prompt and create a readable name
      const cleanPrompt = prompt.trim();
      // Capitalize first letter and limit length
      return cleanPrompt.charAt(0).toUpperCase() + cleanPrompt.slice(1, 50) + (cleanPrompt.length > 50 ? '...' : '');
    }
    return `Component ${id.slice(-3)}`;
  };

  const [componentName, setComponentName] = useState(generateComponentName(prompt, name));
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  
  const componentRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const moreOptionsRef = useRef<HTMLDivElement>(null);

  // Size constraints from constants
  const { MIN_WIDTH, MIN_HEIGHT, MAX_WIDTH, MAX_HEIGHT, MEASURE_DELAY, AI_PROCESSING_DELAY } = COMPONENT_CONSTRAINTS;

  // Auto-resize effect to match content dimensions
  useEffect(() => {
    if (autoResize && contentRef.current) {
      const measureContent = () => {
        const contentElement = contentRef.current;
        if (!contentElement) return;

        // Create a temporary container to measure natural dimensions
        const tempContainer = document.createElement('div');
        tempContainer.style.position = 'absolute';
        tempContainer.style.visibility = 'hidden';
        tempContainer.style.width = 'auto';
        tempContainer.style.height = 'auto';
        tempContainer.style.overflow = 'visible';
        tempContainer.style.fontFamily = 'inherit';
        tempContainer.style.fontSize = 'inherit';
        tempContainer.style.lineHeight = 'inherit';
        tempContainer.innerHTML = code;
        
        document.body.appendChild(tempContainer);
        
        // Get the natural dimensions
        const naturalWidth = tempContainer.scrollWidth;
        const naturalHeight = tempContainer.scrollHeight;
        
        // Clean up
        document.body.removeChild(tempContainer);
        
        // Apply size constraints
        const newWidth = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, naturalWidth));
        const newHeight = Math.min(MAX_HEIGHT, Math.max(MIN_HEIGHT, naturalHeight));
        
        // Only resize if dimensions are significantly different
        if (Math.abs(newWidth - size.width) > 5 || Math.abs(newHeight - size.height) > 5) {
          onResize(id, newWidth, newHeight);
        }
      };

      // Use a small delay to ensure content is rendered
      const timeoutId = setTimeout(measureContent, MEASURE_DELAY);
      
      return () => clearTimeout(timeoutId);
    }
  }, [autoResize, code, id, onResize, size.width, size.height]);

  // Handle mouse down for dragging
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (isEditMode) return; // Disable dragging in edit mode
    
    e.stopPropagation();
    onSelect(id);
    setShowContextMenu(false);
    setShowMoreOptionsMenu(false);
    
    // Only start dragging if clicking on the component itself, not resize handles
    if (e.target === componentRef.current || e.target === contentRef.current || 
        (e.target as HTMLElement).closest('.component-content')) {
      setDragState({
        isDragging: true,
        isResizing: false,
        startPos: position,
        startSize: size,
        startMouse: { x: e.clientX, y: e.clientY }
      });
    }
  }, [id, onSelect, position, size, isEditMode]);

  // Handle element selection in edit mode
  const handleElementClick = useCallback((e: React.MouseEvent) => {
    if (!isEditMode) return;
    
    e.stopPropagation();
    e.preventDefault();
    
    const target = e.target as HTMLElement;
    if (target === componentRef.current || target === contentRef.current) return;
    
    // Remove previous selection
    if (selectedElement) {
      selectedElement.classList.remove('element-selected');
    }
    
    // Add selection to new element
    target.classList.add('element-selected');
    setSelectedElement(target);
    
    // Get element information for inspector
    const elementInfo = {
      tagName: target.tagName.toLowerCase(),
      textContent: target.textContent,
      className: target.className,
      id: target.id,
      styles: {
        color: getComputedStyle(target).color,
        backgroundColor: getComputedStyle(target).backgroundColor,
        fontSize: getComputedStyle(target).fontSize,
        fontWeight: getComputedStyle(target).fontWeight,
        margin: getComputedStyle(target).margin,
        padding: getComputedStyle(target).padding,
        borderRadius: getComputedStyle(target).borderRadius,
        width: getComputedStyle(target).width,
        height: getComputedStyle(target).height,
      },
      innerHTML: target.innerHTML
    };
    
    onElementSelect && onElementSelect(elementInfo);
  }, [isEditMode, selectedElement, onElementSelect]);

  // Handle resize start
  const handleResizeStart = useCallback((e: React.MouseEvent, direction: ResizeDirection) => {
    if (isEditMode) return; // Disable resizing in edit mode
    
    e.stopPropagation();
    e.preventDefault();
    
    setDragState({
      isDragging: false,
      isResizing: true,
      resizeDirection: direction,
      startPos: position,
      startSize: size,
      startMouse: { x: e.clientX, y: e.clientY }
    });
  }, [position, size, isEditMode]);

  // Handle context menu
  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    if (isEditMode) return; // Disable context menu in edit mode
    
    e.preventDefault();
    e.stopPropagation();
    onSelect(id);
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
    setShowContextMenu(true);
    setShowMoreOptionsMenu(false);
  }, [id, onSelect, isEditMode]);

  // Mouse move handler
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (dragState.isDragging) {
      const deltaX = e.clientX - dragState.startMouse.x;
      const deltaY = e.clientY - dragState.startMouse.y;
      
      onMove(id, dragState.startPos.x + deltaX, dragState.startPos.y + deltaY);
    } else if (dragState.isResizing && dragState.resizeDirection) {
      const deltaX = e.clientX - dragState.startMouse.x;
      const deltaY = e.clientY - dragState.startMouse.y;
      
      let newWidth = dragState.startSize.width;
      let newHeight = dragState.startSize.height;
      let newX = dragState.startPos.x;
      let newY = dragState.startPos.y;

      const direction = dragState.resizeDirection;

      // Handle width changes
      if (direction.includes('e')) {
        newWidth = Math.max(MIN_WIDTH, dragState.startSize.width + deltaX);
      } else if (direction.includes('w')) {
        const widthChange = -deltaX;
        newWidth = Math.max(MIN_WIDTH, dragState.startSize.width + widthChange);
        if (newWidth > MIN_WIDTH) {
          newX = dragState.startPos.x - widthChange;
        }
      }

      // Handle height changes
      if (direction.includes('s')) {
        newHeight = Math.max(MIN_HEIGHT, dragState.startSize.height + deltaY);
      } else if (direction.includes('n')) {
        const heightChange = -deltaY;
        newHeight = Math.max(MIN_HEIGHT, dragState.startSize.height + heightChange);
        if (newHeight > MIN_HEIGHT) {
          newY = dragState.startPos.y - heightChange;
        }
      }

      // Update position if needed (for northwest, west, north, northeast resize)
      if (newX !== dragState.startPos.x || newY !== dragState.startPos.y) {
        onMove(id, newX, newY);
      }
      
      onResize(id, newWidth, newHeight);
    }
  }, [dragState, id, onMove, onResize]);

  // Mouse up handler
  const handleMouseUp = useCallback(() => {
    setDragState({
      isDragging: false,
      isResizing: false,
      startPos: { x: 0, y: 0 },
      startSize: { width: 0, height: 0 },
      startMouse: { x: 0, y: 0 }
    });
  }, []);

  // Add/remove event listeners
  useEffect(() => {
    if (dragState.isDragging || dragState.isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = dragState.isDragging ? 'grabbing' : 'inherit';
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = 'inherit';
      };
    }
  }, [dragState.isDragging, dragState.isResizing, handleMouseMove, handleMouseUp]);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      setShowContextMenu(false);
      if (moreOptionsRef.current && !moreOptionsRef.current.contains(event.target as Node)) {
        setShowMoreOptionsMenu(false);
      }
    };
    
    if (showContextMenu || showMoreOptionsMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showContextMenu, showMoreOptionsMenu]);

  // Clean up element selection when exiting edit mode
  useEffect(() => {
    if (!isEditMode && selectedElement) {
      selectedElement.classList.remove('element-selected');
      setSelectedElement(null);
    }
  }, [isEditMode, selectedElement]);

  // Update component name when name prop changes
  useEffect(() => {
    if (name && name !== componentName) {
      setComponentName(name);
    }
  }, [name, componentName]);

  // Render generated content safely with XSS protection
  const renderGeneratedContent = () => {
    try {
      // Sanitize the HTML code to prevent XSS attacks
      const sanitizedCode = HTMLSanitizer.sanitize(code);
      
      return (
        <div 
          className="generated-content"
          dangerouslySetInnerHTML={{ __html: sanitizedCode }}
          onClick={handleElementClick}
        />
      );
    } catch (error) {
      console.error('Error sanitizing or rendering component:', error);
      return (
        <div className="error-content">
          <div className="error-icon">⚠️</div>
          <p>Error rendering component</p>
        </div>
      );
    }
  };

  // Toolbar action handlers
  const handleAskFigaroo = async () => {
    setIsProcessingAI(true);
    // Simulate AI processing
    setTimeout(() => {
      setIsProcessingAI(false);
      // Here you would integrate with your AI service
      ErrorHandler.showInfo('AI Processing', MESSAGES.COMING_SOON);
    }, AI_PROCESSING_DELAY);
  };

  const handleEditClick = () => {
    onEditMode && onEditMode(id, !isEditMode);
  };

  const handleCreateFlow = () => {
    ErrorHandler.showInfo('Create Flow', MESSAGES.COMING_SOON);
  };

  const handleOpenNewTab = () => {
    // Create a new window/tab with just the component
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      // Sanitize the code before opening in new tab to prevent XSS
      const sanitizedCode = HTMLSanitizer.sanitize(code);
      
      newWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${componentName}</title>
            <style>
              body { 
                margin: 0; 
                padding: 40px; 
                background: #f5f5f5; 
                display: flex; 
                justify-content: center; 
                align-items: center; 
                min-height: 100vh;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              }
            </style>
          </head>
          <body>
            ${sanitizedCode}
          </body>
        </html>
      `);
      newWindow.document.close();
    }
  };

  const handleMoreOptions = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMoreOptionsMenu(!showMoreOptionsMenu);
  };

  const handleRefresh = () => {
    setShowMoreOptionsMenu(false);
    // Simulate refresh
    ErrorHandler.showSuccess('Component Refreshed', 'Component has been refreshed successfully!');
  };

  const handleRename = () => {
    setShowMoreOptionsMenu(false);
    setShowRenameModal(true);
  };

  const handleCopy = () => {
    setShowMoreOptionsMenu(false);
    onDuplicate && onDuplicate(id);
  };

  const handleDelete = () => {
    setShowMoreOptionsMenu(false);
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = () => {
    setShowDeleteConfirmation(false);
    onDelete && onDelete(id);
  };

  const handleRenameSubmit = (newName: string) => {
    setComponentName(newName);
    setShowRenameModal(false);
  };

  const handleLabelClick = () => {
    if (isEditMode) return; // Don't allow renaming in edit mode
    setIsRenaming(true);
    setEditingName(componentName);
  };

  const handleInlineRenameSubmit = () => {
    if (editingName.trim()) {
      const newName = editingName.trim();
      // Component name submitted: ${newName}
      setComponentName(newName);
      onRename && onRename(id, newName);
    }
    setIsRenaming(false);
    setEditingName('');
  };

  const handleInlineRenameCancel = () => {
    setIsRenaming(false);
    setEditingName('');
  };

  const handleInlineRenameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleInlineRenameSubmit();
    } else if (e.key === 'Escape') {
      handleInlineRenameCancel();
    }
  };

  // Context menu handlers for right-click
  const handleContextEdit = () => {
    setShowContextMenu(false);
    onEdit && onEdit(id);
  };

  const handleContextDuplicate = () => {
    setShowContextMenu(false);
    onDuplicate && onDuplicate(id);
  };

  const handleContextDelete = () => {
    setShowContextMenu(false);
    onDelete && onDelete(id);
  };

  const handleAddVariant = () => {
    ErrorHandler.showInfo('Add Variant', MESSAGES.COMING_SOON);
  };

  return (
    <>
      <div
        ref={componentRef}
        className={`generated-component ${isSelected ? 'selected' : ''} ${isHovered ? 'hovered' : ''} ${isEditMode ? 'edit-mode' : ''}`}
        style={{
          left: position.x,
          top: position.y,
          width: size.width,
          height: size.height,
        }}
        onMouseDown={handleMouseDown}
        onContextMenu={handleContextMenu}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Main Contextual Toolbar */}
        {isSelected && (
          <div className="main-contextual-toolbar">
            {/* Ask Figaroo */}
            <div className="toolbar-button-container">
              <button 
                className={`toolbar-button${isProcessingAI ? ' processing' : ''}`}
                onClick={handleAskFigaroo}
                onMouseEnter={() => setHoveredButton('ask-figaroo')}
                onMouseLeave={() => setHoveredButton(null)}
                disabled={isProcessingAI}
              >
                <Wand2 size={16} className={isProcessingAI ? 'pulse-animation' : ''} />
                {hoveredButton === 'ask-figaroo' && (
                  <div className="tooltip">Ask Figaroo</div>
                )}
              </button>
            </div>

            {/* Edit Component */}
            <div className="toolbar-button-container">
              <button 
                className={`toolbar-button${isEditMode ? ' active' : ''}`}
                onClick={handleEditClick}
                onMouseEnter={() => setHoveredButton('edit')}
                onMouseLeave={() => setHoveredButton(null)}
              >
                <Edit3 size={16} />
                {hoveredButton === 'edit' && (
                  <div className="tooltip">Edit Component</div>
                )}
              </button>
            </div>

            {/* Create Flow */}
            <div className="toolbar-button-container">
              <button 
                className="toolbar-button"
                onClick={handleCreateFlow}
                onMouseEnter={() => setHoveredButton('flow')}
                onMouseLeave={() => setHoveredButton(null)}
              >
                <ArrowRight size={16} />
                {hoveredButton === 'flow' && (
                  <div className="tooltip">Create Flow</div>
                )}
              </button>
            </div>

            {/* Open in New Tab */}
            <div className="toolbar-button-container">
              <button 
                className="toolbar-button"
                onClick={handleOpenNewTab}
                onMouseEnter={() => setHoveredButton('preview')}
                onMouseLeave={() => setHoveredButton(null)}
              >
                <Eye size={16} />
                {hoveredButton === 'preview' && (
                  <div className="tooltip">Open in New Tab</div>
                )}
              </button>
            </div>

            {/* Add Variant */}
            <div className="toolbar-button-container">
              <button 
                className="toolbar-button"
                onClick={handleAddVariant}
                onMouseEnter={() => setHoveredButton('variant')}
                onMouseLeave={() => setHoveredButton(null)}
              >
                <Layers size={16} />
                {hoveredButton === 'variant' && (
                  <div className="tooltip">Add Variant</div>
                )}
              </button>
            </div>

            {/* More Options */}
            <div className="toolbar-button-container" ref={moreOptionsRef}>
              <button 
                className={`toolbar-button ${showMoreOptionsMenu ? 'active' : ''}`}
                onClick={handleMoreOptions}
                onMouseEnter={() => setHoveredButton('more')}
                onMouseLeave={() => setHoveredButton(null)}
              >
                <MoreHorizontal size={16} />
                {hoveredButton === 'more' && !showMoreOptionsMenu && (
                  <div className="tooltip">More Options</div>
                )}
              </button>
              
              {/* More Options Dropdown */}
              {showMoreOptionsMenu && (
                <div className="more-options-menu">
                  <div className="menu-item" onClick={handleRefresh}>
                    <RefreshCw size={14} />
                    <span>Refresh</span>
                  </div>
                  <div className="menu-item" onClick={handleRename}>
                    <Tag size={14} />
                    <span>Rename</span>
                  </div>
                  <div className="menu-item" onClick={handleCopy}>
                    <Copy size={14} />
                    <span>Copy</span>
                  </div>
                  <div className="menu-divider" />
                  <div className="menu-item danger" onClick={handleDelete}>
                    <Trash2 size={14} />
                    <span>Delete</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Selection Frame */}
        {isSelected && (
          <div className="selection-frame">
            <div className="component-label" onClick={handleLabelClick}>
              <span className="component-icon">📱</span>
              {autoResize && <span className="auto-resize-indicator" title="Auto-resize enabled">🔄</span>}
              {isRenaming ? (
                <div className="inline-rename-container">
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onKeyDown={handleInlineRenameKeyDown}
                    onBlur={handleInlineRenameSubmit}
                    autoFocus
                    className="inline-rename-input"
                  />
                  <div className="inline-rename-controls">
                    <button 
                      className="inline-rename-btn tick-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleInlineRenameSubmit();
                      }}
                      title="Save"
                    >
                      ✓
                    </button>
                    <button 
                      className="inline-rename-btn cross-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleInlineRenameCancel();
                      }}
                      title="Cancel"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ) : (
                <span className={isEditMode ? '' : 'clickable-label'}>{isEditMode ? 'Edit Mode' : componentName}</span>
              )}
            </div>
            <div className="size-display">
              {Math.round(size.width)} × {Math.round(size.height)}
            </div>
          </div>
        )}

        {/* Component Content */}
        <div ref={contentRef} className="component-content">
          {renderGeneratedContent()}
        </div>

        {/* Transform Handles - Only show when not in edit mode */}
        {isSelected && !isEditMode && (
          <div className="transform-handles">
            <div className="handle corner nw-handle" onMouseDown={(e) => handleResizeStart(e, 'nw')} />
            <div className="handle corner ne-handle" onMouseDown={(e) => handleResizeStart(e, 'ne')} />
            <div className="handle corner sw-handle" onMouseDown={(e) => handleResizeStart(e, 'sw')} />
            <div className="handle corner se-handle" onMouseDown={(e) => handleResizeStart(e, 'se')} />
            <div className="handle edge n-handle" onMouseDown={(e) => handleResizeStart(e, 'n')} />
            <div className="handle edge s-handle" onMouseDown={(e) => handleResizeStart(e, 's')} />
            <div className="handle edge w-handle" onMouseDown={(e) => handleResizeStart(e, 'w')} />
            <div className="handle edge e-handle" onMouseDown={(e) => handleResizeStart(e, 'e')} />
          </div>
        )}

        {/* Bounding Box Border */}
        {(isSelected || isHovered) && (
          <div className={`bounding-box ${isSelected ? (isEditMode ? 'edit-mode' : 'selected') : 'hovered'}`} />
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && (
        <div className="modal-overlay">
          <div className="confirmation-modal">
            <h3>Delete Component</h3>
            <p>Are you sure you want to delete '{componentName}'? This action cannot be undone.</p>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setShowDeleteConfirmation(false)}>
                Cancel
              </button>
              <button className="delete-btn" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rename Modal */}
      {showRenameModal && (
        <div className="modal-overlay">
          <div className="rename-modal">
            <h3>Rename Component</h3>
            <input
              type="text"
              defaultValue={componentName}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleRenameSubmit((e.target as HTMLInputElement).value);
                } else if (e.key === 'Escape') {
                  setShowRenameModal(false);
                }
              }}
            />
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setShowRenameModal(false)}>
                Cancel
              </button>
              <button 
                className="save-btn" 
                onClick={() => {
                  const input = document.querySelector('.rename-modal input') as HTMLInputElement;
                  handleRenameSubmit(input.value);
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Right-click Context Menu */}
      {showContextMenu && (
        <div 
          className="context-menu"
          style={{
            position: 'fixed',
            left: contextMenuPosition.x,
            top: contextMenuPosition.y,
            zIndex: 10000
          }}
        >
          <div className="context-menu-item" onClick={handleContextEdit}>
            <span className="context-icon">✏️</span>
            Edit Component
          </div>
          <div className="context-menu-item" onClick={handleContextDuplicate}>
            <span className="context-icon">📋</span>
            Duplicate
          </div>
          <div className="context-menu-divider" />
          <div className="context-menu-item danger" onClick={handleContextDelete}>
            <span className="context-icon">🗑️</span>
            Delete
          </div>
        </div>
      )}
    </>
  );
};

export default GeneratedComponent; 