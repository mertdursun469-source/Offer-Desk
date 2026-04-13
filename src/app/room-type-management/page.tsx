import React from 'react';
import AppLayout from '@/components/AppLayout';
import RoomTypeManagementClient from './components/RoomTypeManagementClient';

export default function RoomTypeManagementPage() {
  return (
    <AppLayout currentPath="/room-type-management">
      <RoomTypeManagementClient />
    </AppLayout>
  );
}