'use client';
import React, { useState } from 'react';
import { X, Send, Loader2, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface SendOfferModalProps {
  guestName: string;
  guestEmail: string;
  optionCount: number;
  shareLink: string | null;
  onClose: () => void;
  onSend: () => void;
}

interface SendFormValues {
  toEmail: string;
  subject: string;
  body: string;
  attachPdf: boolean;
  includeLink: boolean;
}

export default function SendOfferModal({
  guestName,
  guestEmail,
  optionCount,
  shareLink,
  onClose,
  onSend,
}: SendOfferModalProps) {
  const [isSending, setIsSending] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SendFormValues>({
    defaultValues: {
      toEmail: guestEmail,
      subject: `Your Personalised Offer — Luxury Stay`,
      body: `Dear ${guestName},\n\nPlease find attached your personalised offer for your upcoming stay. We have prepared ${optionCount} curated option${optionCount !== 1 ? 's' : ''} for your consideration.\n\nWe look forward to welcoming you.\n\nWarm regards,\nAyşe Kaya\nReservations Manager`,
      attachPdf: true,
      includeLink: true,
    },
  });

  // Backend integration: POST /api/offers/:id/send-email
  const onFormSubmit = (data: SendFormValues) => {
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      onSend();
    }, 2000);
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
        className="relative flex flex-col rounded-2xl w-full max-w-xl max-h-[85vh] animate-slide-up"
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
              <Send size={18} style={{ color: '#5C4A6E' }} />
            </div>
            <div>
              <h2
                className="font-display text-xl font-semibold"
                style={{ color: '#2D2438' }}
              >
                Send Offer to Guest
              </h2>
              <p className="text-xs" style={{ color: '#8A7A6A' }}>
                {optionCount} option{optionCount !== 1 ? 's' : ''} · via Outlook
              </p>
            </div>
          </div>
          <button onClick={onClose} className="btn-ghost p-1.5 rounded-lg">
            <X size={16} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(onFormSubmit)}
          className="flex flex-col flex-1 overflow-hidden"
        >
          <div className="flex-1 overflow-y-auto scrollbar-thin px-6 py-5 space-y-4">
            {/* To */}
            <div>
              <label
                className="block text-sm font-medium mb-1.5"
                style={{ color: '#3A2E22' }}
              >
                To
              </label>
              <input
                type="email"
                {...register('toEmail', { required: 'Recipient email is required' })}
                className="input-field"
              />
              {errors.toEmail && (
                <p className="flex items-center gap-1 text-xs mt-1" style={{ color: '#8A3028' }}>
                  <AlertCircle size={11} />
                  {errors.toEmail.message}
                </p>
              )}
            </div>

            {/* Subject */}
            <div>
              <label
                className="block text-sm font-medium mb-1.5"
                style={{ color: '#3A2E22' }}
              >
                Subject
              </label>
              <input
                type="text"
                {...register('subject', { required: 'Subject is required' })}
                className="input-field"
              />
            </div>

            {/* Body */}
            <div>
              <label
                className="block text-sm font-medium mb-1.5"
                style={{ color: '#3A2E22' }}
              >
                Email Body
              </label>
              <textarea
                {...register('body')}
                rows={7}
                className="input-field resize-none text-sm leading-relaxed"
              />
            </div>

            {/* Attachments */}
            <div
              className="rounded-xl p-4 space-y-3"
              style={{
                backgroundColor: '#F5F0E8',
                border: '1px solid #E4DAC8',
              }}
            >
              <p className="section-label">Attachments & Links</p>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('attachPdf')}
                  className="w-4 h-4 rounded"
                  style={{ accentColor: '#5C4A6E' }}
                />
                <div>
                  <p className="text-sm font-medium" style={{ color: '#1E160E' }}>
                    Attach PDF Offer
                  </p>
                  <p className="text-xs" style={{ color: '#8A7A6A' }}>
                    Branded PDF with all options and pricing
                  </p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('includeLink')}
                  className="w-4 h-4 rounded"
                  style={{ accentColor: '#5C4A6E' }}
                />
                <div>
                  <p className="text-sm font-medium" style={{ color: '#1E160E' }}>
                    Include Shareable Web Link
                  </p>
                  <p className="text-xs" style={{ color: '#8A7A6A' }}>
                    {shareLink
                      ? shareLink
                      : 'A new link will be generated automatically'}
                  </p>
                </div>
              </label>
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
            <button
              type="submit"
              disabled={isSending}
              className="btn-primary"
              style={{ minWidth: 140 }}
            >
              {isSending ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <Send size={15} />
              )}
              {isSending ? 'Sending…' : 'Send Offer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}