export default function AdminDashboard() {
    return (
        <div className="p-6 space-y-8 max-w-7xl mx-auto">
            <header>
                <h1 className="text-3xl font-bold text-gray-900">Administración 🏛️</h1>
                <p className="text-gray-500">Control Financiero y Operativo.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* 1. Dashboard Financiero */}
                <section className="bg-white rounded-2xl shadow-sm p-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Morosidad del Mes</h2>
                    <div className="space-y-4">
                        {[
                            { name: 'Familia González', amount: '$4,500' },
                            { name: 'Familia Pérez', amount: '$3,200' },
                            { name: 'Familia Rodríguez', amount: '$9,000' }
                        ].map((fam, i) => (
                            <div key={i} className="flex justify-between items-center p-3 border-b border-gray-50 last:border-0">
                                <span className="text-gray-700 font-medium">{fam.name}</span>
                                <div className="flex items-center space-x-3">
                                    <span className="text-red-500 font-bold">{fam.amount}</span>
                                    <button className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200">
                                        WhatsApp 📲
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 2. Validador de Pagos */}
                <section className="bg-white rounded-2xl shadow-sm p-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Por Conciliar (3)</h2>
                    <div className="space-y-4">
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg justify-between">
                            <span className="text-sm text-gray-600">Comp. #1234 - $5,000</span>
                            <div className="space-x-2">
                                <button className="text-xs bg-indigo-600 text-white px-2 py-1 rounded">Ver Foto</button>
                                <button className="text-xs bg-green-500 text-white px-2 py-1 rounded">✅</button>
                            </div>
                        </div>
                        {/* More items... */}
                    </div>
                </section>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 3. Fábrica de Docs */}
                <div className="bg-white p-6 rounded-2xl shadow-sm">
                    <h3 className="font-bold text-gray-800 mb-2">📄 Generar Documentos</h3>
                    <p className="text-sm text-gray-500 mb-4">Constancias, boletas y reportes.</p>
                    <button className="w-full border border-gray-300 rounded-lg py-2 text-sm text-gray-700 hover:bg-gray-50">Abrir Fábrica</button>
                </div>
                {/* 4. Muro */}
                <div className="bg-white p-6 rounded-2xl shadow-sm">
                    <h3 className="font-bold text-gray-800 mb-2">📢 Comunicados</h3>
                    <p className="text-sm text-gray-500 mb-4">Publicar noticias urgentes.</p>
                    <button className="w-full border border-gray-300 rounded-lg py-2 text-sm text-gray-700 hover:bg-gray-50">Redactar</button>
                </div>
            </div>
        </div>
    )
}
