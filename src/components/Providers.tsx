'use client';

import { UserProvider } from '@/context/UserContext';
import React from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <UserProvider>
            {children}
        </UserProvider>
    );
}
