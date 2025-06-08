'use client';

import { Suspense } from 'react';
import SignIn from '@/components/SignIn';

function SignInContent() {
  return <SignIn />;
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen"><div className="text-lg">Loading...</div></div>}>
      <SignInContent />
    </Suspense>
  );
}