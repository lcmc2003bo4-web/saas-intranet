'use client';

import { useUser } from '@/context/UserContext';
import { supabase } from '@/lib/supabase';
import { LogOut, Menu, Bell } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface TopbarProps {
    onMenuClick: () => void;
}

export default function Topbar({ onMenuClick }: TopbarProps) {
    const { school, profile } = useUser();
    const router = useRouter();

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    return (
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 fixed top-0 right-0 left-0 md:left-64 z-10 transition-all">
            <div className="flex items-center">
                <button
                    onClick={onMenuClick}
                    className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                >
                    <Menu className="h-6 w-6" />
                </button>
                <div className="flex ml-4 md:ml-0 items-center">
                    {school?.logo_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={school.logo_url} alt="Logo" className="h-8 w-auto mr-3" />
                    ) : (
                        <div className="h-8 w-8 bg-blue-100 rounded flex items-center justify-center text-blue-700 font-bold mr-3">
                            {school?.name?.substring(0, 1) || 'S'}
                        </div>
                    )}
                    <h1 className="text-lg font-semibold text-gray-900 hidden sm:block">
                        {school?.name || 'Cargando institución...'}
                    </h1>
                </div>
            </div>

            <div className="flex items-center space-x-4">
                {/* User Avatar */}
                <div className="flex items-center space-x-3 border-r border-gray-200 pr-4">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium text-gray-900">{profile?.full_name}</p>
                        <p className="text-xs text-gray-500 capitalize">{profile?.role?.replace('_', ' ')}</p>
                    </div>
                    <div className="h-9 w-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm uppercase">
                        {profile?.full_name?.substring(0, 2) || 'U'}
                    </div>
                </div>

                <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none">
                    <Bell className="h-6 w-6" />
                </button>

                <button
                    onClick={handleSignOut}
                    className="p-1 rounded-full text-gray-400 hover:text-red-600 transition-colors"
                    title="Cerrar Sesión"
                >
                    <LogOut className="h-5 w-5" />
                </button>
            </div>
        </header>
    );
}
