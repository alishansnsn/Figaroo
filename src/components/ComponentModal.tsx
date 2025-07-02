import React, { useState, useEffect } from 'react';
import './ComponentModal.css';
import { X, Image, Send } from 'lucide-react';

interface ComponentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (prompt: string) => void;
  editingComponent?: {
    id: string;
    prompt: string;
  } | null;
}

const ComponentModal: React.FC<ComponentModalProps> = ({ isOpen, onClose, onGenerate, editingComponent }) => {
  const [prompt, setPrompt] = useState('');
  const [designSystem, setDesignSystem] = useState('No design system');
  const [isGenerating, setIsGenerating] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{
    id: string;
    type: 'user' | 'ai';
    content: string;
    timestamp: Date;
  }>>([]);
  const [generationSteps, setGenerationSteps] = useState<Array<{
    id: string;
    label: string;
    status: 'pending' | 'active' | 'completed';
    subtext?: string;
  }>>([]);

  // Update prompt when editing component
  useEffect(() => {
    if (editingComponent) {
      setPrompt(editingComponent.prompt);
      // Load previous conversation for this component
      setChatMessages([
        {
          id: '1',
          type: 'user',
          content: editingComponent.prompt,
          timestamp: new Date()
        },
        {
          id: '2',
          type: 'ai',
          content: 'Component created successfully! You can edit the prompt below to regenerate.',
          timestamp: new Date()
        }
      ]);
    } else {
      setPrompt('');
      setChatMessages([]);
    }
  }, [editingComponent]);

  const examplePrompts = [
    'Sign in card',
    'File upload component', 
    'Modern SaaS landing page',
    'A music player card'
  ];

  const promptSuggestions = [
    'Make it more modern',
    'Add dark mode',
    'Change colors to blue',
    'Make buttons larger',
    'Add animations',
    'Simplify the design',
    'Add icons',
    'Make it responsive'
  ];

  const simulateGenerationSteps = async () => {
    const steps = [
      { id: '1', label: 'Component created', status: 'completed' as const },
      { id: '2', label: 'Planning design', status: 'active' as const, subtext: '2 more actions' },
      { id: '3', label: 'Wrapping up things', status: 'pending' as const }
    ];

    setGenerationSteps(steps);

    // Simulate step progression
    await new Promise(resolve => setTimeout(resolve, 1000));
    setGenerationSteps(prev => prev.map(step => 
      step.id === '2' ? { ...step, status: 'completed' } : step
    ));

    await new Promise(resolve => setTimeout(resolve, 800));
    setGenerationSteps(prev => prev.map(step => 
      step.id === '3' ? { ...step, status: 'active' } : step
    ));

    await new Promise(resolve => setTimeout(resolve, 1200));
    setGenerationSteps(prev => prev.map(step => 
      step.id === '3' ? { ...step, status: 'completed' } : step
    ));
  };

  const handleGenerate = async () => {
    if (prompt.trim()) {
      setIsGenerating(true);
      
      // Add user message
      const userMessage = {
        id: Date.now().toString(),
        type: 'user' as const,
        content: prompt,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, userMessage]);

      // Add AI thinking message
      const thinkingMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai' as const,
        content: `Great choice! I'll create a ${prompt.toLowerCase()}.`,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, thinkingMessage]);

      // Simulate generation process
      await simulateGenerationSteps();

      // Add completion message
      const completionMessage = {
        id: (Date.now() + 2).toString(),
        type: 'ai' as const,
        content: `Your ${prompt.toLowerCase()} is ready! Let me know if you want any style or layout changes.`,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, completionMessage]);

      // Generate the actual component with AI service
      await onGenerate(prompt.trim());
      
      setIsGenerating(false);
      setPrompt('');
      setGenerationSteps([]);
    }
  };

  const handleExampleClick = (example: string) => {
    setPrompt(example);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && prompt.trim()) {
      handleGenerate();
    }
  };

  // Always render but control visibility with CSS transform
  if (!isOpen) return null;

  return (
    <div className={`component-modal-overlay ${isOpen ? 'open' : ''}`}>
      <div className="component-modal">
        {/* Header */}
        <div className="modal-header">
          <h2>{editingComponent ? `Edit Component ${editingComponent.id}` : 'Create Component'}</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="modal-content">
          {chatMessages.length === 0 ? (
            // Initial state - show creation interface
            <div className="creation-interface">
              {/* Visual Elements */}
              <div className="visual-section">
                <div className="shapes-container">
                  <div className="shape circle"></div>
                  <div className="shape triangle"></div>
                  <div className="shape square"></div>
                  <div className="shape squiggle"></div>
                </div>
              </div>

              {/* Main Text */}
              <div className="text-section">
                <h1>What do you want to create?</h1>
                <p>Describe your idea or component, and MagicPath will bring it to life.</p>
              </div>

              {/* Upload Section */}
              <div className="upload-section">
                <Image size={16} />
                <span>Upload images to recreate designs</span>
              </div>

              {/* Example Prompts */}
              <div className="examples-section">
                {examplePrompts.map((example, index) => (
                  <button 
                    key={index}
                    className="example-btn"
                    onClick={() => handleExampleClick(example)}
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            // Chat interface - show conversation
            <div className="chat-container">
              <div className="chat-messages">
                {chatMessages.map((message) => (
                  <div key={message.id} className={`message ${message.type}`}>
                    <div className="message-content">
                      {message.content}
                    </div>
                  </div>
                ))}

                {/* Generation Steps */}
                {generationSteps.length > 0 && (
                  <div className="generation-steps">
                    {generationSteps.map((step) => (
                      <div key={step.id} className={`step ${step.status}`}>
                        <div className="step-icon">
                          {step.status === 'completed' ? '✅' : 
                           step.status === 'active' ? '🔄' : '⏳'}
                        </div>
                        <div className="step-content">
                          <span className="step-label">{step.label}</span>
                          {step.subtext && (
                            <span className="step-subtext">{step.subtext}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Prompt Suggestions Pills */}
              {!isGenerating && chatMessages.length > 0 && (
                <div className="prompt-suggestions">
                  {promptSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      className="suggestion-pill"
                      onClick={() => setPrompt(suggestion)}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input Section */}
        <div className="input-section">
          <div className="input-container">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={chatMessages.length === 0 ? "Describe what you want to create..." : "Ask MagicPath..."}
              className="prompt-input"
              disabled={isGenerating}
            />
            <div className="input-controls">
              <div className="design-system-selector">
                <Image size={16} />
                <select 
                  value={designSystem}
                  onChange={(e) => setDesignSystem(e.target.value)}
                  className="design-system-dropdown"
                  disabled={isGenerating}
                >
                  <option>No design system</option>
                  <option>Material UI</option>
                  <option>Tailwind CSS</option>
                  <option>Chakra UI</option>
                </select>
              </div>
              <button 
                className={`generate-btn ${isGenerating ? 'generating' : ''}`}
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
              >
                {isGenerating ? (
                  <div className="spinner" />
                ) : (
                  <Send size={16} />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComponentModal; 