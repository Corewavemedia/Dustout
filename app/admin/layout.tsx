import React from 'react';

import AdminProtection from '@/components/admin/AdminProtection'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminProtection>
      <div className="min-h-screen bg-bg-light">
        {children}
      </div>
    </AdminProtection>
  );
}