import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast, toasts }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context.addToast;
}

import { AnimatePresence, motion } from 'framer-motion';
import { X, CheckCircle, AlertTriangle, Info, AlertCircle } from 'lucide-react';

function ToastContainer({ toasts, removeToast }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full">
      <AnimatePresence>
        {toasts.map((toast) => {
          let icon = <Info className="w-5 h-5 text-neon-blue" />;
          let borderColor = 'border-neon-blue/20';
          let glowColor = 'shadow-[0_0_15px_rgba(0,240,255,0.1)]';

          if (toast.type === 'success') {
            icon = <CheckCircle className="w-5 h-5 text-neon-cyan" />;
            borderColor = 'border-neon-cyan/20';
            glowColor = 'shadow-[0_0_15px_rgba(0,255,209,0.1)]';
          } else if (toast.type === 'error') {
            icon = <AlertCircle className="w-5 h-5 text-neon-pink" />;
            borderColor = 'border-neon-pink/20';
            glowColor = 'shadow-[0_0_15px_rgba(255,0,122,0.1)]';
          } else if (toast.type === 'warning') {
            icon = <AlertTriangle className="w-5 h-5 text-yellow-400" />;
            borderColor = 'border-yellow-500/20';
            glowColor = 'shadow-[0_0_15px_rgba(234,179,8,0.1)]';
          }

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
              layout
              className={`glass-panel p-4 rounded-xl flex items-center justify-between gap-3 ${borderColor} ${glowColor}`}
            >
              <div className="flex items-center gap-3">
                {icon}
                <span className="text-sm font-medium text-white/90">{toast.message}</span>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-white/40 hover:text-white/90 transition-colors p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
