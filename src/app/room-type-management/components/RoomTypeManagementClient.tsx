'use client';
import React, { useState } from 'react';
import { BedDouble, Plus, Search, Grid3X3, List, Edit2, Trash2, Copy, Eye, Users, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import AppImage from '@/components/ui/AppImage';
import RoomTypeFormModal from './RoomTypeFormModal';
import DeleteConfirmModal from './DeleteConfirmModal';

export type BoardPlanCode = 'RO' | 'BB' | 'HB' | 'FB' | 'AI';

export interface BoardPlanPrice {
  code: BoardPlanCode;
  label: string;
  pricePerNight: number;
  available: boolean;
}

export interface AvailabilityPeriod {
  id: string;
  label: string;
  from: string;
  to: string;
  available: boolean;
}

export interface RoomType {
  id: string;
  name: string;
  slug: string;
  description: string;
  maxAdults: number;
  maxChildren: number;
  totalRooms: number;
  sizeM2: number;
  floorLevel: string;
  view: string;
  amenities: string[];
  boardPlans: BoardPlanPrice[];
  availability: AvailabilityPeriod[];
  images: {url: string;alt: string;isPrimary: boolean;}[];
  isActive: boolean;
  createdAt: string;
}

// Backend integration: GET /api/room-types
const mockRoomTypes: RoomType[] = [
{
  id: 'rt-001',
  name: 'Deluxe Sea View Room',
  slug: 'deluxe-sea-view',
  description:
  'A beautifully appointed room with panoramic sea views, featuring a private balcony, king-size bed, and marble en-suite bathroom. Ideal for couples seeking refined comfort.',
  maxAdults: 2,
  maxChildren: 1,
  totalRooms: 12,
  sizeM2: 42,
  floorLevel: '3rd–5th floor',
  view: 'Full Sea View',
  amenities: [
  'King Bed',
  'Private Balcony',
  'Marble Bathroom',
  'Rain Shower',
  'Sea View',
  'Mini Bar',
  'Nespresso Machine',
  'Air Conditioning',
  'In-room Safe',
  'Smart TV'],

  boardPlans: [
  { code: 'RO', label: 'Room Only', pricePerNight: 280, available: true },
  { code: 'BB', label: 'Bed & Breakfast', pricePerNight: 320, available: true },
  { code: 'HB', label: 'Half Board', pricePerNight: 390, available: true },
  { code: 'FB', label: 'Full Board', pricePerNight: 460, available: false },
  { code: 'AI', label: 'All Inclusive', pricePerNight: 520, available: false }],

  availability: [
  { id: 'av-001-1', label: 'Spring Season', from: '2026-03-01', to: '2026-05-31', available: true },
  { id: 'av-001-2', label: 'Summer Peak', from: '2026-06-01', to: '2026-08-31', available: true },
  { id: 'av-001-3', label: 'Autumn', from: '2026-09-01', to: '2026-11-30', available: true },
  { id: 'av-001-4', label: 'Winter Closure', from: '2026-12-01', to: '2027-02-28', available: false }],

  images: [
  {
    url: "https://img.rocket.new/generatedImages/rocket_gen_img_19b18aa6e-1772724374356.png",
    alt: 'Deluxe sea view room with king bed and panoramic ocean view through floor-to-ceiling windows',
    isPrimary: true
  },
  {
    url: "https://images.unsplash.com/photo-1517851272568-25633b09af92",
    alt: 'Private balcony with two chairs overlooking the sea at sunset',
    isPrimary: false
  }],

  isActive: true,
  createdAt: '2025-11-10T10:00:00Z'
},
{
  id: 'rt-002',
  name: 'Junior Suite',
  slug: 'junior-suite',
  description:
  'A spacious suite with a separate lounge area, soaking tub, and private terrace. Blends contemporary design with natural materials for an elevated stay experience.',
  maxAdults: 2,
  maxChildren: 2,
  totalRooms: 8,
  sizeM2: 68,
  floorLevel: '4th–6th floor',
  view: 'Sea & Garden View',
  amenities: [
  'King Bed',
  'Separate Lounge',
  'Private Terrace',
  'Soaking Tub',
  'Walk-in Shower',
  'Sea View',
  'Butler on Request',
  'Espresso Machine',
  'Turndown Service',
  'Smart TV',
  'Mini Bar'],

  boardPlans: [
  { code: 'RO', label: 'Room Only', pricePerNight: 420, available: true },
  { code: 'BB', label: 'Bed & Breakfast', pricePerNight: 480, available: true },
  { code: 'HB', label: 'Half Board', pricePerNight: 560, available: true },
  { code: 'FB', label: 'Full Board', pricePerNight: 640, available: true },
  { code: 'AI', label: 'All Inclusive', pricePerNight: 720, available: false }],

  availability: [
  { id: 'av-002-1', label: 'Spring Season', from: '2026-03-01', to: '2026-05-31', available: true },
  { id: 'av-002-2', label: 'Summer Peak', from: '2026-06-01', to: '2026-08-31', available: true },
  { id: 'av-002-3', label: 'Autumn', from: '2026-09-01', to: '2026-11-30', available: true },
  { id: 'av-002-4', label: 'Winter Closure', from: '2026-12-01', to: '2027-02-28', available: false }],

  images: [
  {
    url: "https://img.rocket.new/generatedImages/rocket_gen_img_16cbd4645-1776073742580.png",
    alt: 'Junior suite living area with cream sofa, terrace doors open to sea view',
    isPrimary: true
  }],

  isActive: true,
  createdAt: '2025-11-10T10:00:00Z'
},
{
  id: 'rt-003',
  name: 'Infinity Pool Suite',
  slug: 'infinity-pool-suite',
  description:
  'The ultimate indulgence — a private infinity pool suite perched above the coastline with unobstructed sea views, dedicated butler service, and an outdoor rain shower.',
  maxAdults: 2,
  maxChildren: 0,
  totalRooms: 4,
  sizeM2: 110,
  floorLevel: 'Top floor / Penthouse',
  view: 'Panoramic Sea View',
  amenities: [
  'Private Infinity Pool',
  'King Bed',
  'Butler Service',
  'Outdoor Rain Shower',
  'Sea View',
  'Outdoor Dining',
  'Champagne on Arrival',
  'Turndown Service',
  'Espresso Machine',
  'Smart TV',
  'Pillow Menu'],

  boardPlans: [
  { code: 'RO', label: 'Room Only', pricePerNight: 580, available: true },
  { code: 'BB', label: 'Bed & Breakfast', pricePerNight: 680, available: true },
  { code: 'HB', label: 'Half Board', pricePerNight: 780, available: true },
  { code: 'FB', label: 'Full Board', pricePerNight: 880, available: true },
  { code: 'AI', label: 'All Inclusive', pricePerNight: 980, available: true }],

  availability: [
  { id: 'av-003-1', label: 'Spring Season', from: '2026-03-01', to: '2026-05-31', available: true },
  { id: 'av-003-2', label: 'Summer Peak', from: '2026-06-01', to: '2026-08-31', available: true },
  { id: 'av-003-3', label: 'Autumn', from: '2026-09-01', to: '2026-11-30', available: true },
  { id: 'av-003-4', label: 'Winter', from: '2026-12-01', to: '2027-02-28', available: true }],

  images: [
  {
    url: "https://img.rocket.new/generatedImages/rocket_gen_img_19d716a61-1773096446705.png",
    alt: 'Infinity pool suite with private pool overflowing to sea horizon at golden hour',
    isPrimary: true
  }],

  isActive: true,
  createdAt: '2025-11-10T10:00:00Z'
},
{
  id: 'rt-004',
  name: 'Garden Villa',
  slug: 'garden-villa',
  description:
  'A private villa set within lush gardens, featuring a plunge pool, outdoor dining area, and a spacious living room. Perfect for families or guests seeking complete privacy.',
  maxAdults: 4,
  maxChildren: 3,
  totalRooms: 3,
  sizeM2: 180,
  floorLevel: 'Ground level',
  view: 'Private Garden & Partial Sea',
  amenities: [
  'Private Plunge Pool',
  'King Bed + Twin Room',
  'Outdoor Dining',
  'Living Room',
  'Private Garden',
  'Butler Service',
  'BBQ on Request',
  'Outdoor Shower',
  'Smart TV',
  'Fully Stocked Mini Bar'],

  boardPlans: [
  { code: 'RO', label: 'Room Only', pricePerNight: 720, available: true },
  { code: 'BB', label: 'Bed & Breakfast', pricePerNight: 820, available: true },
  { code: 'HB', label: 'Half Board', pricePerNight: 960, available: true },
  { code: 'FB', label: 'Full Board', pricePerNight: 1100, available: true },
  { code: 'AI', label: 'All Inclusive', pricePerNight: 1250, available: false }],

  availability: [
  { id: 'av-004-1', label: 'Spring Season', from: '2026-04-01', to: '2026-05-31', available: true },
  { id: 'av-004-2', label: 'Summer Peak', from: '2026-06-01', to: '2026-09-30', available: true },
  { id: 'av-004-3', label: 'Autumn', from: '2026-10-01', to: '2026-11-15', available: true },
  { id: 'av-004-4', label: 'Off Season', from: '2026-11-16', to: '2027-03-31', available: false }],

  images: [
  {
    url: "https://img.rocket.new/generatedImages/rocket_gen_img_17fbea747-1772405650326.png",
    alt: 'Garden villa with private plunge pool surrounded by tropical palms and outdoor lounge',
    isPrimary: true
  }],

  isActive: true,
  createdAt: '2025-11-10T10:00:00Z'
},
{
  id: 'rt-005',
  name: 'Classic Room',
  slug: 'classic-room',
  description:
  'A comfortable and elegantly furnished room with garden views. Ideal for solo travellers or short stays seeking quality and value.',
  maxAdults: 2,
  maxChildren: 1,
  totalRooms: 20,
  sizeM2: 32,
  floorLevel: '1st–2nd floor',
  view: 'Garden View',
  amenities: [
  'Queen Bed',
  'Garden View',
  'En-suite Bathroom',
  'Air Conditioning',
  'Mini Bar',
  'Smart TV',
  'In-room Safe'],

  boardPlans: [
  { code: 'RO', label: 'Room Only', pricePerNight: 180, available: true },
  { code: 'BB', label: 'Bed & Breakfast', pricePerNight: 210, available: true },
  { code: 'HB', label: 'Half Board', pricePerNight: 260, available: true },
  { code: 'FB', label: 'Full Board', pricePerNight: 310, available: false },
  { code: 'AI', label: 'All Inclusive', pricePerNight: 360, available: false }],

  availability: [
  { id: 'av-005-1', label: 'Spring Season', from: '2026-03-01', to: '2026-05-31', available: true },
  { id: 'av-005-2', label: 'Summer Peak', from: '2026-06-01', to: '2026-08-31', available: true },
  { id: 'av-005-3', label: 'Autumn', from: '2026-09-01', to: '2026-11-30', available: true },
  { id: 'av-005-4', label: 'Winter Closure', from: '2026-12-01', to: '2027-02-28', available: false }],

  images: [
  {
    url: "https://img.rocket.new/generatedImages/rocket_gen_img_1169eccf1-1772735242346.png",
    alt: 'Classic room with queen bed, warm lighting, and garden view window',
    isPrimary: true
  }],

  isActive: false,
  createdAt: '2025-11-10T10:00:00Z'
}];


const boardPlanColors: Record<BoardPlanCode, {bg: string;text: string;}> = {
  RO: { bg: 'rgba(160,148,128,0.12)', text: '#6A5A4A' },
  BB: { bg: 'rgba(88,140,100,0.1)', text: '#3A6A4A' },
  HB: { bg: 'rgba(80,130,180,0.1)', text: '#3A6A9A' },
  FB: { bg: 'rgba(92,74,110,0.1)', text: '#5C4A6E' },
  AI: { bg: 'rgba(201,169,110,0.15)', text: '#7A5A20' }
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short'
  });
}

export default function RoomTypeManagementClient() {
  const [rooms, setRooms] = useState<RoomType[]>(mockRoomTypes);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingRoom, setEditingRoom] = useState<RoomType | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deletingRoom, setDeletingRoom] = useState<RoomType | null>(null);
  const [expandedRoomId, setExpandedRoomId] = useState<string | null>(null);

  const filtered = rooms.filter(
    (r) =>
    !searchQuery ||
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.view.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleActive = (id: string) => {
    setRooms((prev) =>
    prev.map((r) => r.id === id ? { ...r, isActive: !r.isActive } : r)
    );
    const room = rooms.find((r) => r.id === id);
    if (room) {
      toast.success(
        room.isActive ?
        `${room.name} deactivated — hidden from offers` :
        `${room.name} activated — available for offers`
      );
    }
  };

  const handleDuplicate = (room: RoomType) => {
    const newRoom: RoomType = {
      ...room,
      id: `rt-${Date.now()}`,
      name: `${room.name} (Copy)`,
      slug: `${room.slug}-copy`,
      totalRooms: 0,
      createdAt: new Date().toISOString()
    };
    setRooms((prev) => [...prev, newRoom]);
    toast.success(`${room.name} duplicated — edit to update details`);
  };

  // Backend integration: DELETE /api/room-types/:id
  const handleDeleteConfirm = () => {
    if (!deletingRoom) return;
    setRooms((prev) => prev.filter((r) => r.id !== deletingRoom.id));
    toast.success(`${deletingRoom.name} deleted permanently`);
    setDeletingRoom(null);
  };

  // Backend integration: POST /api/room-types or PUT /api/room-types/:id
  const handleSaveRoom = (data: RoomType) => {
    if (editingRoom) {
      setRooms((prev) => prev.map((r) => r.id === data.id ? data : r));
      toast.success(`${data.name} updated successfully`);
    } else {
      setRooms((prev) => [data, ...prev]);
      toast.success(`${data.name} created and ready for offers`);
    }
    setEditingRoom(null);
    setIsCreating(false);
  };

  const activeCount = rooms.filter((r) => r.isActive).length;
  const totalRoomCount = rooms.reduce((sum, r) => sum + r.totalRooms, 0);

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: '#F5F0E8' }}>
      {/* Page Header */}
      <div
        className="flex items-center justify-between px-6 py-4 shrink-0"
        style={{
          backgroundColor: '#FDFAF5',
          borderBottom: '1px solid #E4DAC8'
        }}>
        
        <div>
          <h1
            className="font-display text-2xl font-semibold"
            style={{ color: '#2D2438' }}>
            
            Room Types
          </h1>
          <p className="text-sm mt-0.5" style={{ color: '#8A7A6A' }}>
            {activeCount} active · {rooms.length} total room types · {totalRoomCount} rooms
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="btn-ghost p-2"
            title={viewMode === 'grid' ? 'Switch to list view' : 'Switch to grid view'}>
            
            {viewMode === 'grid' ? <List size={16} /> : <Grid3X3 size={16} />}
          </button>
          <button
            onClick={() => setIsCreating(true)}
            className="btn-primary">
            
            <Plus size={15} />
            New Room Type
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div
        className="flex items-center gap-3 px-6 py-3 shrink-0"
        style={{
          backgroundColor: '#FDFAF5',
          borderBottom: '1px solid #E4DAC8'
        }}>
        
        <div className="relative">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: '#B0A090' }} />
          
          <input
            type="text"
            placeholder="Search room types…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 pr-3 py-1.5 rounded-lg text-sm outline-none transition-all duration-150"
            style={{
              backgroundColor: '#F5F0E8',
              border: '1px solid #D2C3AA',
              color: '#1E160E',
              width: 220,
              fontFamily: 'DM Sans, sans-serif'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#5C4A6E';
              e.target.style.boxShadow = '0 0 0 3px rgba(92, 74, 110, 0.12)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#D2C3AA';
              e.target.style.boxShadow = 'none';
            }} />
          
        </div>

        <div className="flex-1" />

        <div className="flex items-center gap-2">
          {[
          { key: 'all', label: `All (${rooms.length})` },
          { key: 'active', label: `Active (${activeCount})` },
          { key: 'inactive', label: `Inactive (${rooms.length - activeCount})` }].
          map((f) =>
          <button
            key={`filter-${f.key}`}
            className="px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150"
            style={{
              backgroundColor: 'rgba(92, 74, 110, 0.08)',
              color: '#5C4A6E'
            }}>
            
              {f.label}
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto scrollbar-thin px-6 py-5">
        {filtered.length === 0 ?
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <BedDouble size={40} style={{ color: '#D2C3AA' }} />
            <h3
            className="font-display text-xl font-medium mt-4"
            style={{ color: '#5C4A6E' }}>
            
              No room types yet
            </h3>
            <p className="text-sm mt-2 max-w-sm" style={{ color: '#8A7A6A' }}>
              Define your property's room types with pricing and availability. They'll appear as options when building offers.
            </p>
            <button
            onClick={() => setIsCreating(true)}
            className="btn-primary mt-5">
            
              <Plus size={15} />
              Create First Room Type
            </button>
          </div> :
        viewMode === 'grid' ?
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-5 max-w-screen-2xl mx-auto">
            {filtered.map((room) =>
          <RoomTypeCard
            key={room.id}
            room={room}
            expanded={expandedRoomId === room.id}
            onExpand={() =>
            setExpandedRoomId(
              expandedRoomId === room.id ? null : room.id
            )
            }
            onEdit={() => setEditingRoom(room)}
            onDuplicate={() => handleDuplicate(room)}
            onDelete={() => setDeletingRoom(room)}
            onToggleActive={() => handleToggleActive(room.id)} />

          )}
          </div> :

        <div className="space-y-3 max-w-screen-2xl mx-auto">
            {filtered.map((room) =>
          <RoomTypeListRow
            key={room.id}
            room={room}
            onEdit={() => setEditingRoom(room)}
            onDuplicate={() => handleDuplicate(room)}
            onDelete={() => setDeletingRoom(room)}
            onToggleActive={() => handleToggleActive(room.id)} />

          )}
          </div>
        }
      </div>

      {/* Modals */}
      {(isCreating || editingRoom) &&
      <RoomTypeFormModal
        room={editingRoom}
        onClose={() => {
          setIsCreating(false);
          setEditingRoom(null);
        }}
        onSave={handleSaveRoom} />

      }

      {deletingRoom &&
      <DeleteConfirmModal
        roomName={deletingRoom.name}
        onClose={() => setDeletingRoom(null)}
        onConfirm={handleDeleteConfirm} />

      }
    </div>);

}

// ─── Room Type Card ───────────────────────────────────────────────────────────

interface RoomCardProps {
  room: RoomType;
  expanded: boolean;
  onExpand: () => void;
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onToggleActive: () => void;
}

function RoomTypeCard({
  room,
  expanded,
  onExpand,
  onEdit,
  onDuplicate,
  onDelete,
  onToggleActive
}: RoomCardProps) {
  const primaryImage = room.images.find((i) => i.isPrimary) ?? room.images[0];
  const availablePlans = room.boardPlans.filter((b) => b.available);
  const lowestRate = availablePlans.length ?
  Math.min(...availablePlans.map((b) => b.pricePerNight)) :
  null;

  return (
    <div
      className="flex flex-col rounded-2xl overflow-hidden transition-all duration-200"
      style={{
        backgroundColor: '#FDFAF5',
        border: room.isActive ? '1px solid #D2C3AA' : '1px solid #E4DAC8',
        boxShadow: '0 1px 4px rgba(30,22,14,0.06)',
        opacity: room.isActive ? 1 : 0.75
      }}>
      
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        {primaryImage ?
        <AppImage
          src={primaryImage.url}
          alt={primaryImage.alt}
          fill
          className="object-cover transition-transform duration-300" /> :


        <div
          className="w-full h-full flex items-center justify-center"
          style={{ backgroundColor: '#E4DAC8' }}>
          
            <BedDouble size={32} style={{ color: '#B0A090' }} />
          </div>
        }
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, transparent 40%, rgba(30,22,14,0.45) 100%)'
          }} />
        

        {/* Active Badge */}
        <div className="absolute top-3 left-3">
          <span
            className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
            style={{
              backgroundColor: room.isActive ?
              'rgba(88,140,100,0.9)' :
              'rgba(160,148,128,0.9)',
              color: '#FDFAF5',
              backdropFilter: 'blur(4px)'
            }}>
            
            {room.isActive ?
            <CheckCircle size={10} /> :

            <XCircle size={10} />
            }
            {room.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>

        {/* Room count */}
        <div className="absolute top-3 right-3">
          <span
            className="px-2 py-1 rounded-full text-xs font-medium"
            style={{
              backgroundColor: 'rgba(45,36,56,0.8)',
              color: '#DFC08A',
              backdropFilter: 'blur(4px)'
            }}>
            
            {room.totalRooms} rooms
          </span>
        </div>

        {/* Lowest rate */}
        {lowestRate &&
        <div className="absolute bottom-3 left-3">
            <p className="text-xs font-semibold" style={{ color: 'rgba(253,250,245,0.8)' }}>
              from
            </p>
            <p
            className="font-display text-xl font-semibold tabular-nums"
            style={{ color: '#DFC08A' }}>
            
              €{lowestRate}
              <span className="text-xs font-normal ml-1" style={{ color: 'rgba(253,250,245,0.7)' }}>
                /night
              </span>
            </p>
          </div>
        }
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3
              className="font-display text-lg font-semibold leading-tight"
              style={{ color: '#2D2438' }}>
              
              {room.name}
            </h3>
            <p className="text-xs mt-0.5" style={{ color: '#8A7A6A' }}>
              {room.view} · {room.sizeM2}m² · {room.floorLevel}
            </p>
          </div>
          <div className="flex items-center gap-1 shrink-0 ml-2">
            <button
              onClick={onEdit}
              className="p-1.5 rounded-lg transition-all duration-150"
              style={{ color: '#8A7A6A' }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor =
                'rgba(92,74,110,0.1)';
                (e.currentTarget as HTMLElement).style.color = '#5C4A6E';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                (e.currentTarget as HTMLElement).style.color = '#8A7A6A';
              }}
              title="Edit room type">
              
              <Edit2 size={14} />
            </button>
            <button
              onClick={onDuplicate}
              className="p-1.5 rounded-lg transition-all duration-150"
              style={{ color: '#8A7A6A' }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor =
                'rgba(92,74,110,0.1)';
                (e.currentTarget as HTMLElement).style.color = '#5C4A6E';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                (e.currentTarget as HTMLElement).style.color = '#8A7A6A';
              }}
              title="Duplicate room type">
              
              <Copy size={14} />
            </button>
            <button
              onClick={onDelete}
              className="p-1.5 rounded-lg transition-all duration-150"
              style={{ color: '#8A7A6A' }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor =
                'rgba(180,80,70,0.1)';
                (e.currentTarget as HTMLElement).style.color = '#8A3028';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                (e.currentTarget as HTMLElement).style.color = '#8A7A6A';
              }}
              title="Delete room type — this cannot be undone">
              
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {/* Capacity */}
        <div className="flex items-center gap-1.5 mb-3">
          <Users size={12} style={{ color: '#8A7A6A' }} />
          <span className="text-xs" style={{ color: '#6A5A4A' }}>
            Max {room.maxAdults} adults
            {room.maxChildren > 0 ? ` + ${room.maxChildren} children` : ''}
          </span>
        </div>

        {/* Board Plans */}
        <div className="mb-3">
          <p className="section-label mb-1.5">Board Plans</p>
          <div className="flex flex-wrap gap-1.5">
            {room.boardPlans.map((bp) =>
            <span
              key={`card-bp-${room.id}-${bp.code}`}
              className="px-2 py-1 rounded-full text-xs font-medium tabular-nums"
              style={{
                backgroundColor: bp.available ?
                boardPlanColors[bp.code].bg :
                'rgba(160,148,128,0.08)',
                color: bp.available ?
                boardPlanColors[bp.code].text :
                '#B0A090',
                textDecoration: bp.available ? 'none' : 'line-through'
              }}>
              
                {bp.code} · €{bp.pricePerNight}
              </span>
            )}
          </div>
        </div>

        {/* Amenity Tags (top 5) */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {room.amenities.slice(0, 5).map((a) =>
          <span
            key={`card-amenity-${room.id}-${a}`}
            className="px-2 py-0.5 rounded-full text-xs"
            style={{
              backgroundColor: 'rgba(92,74,110,0.07)',
              color: '#5C4A6E'
            }}>
            
              {a}
            </span>
          )}
          {room.amenities.length > 5 &&
          <span
            className="px-2 py-0.5 rounded-full text-xs"
            style={{
              backgroundColor: 'rgba(92,74,110,0.07)',
              color: '#8A7A6A'
            }}>
            
              +{room.amenities.length - 5} more
            </span>
          }
        </div>

        {/* Availability Summary */}
        {expanded &&
        <div
          className="mb-3 rounded-xl p-3 animate-fade-in"
          style={{
            backgroundColor: '#F5F0E8',
            border: '1px solid #E4DAC8'
          }}>
          
            <p className="section-label mb-2">Availability Periods</p>
            <div className="space-y-1.5">
              {room.availability.map((period) =>
            <div
              key={period.id}
              className="flex items-center justify-between">
              
                  <div className="flex items-center gap-2">
                    <div
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{
                    backgroundColor: period.available ?
                    '#3A6A4A' : '#B0A090'
                  }} />
                
                    <span className="text-xs font-medium" style={{ color: '#3A2E22' }}>
                      {period.label}
                    </span>
                  </div>
                  <span className="text-xs tabular-nums" style={{ color: '#8A7A6A' }}>
                    {formatDate(period.from)} – {formatDate(period.to)}
                  </span>
                </div>
            )}
            </div>
          </div>
        }

        {/* Footer */}
        <div
          className="flex items-center justify-between pt-3 mt-auto"
          style={{ borderTop: '1px solid #E4DAC8' }}>
          
          <button
            onClick={onExpand}
            className="flex items-center gap-1 text-xs font-medium transition-colors duration-150"
            style={{ color: '#5C4A6E' }}>
            
            <Eye size={12} />
            {expanded ? 'Less details' : 'Availability'}
          </button>

          <button
            onClick={onToggleActive}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150"
            style={{
              backgroundColor: room.isActive ?
              'rgba(180,80,70,0.08)' :
              'rgba(88,140,100,0.1)',
              color: room.isActive ? '#8A3028' : '#3A6A4A'
            }}>
            
            {room.isActive ?
            <XCircle size={12} /> :

            <CheckCircle size={12} />
            }
            {room.isActive ? 'Deactivate' : 'Activate'}
          </button>
        </div>
      </div>
    </div>);

}

// ─── Room Type List Row ───────────────────────────────────────────────────────

interface RoomListRowProps {
  room: RoomType;
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onToggleActive: () => void;
}

function RoomTypeListRow({
  room,
  onEdit,
  onDuplicate,
  onDelete,
  onToggleActive
}: RoomListRowProps) {
  const primaryImage = room.images.find((i) => i.isPrimary) ?? room.images[0];
  const availablePlans = room.boardPlans.filter((b) => b.available);
  const lowestRate = availablePlans.length ?
  Math.min(...availablePlans.map((b) => b.pricePerNight)) :
  null;

  return (
    <div
      className="flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-150"
      style={{
        backgroundColor: '#FDFAF5',
        border: '1px solid #E4DAC8',
        opacity: room.isActive ? 1 : 0.7
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = '#D2C3AA';
        (e.currentTarget as HTMLElement).style.boxShadow =
        '0 2px 8px rgba(30,22,14,0.07)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = '#E4DAC8';
        (e.currentTarget as HTMLElement).style.boxShadow = 'none';
      }}>
      
      {/* Thumbnail */}
      <div className="relative w-16 h-12 rounded-lg overflow-hidden shrink-0">
        {primaryImage ?
        <AppImage
          src={primaryImage.url}
          alt={primaryImage.alt}
          fill
          className="object-cover" /> :


        <div
          className="w-full h-full flex items-center justify-center"
          style={{ backgroundColor: '#E4DAC8' }}>
          
            <BedDouble size={18} style={{ color: '#B0A090' }} />
          </div>
        }
      </div>

      {/* Name + Meta */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span
            className="text-sm font-semibold truncate"
            style={{ color: '#1E160E' }}>
            
            {room.name}
          </span>
          <span
            className={`badge text-xs shrink-0 ${room.isActive ? 'badge-ready' : ''}`}
            style={
            !room.isActive ?
            {
              backgroundColor: 'rgba(160,148,128,0.12)',
              color: '#8A7A6A',
              padding: '2px 8px',
              borderRadius: 999,
              fontSize: 11,
              fontWeight: 500
            } :
            {}
            }>
            
            {room.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
        <p className="text-xs" style={{ color: '#8A7A6A' }}>
          {room.view} · {room.sizeM2}m² · {room.maxAdults} adults max
        </p>
      </div>

      {/* Board Plans */}
      <div className="flex items-center gap-1.5 shrink-0">
        {room.boardPlans.
        filter((b) => b.available).
        slice(0, 3).
        map((bp) =>
        <span
          key={`list-bp-${room.id}-${bp.code}`}
          className="px-2 py-0.5 rounded-full text-xs font-medium"
          style={{
            backgroundColor: boardPlanColors[bp.code].bg,
            color: boardPlanColors[bp.code].text
          }}>
          
              {bp.code}
            </span>
        )}
        {room.boardPlans.filter((b) => b.available).length > 3 &&
        <span className="text-xs" style={{ color: '#B0A090' }}>
            +{room.boardPlans.filter((b) => b.available).length - 3}
          </span>
        }
      </div>

      {/* Lowest Rate */}
      <div className="text-right shrink-0 w-24">
        {lowestRate ?
        <>
            <p
            className="text-sm font-semibold tabular-nums"
            style={{ color: '#2D2438' }}>
            
              from €{lowestRate}
            </p>
            <p className="text-xs" style={{ color: '#8A7A6A' }}>
              per night
            </p>
          </> :

        <p className="text-xs" style={{ color: '#B0A090' }}>
            No plans
          </p>
        }
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={onEdit}
          className="p-1.5 rounded-lg transition-all duration-150"
          style={{ color: '#8A7A6A' }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(92,74,110,0.1)';
            (e.currentTarget as HTMLElement).style.color = '#5C4A6E';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
            (e.currentTarget as HTMLElement).style.color = '#8A7A6A';
          }}
          title="Edit room type">
          
          <Edit2 size={14} />
        </button>
        <button
          onClick={onDuplicate}
          className="p-1.5 rounded-lg transition-all duration-150"
          style={{ color: '#8A7A6A' }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(92,74,110,0.1)';
            (e.currentTarget as HTMLElement).style.color = '#5C4A6E';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
            (e.currentTarget as HTMLElement).style.color = '#8A7A6A';
          }}
          title="Duplicate room type">
          
          <Copy size={14} />
        </button>
        <button
          onClick={onDelete}
          className="p-1.5 rounded-lg transition-all duration-150"
          style={{ color: '#8A7A6A' }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(180,80,70,0.1)';
            (e.currentTarget as HTMLElement).style.color = '#8A3028';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
            (e.currentTarget as HTMLElement).style.color = '#8A7A6A';
          }}
          title="Delete room type — this cannot be undone">
          
          <Trash2 size={14} />
        </button>
        <button
          onClick={onToggleActive}
          className="ml-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-150"
          style={{
            backgroundColor: room.isActive ?
            'rgba(180,80,70,0.08)' :
            'rgba(88,140,100,0.1)',
            color: room.isActive ? '#8A3028' : '#3A6A4A'
          }}>
          
          {room.isActive ? 'Deactivate' : 'Activate'}
        </button>
      </div>
    </div>);

}