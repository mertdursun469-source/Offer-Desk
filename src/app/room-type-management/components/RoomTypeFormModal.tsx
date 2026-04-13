'use client';
import React, { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  AlertCircle,
  Loader2,
  BedDouble,
  Image as ImageIcon,
  Check,
} from 'lucide-react';
import { useForm, useFieldArray } from 'react-hook-form';
import { RoomType, BoardPlanPrice, AvailabilityPeriod } from './RoomTypeManagementClient';

interface RoomTypeFormModalProps {
  room: RoomType | null;
  onClose: () => void;
  onSave: (data: RoomType) => void;
}

const allAmenities = [
  'King Bed', 'Queen Bed', 'Twin Beds', 'Private Balcony', 'Private Terrace',
  'Sea View', 'Garden View', 'Pool View', 'Private Pool', 'Plunge Pool',
  'Marble Bathroom', 'Rain Shower', 'Soaking Tub', 'Outdoor Shower',
  'Living Room', 'Mini Bar', 'Nespresso Machine', 'Espresso Machine',
  'Butler Service', 'Turndown Service', 'Smart TV', 'In-room Safe',
  'Air Conditioning', 'Outdoor Dining', 'BBQ on Request', 'Pillow Menu',
];

const defaultBoardPlans: BoardPlanPrice[] = [
  { code: 'RO', label: 'Room Only', pricePerNight: 0, available: false },
  { code: 'BB', label: 'Bed & Breakfast', pricePerNight: 0, available: false },
  { code: 'HB', label: 'Half Board', pricePerNight: 0, available: false },
  { code: 'FB', label: 'Full Board', pricePerNight: 0, available: false },
  { code: 'AI', label: 'All Inclusive', pricePerNight: 0, available: false },
];

type FormValues = {
  name: string;
  description: string;
  maxAdults: number;
  maxChildren: number;
  totalRooms: number;
  sizeM2: number;
  floorLevel: string;
  view: string;
  isActive: boolean;
  boardPlans: BoardPlanPrice[];
  availability: AvailabilityPeriod[];
  imageUrl: string;
};

export default function RoomTypeFormModal({
  room,
  onClose,
  onSave,
}: RoomTypeFormModalProps) {
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(
    room?.amenities ?? []
  );
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'pricing' | 'availability' | 'images'>('basic');

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = useForm<FormValues>({
    defaultValues: {
      name: room?.name ?? '',
      description: room?.description ?? '',
      maxAdults: room?.maxAdults ?? 2,
      maxChildren: room?.maxChildren ?? 0,
      totalRooms: room?.totalRooms ?? 1,
      sizeM2: room?.sizeM2 ?? 30,
      floorLevel: room?.floorLevel ?? '',
      view: room?.view ?? '',
      isActive: room?.isActive ?? true,
      boardPlans: room?.boardPlans ?? defaultBoardPlans,
      availability: room?.availability ?? [
        {
          id: `av-new-1`,
          label: 'Main Season',
          from: '2026-04-01',
          to: '2026-10-31',
          available: true,
        },
      ],
      imageUrl: room?.images?.[0]?.url ?? '',
    },
  });

  const { fields: availabilityFields, append: appendAvailability, remove: removeAvailability } =
    useFieldArray({ control, name: 'availability' });

  const { fields: boardPlanFields } = useFieldArray({ control, name: 'boardPlans' });

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };

  const onFormSubmit = (data: FormValues) => {
    setIsSaving(true);
    setTimeout(() => {
      const saved: RoomType = {
        id: room?.id ?? `rt-${Date.now()}`,
        name: data.name,
        slug: data.name.toLowerCase().replace(/\s+/g, '-'),
        description: data.description,
        maxAdults: Number(data.maxAdults),
        maxChildren: Number(data.maxChildren),
        totalRooms: Number(data.totalRooms),
        sizeM2: Number(data.sizeM2),
        floorLevel: data.floorLevel,
        view: data.view,
        amenities: selectedAmenities,
        boardPlans: data.boardPlans,
        availability: data.availability,
        images: data.imageUrl
          ? [{ url: data.imageUrl, alt: `${data.name} room view`, isPrimary: true }]
          : room?.images ?? [],
        isActive: data.isActive,
        createdAt: room?.createdAt ?? new Date().toISOString(),
      };
      setIsSaving(false);
      onSave(saved);
    }, 1200);
  };

  const tabs = [
    { key: 'basic', label: 'Basic Info' },
    { key: 'pricing', label: 'Board Plans' },
    { key: 'availability', label: 'Availability' },
    { key: 'images', label: 'Images' },
  ] as const;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      style={{ backgroundColor: 'rgba(30, 22, 14, 0.5)' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="relative flex flex-col rounded-2xl w-full max-w-2xl max-h-[90vh] animate-slide-up"
        style={{
          backgroundColor: '#FDFAF5',
          boxShadow: '0 20px 60px rgba(30, 22, 14, 0.2)',
          border: '1px solid #D2C3AA',
        }}
      >
        {/* Modal Header */}
        <div
          className="flex items-center justify-between px-6 py-5 shrink-0"
          style={{ borderBottom: '1px solid #E4DAC8' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: 'rgba(92, 74, 110, 0.1)' }}
            >
              <BedDouble size={18} style={{ color: '#5C4A6E' }} />
            </div>
            <div>
              <h2
                className="font-display text-xl font-semibold"
                style={{ color: '#2D2438' }}
              >
                {room ? `Edit ${room.name}` : 'New Room Type'}
              </h2>
              <p className="text-xs" style={{ color: '#8A7A6A' }}>
                {room ? 'Update room details, pricing, and availability' : 'Define a new room type for your property'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="btn-ghost p-1.5 rounded-lg">
            <X size={16} />
          </button>
        </div>

        {/* Tabs */}
        <div
          className="flex items-center px-6 shrink-0"
          style={{ borderBottom: '1px solid #E4DAC8' }}
        >
          {tabs.map((tab) => (
            <button
              key={`tab-${tab.key}`}
              onClick={() => setActiveTab(tab.key)}
              className="px-4 py-3 text-sm font-medium transition-all duration-150 border-b-2"
              style={{
                borderBottomColor:
                  activeTab === tab.key ? '#5C4A6E' : 'transparent',
                color: activeTab === tab.key ? '#5C4A6E' : '#8A7A6A',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Form Body */}
        <form
          onSubmit={handleSubmit(onFormSubmit)}
          className="flex flex-col flex-1 overflow-hidden"
        >
          <div className="flex-1 overflow-y-auto scrollbar-thin px-6 py-5 space-y-5">
            {/* ── Basic Info Tab ── */}
            {activeTab === 'basic' && (
              <div className="space-y-5">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: '#3A2E22' }}>
                    Room Type Name <span style={{ color: '#8A3028' }}>*</span>
                  </label>
                  <input
                    type="text"
                    {...register('name', { required: 'Room name is required' })}
                    className="input-field"
                    placeholder="e.g. Infinity Pool Suite"
                  />
                  {errors.name && (
                    <p className="flex items-center gap-1 text-xs mt-1.5" style={{ color: '#8A3028' }}>
                      <AlertCircle size={11} />
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: '#3A2E22' }}>
                    Description
                  </label>
                  <p className="text-xs mb-2" style={{ color: '#8A7A6A' }}>
                    Appears in the offer PDF and guest-facing materials
                  </p>
                  <textarea
                    {...register('description')}
                    rows={4}
                    className="input-field resize-none"
                    placeholder="Describe the room's character, views, and highlights…"
                  />
                </div>

                {/* Capacity Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: '#3A2E22' }}>
                      Max Adults <span style={{ color: '#8A3028' }}>*</span>
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      {...register('maxAdults', { required: true, min: 1 })}
                      className="input-field tabular-nums"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: '#3A2E22' }}>
                      Max Children
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={5}
                      {...register('maxChildren')}
                      className="input-field tabular-nums"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: '#3A2E22' }}>
                      Total Rooms <span style={{ color: '#8A3028' }}>*</span>
                    </label>
                    <input
                      type="number"
                      min={1}
                      {...register('totalRooms', { required: true, min: 1 })}
                      className="input-field tabular-nums"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: '#3A2E22' }}>
                      Size (m²)
                    </label>
                    <input
                      type="number"
                      min={1}
                      {...register('sizeM2')}
                      className="input-field tabular-nums"
                    />
                  </div>
                </div>

                {/* Floor & View */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: '#3A2E22' }}>
                      Floor Level
                    </label>
                    <input
                      type="text"
                      {...register('floorLevel')}
                      className="input-field"
                      placeholder="e.g. 3rd–5th floor"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: '#3A2E22' }}>
                      View
                    </label>
                    <input
                      type="text"
                      {...register('view')}
                      className="input-field"
                      placeholder="e.g. Full Sea View"
                    />
                  </div>
                </div>

                {/* Amenities */}
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: '#3A2E22' }}>
                    Amenities
                  </label>
                  <p className="text-xs mb-2.5" style={{ color: '#8A7A6A' }}>
                    Select all that apply — shown in the offer PDF
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {allAmenities.map((amenity) => {
                      const selected = selectedAmenities.includes(amenity);
                      return (
                        <button
                          key={`amenity-toggle-${amenity}`}
                          type="button"
                          onClick={() => toggleAmenity(amenity)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150"
                          style={{
                            backgroundColor: selected
                              ? '#5C4A6E' :'rgba(92,74,110,0.08)',
                            color: selected ? '#FDFAF5' : '#5C4A6E',
                            border: `1px solid ${selected ? '#5C4A6E' : 'transparent'}`,
                          }}
                        >
                          {selected && <Check size={10} />}
                          {amenity}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Active Toggle */}
                <div className="flex items-center justify-between py-3 px-4 rounded-xl" style={{ backgroundColor: '#F5F0E8', border: '1px solid #E4DAC8' }}>
                  <div>
                    <p className="text-sm font-medium" style={{ color: '#1E160E' }}>
                      Active — Available for Offers
                    </p>
                    <p className="text-xs" style={{ color: '#8A7A6A' }}>
                      Inactive room types won't appear in the Offer Builder
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      {...register('isActive')}
                      className="sr-only peer"
                    />
                    <div
                      className="w-11 h-6 rounded-full peer transition-all duration-200 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all after:duration-200"
                      style={{
                        backgroundColor: watch('isActive') ? '#5C4A6E' : '#D2C3AA',
                      }}
                    />
                  </label>
                </div>
              </div>
            )}

            {/* ── Board Plans Tab ── */}
            {activeTab === 'pricing' && (
              <div className="space-y-4">
                <div
                  className="rounded-xl p-4"
                  style={{ backgroundColor: 'rgba(92,74,110,0.05)', border: '1px solid rgba(92,74,110,0.12)' }}
                >
                  <p className="text-xs" style={{ color: '#5C4A6E' }}>
                    Set nightly rates for each board plan. Toggle availability to control which plans appear in the Offer Builder.
                  </p>
                </div>

                <div className="space-y-3">
                  {boardPlanFields.map((field, index) => (
                    <div
                      key={field.id}
                      className="flex items-center gap-4 px-4 py-3 rounded-xl"
                      style={{
                        backgroundColor: '#F5F0E8',
                        border: '1px solid #E4DAC8',
                      }}
                    >
                      <div className="w-24 shrink-0">
                        <p className="text-sm font-semibold" style={{ color: '#1E160E' }}>
                          {field.label}
                        </p>
                        <p className="text-xs" style={{ color: '#8A7A6A' }}>
                          {field.code}
                        </p>
                      </div>

                      <div className="flex-1">
                        <label className="section-label block mb-1">
                          Price per night (€)
                        </label>
                        <div className="relative">
                          <span
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-sm"
                            style={{ color: '#B0A090' }}
                          >
                            €
                          </span>
                          <input
                            type="number"
                            min={0}
                            step={10}
                            {...register(`boardPlans.${index}.pricePerNight` as const)}
                            className="input-field pl-7 tabular-nums"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col items-center gap-1 shrink-0">
                        <label className="section-label">Available</label>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            {...register(`boardPlans.${index}.available` as const)}
                            className="sr-only peer"
                          />
                          <div
                            className="w-9 h-5 rounded-full transition-all duration-200 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all after:duration-200"
                            style={{
                              backgroundColor: watch(`boardPlans.${index}.available`)
                                ? '#5C4A6E' :'#D2C3AA',
                            }}
                          />
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Availability Tab ── */}
            {activeTab === 'availability' && (
              <div className="space-y-4">
                <div
                  className="rounded-xl p-4"
                  style={{ backgroundColor: 'rgba(92,74,110,0.05)', border: '1px solid rgba(92,74,110,0.12)' }}
                >
                  <p className="text-xs" style={{ color: '#5C4A6E' }}>
                    Define seasonal availability periods. Unavailable periods will show as blocked when building offers. Note: live availability sync from your website requires backend integration.
                  </p>
                </div>

                <div className="space-y-3">
                  {availabilityFields.map((field, index) => (
                    <div
                      key={field.id}
                      className="flex items-end gap-3 px-4 py-3 rounded-xl"
                      style={{ backgroundColor: '#F5F0E8', border: '1px solid #E4DAC8' }}
                    >
                      <div className="flex-1">
                        <label className="section-label block mb-1">Period Label</label>
                        <input
                          type="text"
                          {...register(`availability.${index}.label` as const)}
                          className="input-field"
                          placeholder="e.g. Summer Peak"
                        />
                      </div>
                      <div className="w-32">
                        <label className="section-label block mb-1">From</label>
                        <input
                          type="date"
                          {...register(`availability.${index}.from` as const)}
                          className="input-field text-xs"
                        />
                      </div>
                      <div className="w-32">
                        <label className="section-label block mb-1">To</label>
                        <input
                          type="date"
                          {...register(`availability.${index}.to` as const)}
                          className="input-field text-xs"
                        />
                      </div>
                      <div className="flex flex-col items-center gap-1 shrink-0">
                        <label className="section-label">Open</label>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            {...register(`availability.${index}.available` as const)}
                            className="sr-only peer"
                          />
                          <div
                            className="w-9 h-5 rounded-full transition-all duration-200 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all after:duration-200"
                            style={{
                              backgroundColor: watch(`availability.${index}.available`)
                                ? '#3A6A4A' :'#D2C3AA',
                            }}
                          />
                        </label>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeAvailability(index)}
                        className="p-1.5 rounded-lg mb-0.5 transition-all duration-150"
                        style={{ color: '#B0A090' }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLElement).style.color = '#8A3028';
                          (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(180,80,70,0.1)';
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.color = '#B0A090';
                          (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                        }}
                        title="Remove this period"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() =>
                    appendAvailability({
                      id: `av-new-${Date.now()}`,
                      label: '',
                      from: '',
                      to: '',
                      available: true,
                    })
                  }
                  className="btn-secondary w-full justify-center"
                >
                  <Plus size={14} />
                  Add Availability Period
                </button>
              </div>
            )}

            {/* ── Images Tab ── */}
            {activeTab === 'images' && (
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: '#3A2E22' }}>
                    Primary Image URL
                  </label>
                  <p className="text-xs mb-2" style={{ color: '#8A7A6A' }}>
                    Enter a URL for the main room image. Shown in the offer PDF and room type card.
                  </p>
                  <input
                    type="url"
                    {...register('imageUrl')}
                    className="input-field"
                    placeholder="https://…"
                  />
                </div>

                {watch('imageUrl') && (
                  <div className="relative h-48 rounded-xl overflow-hidden">
                    <img
                      src={watch('imageUrl')}
                      alt="Room preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}

                <div
                  className="rounded-xl p-5 flex flex-col items-center justify-center gap-3 border-2 border-dashed"
                  style={{ borderColor: '#D2C3AA', minHeight: 120 }}
                >
                  <ImageIcon size={24} style={{ color: '#D2C3AA' }} />
                  <p className="text-sm text-center" style={{ color: '#B0A090' }}>
                    Additional image upload via file system requires backend integration
                  </p>
                </div>
              </div>
            )}
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
              disabled={isSaving}
              className="btn-primary"
              style={{ minWidth: 140 }}
            >
              {isSaving ? (
                <Loader2 size={15} className="animate-spin" />
              ) : null}
              {isSaving ? 'Saving…' : room ? 'Save Changes' : 'Create Room Type'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}