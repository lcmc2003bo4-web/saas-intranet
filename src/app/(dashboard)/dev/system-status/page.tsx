export default function DevDashboard() {
    return (
        <div className="p-6 space-y-8 max-w-7xl mx-auto bg-gray-900 min-h-screen text-gray-200">
            <header className="border-b border-gray-700 pb-4">
                <h1 className="text-3xl font-mono font-bold text-green-400">GOD MODE ⚡</h1>
                <p className="text-gray-400">System Status & Maintenance</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 1. Logs */}
                <section className="lg:col-span-2 bg-black rounded-lg p-4 font-mono text-xs overflow-y-auto h-64 border border-gray-800">
                    <h2 className="text-gray-500 mb-2 uppercase tracking-wider">Live Server Logs</h2>
                    <div className="space-y-1">
                        <p className="text-green-500">[INFO] Server started at port 3000</p>
                        <p className="text-blue-500">[AUTH] User login: student@school.com</p>
                        <p className="text-yellow-500">[WARN] High latency on /api/grades (200ms)</p>
                        <p className="text-red-500">[ERROR] Failed to sync with WhatsApp API (Retry 1/3)</p>
                    </div>
                </section>

                {/* 2. Feature Flags */}
                <section className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <h2 className="text-gray-400 mb-4 uppercase tracking-wider text-sm">Feature Flags</h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span>Payments Module</span>
                            <div className="w-10 h-5 bg-green-500 rounded-full relative cursor-pointer">
                                <div className="w-3 h-3 bg-white rounded-full absolute right-1 top-1"></div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between opacity-50">
                            <span>Maintenance Mode</span>
                            <div className="w-10 h-5 bg-gray-600 rounded-full relative cursor-pointer">
                                <div className="w-3 h-3 bg-white rounded-full absolute left-1 top-1"></div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {/* 3. Integrations */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['Database', 'Redis', 'Storage', 'WhatsApp API'].map((service, i) => (
                    <div key={i} className="bg-gray-800 p-4 rounded-lg flex items-center justify-between">
                        <span className="text-sm font-bold">{service}</span>
                        <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e]"></span>
                    </div>
                ))}
            </section>
        </div>
    )
}
