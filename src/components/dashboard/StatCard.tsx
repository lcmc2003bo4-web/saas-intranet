import { LucideIcon } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    trend?: string;
    trendUp?: boolean;
    color?: string; // Tailwind color class prefix (e.g., 'blue', 'green', 'red')
}

export function StatCard({ title, value, icon: Icon, trend, trendUp, color = 'blue' }: StatCardProps) {
    // Determine color classes safely
    // Note: Safelist these classes or use style objects if dynamic construction fails in some setups.
    // Ideally, use a fixed set of color props or maintain strict map.
    // Simple map for common colors to ensure Tailwind purge works:
    const colors: Record<string, { bg: string, text: string }> = {
        blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
        green: { bg: 'bg-green-100', text: 'text-green-600' },
        red: { bg: 'bg-red-100', text: 'text-red-600' },
        yellow: { bg: 'bg-yellow-100', text: 'text-yellow-600' },
        purple: { bg: 'bg-purple-100', text: 'text-purple-600' },
    };

    const theme = colors[color] || colors.blue;

    return (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500">{title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
                </div>
                <div className={`p-3 rounded-full ${theme.bg}`}>
                    <Icon className={`h-6 w-6 ${theme.text}`} />
                </div>
            </div>
            {trend && (
                <div className="mt-4 flex items-center">
                    <span className={`text-sm font-medium ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
                        {trend}
                    </span>
                    <span className="text-sm text-gray-400 ml-2">vs el mes pasado</span>
                </div>
            )}
        </div>
    );
}
