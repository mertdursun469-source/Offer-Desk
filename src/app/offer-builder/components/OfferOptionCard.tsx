'use client';
import React, { useState } from 'react';
import { Star, Trash2, ChevronDown, BedDouble, Utensils, Euro, Check,  } from 'lucide-react';
import AppImage from '@/components/ui/AppImage';
import { OfferOption, BoardPlan } from './OfferBuilderClient';

interface RoomType {
  id: string;
  name: string;
  capacity: string;
  imageUrl: string;
  amenities: string[];
  baseRate: number;
}

interface OfferOptionCardProps {
  option: OfferOption;
  roomTypes: RoomType[];
  boardPlans: BoardPlan[];
  nights: number;
  onUpdate: (updates: Partial<OfferOption>) => void;
  onRemove: () => void;
  onToggleHighlight: () => void;
}

export default function OfferOptionCard({
  option,
  roomTypes,
  boardPlans,
  nights,
  onUpdate,
  onRemove,
  onToggleHighlight,
}: OfferOptionCardProps) {
  const [showRoomDropdown, setShowRoomDropdown] = useState(false);
  const [showBoardDropdown, setShowBoardDropdown] = useState(false);

  const total = option.nightlyRate * nights;
  const selectedBoardPlan = boardPlans.find((b) => b.code === option.boardPlan);

  return (
    <div
      className="relative flex flex-col rounded-2xl overflow-hidden transition-all duration-200"
      style={{
        backgroundColor: '#FDFAF5',
        border: option.highlight
          ? '2px solid #C9A96E' :'1px solid #D2C3AA',
        boxShadow: option.highlight
          ? '0 4px 20px rgba(201, 169, 110, 0.2)'
          : '0 1px 4px rgba(30, 22, 14, 0.06)',
      }}
    >
      {/* Highlight Badge */}
      {option.highlight && (
        <div
          className="absolute top-3 left-3 z-10 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
          style={{ backgroundColor: '#C9A96E', color: '#2D2438' }}
        >
          <Star size={10} fill="#2D2438" />
          Recommended
        </div>
      )}

      {/* Room Image */}
      <div className="relative h-44 overflow-hidden">
        <AppImage
          src={option.imageUrl}
          alt={`${option.roomTypeName} room interior view`}
          fill
          className="object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, transparent 50%, rgba(30,22,14,0.5) 100%)',
          }}
        />
        {/* Option Label */}
        <div
          className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg text-xs font-semibold"
          style={{
            backgroundColor: 'rgba(45, 36, 56, 0.85)',
            color: '#DFC08A',
            backdropFilter: 'blur(4px)',
          }}
        >
          {option.label}
        </div>
      </div>

      {/* Card Body */}
      <div className="flex flex-col flex-1 p-4 space-y-4">
        {/* Room Type Selector */}
        <div>
          <label className="section-label block mb-1.5">Room Type</label>
          <div className="relative">
            <button
              onClick={() => {
                setShowRoomDropdown(!showRoomDropdown);
                setShowBoardDropdown(false);
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all duration-150"
              style={{
                backgroundColor: '#F5F0E8',
                border: '1px solid #D2C3AA',
                color: '#1E160E',
              }}
            >
              <div className="flex items-center gap-2">
                <BedDouble size={14} style={{ color: '#5C4A6E' }} />
                <span className="font-medium truncate">{option.roomTypeName}</span>
              </div>
              <ChevronDown size={14} style={{ color: '#8A7A6A' }} />
            </button>

            {showRoomDropdown && (
              <div
                className="absolute top-full left-0 right-0 mt-1 rounded-xl z-20 overflow-hidden animate-slide-up"
                style={{
                  backgroundColor: '#FDFAF5',
                  border: '1px solid #D2C3AA',
                  boxShadow: '0 8px 24px rgba(30, 22, 14, 0.12)',
                }}
              >
                {roomTypes.map((rt) => (
                  <button
                    key={rt.id}
                    onClick={() => {
                      onUpdate({ roomTypeId: rt.id, nightlyRate: rt.baseRate });
                      setShowRoomDropdown(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2.5 text-sm transition-colors duration-100 text-left"
                    style={{ borderBottom: '1px solid #E4DAC8' }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.backgroundColor =
                        'rgba(92, 74, 110, 0.06)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                    }}
                  >
                    <div>
                      <p className="font-medium" style={{ color: '#1E160E' }}>
                        {rt.name}
                      </p>
                      <p className="text-xs" style={{ color: '#8A7A6A' }}>
                        {rt.capacity} · from €{rt.baseRate}/night
                      </p>
                    </div>
                    {option.roomTypeId === rt.id && (
                      <Check size={14} style={{ color: '#5C4A6E' }} />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Board Plan Selector */}
        <div>
          <label className="section-label block mb-1.5">Board Plan</label>
          <div className="relative">
            <button
              onClick={() => {
                setShowBoardDropdown(!showBoardDropdown);
                setShowRoomDropdown(false);
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all duration-150"
              style={{
                backgroundColor: '#F5F0E8',
                border: '1px solid #D2C3AA',
                color: '#1E160E',
              }}
            >
              <div className="flex items-center gap-2">
                <Utensils size={14} style={{ color: '#5C4A6E' }} />
                <span className="font-medium">
                  {selectedBoardPlan?.label ?? option.boardPlan}
                </span>
                <span className="text-xs" style={{ color: '#8A7A6A' }}>
                  · {selectedBoardPlan?.description}
                </span>
              </div>
              <ChevronDown size={14} style={{ color: '#8A7A6A' }} />
            </button>

            {showBoardDropdown && (
              <div
                className="absolute top-full left-0 right-0 mt-1 rounded-xl z-20 overflow-hidden animate-slide-up"
                style={{
                  backgroundColor: '#FDFAF5',
                  border: '1px solid #D2C3AA',
                  boxShadow: '0 8px 24px rgba(30, 22, 14, 0.12)',
                }}
              >
                {boardPlans.map((bp) => (
                  <button
                    key={`bp-${bp.code}`}
                    onClick={() => {
                      onUpdate({ boardPlan: bp.code });
                      setShowBoardDropdown(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2.5 text-sm transition-colors duration-100 text-left"
                    style={{ borderBottom: '1px solid #E4DAC8' }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.backgroundColor =
                        'rgba(92, 74, 110, 0.06)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                    }}
                  >
                    <div>
                      <p className="font-medium" style={{ color: '#1E160E' }}>
                        {bp.label}
                      </p>
                      <p className="text-xs" style={{ color: '#8A7A6A' }}>
                        {bp.description}
                      </p>
                    </div>
                    {option.boardPlan === bp.code && (
                      <Check size={14} style={{ color: '#5C4A6E' }} />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Nightly Rate */}
        <div>
          <label className="section-label block mb-1.5">Nightly Rate (EUR)</label>
          <div className="relative">
            <Euro
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: '#B0A090' }}
            />
            <input
              type="number"
              value={option.nightlyRate}
              onChange={(e) =>
                onUpdate({ nightlyRate: parseFloat(e.target.value) || 0 })
              }
              className="input-field pl-8 tabular-nums"
              min={0}
              step={10}
            />
          </div>
        </div>

        {/* Amenity Tags */}
        <div>
          <label className="section-label block mb-1.5">Room Features</label>
          <div className="flex flex-wrap gap-1.5">
            {option.amenities.map((amenity) => (
              <span
                key={`amenity-${option.id}-${amenity}`}
                className="px-2 py-1 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: 'rgba(92, 74, 110, 0.08)',
                  color: '#5C4A6E',
                }}
              >
                {amenity}
              </span>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="section-label block mb-1.5">Option Notes</label>
          <textarea
            value={option.notes}
            onChange={(e) => onUpdate({ notes: e.target.value })}
            rows={3}
            className="input-field resize-none text-xs leading-relaxed"
            placeholder="Special inclusions, upgrade notes, honeymoon touches…"
          />
        </div>

        {/* Total + Actions */}
        <div
          className="flex items-center justify-between pt-2"
          style={{ borderTop: '1px solid #E4DAC8' }}
        >
          <div>
            <p className="section-label mb-0.5">Total</p>
            <p
              className="font-display text-xl font-semibold tabular-nums"
              style={{ color: '#2D2438' }}
            >
              €{total.toLocaleString()}
            </p>
            <p className="text-xs" style={{ color: '#8A7A6A' }}>
              {nights} nights · €{option.nightlyRate}/night
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onToggleHighlight}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150"
              style={{
                backgroundColor: option.highlight
                  ? 'rgba(201, 169, 110, 0.15)'
                  : 'rgba(92, 74, 110, 0.08)',
                color: option.highlight ? '#7A5A20' : '#5C4A6E',
                border: `1px solid ${option.highlight ? 'rgba(201, 169, 110, 0.3)' : 'transparent'}`,
              }}
              title={option.highlight ? 'Remove recommended badge' : 'Mark as recommended'}
            >
              <Star size={12} fill={option.highlight ? '#C9A96E' : 'none'} />
              {option.highlight ? 'Recommended' : 'Recommend'}
            </button>

            <button
              onClick={onRemove}
              className="p-2 rounded-lg transition-all duration-150"
              style={{ color: '#B0A090' }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor =
                  'rgba(180, 80, 70, 0.1)';
                (e.currentTarget as HTMLElement).style.color = '#8A3028';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                (e.currentTarget as HTMLElement).style.color = '#B0A090';
              }}
              title="Remove this option"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}