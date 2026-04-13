'use client';
import React, { useState } from 'react';
import { Inbox, RefreshCw, Plus, Search, Sparkles, Calendar, Users, Clock, Clipboard, X, CheckCircle, Loader2, FileText, Send, Star,  } from 'lucide-react';
import { toast } from 'sonner';
import ManualPasteModal from './ManualPasteModal';
import RequestPreviewPanel from './RequestPreviewPanel';

export type RequestStatus =
  | 'new' |'analyzing' |'ready' |'offer_sent' |'confirmed' |'declined';

export type EmailSource = 'outlook' | 'manual';

export interface ReservationRequest {
  id: string;
  guestName: string;
  guestEmail: string;
  subject: string;
  emailBody: string;
  source: EmailSource;
  receivedAt: string;
  status: RequestStatus;
  checkIn: string | null;
  checkOut: string | null;
  adults: number | null;
  children: number | null;
  nights: number | null;
  roomPreference: string | null;
  specialRequests: string | null;
  budget: string | null;
  isUrgent: boolean;
  isStarred: boolean;
  offerId: string | null;
  analyzedAt: string | null;
}

// Backend integration: replace with GET /api/reservation-requests
const mockRequests: ReservationRequest[] = [
  {
    id: 'req-001',
    guestName: 'Sophie Beaumont',
    guestEmail: 'sophie.beaumont@gmail.com',
    subject: 'Reservation Inquiry – Honeymoon Stay, June 2026',
    emailBody: `Dear Reservations Team,

My fiancé and I are planning our honeymoon and have been dreaming of staying at your beautiful property. We are looking for a romantic suite or villa for our stay from June 14 to June 21, 2026 — that would be 7 nights.

We will be 2 adults. We would love a room with a private pool or at least a sea view if possible. We are also interested in your half-board option as we'd like to explore local restaurants for some meals.

Our budget is approximately €3,500–4,500 for the entire stay. We would appreciate any special arrangements you might offer for honeymooners.

Looking forward to hearing from you,
Sophie Beaumont`,
    source: 'outlook',
    receivedAt: '2026-04-13T08:22:00Z',
    status: 'ready',
    checkIn: '2026-06-14',
    checkOut: '2026-06-21',
    adults: 2,
    children: 0,
    nights: 7,
    roomPreference: 'Suite or Villa with private pool / sea view',
    specialRequests: 'Honeymoon arrangements',
    budget: '€3,500–4,500',
    isUrgent: false,
    isStarred: true,
    offerId: null,
    analyzedAt: '2026-04-13T08:25:00Z',
  },
  {
    id: 'req-002',
    guestName: 'Marcus Lindqvist',
    guestEmail: 'm.lindqvist@nordicventures.se',
    subject: 'Corporate Retreat – 8 Rooms, September',
    emailBody: `Hello,

I'm organising a corporate retreat for our leadership team of 16 people (8 couples). We're looking at the last week of September 2026, ideally September 20–25.

We need 8 superior or deluxe rooms, ideally with a meeting space available for half a day. Full board preferred. Budget is flexible for the right property.

Could you send us a group offer with your best rates?

Best,
Marcus Lindqvist
Nordic Ventures AB`,
    source: 'outlook',
    receivedAt: '2026-04-13T07:45:00Z',
    status: 'ready',
    checkIn: '2026-09-20',
    checkOut: '2026-09-25',
    adults: 16,
    children: 0,
    nights: 5,
    roomPreference: 'Superior or Deluxe rooms x8',
    specialRequests: 'Meeting space for half day, group rates',
    budget: 'Flexible',
    isUrgent: false,
    isStarred: false,
    offerId: null,
    analyzedAt: '2026-04-13T07:50:00Z',
  },
  {
    id: 'req-003',
    guestName: 'Layla Al-Rashidi',
    guestEmail: 'layla.rashidi@hotmail.com',
    subject: 'Availability Check – Family Holiday July',
    emailBody: `To Whom It May Concern,

I would like to inquire about availability for a family holiday. We are 2 adults and 2 children (ages 7 and 10). Dates: July 3 to July 10, 2026.

We need a family room or two connecting rooms. Breakfast included is a must. Please send pricing options.

Thank you,
Layla Al-Rashidi`,
    source: 'outlook',
    receivedAt: '2026-04-13T06:10:00Z',
    status: 'new',
    checkIn: '2026-07-03',
    checkOut: '2026-07-10',
    adults: 2,
    children: 2,
    nights: 7,
    roomPreference: 'Family room or connecting rooms',
    specialRequests: 'Breakfast included',
    budget: null,
    isUrgent: false,
    isStarred: false,
    offerId: null,
    analyzedAt: null,
  },
  {
    id: 'req-004',
    guestName: 'James Whitfield',
    guestEmail: 'j.whitfield@whitfieldlaw.co.uk',
    subject: 'URGENT: Long Weekend Stay This Friday',
    emailBody: `Hi,

I know this is very last minute but I need a room for this Friday to Sunday (April 17–19). Just myself, 1 adult. Any room type available. I saw your property on Condé Nast and I'd love to stay.

Happy to take whatever is available. Please reply ASAP.

James`,
    source: 'manual',
    receivedAt: '2026-04-13T09:05:00Z',
    status: 'analyzing',
    checkIn: '2026-04-17',
    checkOut: '2026-04-19',
    adults: 1,
    children: 0,
    nights: 2,
    roomPreference: 'Any available',
    specialRequests: null,
    budget: null,
    isUrgent: true,
    isStarred: false,
    offerId: null,
    analyzedAt: null,
  },
  {
    id: 'req-005',
    guestName: 'Chiara Moretti',
    guestEmail: 'chiara.moretti@libero.it',
    subject: 'Richiesta Preventivo – Agosto 2026',
    emailBody: `Buongiorno,

Vorrei richiedere un preventivo per un soggiorno di 10 notti ad agosto, dal 5 al 15 agosto 2026. Siamo 2 adulti. Preferiamo una camera con vista mare e colazione inclusa. Budget massimo €2.800 totali.

Grazie mille,
Chiara Moretti`,
    source: 'outlook',
    receivedAt: '2026-04-12T16:30:00Z',
    status: 'offer_sent',
    checkIn: '2026-08-05',
    checkOut: '2026-08-15',
    adults: 2,
    children: 0,
    nights: 10,
    roomPreference: 'Sea view, breakfast included',
    specialRequests: null,
    budget: '€2,800',
    isUrgent: false,
    isStarred: false,
    offerId: 'offer-088',
    analyzedAt: '2026-04-12T16:35:00Z',
  },
  {
    id: 'req-006',
    guestName: 'Tariq Osman',
    guestEmail: 'tariq.osman@gmail.com',
    subject: 'Anniversary Trip – October Availability',
    emailBody: `Dear Team,

My wife and I are celebrating our 10th anniversary in October. We're looking at October 8–13, 5 nights. 2 adults. We'd prefer a premium room with a terrace. Dinner included would be nice. Budget around €2,000.

Kind regards,
Tariq Osman`,
    source: 'outlook',
    receivedAt: '2026-04-12T11:20:00Z',
    status: 'confirmed',
    checkIn: '2026-10-08',
    checkOut: '2026-10-13',
    adults: 2,
    children: 0,
    nights: 5,
    roomPreference: 'Premium room with terrace',
    specialRequests: 'Anniversary celebration',
    budget: '€2,000',
    isUrgent: false,
    isStarred: true,
    offerId: 'offer-085',
    analyzedAt: '2026-04-12T11:28:00Z',
  },
  {
    id: 'req-007',
    guestName: 'Nadia Petrova',
    guestEmail: 'n.petrova@moskovdesign.ru',
    subject: 'Inquiry: New Year Stay',
    emailBody: `Hello,

We would like to stay for New Year's Eve. 2 adults, December 29 to January 3. We want the best suite available and full board. Money is not an issue.

Please send your top offer.
Nadia`,
    source: 'manual',
    receivedAt: '2026-04-11T14:00:00Z',
    status: 'ready',
    checkIn: '2026-12-29',
    checkOut: '2027-01-03',
    adults: 2,
    children: 0,
    nights: 5,
    roomPreference: 'Best suite available',
    specialRequests: 'New Year\'s Eve celebration',
    budget: 'No limit',
    isUrgent: false,
    isStarred: true,
    offerId: null,
    analyzedAt: '2026-04-11T14:10:00Z',
  },
  {
    id: 'req-008',
    guestName: 'Henrik Bauer',
    guestEmail: 'h.bauer@bauer-family.de',
    subject: 'Family Vacation – 3 Rooms Needed',
    emailBody: `Good day,

We are a family of 3 couples with children (total 6 adults, 4 children aged 4–12). We need 3 family rooms or suites from August 20 to August 30. Half board. Budget around €6,000 total.

Please advise availability and pricing.

Henrik Bauer`,
    source: 'outlook',
    receivedAt: '2026-04-11T09:15:00Z',
    status: 'offer_sent',
    checkIn: '2026-08-20',
    checkOut: '2026-08-30',
    adults: 6,
    children: 4,
    nights: 10,
    roomPreference: '3 family rooms or suites',
    specialRequests: 'Children amenities',
    budget: '€6,000',
    isUrgent: false,
    isStarred: false,
    offerId: 'offer-091',
    analyzedAt: '2026-04-11T09:20:00Z',
  },
  {
    id: 'req-009',
    guestName: 'Amara Diallo',
    guestEmail: 'amara.diallo@outlook.com',
    subject: 'Yoga Retreat – Solo Stay, May',
    emailBody: `Hi there,

I'm looking for a peaceful solo retreat. May 10–17, 7 nights. 1 adult. I practice yoga daily so a room with outdoor space would be ideal. Breakfast only. Budget €900–1,200.

Thank you,
Amara`,
    source: 'outlook',
    receivedAt: '2026-04-10T18:45:00Z',
    status: 'declined',
    checkIn: '2026-05-10',
    checkOut: '2026-05-17',
    adults: 1,
    children: 0,
    nights: 7,
    roomPreference: 'Room with outdoor/terrace space',
    specialRequests: 'Yoga practice space',
    budget: '€900–1,200',
    isUrgent: false,
    isStarred: false,
    offerId: 'offer-079',
    analyzedAt: '2026-04-10T18:52:00Z',
  },
];

const statusConfig: Record<RequestStatus, { label: string; className: string; icon: React.ElementType }> = {
  new: { label: 'New', className: 'badge badge-new', icon: Inbox },
  analyzing: { label: 'Analyzing…', className: 'badge badge-analyzing', icon: Loader2 },
  ready: { label: 'Ready', className: 'badge badge-ready', icon: CheckCircle },
  offer_sent: { label: 'Offer Sent', className: 'badge badge-sent', icon: Send },
  confirmed: { label: 'Confirmed', className: 'badge badge-confirmed', icon: CheckCircle },
  declined: { label: 'Declined', className: 'badge badge-declined', icon: X },
};

function formatDate(iso: string | null): string {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatRelativeTime(iso: string): string {
  const now = new Date('2026-04-13T09:37:26Z');
  const then = new Date(iso);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

export default function RequestInboxClient() {
  const [requests, setRequests] = useState<ReservationRequest[]>(mockRequests);
  const [selectedId, setSelectedId] = useState<string | null>('req-001');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<RequestStatus | 'all'>('all');
  const [showManualPaste, setShowManualPaste] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [analyzingIds, setAnalyzingIds] = useState<Set<string>>(new Set());

  const selectedRequest = requests.find((r) => r.id === selectedId) ?? null;

  const filtered = requests.filter((r) => {
    const matchesSearch =
      !searchQuery ||
      r.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.guestEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Backend integration: POST /api/outlook/sync
  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      toast.success('Inbox synced — 2 new requests found');
    }, 2000);
  };

  // Backend integration: POST /api/requests/:id/analyze (calls Google Gemini)
  const handleAnalyze = (id: string) => {
    setAnalyzingIds((prev) => new Set(prev).add(id));
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'analyzing' } : r))
    );
    setTimeout(() => {
      setAnalyzingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      setRequests((prev) =>
        prev.map((r) =>
          r.id === id
            ? {
                ...r,
                status: 'ready',
                analyzedAt: new Date().toISOString(),
              }
            : r
        )
      );
      toast.success('AI analysis complete — request details extracted');
    }, 3000);
  };

  const handleToggleStar = (id: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isStarred: !r.isStarred } : r))
    );
  };

  const handleManualPasteSubmit = (emailText: string, guestEmail: string) => {
    const newReq: ReservationRequest = {
      id: `req-${Date.now()}`,
      guestName: 'Pending Analysis',
      guestEmail: guestEmail || 'unknown@guest.com',
      subject: 'Manual Paste — Pending AI Analysis',
      emailBody: emailText,
      source: 'manual',
      receivedAt: new Date().toISOString(),
      status: 'new',
      checkIn: null,
      checkOut: null,
      adults: null,
      children: null,
      nights: null,
      roomPreference: null,
      specialRequests: null,
      budget: null,
      isUrgent: false,
      isStarred: false,
      offerId: null,
      analyzedAt: null,
    };
    setRequests((prev) => [newReq, ...prev]);
    setSelectedId(newReq.id);
    setShowManualPaste(false);
    toast.success('Email added — click Analyze to extract details');
  };

  const statusCounts = {
    new: requests.filter((r) => r.status === 'new').length,
    ready: requests.filter((r) => r.status === 'ready').length,
    offer_sent: requests.filter((r) => r.status === 'offer_sent').length,
  };

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: '#F5F0E8' }}>
      {/* Page Header */}
      <div
        className="flex items-center justify-between px-6 py-4 shrink-0"
        style={{
          backgroundColor: '#FDFAF5',
          borderBottom: '1px solid #E4DAC8',
        }}
      >
        <div>
          <h1 className="font-display text-2xl font-semibold" style={{ color: '#2D2438' }}>
            Request Inbox
          </h1>
          <p className="text-sm mt-0.5" style={{ color: '#8A7A6A' }}>
            {requests.length} total requests · {statusCounts.new} new · {statusCounts.ready} ready for offer
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowManualPaste(true)}
            className="btn-secondary"
          >
            <Clipboard size={15} />
            Paste Email
          </button>
          <button
            onClick={handleSync}
            disabled={isSyncing}
            className="btn-primary"
          >
            {isSyncing ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <RefreshCw size={15} />
            )}
            {isSyncing ? 'Syncing…' : 'Sync Outlook'}
          </button>
        </div>
      </div>

      {/* Status Summary Chips */}
      <div
        className="flex items-center gap-3 px-6 py-3 shrink-0"
        style={{
          backgroundColor: '#FDFAF5',
          borderBottom: '1px solid #E4DAC8',
        }}
      >
        {(
          [
            { key: 'all', label: 'All Requests', count: requests.length },
            { key: 'new', label: 'New', count: statusCounts.new },
            { key: 'ready', label: 'Ready', count: statusCounts.ready },
            { key: 'offer_sent', label: 'Offer Sent', count: statusCounts.offer_sent },
          ] as { key: RequestStatus | 'all'; label: string; count: number }[]
        ).map((chip) => (
          <button
            key={`chip-${chip.key}`}
            onClick={() => setStatusFilter(chip.key)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150"
            style={{
              backgroundColor:
                statusFilter === chip.key
                  ? '#5C4A6E' :'rgba(92, 74, 110, 0.08)',
              color: statusFilter === chip.key ? '#FDFAF5' : '#5C4A6E',
              border: '1px solid',
              borderColor:
                statusFilter === chip.key ? '#5C4A6E' : 'rgba(92, 74, 110, 0.2)',
            }}
          >
            {chip.label}
            <span
              className="tabular-nums px-1.5 py-0.5 rounded-full text-xs"
              style={{
                backgroundColor:
                  statusFilter === chip.key
                    ? 'rgba(255,255,255,0.2)'
                    : 'rgba(92, 74, 110, 0.12)',
                color: statusFilter === chip.key ? '#FDFAF5' : '#5C4A6E',
              }}
            >
              {chip.count}
            </span>
          </button>
        ))}

        <div className="flex-1" />

        {/* Search */}
        <div className="relative">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: '#B0A090' }}
          />
          <input
            type="text"
            placeholder="Search guest, email, subject…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 pr-3 py-1.5 rounded-lg text-sm outline-none transition-all duration-150"
            style={{
              backgroundColor: '#F5F0E8',
              border: '1px solid #D2C3AA',
              color: '#1E160E',
              width: 240,
              fontFamily: 'DM Sans, sans-serif',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#5C4A6E';
              e.target.style.boxShadow = '0 0 0 3px rgba(92, 74, 110, 0.12)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#D2C3AA';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>
      </div>

      {/* Main Content: Table + Preview */}
      <div className="flex flex-1 overflow-hidden">
        {/* Request List */}
        <div
          className="flex flex-col overflow-hidden"
          style={{
            width: selectedId ? 480 : '100%',
            borderRight: selectedId ? '1px solid #E4DAC8' : 'none',
            transition: 'width 0.3s ease',
          }}
        >
          <div className="flex-1 overflow-y-auto scrollbar-thin">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
                <Inbox size={40} style={{ color: '#D2C3AA' }} />
                <h3
                  className="font-display text-xl font-medium mt-4"
                  style={{ color: '#5C4A6E' }}
                >
                  No requests found
                </h3>
                <p className="text-sm mt-2" style={{ color: '#8A7A6A' }}>
                  {searchQuery
                    ? `No requests match "${searchQuery}"`
                    : 'Sync Outlook or paste an email to get started'}
                </p>
                {!searchQuery && (
                  <button
                    onClick={() => setShowManualPaste(true)}
                    className="btn-primary mt-4"
                  >
                    <Plus size={15} />
                    Paste Email Manually
                  </button>
                )}
              </div>
            ) : (
              <div>
                {filtered.map((req) => {
                  const StatusIcon = statusConfig[req.status].icon;
                  const isSelected = selectedId === req.id;
                  const isAnalyzing = analyzingIds.has(req.id);

                  return (
                    <div
                      key={req.id}
                      onClick={() => setSelectedId(req.id)}
                      className="flex items-start gap-3 px-4 py-4 cursor-pointer transition-all duration-150 border-b"
                      style={{
                        backgroundColor: isSelected
                          ? 'rgba(92, 74, 110, 0.07)'
                          : 'transparent',
                        borderColor: '#E4DAC8',
                        borderLeft: isSelected
                          ? '3px solid #5C4A6E' :'3px solid transparent',
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected)
                          (e.currentTarget as HTMLElement).style.backgroundColor =
                            'rgba(92, 74, 110, 0.04)';
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected)
                          (e.currentTarget as HTMLElement).style.backgroundColor =
                            'transparent';
                      }}
                    >
                      {/* Source + Urgency indicator */}
                      <div className="flex flex-col items-center gap-1.5 pt-0.5 shrink-0">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                          style={{
                            backgroundColor:
                              req.source === 'outlook' ?'rgba(0, 120, 212, 0.12)' :'rgba(201, 169, 110, 0.15)',
                            color:
                              req.source === 'outlook' ? '#005A9E' : '#7A5A20',
                          }}
                        >
                          {req.guestName
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .slice(0, 2)
                            .toUpperCase()}
                        </div>
                        {req.isUrgent && (
                          <div
                            className="w-2 h-2 rounded-full animate-pulse"
                            style={{ backgroundColor: '#C0392B' }}
                          />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-0.5">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span
                              className="text-sm font-semibold truncate"
                              style={{ color: '#1E160E' }}
                            >
                              {req.guestName}
                            </span>
                            {req.isUrgent && (
                              <span
                                className="badge text-xs shrink-0"
                                style={{
                                  backgroundColor: 'rgba(180, 80, 70, 0.12)',
                                  color: '#8A3028',
                                  padding: '1px 6px',
                                }}
                              >
                                URGENT
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleStar(req.id);
                              }}
                              className="transition-colors duration-150"
                            >
                              <Star
                                size={13}
                                fill={req.isStarred ? '#C9A96E' : 'none'}
                                style={{
                                  color: req.isStarred ? '#C9A96E' : '#D2C3AA',
                                }}
                              />
                            </button>
                            <span
                              className="text-xs"
                              style={{ color: '#B0A090' }}
                            >
                              {formatRelativeTime(req.receivedAt)}
                            </span>
                          </div>
                        </div>

                        <p
                          className="text-xs truncate mb-1.5"
                          style={{ color: '#5C4A6E', fontWeight: 500 }}
                        >
                          {req.subject}
                        </p>

                        <p
                          className="text-xs truncate mb-2"
                          style={{ color: '#8A7A6A' }}
                        >
                          {req.emailBody.split('\n')[2]?.trim() ||
                            req.emailBody.slice(0, 80)}
                        </p>

                        {/* Meta row */}
                        <div className="flex items-center gap-3 flex-wrap">
                          {req.checkIn && req.checkOut && (
                            <span
                              className="flex items-center gap-1 text-xs"
                              style={{ color: '#6A5A4A' }}
                            >
                              <Calendar size={11} />
                              {formatDate(req.checkIn)} → {formatDate(req.checkOut)}
                            </span>
                          )}
                          {req.adults !== null && (
                            <span
                              className="flex items-center gap-1 text-xs"
                              style={{ color: '#6A5A4A' }}
                            >
                              <Users size={11} />
                              {req.adults} adults{req.children ? ` + ${req.children} ch.` : ''}
                            </span>
                          )}
                          {req.nights && (
                            <span
                              className="flex items-center gap-1 text-xs tabular-nums"
                              style={{ color: '#6A5A4A' }}
                            >
                              <Clock size={11} />
                              {req.nights}n
                            </span>
                          )}
                        </div>

                        {/* Status + Source row */}
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2">
                            <span className={statusConfig[req.status].className}>
                              <StatusIcon
                                size={10}
                                className={
                                  req.status === 'analyzing' ?'animate-spin' :''
                                }
                              />
                              {statusConfig[req.status].label}
                            </span>
                            <span
                              className={
                                req.source === 'outlook' ?'badge badge-outlook' :'badge badge-manual'
                              }
                            >
                              {req.source === 'outlook' ? '📨 Outlook' : '📋 Manual'}
                            </span>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-1">
                            {(req.status === 'new') && !isAnalyzing && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAnalyze(req.id);
                                }}
                                className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-all duration-150 hover:scale-105"
                                style={{
                                  backgroundColor: 'rgba(92, 74, 110, 0.1)',
                                  color: '#5C4A6E',
                                }}
                              >
                                <Sparkles size={10} />
                                Analyze
                              </button>
                            )}
                            {req.status === 'ready' && (
                              <a
                                href={`/offer-builder?requestId=${req.id}`}
                                onClick={(e) => e.stopPropagation()}
                                className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-all duration-150 hover:scale-105"
                                style={{
                                  backgroundColor: 'rgba(201, 169, 110, 0.15)',
                                  color: '#7A5A20',
                                }}
                              >
                                <FileText size={10} />
                                Build Offer
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Preview Panel */}
        {selectedRequest && (
          <RequestPreviewPanel
            request={selectedRequest}
            onAnalyze={handleAnalyze}
            onClose={() => setSelectedId(null)}
            isAnalyzing={analyzingIds.has(selectedRequest.id)}
          />
        )}
      </div>

      {/* Manual Paste Modal */}
      {showManualPaste && (
        <ManualPasteModal
          onClose={() => setShowManualPaste(false)}
          onSubmit={handleManualPasteSubmit}
        />
      )}
    </div>
  );
}