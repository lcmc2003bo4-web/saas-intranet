'use client';

import { useUser } from '@/context/UserContext';
import { NAV_ITEMS } from '@/config/navigation';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { X } from 'lucide-react';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const { profile, isLoading } = useUser();
    const pathname = usePathname();

    if (isLoading || !profile) {
        return null; // Layout handles main loader, sidebar can just be empty or skeleton if needed
    }

    const menuItems = NAV_ITEMS[profile.role] || [];

    return (
        <>
            <div
                className={clsx(
                    "bg-white h-screen border-r border-gray-200 flex flex-col fixed left-0 top-0 z-30 transition-transform duration-300 ease-in-out w-64",
                    // Mobile: slide in/out based on isOpen. Desktop: always show (translate-x-0) but manage via layout padding.
                    // Note: The layout component handles the pl-64 for desktop content.
                    // Here we just handle the sidebar visibility itself.
                    isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
                )}
            >
                <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100">
                    <span className="text-xl font-bold text-blue-600">Intranet</span>
                    <button
                        type="button"
                        className="md:hidden text-gray-500 hover:text-gray-700"
                        onClick={onClose}
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {menuItems.map((item) => {
                        const isActive = pathname.startsWith(item.href);
                        return (
                            <Link
                                key={item.href}
                                onClick={() => {
                                    // Close sidebar on mobile when navigating
                                    if (window.innerWidth < 768) onClose();
                                }}
                                href={item.href}
                                className={clsx(
                                    'flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors mb-1',
                                    isActive
                                        ? 'bg-blue-50 text-blue-700'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                )}
                            >
                                <item.icon className={clsx('mr-3 h-5 w-5', isActive ? 'text-blue-700' : 'text-gray-400')} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer section removed as Profile is now in Header */}
            </div>
        </>
    );
}
