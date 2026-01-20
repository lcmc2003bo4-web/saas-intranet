'use client';

import { StatCard } from '@/components/dashboard/StatCard';
import { useUser } from '@/context/UserContext';
import { Users, CreditCard, GraduationCap, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
    const { profile, school } = useUser();

    // In a real app, we would fetch these stats from the DB
    const stats = [
        {
            title: 'Total Alumnos',
            value: '1,234',
            icon: Users,
            trend: '+12%',
            trendUp: true,
            color: 'blue'
        },
        {
            title: 'Deuda Pendiente',
            value: 'S/ 4,500',
            icon: CreditCard,
            trend: '-5%',
            trendUp: true,
            color: 'red'
        },
        {
            title: 'Docentes Activos',
            value: '45',
            icon: GraduationCap,
            trend: '+2',
            trendUp: true,
            color: 'purple'
        },
        {
            title: 'Asistencia Hoy',
            value: '98%',
            icon: TrendingUp,
            trend: '+1%',
            trendUp: true,
            color: 'green'
        },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">
                    Hola, {profile?.full_name?.split(' ')[0]}
                </h1>
                <p className="text-gray-500">
                    Resumen de actividad para {school?.name || 'tu colegio'}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <StatCard key={stat.title} {...stat} />
                ))}
            </div>

            {/* Placeholder for Charts/Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm h-64 flex items-center justify-center text-gray-400">
                    Gráfico de Recaudación (Próximamente)
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm h-64 flex items-center justify-center text-gray-400">
                    Asistencia en Tiempo Real (Próximamente)
                </div>
            </div>
        </div>
    );
}
