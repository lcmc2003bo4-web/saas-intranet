'use client';

import { useUser } from '@/context/UserContext';
import { Clock, CheckSquare, Calendar } from 'lucide-react';

export default function TeacherDashboard() {
    const { profile } = useUser();

    const todayClasses = [
        { time: '08:00 - 09:30', course: 'Matemáticas 5to A', room: 'Aula 101' },
        { time: '09:45 - 11:15', course: 'Matemáticas 4to B', room: 'Aula 102' },
        { time: '11:45 - 13:15', course: 'Tutoría 5to A', room: 'Aula 101' },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">
                    Bienvenido, Prof. {profile?.full_name?.split(' ')[1] || profile?.full_name}
                </h1>
                <p className="text-gray-500">
                    Aquí tienes tu agenda para hoy
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Agenda del Día */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                            <Clock className="w-5 h-5 mr-2 text-blue-600" />
                            Clases de Hoy
                        </h2>
                        <span className="text-sm text-gray-500">{new Date().toLocaleDateString()}</span>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {todayClasses.map((cls, idx) => (
                            <div key={idx} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-gray-900">{cls.course}</p>
                                    <div className="flex items-center text-sm text-gray-500 mt-1">
                                        <Calendar className="w-4 h-4 mr-1" />
                                        {cls.time}
                                    </div>
                                </div>
                                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                                    {cls.room}
                                </span>
                            </div>
                        ))}
                    </div>
                    {/* Empty State visual aid if needed */}
                    {todayClasses.length === 0 && (
                        <div className="p-8 text-center text-gray-400">No tienes clases hoy.</div>
                    )}
                </div>

                {/* Pending Tasks */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center mb-4">
                        <CheckSquare className="w-5 h-5 mr-2 text-orange-600" />
                        Pendientes
                    </h2>
                    <ul className="space-y-3">
                        <li className="flex items-start">
                            <input type="checkbox" className="mt-1 mr-3 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
                            <span className="text-sm text-gray-600">Subir notas del Examen Parcial (4to B)</span>
                        </li>
                        <li className="flex items-start">
                            <input type="checkbox" className="mt-1 mr-3 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
                            <span className="text-sm text-gray-600">Revisar justificaciones de asistencia</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
