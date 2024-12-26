import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="relative w-full max-w-md bg-gradient-to-br from-gray-900/90 to-gray-800/90 rounded-xl border border-white/10 shadow-2xl">
        {/* Decorative elements */}
        <div className="absolute top-0 -right-10 w-40 h-40 bg-red-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -left-10 w-40 h-40 bg-orange-500/20 rounded-full blur-3xl" />

        <div className="relative p-6">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white 
                     bg-white/5 hover:bg-white/10 rounded-lg transition-colors duration-200"
          >
            <X size={20} />
          </button>

          {/* Content */}
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>

            <h3 className="text-xl font-semibold text-white mb-2">
              {title || 'Confirm Delete'}
            </h3>

            <p className="text-gray-300 mb-6">
              {message || 'Are you sure you want to delete this entry? This action cannot be undone.'}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <button
                onClick={onConfirm}
                className="w-full sm:w-1/2 py-2 px-4 bg-red-500 hover:bg-red-600
                         text-white rounded-lg transition-colors duration-200"
              >
                Delete
              </button>
              
              <button
                onClick={onClose}
                className="w-full sm:w-1/2 py-2 px-4 bg-gray-700 hover:bg-gray-600
                         text-white rounded-lg border border-gray-600
                         transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;