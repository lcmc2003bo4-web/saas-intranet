export default function StudentDashboard() {
    return (
        <div className="p-6 space-y-8 max-w-7xl mx-auto">
            <header>
                <h1 className="text-3xl font-bold text-gray-900">Hola, Juan 👋</h1>
                <p className="text-gray-500">Aquí tienes el resumen de tu día.</p>
            </header>

            {/* 1. Semáforo Académico */}
            <section>
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Mi Semáforo Académico</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
                        <span className="text-2xl font-bold text-gray-800">Matemáticas</span>
                        <p className="text-green-600 font-medium">Promedio: 9.5 (Seguro)</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-yellow-500">
                        <span className="text-2xl font-bold text-gray-800">Historia</span>
                        <p className="text-yellow-600 font-medium">Promedio: 7.8 (Atención)</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-red-500">
                        <span className="text-2xl font-bold text-gray-800">Química</span>
                        <p className="text-red-600 font-medium">Promedio: 5.4 (Peligro)</p>
                    </div>
                </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* 2. Horario */}
                <section className="bg-white rounded-2xl shadow-sm p-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Horario de Hoy</h2>
                    <div className="space-y-4">
                        {['08:00 - Matemáticas', '09:30 - Historia', '11:00 - Recreo', '11:30 - Química'].map((item, i) => (
                            <div key={i} className="flex items-center p-3 bg-gray-50 rounded-lg">
                                <div className="w-2 h-2 rounded-full bg-indigo-500 mr-3"></div>
                                <span className="text-gray-700 font-medium">{item}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 3. Estado de Cuenta */}
                <section className="bg-white rounded-2xl shadow-sm p-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Estado de Matrícula</h2>
                    <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-gray-200 rounded-xl bg-green-50">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-2">
                            <span className="text-2xl">✅</span>
                        </div>
                        <p className="text-green-800 font-bold text-lg">Al corriente</p>
                        <p className="text-sm text-green-600">Gracias por tu puntualidad.</p>
                    </div>
                </section>
            </div>
        </div>
    )
}
