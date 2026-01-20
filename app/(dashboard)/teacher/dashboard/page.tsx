export default function TeacherDashboard() {
    return (
        <div className="p-6 space-y-8 max-w-7xl mx-auto">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Panel Docente 🍎</h1>
                    <p className="text-gray-500">Gestión rápida de aula.</p>
                </div>
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
                    Iniciar Clase
                </button>
            </header>

            {/* 1. Accesos Rápidos */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition cursor-pointer border border-gray-100">
                    <div className="text-indigo-600 mb-2">📋</div>
                    <h3 className="text-lg font-bold text-gray-900">Pase de Lista</h3>
                    <p className="text-sm text-gray-500">Registrar asistencia con un click.</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition cursor-pointer border border-gray-100">
                    <div className="text-green-600 mb-2">📊</div>
                    <h3 className="text-lg font-bold text-gray-900">Cargar Notas</h3>
                    <p className="text-sm text-gray-500">Interfaz rápida tipo Excel.</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition cursor-pointer border border-gray-100">
                    <div className="text-purple-600 mb-2">💬</div>
                    <h3 className="text-lg font-bold text-gray-900">Mensajes</h3>
                    <p className="text-sm text-gray-500">3 nuevos mensajes de padres.</p>
                </div>
            </section>

            {/* 2. Modo No Molestar */}
            <section className="bg-blue-50 border border-blue-100 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between">
                <div>
                    <h3 className="text-blue-900 font-bold">Modo "No Molestar" Activo 🌙</h3>
                    <p className="text-blue-700 text-sm">Fuera de horario laboral. Las notificaciones están pausadas.</p>
                </div>
                <div className="mt-4 md:mt-0">
                    <span className="px-3 py-1 bg-white text-blue-600 rounded-full text-xs font-bold shadow-sm uppercase">Protegido</span>
                </div>
            </section>
        </div>
    )
}
