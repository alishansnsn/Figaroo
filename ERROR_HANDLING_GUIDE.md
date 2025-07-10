# Error Handling & Retry Mechanisms Guide

## Overview

This document outlines the comprehensive error handling and retry mechanisms implemented in the Figaroo application to address the issues of:

1. **No Error Context**: Users not knowing they're seeing fallback components
2. **No Retry Mechanism**: No way for users to retry failed requests
3. **Silent Failures**: System falling back without user notification

## 🎯 Solutions Implemented

### 1. Enhanced AI Service (`src/services/aiService.ts`)

#### Key Features:
- **Retry Logic**: Exponential backoff with jitter for failed requests
- **Error Categorization**: Smart classification of errors (retryable vs non-retryable)
- **Service Status Tracking**: Real-time monitoring of AI service availability
- **Fallback Indicators**: Clear indication when fallback components are used

#### Error Types Handled:
- **Network Errors**: Connection issues, timeouts
- **API Key Errors**: Invalid or missing API keys
- **Rate Limiting**: Quota exceeded, rate limits
- **Server Errors**: 5xx errors from AI service
- **Parsing Errors**: Invalid AI responses

#### Retry Strategy:
```typescript
// Exponential backoff with jitter
const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000;
```

### 2. Error Retry Banner (`src/components/ErrorRetryBanner.tsx`)

#### Features:
- **Visual Error Feedback**: Prominent banner showing error status
- **Retry Button**: One-click retry for failed requests
- **Error Details**: Expandable error information
- **Dismissible**: Users can dismiss non-critical errors
- **Loading States**: Visual feedback during retry attempts

#### Severity Levels:
- **Info** (Blue): Fallback components in use
- **Warning** (Orange): Retryable errors
- **Error** (Red): Non-retryable errors

### 3. Component Fallback Indicators

#### Visual Indicators:
- **Warning Icon**: ⚠️ displayed on fallback components
- **Pulsing Animation**: Subtle animation to draw attention
- **Tooltip**: Hover for detailed explanation

#### Implementation:
```typescript
{isFallback && <span className="fallback-indicator" title="Fallback component - AI service unavailable">⚠️</span>}
```

### 4. Backend Error Handling (`backend/src/services/openRouterService.ts`)

#### Enhanced Error Responses:
```typescript
{
  html: "...",
  css: "...",
  isFallback: true,
  error: "User-friendly error message",
  retryable: true
}
```

#### Error Categorization:
- **Non-retryable**: API key issues, unauthorized access
- **Retryable**: Network issues, server errors, rate limits

## 🔧 Usage Examples

### 1. Basic Error Handling

```typescript
const response = await aiService.generateComponent(request);

if (response.isFallback) {
  // Show error banner
  setErrorBanner({
    isVisible: true,
    error: response.error,
    isFallback: true,
    retryable: response.retryable
  });
}
```

### 2. Retry Implementation

```typescript
const handleRetry = async () => {
  setIsRetrying(true);
  try {
    await handleGenerateComponent(lastPrompt);
  } finally {
    setIsRetrying(false);
  }
};
```

### 3. Service Status Monitoring

```typescript
const serviceStatus = aiService.getServiceStatus();
console.log(`Service Available: ${serviceStatus.isAvailable}`);
console.log(`Retry Count: ${serviceStatus.retryCount}/${serviceStatus.maxRetries}`);
```

## 🎨 UI Components

### ErrorRetryBanner
```typescript
<ErrorRetryBanner
  isVisible={errorBanner.isVisible}
  error={errorBanner.error}
  isFallback={errorBanner.isFallback}
  retryable={errorBanner.retryable}
  isRetrying={isRetrying}
  onRetry={handleRetry}
  onDismiss={handleDismiss}
  onViewDetails={handleErrorDetails}
/>
```

### GeneratedComponent with Fallback Indicator
```typescript
<GeneratedComponent
  // ... other props
  isFallback={component.isFallback}
/>
```

## 🧪 Testing

### ErrorHandlingTest Component
A test component is provided to verify error handling functionality:

```typescript
// Test different scenarios
- Network Error (retryable)
- API Key Error (not retryable)
- Rate Limit Error (retryable)
- Fallback Component (info)
- Server Error (retryable)
```

### Manual Testing
1. Disconnect internet to test network errors
2. Use invalid API key to test authentication errors
3. Exceed rate limits to test quota errors
4. Check fallback component indicators

## 📊 Error Metrics

### Tracked Metrics:
- **Error Frequency**: How often errors occur
- **Retry Success Rate**: Percentage of successful retries
- **Fallback Usage**: How often fallback components are used
- **Service Availability**: AI service uptime

### Logging:
```typescript
// Development: Detailed error logs
console.group('Error Details');
console.error('Error:', error);
console.error('Error Info:', errorInfo);

// Production: Structured logging
console.error('Application Error:', {
  message: error.message,
  type: errorInfo.type,
  retryable: errorInfo.retryable,
  timestamp: new Date().toISOString()
});
```

## 🔄 Retry Logic

### Exponential Backoff Algorithm:
```typescript
const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000;
```

### Retry Limits:
- **Max Retries**: 3 attempts
- **Base Delay**: 1000ms
- **Max Delay**: ~8000ms (with jitter)

### Non-Retryable Errors:
- API key configuration issues
- Unauthorized access
- Rate limit exceeded
- Quota exceeded

## 🎯 User Experience Improvements

### Before:
- ❌ Silent fallbacks
- ❌ No error context
- ❌ No retry mechanism
- ❌ Confusing user experience

### After:
- ✅ Clear error notifications
- ✅ Visual fallback indicators
- ✅ One-click retry functionality
- ✅ Transparent error communication
- ✅ Graceful degradation

## 🚀 Future Enhancements

### Planned Features:
1. **Error Analytics**: Track error patterns and success rates
2. **Smart Retry**: Adaptive retry strategies based on error types
3. **Offline Mode**: Enhanced offline functionality
4. **Error Recovery**: Automatic recovery for certain error types
5. **User Preferences**: Configurable error handling settings

### Integration Points:
- **Sentry**: Error tracking and monitoring
- **Analytics**: Error metrics and user behavior
- **Support System**: Automatic error reporting
- **User Feedback**: Error reporting and feedback collection

## 📝 Best Practices

### For Developers:
1. **Always check `isFallback`** when handling AI responses
2. **Use retry mechanisms** for transient errors
3. **Provide user-friendly messages** for all errors
4. **Log errors appropriately** for debugging
5. **Test error scenarios** thoroughly

### For Users:
1. **Retry failed requests** when possible
2. **Check internet connection** for network errors
3. **Verify API settings** for authentication errors
4. **Wait before retrying** rate-limited requests
5. **Report persistent errors** to support

## 🔧 Configuration

### Environment Variables:
```bash
# AI Service Configuration
REACT_APP_OPENROUTER_API_KEY=your_api_key
REACT_APP_OPENROUTER_BASE_URL=https://openrouter.ai/api/v1

# Retry Configuration
REACT_APP_MAX_RETRIES=3
REACT_APP_BASE_RETRY_DELAY=1000
```

### Service Configuration:
```typescript
const aiService = new AIService({
  maxRetries: 3,
  baseDelay: 1000,
  enableLogging: process.env.NODE_ENV === 'development'
});
```

---

This comprehensive error handling system ensures users always know what's happening, can retry failed requests, and have a smooth experience even when the AI service is unavailable. 