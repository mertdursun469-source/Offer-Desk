'use client';
import React from 'react';
import { X, Download } from 'lucide-react';
import AppImage from '@/components/ui/AppImage';
import { OfferOption } from './OfferBuilderClient';

interface OfferPreviewModalProps {
  request: {
    guestName: string;
    guestEmail: string;
    checkIn: string;
    checkOut: string;
    adults: number;
    children: number;
    nights: number;
  };
  options: OfferOption[];
  personalMessage: string;
  validUntil: string;
  onClose: () => void;
}

const boardPlanLabels: Record<string, string> = {
  RO: 'Room Only',
  BB: 'Bed & Breakfast',
  HB: 'Half Board',
  FB: 'Full Board',
  AI: 'All Inclusive',
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export default function OfferPreviewModal({
  request,
  options,
  personalMessage,
  validUntil,
  onClose,
}: OfferPreviewModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      style={{ backgroundColor: 'rgba(30, 22, 14, 0.6)' }}
      onClick={(e) => {
        if(e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="relative flex flex-col rounded-2xl w-full max-w-3xl max-h-[90vh] animate-slide-up overflow-hidden"
        style={{
          backgroundColor: '#FDFAF5',
          boxShadow: '0 20px 60px rgba(30, 22, 14, 0.2)',
          border: '1px solid #D2C3AA',
        }}
      >
        {/* Modal Header */}
        <div
          className="flex items-center justify-between px-6 py-4 shrink-0"
          style={{ borderBottom: '1px solid #E4DAC8' }}
        >
          <h2 className="font-display text-xl font-semibold" style={{ color: '#2D2438' }}>
            Offer Preview
          </h2>
          <div className="flex items-center gap-2">
            <button className="btn-secondary text-sm py-2">
              <Download size={14} />
              Download PDF
            </button>
            <button onClick={onClose} className="btn-ghost p-1.5 rounded-lg">
              <X size={16} />
            </button>
          </div>
        </div>

        {/* PDF Preview Body */}
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          <div
            className="mx-auto my-6 rounded-2xl overflow-hidden"
            style={{
              maxWidth: 680,
              backgroundColor: '#FDFAF5',
              border: '1px solid #E4DAC8',
              boxShadow: '0 4px 24px rgba(30,22,14,0.1)',
            }}
          >
            {/* PDF Header */}
            <div
              className="px-10 py-8"
              style={{
                background: 'linear-gradient(135deg, #2D2438 0%, #3E3050 100%)',
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: '#C9A96E' }}>
                    OfferDesk
                  </p>
                  <h1 className="font-display text-3xl font-light" style={{ color: '#FDFAF5' }}>
                    Your Personalised Offer
                  </h1>
                </div>
                <div className="text-right">
                  <p className="text-xs" style={{ color: 'rgba(253,250,245,0.5)' }}>
                    Valid until
                  </p>
                  <p className="text-sm font-semibold" style={{ color: '#DFC08A' }}>
                    {formatDate(validUntil)}
                  </p>
                </div>
              </div>

              <div
                className="rounded-xl px-5 py-4"
                style={{ backgroundColor: 'rgba(255,255,255,0.07)' }}
              >
                <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: 'rgba(201,169,110,0.7)' }}>
                  Prepared for
                </p>
                <p className="font-display text-xl" style={{ color: '#FDFAF5' }}>
                  {request.guestName}
                </p>
                <div className="flex items-center gap-6 mt-2">
                  <div>
                    <p className="text-xs" style={{ color: 'rgba(253,250,245,0.5)' }}>Check-in</p>
                    <p className="text-sm font-medium" style={{ color: '#FDFAF5' }}>
                      {formatDate(request.checkIn)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs" style={{ color: 'rgba(253,250,245,0.5)' }}>Check-out</p>
                    <p className="text-sm font-medium" style={{ color: '#FDFAF5' }}>
                      {formatDate(request.checkOut)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs" style={{ color: 'rgba(253,250,245,0.5)' }}>Guests</p>
                    <p className="text-sm font-medium" style={{ color: '#FDFAF5' }}>
                      {request.adults} adults{request.children ? ` + ${request.children} children` : ''}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs" style={{ color: 'rgba(253,250,245,0.5)' }}>Duration</p>
                    <p className="text-sm font-medium tabular-nums" style={{ color: '#FDFAF5' }}>
                      {request.nights} nights
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Personal Message */}
            {personalMessage && (
              <div
                className="px-10 py-6"
                style={{ borderBottom: '1px solid #E4DAC8' }}
              >
                <p
                  className="text-sm leading-relaxed whitespace-pre-wrap"
                  style={{ color: '#3A2E22', fontStyle: 'italic' }}
                >
                  {personalMessage}
                </p>
              </div>
            )}

            {/* Options */}
            <div className="px-10 py-6 space-y-6">
              <p className="section-label" style={{ color: '#5C4A6E' }}>
                Your Options
              </p>

              {options.map((opt, idx) => (
                <div
                  key={opt.id}
                  className="rounded-xl overflow-hidden"
                  style={{
                    border: opt.highlight ? '2px solid #C9A96E' : '1px solid #E4DAC8',
                  }}
                >
                  {opt.highlight && (
                    <div
                      className="px-4 py-2 text-xs font-semibold text-center tracking-widest uppercase"
                      style={{ backgroundColor: '#C9A96E', color: '#2D2438' }}
                    >
                      ★ Recommended Option
                    </div>
                  )}
                  <div className="flex">
                    <div className="relative w-40 shrink-0">
                      <AppImage
                        src={opt.imageUrl}
                        alt={`${opt.roomTypeName} room view`}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p
                            className="text-xs font-semibold tracking-widest uppercase mb-0.5"
                            style={{ color: '#C9A96E' }}
                          >
                            {opt.label}
                          </p>
                          <p
                            className="font-display text-lg font-semibold"
                            style={{ color: '#2D2438' }}
                          >
                            {opt.roomTypeName}
                          </p>
                          <p className="text-xs mt-0.5" style={{ color: '#8A7A6A' }}>
                            {opt.capacity} · {boardPlanLabels[opt.boardPlan]}
                          </p>
                        </div>
                        <div className="text-right">
                          <p
                            className="font-display text-2xl font-semibold tabular-nums"
                            style={{ color: '#2D2438' }}
                          >
                            €{(opt.nightlyRate * request.nights).toLocaleString()}
                          </p>
                          <p className="text-xs" style={{ color: '#8A7A6A' }}>
                            €{opt.nightlyRate}/night · {request.nights} nights
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {opt.amenities.map((a) => (
                          <span
                            key={`prev-amenity-${opt.id}-${a}`}
                            className="px-2 py-0.5 rounded-full text-xs"
                            style={{
                              backgroundColor: 'rgba(92,74,110,0.08)',
                              color: '#5C4A6E',
                            }}
                          >
                            {a}
                          </span>
                        ))}
                      </div>

                      {opt.notes && (
                        <p className="text-xs leading-relaxed" style={{ color: '#6A5A4A' }}>
                          {opt.notes}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* PDF Footer */}
            <div
              className="px-10 py-6 text-center"
              style={{
                backgroundColor: '#F5F0E8',
                borderTop: '1px solid #E4DAC8',
              }}
            >
              <p className="text-xs" style={{ color: '#8A7A6A' }}>
                To confirm your reservation or ask questions, please reply to this email or contact us directly.
              </p>
              <p className="text-xs mt-1 font-medium" style={{ color: '#5C4A6E' }}>
                This offer is valid until {formatDate(validUntil)}.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}