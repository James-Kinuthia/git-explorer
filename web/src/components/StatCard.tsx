export interface StatCardProps {
    label: string;
    value: string;
}

function StatCard({ label, value }: StatCardProps) {
    return (
        <div className="bg-gray-900 p-4 rounded-lg">
            <div className="text-gray-400 text-sm mb-1">
                {label}
            </div>
            <div className="text-2xl font-bold text-white">
                {value}
            </div>
        </div>
    );
}

export default StatCard;