import {
    LayoutDashboard,
    Users,
    GraduationCap,
    CreditCard,
    Settings,
    BookOpen,
    ClipboardCheck,
    CalendarCheck,
    User,
    FileText,
    Calendar
} from 'lucide-react';
import { UserRole } from '@/types/auth';

type NavItem = {
    name: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
};

// We Map the user specified roles to our internal UserRole types
// Director -> director (super_admin, admin)
// Docente -> teacher
// Alumno -> student

export const NAV_ITEMS: Partial<Record<UserRole, NavItem[]>> = {
    director: [
        { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Alumnos', href: '/admin/students', icon: GraduationCap },
        { name: 'Docentes', href: '/admin/teachers', icon: Users },
        { name: 'Finanzas', href: '/admin/finance', icon: CreditCard },
        { name: 'Configuración', href: '/admin/settings', icon: Settings },
    ],
    admin: [ // Admin shares Director view typically, or slightly restricted. mirroring for now.
        { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Alumnos', href: '/admin/students', icon: GraduationCap },
        { name: 'Docentes', href: '/admin/teachers', icon: Users },
        { name: 'Finanzas', href: '/admin/finance', icon: CreditCard },
    ],
    teacher: [
        { name: 'Mis Cursos', href: '/teacher/courses', icon: BookOpen },
        { name: 'Calificaciones', href: '/teacher/grades', icon: ClipboardCheck },
        { name: 'Asistencia', href: '/teacher/attendance', icon: CalendarCheck },
    ],
    student: [
        { name: 'Mi Perfil', href: '/student/profile', icon: User },
        { name: 'Mis Notas', href: '/student/grades', icon: FileText },
        { name: 'Horario', href: '/student/schedule', icon: Calendar },
    ],
    // Fallbacks
    super_admin: [
        { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Alumnos', href: '/admin/students', icon: GraduationCap },
        { name: 'Docentes', href: '/admin/teachers', icon: Users },
        { name: 'Finanzas', href: '/admin/finance', icon: CreditCard },
        { name: 'Configuración', href: '/admin/settings', icon: Settings },
    ]
};
