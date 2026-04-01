"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { Notification } from '@/components/ui/Notification';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';

type NotificationType = 'success' | 'error' | 'info';

interface ConfirmationOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

interface UIContextType {
  showNotification: (message: string, type?: NotificationType) => void;
  showConfirmation: (options: ConfirmationOptions) => void;
  hideNotification: () => void;
  hideConfirmation: () => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};

interface UIProviderProps {
  children: ReactNode;
}

export const UIProvider: React.FC<UIProviderProps> = ({ children }) => {
  const [notification, setNotification] = useState<{ message: string; type: NotificationType } | null>(null);
  const [confirmation, setConfirmation] = useState<ConfirmationOptions | null>(null);

  const showNotification = useCallback((message: string, type: NotificationType = 'info') => {
    setNotification({ message, type });
    // Auto-hide after 4 seconds
    setTimeout(() => {
      setNotification(prev => prev?.message === message ? null : prev);
    }, 4000);
  }, []);

  const hideNotification = useCallback(() => {
    setNotification(null);
  }, []);

  const showConfirmation = useCallback((options: ConfirmationOptions) => {
    setConfirmation(options);
  }, []);

  const hideConfirmation = useCallback(() => {
    setConfirmation(null);
  }, []);

  return (
    <UIContext.Provider value={{ showNotification, showConfirmation, hideNotification, hideConfirmation }}>
      {children}
      {/* UI Elements will be rendered here via a wrapper component described later */}
      <UIRenderer 
        notification={notification} 
        confirmation={confirmation} 
        onCloseNotification={hideNotification}
        onCloseConfirmation={hideConfirmation}
      />
    </UIContext.Provider>
  );
};

// Internal renderer component to keep UIProvider clean

const UIRenderer = ({ 
  notification, 
  confirmation, 
  onCloseNotification, 
  onCloseConfirmation 
}: { 
  notification: { message: string; type: NotificationType } | null;
  confirmation: ConfirmationOptions | null;
  onCloseNotification: () => void;
  onCloseConfirmation: () => void;
}) => {
  return (
    <>
      {notification && (
        <Notification 
          message={notification.message} 
          type={notification.type} 
          onClose={onCloseNotification} 
        />
      )}
      {confirmation && (
        <ConfirmationModal 
          {...confirmation} 
          onClose={onCloseConfirmation} 
        />
      )}
    </>
  );
};
