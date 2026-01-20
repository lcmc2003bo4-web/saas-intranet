'use client';

import { useUser } from '@/context/UserContext';
import { UserRole } from '@/types/auth';
import {
    LayoutDashboard,
    Users,
    GraduationCap,
    CreditCard,
    Settings,
    BookOpen,
    ClipboardCheck,
    FileText,
    Calendar
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

type MenuItem = {
    name: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
};

const ROLE_MENUS: Record<UserRole, MenuItem[]> = {
    super_admin: [
        { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Usuarios', href: '/admin/users', icon: Users },
        { name: 'Configuración', href: '/admin/settings', icon: Settings },
    ],
    director: [
        { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Usuarios', href: '/admin/users', icon: Users },
        { name: 'Académico', href: '/admin/academics', icon: GraduationCap },
        { name: 'Finanzas', href: '/admin/finance', icon: CreditCard },
        { name: 'Configuración', href: '/admin/settings', icon: Settings },
    ],
    admin: [
        { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Usuarios', href: '/admin/users', icon: Users },
        { name: 'Finanzas', href: '/admin/finance', icon: CreditCard },
    ],
    teacher: [
        { name: 'Dashboard', href: '/teacher/dashboard', icon: LayoutDashboard },
        { name: 'Mis Cursos', href: '/teacher/courses', icon: BookOpen },
        { name: 'Evaluaciones', href: '/teacher/grading', icon: ClipboardCheck },
    ],
    student: [
        { name: 'Dashboard', href: '/student/dashboard', icon: LayoutDashboard },
        { name: 'Libreta de Notas', href: '/student/grades', icon: FileText },
        { name: 'Asistencia', href: '/student/attendance', icon: Calendar },
        { name: 'Mis Pagos', href: '/student/payments', icon: CreditCard },
    ],
    parent: [
        { name: 'Dashboard', href: '/student/dashboard', icon: LayoutDashboard }, // Shares student view basically or similar
        { name: 'Mis Pagos', href: '/student/payments', icon: CreditCard },
    ]
};

export default function Sidebar() {
    const { profile, isLoading } = useUser();
    const pathname = usePathname();

    if (isLoading || !profile) {
        // Render a skeleton or minimal placeholder
        return (
            <div className="w-64 bg-white h-screen border-r border-gray-200 p-4">
                <div className="h-8 w-32 bg-gray-200 rounded animate-pulse mb-8" />
                <div className="space-y-4">
                    {[1, 2, 3, 4].map(i => <div key={i} className="h-6 w-full bg-gray-100 rounded animate-pulse" />)}
                </div>
            </div>
        );
    }

    const menuItems = ROLE_MENUS[profile.role] || [];

    return (
        <div className="w-64 bg-white h-screen border-r border-gray-200 flex flex-col hidden md:flex fixed left-0 top-0">
            <div className="h-16 flex items-center px-6 border-b border-gray-100">
                <span className="text-xl font-bold text-blue-600">Intranet</span>
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {menuItems.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    return (
                        <Link
                            key={item.href}
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

            <div className="p-4 border-t border-gray-100">
                <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-bold text-xs uppercase">
                        {profile.full_name?.substring(0, 2) || 'U'}
                    </div>
                    <div className="ml-3">
                        <p className="text-sm font-medium text-gray-700 truncate w-32">{profile.full_name}</p>
                        <p className="text-xs text-gray-500 capitalize">{profile.role.replace('_', ' ')}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
