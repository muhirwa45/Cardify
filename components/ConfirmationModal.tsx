import React from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: React.ReactNode;
  confirmButtonText?: string;
  cancelButtonText?: string;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmButtonText = 'Confirm',
  cancelButtonText = 'Cancel',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4" aria-modal="true" role="dialog">
      <div className="bg-card rounded-app shadow-xl w-full max-w-md">
        <div className="p-6">
          <h2 className="text-xl font-bold text-text-base">{title}</h2>
          <div className="text-text-muted mt-2">{message}</div>
        </div>
        <div className="p-4 bg-background dark:bg-card/50 rounded-b-app flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="bg-border text-text-base px-4 py-2 rounded-app font-semibold hover:bg-border/80 transition-colors"
          >
            {cancelButtonText}
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-600 text-white px-4 py-2 rounded-app font-semibold hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-background"
          >
            {confirmButtonText}
          </button>
        </div>
      </div>
    </div>
  );
};
