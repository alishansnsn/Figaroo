import React, { useState, useEffect } from 'react';
import './SettingsModal.css';
import { X, Key, Crown, Zap, Shield, Info } from 'lucide-react';
import { userService, UserSettings } from '../services/userService';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('account');
  const [settings, setSettings] = useState<UserSettings>(userService.getUserSettings());
  const [apiKey, setApiKey] = useState(settings.apiKey || '');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const currentSettings = userService.getUserSettings();
      setSettings(currentSettings);
      setApiKey(currentSettings.apiKey || '');
    }
  }, [isOpen]);

  const handleSaveApiKey = () => {
    userService.updateApiKey(apiKey);
    setSettings(userService.getUserSettings());
    // Show success feedback
    alert('API key saved successfully!');
  };

  const handleUpgradeToPro = () => {
    userService.upgradeToPro(apiKey);
    setSettings(userService.getUserSettings());
    // Show success feedback
    alert('Upgraded to Pro! You now have unlimited generations.');
  };

  const usageStats = userService.getUsageStats();

  if (!isOpen) return null;

  return (
    <div className="settings-overlay">
      <div className="settings-modal">
        {/* Header */}
        <div className="modal-header">
          <h2>Settings</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'account' ? 'active' : ''}`}
            onClick={() => setActiveTab('account')}
          >
            <Crown size={16} />
            Account
          </button>
          <button 
            className={`tab ${activeTab === 'api' ? 'active' : ''}`}
            onClick={() => setActiveTab('api')}
          >
            <Key size={16} />
            API Keys
          </button>
          <button 
            className={`tab ${activeTab === 'usage' ? 'active' : ''}`}
            onClick={() => setActiveTab('usage')}
          >
            <Zap size={16} />
            Usage
          </button>
        </div>

        {/* Content */}
        <div className="modal-content">
          {activeTab === 'account' && (
            <div className="account-section">
              <div className="tier-card">
                <div className="tier-header">
                  <div className="tier-icon">
                    {settings.tier === 'pro' ? <Crown size={24} /> : <Shield size={24} />}
                  </div>
                  <div className="tier-info">
                    <h3>{settings.tier === 'pro' ? 'Pro Plan' : 'Free Plan'}</h3>
                    <p>{settings.tier === 'pro' ? 'Unlimited AI generations' : 'Limited daily generations'}</p>
                  </div>
                  {settings.tier === 'free' && (
                    <button className="upgrade-btn" onClick={handleUpgradeToPro}>
                      Upgrade
                    </button>
                  )}
                </div>

                <div className="tier-features">
                  <h4>Plan Features</h4>
                  <div className="features-list">
                    {settings.tier === 'free' ? (
                      <>
                        <div className="feature">
                          <span className="feature-check">✓</span>
                          10 generations per day
                        </div>
                        <div className="feature">
                          <span className="feature-check">✓</span>
                          Free AI models
                        </div>
                        <div className="feature disabled">
                          <span className="feature-check">✗</span>
                          Claude Sonnet 4
                        </div>
                        <div className="feature disabled">
                          <span className="feature-check">✗</span>
                          Unlimited generations
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="feature">
                          <span className="feature-check">✓</span>
                          Unlimited generations
                        </div>
                        <div className="feature">
                          <span className="feature-check">✓</span>
                          Claude Sonnet 4 access
                        </div>
                        <div className="feature">
                          <span className="feature-check">✓</span>
                          Premium AI models
                        </div>
                        <div className="feature">
                          <span className="feature-check">✓</span>
                          BYOK (Bring Your Own Key)
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'api' && (
            <div className="api-section">
              <div className="api-card">
                <div className="api-header">
                  <h3>OpenRouter API Key</h3>
                  <div className="info-badge">
                    <Info size={14} />
                    <span>BYOK for Pro users</span>
                  </div>
                </div>
                
                <p className="api-description">
                  {settings.tier === 'pro' 
                    ? 'Add your OpenRouter API key to use premium models with your own credits.'
                    : 'Upgrade to Pro to use your own API key and access Claude Sonnet 4.'
                  }
                </p>

                <div className="api-input-group">
                  <div className="input-wrapper">
                    <input
                      type={showApiKey ? 'text' : 'password'}
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="sk-or-v1-..."
                      className="api-input"
                      disabled={settings.tier === 'free'}
                    />
                    <button 
                      className="toggle-visibility"
                      onClick={() => setShowApiKey(!showApiKey)}
                      disabled={settings.tier === 'free'}
                    >
                      {showApiKey ? '🙈' : '👁️'}
                    </button>
                  </div>
                  <button 
                    className="save-btn"
                    onClick={handleSaveApiKey}
                    disabled={settings.tier === 'free' || !apiKey.trim()}
                  >
                    Save Key
                  </button>
                </div>

                <div className="api-help">
                  <h4>How to get your API key:</h4>
                  <ol>
                    <li>Visit <a href="https://openrouter.ai" target="_blank" rel="noopener noreferrer">OpenRouter.ai</a></li>
                    <li>Create an account and verify your email</li>
                    <li>Go to "API Keys" in your dashboard</li>
                    <li>Create a new key and copy it here</li>
                  </ol>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'usage' && (
            <div className="usage-section">
              <div className="usage-card">
                <h3>Daily Usage</h3>
                <div className="usage-stats">
                  <div className="usage-bar">
                    <div 
                      className="usage-fill"
                      style={{ width: `${usageStats.percentage}%` }}
                    />
                  </div>
                  <div className="usage-text">
                    {usageStats.limit === -1 
                      ? `${usageStats.current} generations (Unlimited)`
                      : `${usageStats.current} / ${usageStats.limit} generations`
                    }
                  </div>
                </div>

                {settings.tier === 'free' && usageStats.percentage > 80 && (
                  <div className="usage-warning">
                    <Info size={16} />
                    <span>You're approaching your daily limit. Upgrade to Pro for unlimited access.</span>
                  </div>
                )}
              </div>

              <div className="models-card">
                <h3>Available Models</h3>
                <div className="models-list">
                  {userService.getAvailableModels().map((model, index) => (
                    <div key={index} className="model-item">
                      <span className="model-name">{model.split('/')[1] || model}</span>
                      <span className="model-status">Available</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsModal; 