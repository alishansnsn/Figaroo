import React from 'react';
import { Wand2, Edit3, Copy, Trash2, MoreHorizontal, RefreshCw, ExternalLink, Plus } from 'lucide-react';
import { MESSAGES, COMPONENT_CONSTRAINTS } from '../../constants';

interface ComponentToolbarProps {
  isSelected: boolean;
  isEditMode: boolean;
  isProcessingAI: boolean;
  hoveredButton: string | null;
  onAskFigaroo: () => void;
  onEditClick: () => void;
  onCreateFlow: () => void;
  onOpenNewTab: () => void;
  onMoreOptions: (e: React.MouseEvent) => void;
  onRefresh: () => void;
  onRename: () => void;
  onCopy: () => void;
  onDelete: () => void;
  onAddVariant: () => void;
  setHoveredButton: (button: string | null) => void;
}

export const ComponentToolbar: React.FC<ComponentToolbarProps> = ({
  isSelected,
  isEditMode,
  isProcessingAI,
  hoveredButton,
  onAskFigaroo,
  onEditClick,
  onCreateFlow,
  onOpenNewTab,
  onMoreOptions,
  onRefresh,
  onRename,
  onCopy,
  onDelete,
  onAddVariant,
  setHoveredButton,
}) => {
  if (!isSelected) return null;

  return (
    <div className="main-contextual-toolbar">
      {/* Ask Figaroo */}
      <div className="toolbar-button-container">
        <button 
          className={`toolbar-button${isProcessingAI ? ' processing' : ''}`}
          onClick={onAskFigaroo}
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
          onClick={onEditClick}
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
          onClick={onCreateFlow}
          onMouseEnter={() => setHoveredButton('create-flow')}
          onMouseLeave={() => setHoveredButton(null)}
        >
          <Plus size={16} />
          {hoveredButton === 'create-flow' && (
            <div className="tooltip">Create Flow</div>
          )}
        </button>
      </div>

      {/* Open in New Tab */}
      <div className="toolbar-button-container">
        <button 
          className="toolbar-button"
          onClick={onOpenNewTab}
          onMouseEnter={() => setHoveredButton('open-tab')}
          onMouseLeave={() => setHoveredButton(null)}
        >
          <ExternalLink size={16} />
          {hoveredButton === 'open-tab' && (
            <div className="tooltip">Open in New Tab</div>
          )}
        </button>
      </div>

      {/* More Options */}
      <div className="toolbar-button-container">
        <button 
          className="toolbar-button"
          onClick={onMoreOptions}
          onMouseEnter={() => setHoveredButton('more')}
          onMouseLeave={() => setHoveredButton(null)}
        >
          <MoreHorizontal size={16} />
          {hoveredButton === 'more' && (
            <div className="tooltip">More Options</div>
          )}
        </button>
      </div>
    </div>
  );
}; 