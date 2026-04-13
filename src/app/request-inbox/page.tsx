import React from 'react';
import AppLayout from '@/components/AppLayout';
import RequestInboxClient from './components/RequestInboxClient';

export default function RequestInboxPage() {
  return (
    <AppLayout currentPath="/request-inbox">
      <RequestInboxClient />
    </AppLayout>
  );
}