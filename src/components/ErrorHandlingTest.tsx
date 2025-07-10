import React, { useState } from 'react';
import { Button } from './Button';
import ErrorRetryBanner from './ErrorRetryBanner';

const ErrorHandlingTest: React.FC = () => {
  const [testScenario, setTestScenario] = useState<string>('');
  const [showBanner, setShowBanner] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  const testScenarios = [
    {
      name: 'Network Error',
      error: 'Connection issue. Please check your internet and try again.',
      isFallback: false,
      retryable: true
    },
    {
      name: 'API Key Error',
      error: 'API configuration issue. Please check your settings.',
      isFallback: false,
      retryable: false
    },
    {
      name: 'Rate Limit Error',
      error: 'Rate limit reached. Please wait a moment and try again.',
      isFallback: false,
      retryable: true
    },
    {
      name: 'Fallback Component',
      error: 'AI service is currently unavailable. This is a fallback component.',
      isFallback: true,
      retryable: true
    },
    {
      name: 'Server Error',
      error: 'Service temporarily unavailable. Please try again.',
      isFallback: false,
      retryable: true
    }
  ];

  const handleTestScenario = (scenario: any) => {
    setTestScenario(scenario.name);
    setShowBanner(true);
    setIsRetrying(false);
  };

  const handleRetry = () => {
    setIsRetrying(true);
    // Simulate retry process
    setTimeout(() => {
      setIsRetrying(false);
      setShowBanner(false);
    }, 2000);
  };

  const handleDismiss = () => {
    setShowBanner(false);
  };

  const handleViewDetails = () => {
    alert('Error Details:\n\nThis is a test scenario to demonstrate error handling capabilities.');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Error Handling Test</h2>
      <p>Test different error scenarios to see how the error handling system works:</p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
        {testScenarios.map((scenario, index) => (
          <Button
            key={index}
            variant="outline"
            onClick={() => handleTestScenario(scenario)}
            style={{ textAlign: 'left', justifyContent: 'flex-start' }}
          >
            <strong>{scenario.name}</strong>
            <br />
            <small style={{ opacity: 0.7 }}>
              {scenario.isFallback ? 'Fallback' : 'Error'} • {scenario.retryable ? 'Retryable' : 'Not Retryable'}
            </small>
          </Button>
        ))}
      </div>

      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <h3>Current Test: {testScenario || 'None'}</h3>
        <p>Click a scenario above to test the error banner.</p>
      </div>

      {/* Error Retry Banner */}
      <ErrorRetryBanner
        isVisible={showBanner}
        error={testScenarios.find(s => s.name === testScenario)?.error}
        isFallback={testScenarios.find(s => s.name === testScenario)?.isFallback}
        retryable={testScenarios.find(s => s.name === testScenario)?.retryable}
        isRetrying={isRetrying}
        onRetry={handleRetry}
        onDismiss={handleDismiss}
        onViewDetails={handleViewDetails}
      />
    </div>
  );
};

export default ErrorHandlingTest; 