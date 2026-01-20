import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar (Fixed on Desktop, Hidden on Mobile) */}
            <Sidebar />

            {/* Main Content Wrapper */}
            <div className="flex-1 flex flex-col md:pl-64 transition-all duration-300">
                <Topbar />

                <main className="flex-1 pt-20 p-6 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
