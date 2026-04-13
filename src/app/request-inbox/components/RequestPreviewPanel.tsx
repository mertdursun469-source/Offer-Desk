'use client';
import React, { useState, useEffect } from 'react';
import { X, Calendar, Users, Clock, Mail, Sparkles, FileText, ExternalLink, BedDouble, MessageSquare, Banknote, Loader2, AlertCircle,  } from 'lucide-react';
import { ReservationRequest, RequestStatus } from './RequestInboxClient';

interface RequestPreviewPanelProps {
  request: ReservationRequest;
  onAnalyze: (id: string) => void;
  onClose: () => void;
  isAnalyzing: boolean;
}

const statusConfig: Record<RequestStatus, { label: string; className: string }> = {
  new: { label: 'New', className: 'badge badge-new' },
  analyzing: { label: 'Analyzing…', className: 'badge badge-analyzing' },
  ready: { label: 'Ready for Offer', className: 'badge badge-ready' },
  offer_sent: { label: 'Offer Sent', className: 'badge badge-sent' },
  confirmed: { label: 'Confirmed', className: 'badge badge-confirmed' },
  declined: { label: 'Declined', className: 'badge badge-declined' },
};

function formatDate(iso: string | null): string {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' });
}

export default function RequestPreviewPanel({
  request,
  onAnalyze,
  onClose,
  isAnalyzing,
}: RequestPreviewPanelProps) {
  const [analyzedTime, setAnalyzedTime] = useState<string | null>(null);

  useEffect(() => {
    if (request.analyzedAt) {
      setAnalyzedTime(new Date(request.analyzedAt).toLocaleTimeString('tr-TR', {
        hour: '2-digit',
        minute: '2-digit',
      }));
    }
  }, [request.analyzedAt]);

  return (
    <div
      className="flex flex-col flex-1 overflow-hidden animate-fade-in"
      style={{ backgroundColor: '#FDFAF5' }}
    >
      {/* Panel Header */}
      <div
        className="flex items-start justify-between px-5 py-4 shrink-0"
        style={{ borderBottom: '1px solid #E4DAC8' }}
      >
        <div className="flex-1 min-w-0 pr-4">
          <div className="flex items-center gap-2 mb-1">
            <span className={statusConfig[request.status].className}>
              {statusConfig[request.status].label}
            </span>
            <span
              className={
                request.source === 'outlook' ?'badge badge-outlook' :'badge badge-manual'
              }
            >
              {request.source === 'outlook' ? '📨 Outlook' : '📋 Manual'}
            </span>
            {request.isUrgent && (
              <span
                className="badge"
                style={{
                  backgroundColor: 'rgba(180, 80, 70, 0.12)',
                  color: '#8A3028',
                }}
              >
                <AlertCircle size={10} />
                URGENT
              </span>
            )}
          </div>
          <h2
            className="font-display text-xl font-semibold truncate"
            style={{ color: '#2D2438' }}
          >
            {request.guestName}
          </h2>
          <p className="text-xs mt-0.5" style={{ color: '#8A7A6A' }}>
            {request.guestEmail}
          </p>
        </div>
        <button
          onClick={onClose}
          className="btn-ghost p-1.5 rounded-lg"
          aria-label="Close preview"
        >
          <X size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin px-5 py-4 space-y-5">
        {/* Subject */}
        <div>
          <p className="section-label mb-1.5">Subject</p>
          <p className="text-sm font-medium" style={{ color: '#1E160E' }}>
            {request.subject}
          </p>
        </div>

        {/* AI Extracted Details */}
        {request.status !== 'new' && (
          <div
            className="rounded-xl p-4 space-y-3"
            style={{
              backgroundColor: 'rgba(92, 74, 110, 0.06)',
              border: '1px solid rgba(92, 74, 110, 0.15)',
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={14} style={{ color: '#5C4A6E' }} />
              <p className="text-xs font-semibold" style={{ color: '#5C4A6E' }}>
                AI Extracted Details
              </p>
              {request.analyzedAt && (
                <span className="text-xs ml-auto" style={{ color: '#B0A090' }}>
                  {analyzedTime}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="section-label mb-0.5">Check-in</p>
                <div className="flex items-center gap-1.5">
                  <Calendar size={13} style={{ color: '#5C4A6E' }} />
                  <span className="text-sm font-medium" style={{ color: '#1E160E' }}>
                    {formatDate(request.checkIn)}
                  </span>
                </div>
              </div>
              <div>
                <p className="section-label mb-0.5">Check-out</p>
                <div className="flex items-center gap-1.5">
                  <Calendar size={13} style={{ color: '#5C4A6E' }} />
                  <span className="text-sm font-medium" style={{ color: '#1E160E' }}>
                    {formatDate(request.checkOut)}
                  </span>
                </div>
              </div>
              <div>
                <p className="section-label mb-0.5">Guests</p>
                <div className="flex items-center gap-1.5">
                  <Users size={13} style={{ color: '#5C4A6E' }} />
                  <span className="text-sm font-medium" style={{ color: '#1E160E' }}>
                    {request.adults !== null
                      ? `${request.adults} adults${request.children ? ` + ${request.children} children` : ''}`
                      : '—'}
                  </span>
                </div>
              </div>
              <div>
                <p className="section-label mb-0.5">Duration</p>
                <div className="flex items-center gap-1.5">
                  <Clock size={13} style={{ color: '#5C4A6E' }} />
                  <span className="text-sm font-medium tabular-nums" style={{ color: '#1E160E' }}>
                    {request.nights ? `${request.nights} nights` : '—'}
                  </span>
                </div>
              </div>
              {request.roomPreference && (
                <div className="col-span-2">
                  <p className="section-label mb-0.5">Room Preference</p>
                  <div className="flex items-start gap-1.5">
                    <BedDouble size={13} style={{ color: '#5C4A6E', marginTop: 2 }} />
                    <span className="text-sm" style={{ color: '#1E160E' }}>
                      {request.roomPreference}
                    </span>
                  </div>
                </div>
              )}
              {request.budget && (
                <div className="col-span-2">
                  <p className="section-label mb-0.5">Budget</p>
                  <div className="flex items-center gap-1.5">
                    <Banknote size={13} style={{ color: '#5C4A6E' }} />
                    <span className="text-sm font-medium" style={{ color: '#1E160E' }}>
                      {request.budget}
                    </span>
                  </div>
                </div>
              )}
              {request.specialRequests && (
                <div className="col-span-2">
                  <p className="section-label mb-0.5">Special Requests</p>
                  <div className="flex items-start gap-1.5">
                    <MessageSquare size={13} style={{ color: '#5C4A6E', marginTop: 2 }} />
                    <span className="text-sm" style={{ color: '#1E160E' }}>
                      {request.specialRequests}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Email Body */}
        <div>
          <p className="section-label mb-2">Original Email</p>
          <div
            className="rounded-xl p-4 text-sm whitespace-pre-wrap leading-relaxed"
            style={{
              backgroundColor: '#F5F0E8',
              border: '1px solid #E4DAC8',
              color: '#3A2E22',
              fontFamily: 'DM Sans, sans-serif',
              fontSize: 13,
            }}
          >
            {request.emailBody}
          </div>
        </div>
      </div>

      {/* Panel Footer Actions */}
      <div
        className="flex items-center gap-2 px-5 py-4 shrink-0"
        style={{ borderTop: '1px solid #E4DAC8' }}
      >
        {request.status === 'new' && (
          <button
            onClick={() => onAnalyze(request.id)}
            disabled={isAnalyzing}
            className="btn-primary flex-1 justify-center"
          >
            {isAnalyzing ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Sparkles size={15} />
            )}
            {isAnalyzing ? 'Analyzing with Gemini…' : 'Analyze with AI'}
          </button>
        )}
        {request.status === 'analyzing' && (
          <div
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm"
            style={{
              backgroundColor: 'rgba(200, 150, 60, 0.1)',
              color: '#8A6010',
            }}
          >
            <Loader2 size={15} className="animate-spin" />
            Gemini is analyzing…
          </div>
        )}
        {request.status === 'ready' && (
          <a
            href={`/offer-builder?requestId=${request.id}`}
            className="btn-primary flex-1 justify-center"
          >
            <FileText size={15} />
            Build Offer
          </a>
        )}
        {(request.status === 'offer_sent' ||
          request.status === 'confirmed' ||
          request.status === 'declined') && (
          <a
            href={`/offer-builder?requestId=${request.id}`}
            className="btn-secondary flex-1 justify-center"
          >
            <ExternalLink size={15} />
            View Offer
          </a>
        )}

        <button
          className="btn-ghost px-3 py-2.5"
          onClick={() =>
            window.open(`mailto:${request.guestEmail}`, '_blank')
          }
          title="Reply via email client"
        >
          <Mail size={16} />
        </button>
      </div>
    </div>
  );
}