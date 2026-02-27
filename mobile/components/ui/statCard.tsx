import { StatProps } from "@/types/profile";
import { LinearGradient } from "expo-linear-gradient";
import { Text, View } from "react-native";

export default function StatCard({ icon: Icon, label, value, bgClass, iconClass }: StatProps) {
    // Map Tailwind gradient class strings to actual color pairs for LinearGradient
    const gradientMap: Record<string, [string, string]> = {
        'from-blue-600/20 to-blue-800/20': ['rgba(37,99,235,0.2)', 'rgba(30,64,175,0.2)'],
        'from-green-600/20 to-green-800/20': ['rgba(22,163,74,0.2)', 'rgba(21,128,61,0.2)'],
        'from-purple-600/20 to-purple-800/20': ['rgba(147,51,234,0.2)', 'rgba(107,33,168,0.2)'],
        'from-orange-600/20 to-orange-800/20': ['rgba(234,88,12,0.2)', 'rgba(194,65,12,0.2)'],
    };

    const iconColorMap: Record<string, string> = {
        'text-blue-400': '#60a5fa',
        'text-green-400': '#4ade80',
        'text-purple-400': '#c084fc',
        'text-orange-400': '#fb923c',
    };

    const [fromColor, toColor] = gradientMap[bgClass] ?? ['rgba(37,99,235,0.2)', 'rgba(30,64,175,0.2)'];
    const iconColor = iconColorMap[iconClass] ?? '#60a5fa';

    return (
        <LinearGradient
            colors={[fromColor, toColor]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderRadius: 12,
                borderWidth: 1,
                borderColor: 'rgba(99,102,241,0.3)',
                padding: 16,
                margin: 4,
            }}
        >
            <View className="flex-row items-center gap-4 mb-2">
                <Icon size={18} color={iconColor} />
                <Text className="text-gray-400 text-md font-medium">{label}</Text>
            </View>
            <Text className="text-white text-3xl font-bold">{value ?? 0}</Text>
        </LinearGradient>
    );
}