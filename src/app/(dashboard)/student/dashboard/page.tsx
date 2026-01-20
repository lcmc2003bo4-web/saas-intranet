'use client';

import { useUser } from '@/context/UserContext';
import { FileText, Calendar, CreditCard, AlertCircle } from 'lucide-react';

export default function StudentDashboard() {
    const { profile } = useUser();

    const recentGrades = [
        { course: 'Matemáticas', grade: '18', date: '19 Ene' },
        { course: 'Historia', grade: '16', date: '18 Ene' },
        { course: 'Ciencias', grade: '20', date: '15 Ene' },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">
                    Hola, {profile?.full_name}
                </h1>
                <p className="text-gray-500">
                    Bienvenido a tu portal estudiantil
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Status Card */}
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-blue-100 font-medium">Estado de Matrícula</span>
                        <span className="bg-white/20 px-2 py-1 rounded text-xs">Activo</span>
                    </div>
                    <div className="text-3xl font-bold mb-1">5to Secundaria</div>
                    <div className="text-blue-100 text-sm">Sección A - 2026</div>
                </div>

                {/* Next Payment */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center text-gray-500 mb-2">
                            <CreditCard className="w-4 h-4 mr-2" />
                            Próximo Pago
                        </div>
                        <div className="text-2xl font-bold text-gray-900">Marzo 2026</div>
                        <div className="text-sm text-gray-400">Mensualidad</div>
                    </div>
                    <button className="mt-4 w-full py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors">
                        Ver Cronograma
                    </button>
                </div>

                {/* Payment Alert - Example */}
                <div className="bg-white rounded-xl shadow-sm border border-red-100 p-6 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center text-red-500 mb-2">
                            <AlertCircle className="w-4 h-4 mr-2" />
                            Pagos Pendientes
                        </div>
                        <div className="text-2xl font-bold text-red-600">S/ 0.00</div>
                        <div className="text-sm text-green-500">Estás al día!</div>
                    </div>
                </div>
            </div>

            {/* Recent Grades */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                        <FileText className="w-5 h-5 mr-2 text-blue-600" />
                        Calificaciones Recientes
                    </h2>
                </div>
                <div className="divide-y divide-gray-100">
                    {recentGrades.map((grade, idx) => (
                        <div key={idx} className="p-4 flex items-center justify-between hover:bg-gray-50">
                            <div className="flex items-center">
                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 mr-4">
                                    {grade.course.substring(0, 1)}
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">{grade.course}</p>
                                    <p className="text-xs text-gray-500">{grade.date}</p>
                                </div>
                            </div>
                            <div className="text-lg font-bold text-gray-900">
                                {grade.grade}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
