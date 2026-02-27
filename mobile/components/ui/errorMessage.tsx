import React from "react";
import { Text, View } from "react-native";

interface ErrorMsgTypes {
    message: string | null | undefined;
    className?: string;
}


function ErrorMessage({ message, className = '' }: ErrorMsgTypes): React.ReactElement | null {

    if (!message) return null;


    return (
        <View className={`${className} w-screen max-w-screen-lg py-6 items-center justify-center mb-6 p-4 bg-red-900 border border-red-700 rounded-lg`}>
            <Text className="text-red-200 text-center">
                {message}
            </Text>
        </View>
    );
}

export default ErrorMessage;