import React, { useState, useEffect } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import Canvas from './components/Canvas';
import { ToastProvider, useToast } from './components/Toast/ToastProvider';
import { ErrorHandler } from './utils/errorHandler';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';

function AppContent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { showToast } = useToast();

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  // Initialize error handler with toast provider
  useEffect(() => {
    ErrorHandler.initialize({ showToast });
  }, [showToast]);

  return (
    <div className="app">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <Canvas onToggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App; 