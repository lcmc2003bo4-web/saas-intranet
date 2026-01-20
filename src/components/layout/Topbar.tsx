'use client';

import { useUser } from '@/context/UserContext';
import { supabase } from '@/lib/supabase';
import { LogOut, Menu, Bell } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Topbar() {
    const { school, profile } = useUser();
    const router = useRouter();

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    return (
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 fixed top-0 right-0 left-0 md:left-64 z-10 transition-all">
            <div className="flex items-center">
                <button className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500">
                    <Menu className="h-6 w-6" />
                </button>
                <div className="flex ml-4 md:ml-0">
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
                <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none">
                    <Bell className="h-6 w-6" />
                </button>

                <div className="h-6 w-px bg-gray-200" aria-hidden="true" />

                <button
                    onClick={handleSignOut}
                    className="flex items-center text-sm font-medium text-red-600 hover:text-red-800 transition-colors"
                >
                    <LogOut className="h-5 w-5 mr-1" />
                    <span className="hidden sm:inline">Cerrar Sesión</span>
                </button>
            </div>
        </header>
    );
}
