'use client';
import React from 'react';
import { Trash2, AlertTriangle } from 'lucide-react';

interface DeleteConfirmModalProps {
  roomName: string;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteConfirmModal({
  roomName,
  onClose,
  onConfirm,
}: DeleteConfirmModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      style={{ backgroundColor: 'rgba(30, 22, 14, 0.5)' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="relative rounded-2xl w-full max-w-md animate-slide-up p-6"
        style={{
          backgroundColor: '#FDFAF5',
          boxShadow: '0 20px 60px rgba(30, 22, 14, 0.2)',
          border: '1px solid #D2C3AA',
        }}
      >
        <div className="flex items-start gap-4 mb-5">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: 'rgba(180, 80, 70, 0.1)' }}
          >
            <AlertTriangle size={20} style={{ color: '#8A3028' }} />
          </div>
          <div>
            <h2
              className="font-display text-xl font-semibold"
              style={{ color: '#2D2438' }}
            >
              Delete Room Type
            </h2>
            <p className="text-sm mt-1" style={{ color: '#6A5A4A' }}>
              Are you sure you want to permanently delete{' '}
              <span className="font-semibold" style={{ color: '#1E160E' }}>
                {roomName}
              </span>
              ? This cannot be undone and may affect existing offers that reference this room type.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 active:scale-95"
            style={{
              backgroundColor: '#8A3028',
              color: '#FDFAF5',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = '#6A2018';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = '#8A3028';
            }}
          >
            <Trash2 size={14} />
            Delete Permanently
          </button>
        </div>
      </div>
    </div>
  );
}