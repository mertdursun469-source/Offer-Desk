'use client';
import React, { useState } from 'react';
import { X, Clipboard, Sparkles, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface ManualPasteModalProps {
  onClose: () => void;
  onSubmit: (emailText: string, guestEmail: string) => void;
}

interface FormValues {
  guestEmail: string;
  emailBody: string;
}

export default function ManualPasteModal({
  onClose,
  onSubmit,
}: ManualPasteModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormValues>();

  const emailBody = watch('emailBody', '');
  const charCount = emailBody?.length || 0;

  const onFormSubmit = (data: FormValues) => {
    onSubmit(data.emailBody, data.guestEmail);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      style={{ backgroundColor: 'rgba(30, 22, 14, 0.5)' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="relative flex flex-col rounded-2xl w-full max-w-2xl max-h-[85vh] animate-slide-up"
        style={{
          backgroundColor: '#FDFAF5',
          boxShadow: '0 20px 60px rgba(30, 22, 14, 0.2)',
          border: '1px solid #D2C3AA',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-5 shrink-0"
          style={{ borderBottom: '1px solid #E4DAC8' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: 'rgba(92, 74, 110, 0.1)' }}
            >
              <Clipboard size={18} style={{ color: '#5C4A6E' }} />
            </div>
            <div>
              <h2
                className="font-display text-xl font-semibold"
                style={{ color: '#2D2438' }}
              >
                Paste Email Manually
              </h2>
              <p className="text-xs" style={{ color: '#8A7A6A' }}>
                Paste the reservation request email and AI will extract the details
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="btn-ghost p-1.5 rounded-lg"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onFormSubmit)}
          className="flex flex-col flex-1 overflow-hidden"
        >
          <div className="flex-1 overflow-y-auto scrollbar-thin px-6 py-5 space-y-5">
            {/* Guest Email */}
            <div>
              <label
                className="block text-sm font-medium mb-1.5"
                style={{ color: '#3A2E22' }}
              >
                Guest Email Address
                <span style={{ color: '#8A3028' }}> *</span>
              </label>
              <p className="text-xs mb-2" style={{ color: '#8A7A6A' }}>
                The sender's email — used to send the offer later
              </p>
              <input
                type="email"
                {...register('guestEmail', {
                  required: 'Guest email is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Enter a valid email address',
                  },
                })}
                className="input-field"
                placeholder="guest@example.com"
              />
              {errors.guestEmail && (
                <p
                  className="flex items-center gap-1 text-xs mt-1.5"
                  style={{ color: '#8A3028' }}
                >
                  <AlertCircle size={11} />
                  {errors.guestEmail.message}
                </p>
              )}
            </div>

            {/* Email Body */}
            <div>
              <label
                className="block text-sm font-medium mb-1.5"
                style={{ color: '#3A2E22' }}
              >
                Email Content
                <span style={{ color: '#8A3028' }}> *</span>
              </label>
              <p className="text-xs mb-2" style={{ color: '#8A7A6A' }}>
                Paste the full email text including the body. AI will extract check-in/out dates, guest count, room preferences, and special requests.
              </p>
              <textarea
                {...register('emailBody', {
                  required: 'Email content is required',
                  minLength: {
                    value: 30,
                    message: 'Email content must be at least 30 characters',
                  },
                })}
                rows={12}
                className="input-field resize-none"
                placeholder="Paste the full reservation request email here…

Example:
Dear Reservations Team,

I would like to inquire about availability for June 14–21, 2026.
We are 2 adults looking for a suite with sea view…"
              />
              <div className="flex items-center justify-between mt-1">
                {errors.emailBody ? (
                  <p
                    className="flex items-center gap-1 text-xs"
                    style={{ color: '#8A3028' }}
                  >
                    <AlertCircle size={11} />
                    {errors.emailBody.message}
                  </p>
                ) : (
                  <span />
                )}
                <span
                  className="text-xs tabular-nums"
                  style={{ color: '#B0A090' }}
                >
                  {charCount} characters
                </span>
              </div>
            </div>

            {/* Info Box */}
            <div
              className="flex items-start gap-3 rounded-xl p-4"
              style={{
                backgroundColor: 'rgba(92, 74, 110, 0.06)',
                border: '1px solid rgba(92, 74, 110, 0.15)',
              }}
            >
              <Sparkles size={16} style={{ color: '#5C4A6E', flexShrink: 0, marginTop: 1 }} />
              <div>
                <p className="text-xs font-semibold mb-0.5" style={{ color: '#5C4A6E' }}>
                  Google Gemini AI Analysis
                </p>
                <p className="text-xs" style={{ color: '#6A5A4A' }}>
                  After adding, click "Analyze with AI" on the request to automatically extract check-in/out dates, guest count, room preferences, budget, and special requests.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            className="flex items-center justify-end gap-3 px-6 py-4 shrink-0"
            style={{ borderTop: '1px solid #E4DAC8' }}
          >
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              <Clipboard size={15} />
              Add to Inbox
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}