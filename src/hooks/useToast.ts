import { useState, useCallback, useRef, useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastConfig {
  type: ToastType;
  title: string;
  message: string;
  duration?: number;
}

interface ToastState extends ToastConfig {
  id: string;
  visible: boolean;
}

/**
 * Custom hook for managing toast notifications
 * Provides a centralized way to show toast messages with automatic dismissal
 */
export function useToast() {
  const [toast, setToast] = useState<ToastState | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const showToast = useCallback((
    type: ToastType,
    title: string,
    message: string,
    duration: number = 2500
  ) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    const id = `toast-${Date.now()}-${Math.random()}`;

    // Show toast
    setToast({
      id,
      type,
      title,
      message,
      duration,
      visible: true,
    });

    timeoutRef.current = setTimeout(() => {
      setToast((prev) => (prev?.id === id ? { ...prev, visible: false } : prev));
      
      // Clear state after animation completes 
      setTimeout(() => {
        setToast((prev) => (prev?.id === id ? null : prev));
      }, 300);
    }, duration);
  }, []);

  const hideToast = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setToast((prev) => (prev ? { ...prev, visible: false } : null));
    setTimeout(() => setToast(null), 300);
  }, []);

  const showSuccess = useCallback(
    (title: string, message: string, duration?: number) => {
      showToast('success', title, message, duration);
    },
    [showToast]
  );

  const showError = useCallback(
    (title: string, message: string, duration?: number) => {
      showToast('error', title, message, duration || 3000); // Errors stay longer
    },
    [showToast]
  );

  const showInfo = useCallback(
    (title: string, message: string, duration?: number) => {
      showToast('info', title, message, duration);
    },
    [showToast]
  );

  const showWarning = useCallback(
    (title: string, message: string, duration?: number) => {
      showToast('warning', title, message, duration);
    },
    [showToast]
  );

  return {
    toast: toast
      ? {
          type: toast.type,
          title: toast.title,
          message: toast.message,
          visible: toast.visible,
        }
      : null,
    showToast,
    hideToast,
    showSuccess,
    showError,
    showInfo,
    showWarning,
  };
}

/**
 * Hook variant that returns toast props directly for easier spreading
 * 
 */
export function useToastProps() {
  const { toast, ...methods } = useToast();
  
  return {
    toastProps: toast || {
      type: 'info' as ToastType,
      title: '',
      message: '',
      visible: false,
    },
    ...methods,
  };
}