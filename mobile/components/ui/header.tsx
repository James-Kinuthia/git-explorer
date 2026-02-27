import { Text, View } from "react-native";

export default function Header(){
    return (
        <View className="flex-1 items-center justify-between flex-row w-full h-16">
            <Text className="font-bold text-white text-lg">
                Github Explorer
            </Text>
        </View>
    );
}