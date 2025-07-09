// Error Handling Utility - Centralized error management
// Replaces all alert() calls with proper error handling and user feedback

export enum ErrorType {
  VALIDATION = 'validation',
  NETWORK = 'network',
  PERMISSION = 'permission',
  GENERATION = 'generation',
  RENDER = 'render',
  UNKNOWN = 'unknown'
}

export interface ErrorInfo {
  type: ErrorType;
  title: string;
  message: string;
  details?: string;
  retryable?: boolean;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export class ErrorHandler {
  private static toastProvider?: any;

  // Initialize with toast provider
  static initialize(toastProvider: any) {
    this.toastProvider = toastProvider;
  }

  // Handle errors with proper categorization and user feedback
  static handleError(error: Error | string, context?: string): ErrorInfo {
    let errorInfo: ErrorInfo;

    if (typeof error === 'string') {
      errorInfo = this.categorizeError(error, context);
    } else {
      errorInfo = this.categorizeError(error.message, context);
    }

    // Log error for debugging
    this.logError(error, errorInfo);

    // Show user-friendly notification
    this.showUserNotification(errorInfo);

    return errorInfo;
  }

  // Categorize errors based on message and context
  private static categorizeError(message: string, context?: string): ErrorInfo {
    const lowerMessage = message.toLowerCase();

    // API and network errors
    if (lowerMessage.includes('network') || lowerMessage.includes('fetch') || lowerMessage.includes('api')) {
      return {
        type: ErrorType.NETWORK,
        title: 'Connection Error',
        message: 'Unable to connect to the server. Please check your internet connection and try again.',
        details: message,
        retryable: true,
        severity: 'medium'
      };
    }

    // Component generation errors
    if (lowerMessage.includes('generation') || lowerMessage.includes('generate') || context?.includes('component')) {
      return {
        type: ErrorType.GENERATION,
        title: 'Generation Failed',
        message: 'Failed to generate component. Please check your settings or try again.',
        details: message,
        retryable: true,
        severity: 'medium'
      };
    }

    // Rendering errors
    if (lowerMessage.includes('render') || lowerMessage.includes('sanitize')) {
      return {
        type: ErrorType.RENDER,
        title: 'Display Error',
        message: 'Unable to display the component. Please try refreshing the page.',
        details: message,
        retryable: true,
        severity: 'low'
      };
    }

    // Permission and authentication errors
    if (lowerMessage.includes('permission') || lowerMessage.includes('unauthorized') || lowerMessage.includes('forbidden')) {
      return {
        type: ErrorType.PERMISSION,
        title: 'Access Denied',
        message: 'You don\'t have permission to perform this action.',
        details: message,
        retryable: false,
        severity: 'high'
      };
    }

    // Validation errors
    if (lowerMessage.includes('validation') || lowerMessage.includes('invalid') || lowerMessage.includes('required')) {
      return {
        type: ErrorType.VALIDATION,
        title: 'Invalid Input',
        message: 'Please check your input and try again.',
        details: message,
        retryable: false,
        severity: 'low'
      };
    }

    // Default unknown error
    return {
      type: ErrorType.UNKNOWN,
      title: 'Unexpected Error',
      message: 'Something went wrong. Please try again or contact support if the problem persists.',
      details: message,
      retryable: true,
      severity: 'medium'
    };
  }

  // Log errors appropriately for different environments
  private static logError(error: Error | string, errorInfo: ErrorInfo) {
    const logData = {
      message: typeof error === 'string' ? error : error.message,
      stack: typeof error === 'string' ? undefined : error.stack,
      errorInfo,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    // Development: Detailed logging
    if (process.env.NODE_ENV === 'development') {
      console.group('Error Details');
      console.error('Error:', error);
      console.error('Error Info:', errorInfo);
      console.error('Full Log Data:', logData);
      console.groupEnd();
    } else {
      // Production: Structured logging
      console.error('Application Error:', logData);
      
      // TODO: Send to error tracking service (Sentry, LogRocket, etc.)
      // this.sendToErrorService(logData);
    }
  }

  // Show user-friendly notification
  private static showUserNotification(errorInfo: ErrorInfo) {
    if (!this.toastProvider) {
      // Fallback to alert if toast provider not available
      alert(`${errorInfo.title}: ${errorInfo.message}`);
      return;
    }

    // Map error severity to toast type
    let toastType: 'success' | 'error' | 'warning' | 'info' = 'error';
    
    switch (errorInfo.severity) {
      case 'low':
        toastType = 'info';
        break;
      case 'medium':
        toastType = 'warning';
        break;
      case 'high':
      case 'critical':
        toastType = 'error';
        break;
    }

    // Show toast notification
    this.toastProvider.showToast(
      toastType,
      errorInfo.title,
      errorInfo.message,
      errorInfo.severity === 'critical' ? 8000 : 5000
    );
  }

  // Success notifications
  static showSuccess(title: string, message?: string) {
    if (!this.toastProvider) {
      alert(`${title}: ${message || 'Operation completed successfully'}`);
      return;
    }

    this.toastProvider.showToast('success', title, message, 3000);
  }

  // Warning notifications
  static showWarning(title: string, message?: string) {
    if (!this.toastProvider) {
      alert(`${title}: ${message || 'Please review your input'}`);
      return;
    }

    this.toastProvider.showToast('warning', title, message, 4000);
  }

  // Info notifications
  static showInfo(title: string, message?: string) {
    if (!this.toastProvider) {
      alert(`${title}: ${message || 'Information'}`);
      return;
    }

    this.toastProvider.showToast('info', title, message, 3000);
  }

  // Async error wrapper for try-catch blocks
  static async wrapAsync<T>(
    asyncFn: () => Promise<T>,
    context?: string
  ): Promise<T | null> {
    try {
      return await asyncFn();
    } catch (error) {
      this.handleError(error as Error, context);
      return null;
    }
  }

  // Sync error wrapper for try-catch blocks
  static wrapSync<T>(
    syncFn: () => T,
    context?: string
  ): T | null {
    try {
      return syncFn();
    } catch (error) {
      this.handleError(error as Error, context);
      return null;
    }
  }
} 