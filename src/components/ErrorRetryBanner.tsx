import React from 'react';
import { AlertTriangle, RefreshCw, Info, X } from 'lucide-react';
import './ErrorRetryBanner.css';

export interface ErrorRetryBannerProps {
  isVisible: boolean;
  error?: string;
  isFallback?: boolean;
  retryable?: boolean;
  isRetrying?: boolean;
  onRetry?: () => void;
  onDismiss?: () => void;
  onViewDetails?: () => void;
}

const ErrorRetryBanner: React.FC<ErrorRetryBannerProps> = ({
  isVisible,
  error,
  isFallback = false,
  retryable = true,
  isRetrying = false,
  onRetry,
  onDismiss,
  onViewDetails
}) => {
  if (!isVisible) return null;

  const getIcon = () => {
    if (isFallback) {
      return <Info size={20} />;
    }
    return <AlertTriangle size={20} />;
  };

  const getTitle = () => {
    if (isFallback) {
      return 'Using Fallback Component';
    }
    return 'AI Service Unavailable';
  };

  const getMessage = () => {
    if (isFallback) {
      return error || 'AI service is currently unavailable. This is a fallback component.';
    }
    return error || 'Unable to connect to AI service.';
  };

  const getSeverity = () => {
    if (isFallback) return 'info';
    if (!retryable) return 'error';
    return 'warning';
  };

  return (
    <div className={`error-retry-banner ${getSeverity()}`}>
      <div className="banner-content">
        <div className="banner-icon">
          {getIcon()}
        </div>
        <div className="banner-text">
          <h4 className="banner-title">{getTitle()}</h4>
          <p className="banner-message">{getMessage()}</p>
        </div>
        <div className="banner-actions">
          {retryable && onRetry && (
            <button 
              className={`retry-button ${isRetrying ? 'loading' : ''}`}
              onClick={onRetry}
              disabled={isRetrying}
              title="Retry AI generation"
            >
              <RefreshCw size={16} />
              {isRetrying ? 'Retrying...' : 'Retry'}
            </button>
          )}
          {onViewDetails && (
            <button 
              className="details-button"
              onClick={onViewDetails}
              title="View error details"
            >
              Details
            </button>
          )}
          {onDismiss && (
            <button 
              className="dismiss-button"
              onClick={onDismiss}
              title="Dismiss banner"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorRetryBanner; 