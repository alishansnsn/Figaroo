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
  const [showDesignSystemDropdown, setShowDesignSystemDropdown] = useState(false);
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

  // Typewriter animation state
  const [typewriterText, setTypewriterText] = useState('');
  const [typewriterIndex, setTypewriterIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0);

  // Cycling placeholder messages
  const placeholderMessages = [
    "Describe what you want to create...",
    "A modern login form with animations...",
    "A dashboard card with charts...",
    "A responsive navigation menu...",
    "A beautiful landing page hero..."
  ];

  // Typewriter effect for placeholder
  useEffect(() => {
    if (chatMessages.length === 0 && !isGenerating && prompt === '') {
      const currentMessage = placeholderMessages[currentPlaceholderIndex];
      
      if (typewriterIndex < currentMessage.length) {
        // Typing effect with variable speed for more natural feel
        const typingSpeed = Math.random() * 30 + 40; // 40-70ms for natural variation
        const timer = setTimeout(() => {
          setTypewriterText(currentMessage.slice(0, typewriterIndex + 1));
          setTypewriterIndex(typewriterIndex + 1);
        }, typingSpeed);
        
        return () => clearTimeout(timer);
      } else {
        // Wait before starting to delete
        const waitTimer = setTimeout(() => {
          setIsTyping(true);
        }, 2000); // Wait 2 seconds before deleting
        
        return () => clearTimeout(waitTimer);
      }
    }
  }, [typewriterIndex, currentPlaceholderIndex, chatMessages.length, isGenerating, prompt]);

  // Delete effect
  useEffect(() => {
    if (isTyping && typewriterText.length > 0 && prompt === '') {
      const deleteSpeed = Math.random() * 20 + 20; // 20-40ms for faster, varied deletion
      const deleteTimer = setTimeout(() => {
        setTypewriterText(typewriterText.slice(0, -1));
      }, deleteSpeed);
      
      return () => clearTimeout(deleteTimer);
    } else if (isTyping && typewriterText.length === 0) {
      // Move to next placeholder
      setCurrentPlaceholderIndex((prev) => (prev + 1) % placeholderMessages.length);
      setTypewriterIndex(0);
      setIsTyping(false);
    }
  }, [isTyping, typewriterText, prompt]);

  // Reset typewriter when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setTypewriterText('');
      setTypewriterIndex(0);
      setIsTyping(false);
      setCurrentPlaceholderIndex(0);
    }
  }, [isOpen]);

  // Reset typewriter when user starts typing
  useEffect(() => {
    if (prompt !== '') {
      setTypewriterText('');
      setTypewriterIndex(0);
      setIsTyping(false);
    }
  }, [prompt]);

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
                <p>Describe your idea or component, and Figaroo will bring it to life.</p>
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
            {chatMessages.length === 0 && !isGenerating ? (
              <div className="typewriter-container">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => {
                    setPrompt(e.target.value);
                    if (e.target.value) {
                      document.querySelector('.typewriter-cursor')?.classList.add('hidden');
                    } else {
                      document.querySelector('.typewriter-cursor')?.classList.remove('hidden');
                    }
                  }}
                  onFocus={() => {
                    document.querySelector('.typewriter-cursor')?.classList.add('hidden');
                  }}
                  onBlur={(e) => {
                    if (!e.target.value) {
                      document.querySelector('.typewriter-cursor')?.classList.remove('hidden');
                    }
                  }}
                  onKeyPress={handleKeyPress}
                  placeholder=""
                  className="prompt-input typewriter"
                  disabled={isGenerating}
                />
                <div className={`typewriter-placeholder ${isTyping ? 'typing' : ''}`}>
                  {typewriterText}
                  <span className="typewriter-cursor">|</span>
                </div>
                <div className="design-system-container">
                  <button 
                    className="design-system-button"
                    onClick={() => setShowDesignSystemDropdown(!showDesignSystemDropdown)}
                    disabled={isGenerating}
                  >
                    <Image size={16} />
                  </button>
                  {showDesignSystemDropdown && (
                    <div className="design-system-dropdown-menu">
                      {['No design system', 'Material UI', 'Tailwind CSS', 'Chakra UI'].map((option) => (
                        <div 
                          key={option}
                          className={`design-system-option ${designSystem === option ? 'selected' : ''}`}
                          onClick={() => {
                            setDesignSystem(option);
                            setShowDesignSystemDropdown(false);
                          }}
                        >
                          {option}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="input-wrapper">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask Figaroo..."
                  className="prompt-input"
                  disabled={isGenerating}
                />
                <div className="design-system-container">
                  <button 
                    className="design-system-button"
                    onClick={() => setShowDesignSystemDropdown(!showDesignSystemDropdown)}
                    disabled={isGenerating}
                  >
                    <Image size={16} />
                  </button>
                  {showDesignSystemDropdown && (
                    <div className="design-system-dropdown-menu">
                      {['No design system', 'Material UI', 'Tailwind CSS', 'Chakra UI'].map((option) => (
                        <div 
                          key={option}
                          className={`design-system-option ${designSystem === option ? 'selected' : ''}`}
                          onClick={() => {
                            setDesignSystem(option);
                            setShowDesignSystemDropdown(false);
                          }}
                        >
                          {option}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
            <div className="input-controls">
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