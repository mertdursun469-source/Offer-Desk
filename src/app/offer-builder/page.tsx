import React from 'react';
import AppLayout from '@/components/AppLayout';
import OfferBuilderClient from './components/OfferBuilderClient';

export default function OfferBuilderPage() {
  return (
    <AppLayout currentPath="/offer-builder">
      <OfferBuilderClient />
    </AppLayout>
  );
}