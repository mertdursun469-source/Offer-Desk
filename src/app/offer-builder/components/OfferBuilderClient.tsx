'use client';
import React, { useState } from 'react';
import { Plus, Send, Eye, Link2, Copy, CheckCircle, Loader2, Sparkles, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

import OfferOptionCard from './OfferOptionCard';
import SendOfferModal from './SendOfferModal';
import OfferPreviewModal from './OfferPreviewModal';

export interface BoardPlan {
  code: 'RO' | 'BB' | 'HB' | 'FB' | 'AI';
  label: string;
  description: string;
}

export const boardPlans: BoardPlan[] = [
{ code: 'RO', label: 'Room Only', description: 'No meals included' },
{ code: 'BB', label: 'Bed & Breakfast', description: 'Breakfast included' },
{ code: 'HB', label: 'Half Board', description: 'Breakfast + dinner' },
{ code: 'FB', label: 'Full Board', description: 'All meals included' },
{ code: 'AI', label: 'All Inclusive', description: 'All meals + drinks' }];


export interface OfferOption {
  id: string;
  label: string;
  roomTypeId: string;
  roomTypeName: string;
  boardPlan: BoardPlan['code'];
  nightlyRate: number;
  currency: 'EUR' | 'USD' | 'TRY';
  totalNights: number;
  notes: string;
  highlight: boolean;
  imageUrl: string;
  capacity: string;
  amenities: string[];
}

export interface OfferFormData {
  validUntil: string;
  personalMessage: string;
  internalNote: string;
  options: OfferOption[];
}

// Mock request summary — Backend integration: GET /api/reservation-requests/:id
const mockRequest = {
  id: 'req-001',
  guestName: 'Sophie Beaumont',
  guestEmail: 'sophie.beaumont@gmail.com',
  checkIn: '2026-06-14',
  checkOut: '2026-06-21',
  adults: 2,
  children: 0,
  nights: 7,
  roomPreference: 'Suite or Villa with private pool / sea view',
  specialRequests: 'Honeymoon arrangements',
  budget: '€3,500–4,500',
  subject: 'Reservation Inquiry – Honeymoon Stay, June 2026'
};

// Mock room types — Backend integration: GET /api/room-types
const mockRoomTypes = [
{
  id: 'rt-001',
  name: 'Deluxe Sea View Room',
  capacity: '2 adults',
  imageUrl: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&q=80',
  amenities: ['Sea View', 'King Bed', 'Balcony', 'Marble Bath'],
  baseRate: 320
},
{
  id: 'rt-002',
  name: 'Junior Suite',
  capacity: '2 adults + 1 child',
  imageUrl: "https://img.rocket.new/generatedImages/rocket_gen_img_11586d3d5-1775098514554.png",
  amenities: ['Sea View', 'Lounge Area', 'Soaking Tub', 'Private Terrace'],
  baseRate: 480
},
{
  id: 'rt-003',
  name: 'Infinity Pool Suite',
  capacity: '2 adults',
  imageUrl: "https://img.rocket.new/generatedImages/rocket_gen_img_1f060e174-1776073745222.png",
  amenities: ['Private Pool', 'Sea View', 'Butler Service', 'Outdoor Shower'],
  baseRate: 680
},
{
  id: 'rt-004',
  name: 'Garden Villa',
  capacity: '2 adults + 2 children',
  imageUrl: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&q=80',
  amenities: ['Private Garden', 'Plunge Pool', 'Outdoor Dining', 'Living Room'],
  baseRate: 820
}];


function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

export default function OfferBuilderClient() {
  const [options, setOptions] = useState<OfferOption[]>([
  {
    id: 'opt-001',
    label: 'Option A',
    roomTypeId: 'rt-002',
    roomTypeName: 'Junior Suite',
    boardPlan: 'HB',
    nightlyRate: 520,
    currency: 'EUR',
    totalNights: 7,
    notes: 'Includes welcome fruit basket and champagne on arrival. Daily turndown service.',
    highlight: false,
    imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&q=80',
    capacity: '2 adults + 1 child',
    amenities: ['Sea View', 'Lounge Area', 'Soaking Tub', 'Private Terrace']
  },
  {
    id: 'opt-002',
    label: 'Option B',
    roomTypeId: 'rt-003',
    roomTypeName: 'Infinity Pool Suite',
    boardPlan: 'BB',
    nightlyRate: 720,
    currency: 'EUR',
    totalNights: 7,
    notes: 'Exclusive private pool, dedicated butler, romantic dinner setup on arrival night.',
    highlight: true,
    imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&q=80',
    capacity: '2 adults',
    amenities: ['Private Pool', 'Sea View', 'Butler Service', 'Outdoor Shower']
  }]
  );

  const [validUntil, setValidUntil] = useState('2026-04-20');
  const [personalMessage, setPersonalMessage] = useState(
    `Dear Sophie,\n\nThank you so much for considering us for your honeymoon. We are absolutely delighted to present two curated options that we believe will create an unforgettable experience for you and your partner.\n\nWe look forward to welcoming you.\n\nWarm regards,\nAyşe Kaya\nReservations Manager`
  );
  const [showSendModal, setShowSendModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleAddOption = () => {
    if (options.length >= 4) {
      toast.error('Maximum 4 options per offer');
      return;
    }
    const labels = ['A', 'B', 'C', 'D'];
    const nextLabel = `Option ${labels[options.length]}`;
    const newOption: OfferOption = {
      id: `opt-${Date.now()}`,
      label: nextLabel,
      roomTypeId: mockRoomTypes[0].id,
      roomTypeName: mockRoomTypes[0].name,
      boardPlan: 'BB',
      nightlyRate: mockRoomTypes[0].baseRate,
      currency: 'EUR',
      totalNights: mockRequest.nights,
      notes: '',
      highlight: false,
      imageUrl: mockRoomTypes[0].imageUrl,
      capacity: mockRoomTypes[0].capacity,
      amenities: mockRoomTypes[0].amenities
    };
    setOptions((prev) => [...prev, newOption]);
  };

  const handleRemoveOption = (id: string) => {
    if (options.length <= 1) {
      toast.error('Offer must have at least one option');
      return;
    }
    setOptions((prev) => prev.filter((o) => o.id !== id));
    toast.success('Option removed');
  };

  const handleUpdateOption = (id: string, updates: Partial<OfferOption>) => {
    setOptions((prev) =>
    prev.map((o) => {
      if (o.id !== id) return o;
      const roomType = mockRoomTypes.find(
        (rt) => rt.id === (updates.roomTypeId ?? o.roomTypeId)
      );
      return {
        ...o,
        ...updates,
        roomTypeName: roomType?.name ?? o.roomTypeName,
        imageUrl: roomType?.imageUrl ?? o.imageUrl,
        capacity: roomType?.capacity ?? o.capacity,
        amenities: roomType?.amenities ?? o.amenities
      };
    })
    );
  };

  const handleToggleHighlight = (id: string) => {
    setOptions((prev) =>
    prev.map((o) => ({ ...o, highlight: o.id === id ? !o.highlight : false }))
    );
  };

  // Backend integration: POST /api/offers (save draft)
  const handleSaveDraft = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Offer draft saved');
    }, 1200);
  };

  // Backend integration: POST /api/offers/:id/share-link
  const handleGenerateLink = () => {
    const link = `https://offerdesk.app/offer/preview/abc123xyz`;
    setShareLink(link);
    toast.success('Shareable link generated');
  };

  const handleCopyLink = () => {
    if (shareLink) {
      navigator.clipboard.writeText(shareLink).then(() => {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
        toast.success('Link copied to clipboard');
      });
    }
  };

  const totalMin = Math.min(...options.map((o) => o.nightlyRate * o.totalNights));
  const totalMax = Math.max(...options.map((o) => o.nightlyRate * o.totalNights));

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: '#F5F0E8' }}>
      {/* Header */}
      <div
        className="flex items-center justify-between px-6 py-4 shrink-0"
        style={{
          backgroundColor: '#FDFAF5',
          borderBottom: '1px solid #E4DAC8'
        }}>
        
        <div className="flex items-center gap-4">
          <a
            href="/request-inbox"
            className="btn-ghost p-2 rounded-lg"
            aria-label="Back to inbox">
            
            <ArrowLeft size={16} />
          </a>
          <div>
            <h1
              className="font-display text-2xl font-semibold"
              style={{ color: '#2D2438' }}>
              
              Offer Builder
            </h1>
            <p className="text-sm mt-0.5" style={{ color: '#8A7A6A' }}>
              Building offer for{' '}
              <span className="font-medium" style={{ color: '#5C4A6E' }}>
                {mockRequest.guestName}
              </span>{' '}
              · {mockRequest.nights} nights · {formatDate(mockRequest.checkIn)} –{' '}
              {formatDate(mockRequest.checkOut)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={handleSaveDraft} disabled={isSaving} className="btn-ghost">
            {isSaving ? <Loader2 size={15} className="animate-spin" /> : null}
            {isSaving ? 'Saving…' : 'Save Draft'}
          </button>
          <button
            onClick={() => setShowPreview(true)}
            className="btn-secondary">
            
            <Eye size={15} />
            Preview PDF
          </button>
          <button
            onClick={() => setShowSendModal(true)}
            className="btn-primary">
            
            <Send size={15} />
            Send to Guest
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Request Summary + Offer Settings */}
        <div
          className="flex flex-col overflow-y-auto scrollbar-thin shrink-0"
          style={{
            width: 320,
            borderRight: '1px solid #E4DAC8',
            backgroundColor: '#FDFAF5'
          }}>
          
          {/* Request Summary */}
          <div className="px-5 py-5">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={14} style={{ color: '#5C4A6E' }} />
              <p className="section-label" style={{ color: '#5C4A6E' }}>
                Request Summary
              </p>
            </div>

            <div
              className="rounded-xl p-4 space-y-3"
              style={{
                backgroundColor: 'rgba(92, 74, 110, 0.05)',
                border: '1px solid rgba(92, 74, 110, 0.12)'
              }}>
              
              <div className="flex items-center gap-2.5">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                  style={{ backgroundColor: '#C9A96E', color: '#2D2438' }}>
                  
                  {mockRequest.guestName.
                  split(' ').
                  map((n) => n[0]).
                  join('')}
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: '#1E160E' }}>
                    {mockRequest.guestName}
                  </p>
                  <p className="text-xs" style={{ color: '#8A7A6A' }}>
                    {mockRequest.guestEmail}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <p className="section-label mb-0.5">Check-in</p>
                  <p className="text-xs font-medium" style={{ color: '#1E160E' }}>
                    {formatDate(mockRequest.checkIn)}
                  </p>
                </div>
                <div>
                  <p className="section-label mb-0.5">Check-out</p>
                  <p className="text-xs font-medium" style={{ color: '#1E160E' }}>
                    {formatDate(mockRequest.checkOut)}
                  </p>
                </div>
                <div>
                  <p className="section-label mb-0.5">Guests</p>
                  <p className="text-xs font-medium" style={{ color: '#1E160E' }}>
                    {mockRequest.adults} adults
                  </p>
                </div>
                <div>
                  <p className="section-label mb-0.5">Nights</p>
                  <p className="text-xs font-medium tabular-nums" style={{ color: '#1E160E' }}>
                    {mockRequest.nights}
                  </p>
                </div>
              </div>

              {mockRequest.roomPreference &&
              <div className="pt-1">
                  <p className="section-label mb-0.5">Room Preference</p>
                  <p className="text-xs" style={{ color: '#3A2E22' }}>
                    {mockRequest.roomPreference}
                  </p>
                </div>
              }

              {mockRequest.specialRequests &&
              <div>
                  <p className="section-label mb-0.5">Special Requests</p>
                  <p className="text-xs" style={{ color: '#3A2E22' }}>
                    {mockRequest.specialRequests}
                  </p>
                </div>
              }

              {mockRequest.budget &&
              <div>
                  <p className="section-label mb-0.5">Budget</p>
                  <p className="text-xs font-medium" style={{ color: '#3A2E22' }}>
                    {mockRequest.budget}
                  </p>
                </div>
              }
            </div>
          </div>

          {/* Divider */}
          <div style={{ borderTop: '1px solid #E4DAC8' }} />

          {/* Offer Settings */}
          <div className="px-5 py-5 space-y-5">
            <p className="section-label" style={{ color: '#5C4A6E' }}>
              Offer Settings
            </p>

            {/* Validity */}
            <div>
              <label
                className="block text-sm font-medium mb-1.5"
                style={{ color: '#3A2E22' }}>
                
                Offer Valid Until
              </label>
              <p className="text-xs mb-2" style={{ color: '#8A7A6A' }}>
                Guest must respond by this date
              </p>
              <input
                type="date"
                value={validUntil}
                onChange={(e) => setValidUntil(e.target.value)}
                className="input-field"
                min="2026-04-13" />
              
            </div>

            {/* Personal Message */}
            <div>
              <label
                className="block text-sm font-medium mb-1.5"
                style={{ color: '#3A2E22' }}>
                
                Personal Message
              </label>
              <p className="text-xs mb-2" style={{ color: '#8A7A6A' }}>
                Appears at the top of the offer PDF and email
              </p>
              <textarea
                value={personalMessage}
                onChange={(e) => setPersonalMessage(e.target.value)}
                rows={8}
                className="input-field resize-none text-xs leading-relaxed"
                placeholder="Write a personal message to the guest…" />
              
            </div>

            {/* Price Summary */}
            <div
              className="rounded-xl p-4"
              style={{
                backgroundColor: 'rgba(201, 169, 110, 0.08)',
                border: '1px solid rgba(201, 169, 110, 0.25)'
              }}>
              
              <p className="section-label mb-2" style={{ color: '#7A5A20' }}>
                Offer Price Range
              </p>
              <p
                className="font-display text-2xl font-semibold tabular-nums"
                style={{ color: '#2D2438' }}>
                
                €{totalMin.toLocaleString()} – €{totalMax.toLocaleString()}
              </p>
              <p className="text-xs mt-1" style={{ color: '#8A7A6A' }}>
                Total across {options.length} option{options.length !== 1 ? 's' : ''} ·{' '}
                {mockRequest.nights} nights
              </p>
            </div>

            {/* Share Link */}
            <div>
              <p className="section-label mb-2" style={{ color: '#5C4A6E' }}>
                Shareable Link
              </p>
              {shareLink ?
              <div className="space-y-2">
                  <div
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs truncate"
                  style={{
                    backgroundColor: '#F5F0E8',
                    border: '1px solid #D2C3AA',
                    color: '#5C4A6E'
                  }}>
                  
                    <Link2 size={12} style={{ flexShrink: 0 }} />
                    <span className="truncate">{shareLink}</span>
                  </div>
                  <button
                  onClick={handleCopyLink}
                  className="btn-secondary w-full justify-center text-xs py-2">
                  
                    {copiedLink ?
                  <CheckCircle size={13} /> :

                  <Copy size={13} />
                  }
                    {copiedLink ? 'Copied!' : 'Copy Link'}
                  </button>
                </div> :

              <button
                onClick={handleGenerateLink}
                className="btn-secondary w-full justify-center text-sm">
                
                  <Link2 size={14} />
                  Generate Share Link
                </button>
              }
            </div>
          </div>
        </div>

        {/* Right: Offer Canvas */}
        <div className="flex-1 overflow-y-auto scrollbar-thin px-6 py-5">
          <div className="max-w-screen-xl mx-auto">
            {/* Canvas Header */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2
                  className="font-display text-xl font-semibold"
                  style={{ color: '#2D2438' }}>
                  
                  Offer Options
                </h2>
                <p className="text-sm mt-0.5" style={{ color: '#8A7A6A' }}>
                  {options.length} option{options.length !== 1 ? 's' : ''} · Add up to 4
                </p>
              </div>
              <button
                onClick={handleAddOption}
                disabled={options.length >= 4}
                className="btn-primary">
                
                <Plus size={15} />
                Add Option
              </button>
            </div>

            {/* Options Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2 gap-5">
              {options.map((option) =>
              <OfferOptionCard
                key={option.id}
                option={option}
                roomTypes={mockRoomTypes}
                boardPlans={boardPlans}
                nights={mockRequest.nights}
                onUpdate={(updates) => handleUpdateOption(option.id, updates)}
                onRemove={() => handleRemoveOption(option.id)}
                onToggleHighlight={() => handleToggleHighlight(option.id)} />

              )}

              {/* Add Option Placeholder */}
              {options.length < 4 &&
              <button
                onClick={handleAddOption}
                className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed transition-all duration-150 min-h-64"
                style={{
                  borderColor: '#D2C3AA',
                  color: '#B0A090'
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = '#5C4A6E';
                  (e.currentTarget as HTMLElement).style.backgroundColor =
                  'rgba(92, 74, 110, 0.03)';
                  (e.currentTarget as HTMLElement).style.color = '#5C4A6E';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = '#D2C3AA';
                  (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                  (e.currentTarget as HTMLElement).style.color = '#B0A090';
                }}>
                
                  <Plus size={24} />
                  <span className="text-sm font-medium">
                    Add Option {['A', 'B', 'C', 'D'][options.length]}
                  </span>
                </button>
              }
            </div>

            {/* Bottom Actions */}
            <div
              className="flex items-center justify-between mt-8 pt-6"
              style={{ borderTop: '1px solid #E4DAC8' }}>
              
              <p className="text-sm" style={{ color: '#8A7A6A' }}>
                Offer will be sent as a branded PDF with a shareable web link
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowPreview(true)}
                  className="btn-secondary">
                  
                  <Eye size={15} />
                  Preview
                </button>
                <button
                  onClick={() => setShowSendModal(true)}
                  className="btn-primary">
                  
                  <Send size={15} />
                  Send to {mockRequest.guestName.split(' ')[0]}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showSendModal &&
      <SendOfferModal
        guestName={mockRequest.guestName}
        guestEmail={mockRequest.guestEmail}
        optionCount={options.length}
        shareLink={shareLink}
        onClose={() => setShowSendModal(false)}
        onSend={() => {
          setShowSendModal(false);
          toast.success(`Offer sent to ${mockRequest.guestEmail}`);
        }} />

      }

      {showPreview &&
      <OfferPreviewModal
        request={mockRequest}
        options={options}
        personalMessage={personalMessage}
        validUntil={validUntil}
        onClose={() => setShowPreview(false)} />

      }
    </div>);

}