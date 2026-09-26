import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Copy } from 'lucide-react';
import { ToastMessage } from '../types';

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed top-20 right-6 z-50 flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            onClick={() => onDismiss(toast.id)}
            className="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl bg-neutral-950/90 border border-[#ff1e27]/60 shadow-[0_10px_30px_rgba(255,30,39,0.3)] backdrop-blur-xl text-white min-w-[280px] cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-[#ff1e27]/20 border border-[#ff1e27] flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4 text-[#ff1e27]" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-white font-mono tracking-wide">
                {toast.title}
              </span>
              {toast.description && (
                <span className="text-[11px] text-neutral-400 font-mono">
                  {toast.description}
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
