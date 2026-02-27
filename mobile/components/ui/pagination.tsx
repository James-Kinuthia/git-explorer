import { Pressable, Text, View } from "react-native";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    loading: boolean;
}

function Pagination({ currentPage, totalPages, onPageChange, loading }: PaginationProps) {
    if (totalPages <= 1) return null;
    const btnClass = 'px-4 py-2 bg-gray-800 hover:bg-gray-700 disabled:bg-gray-900 rounded-lg transition-colors border border-gray-700';

    return (
        <View className="justify-center mt-3 flex-row items-baseline gap-2">
            <Pressable onPress={() => onPageChange(currentPage - 1)} disabled={currentPage === 1 || loading} className={btnClass}>
                <Text className={`${loading || currentPage === 1 ? 'text-gray-600': 'text-white'} text-white`}>
                    Previous
                </Text>
            </Pressable>
            <Text className="text-base text-gray-500">
                Page {currentPage} of {totalPages}
            </Text>
            <Pressable onPress={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages || loading} className={btnClass}>
                <Text className={`${loading || currentPage === totalPages ? 'text-gray-600': 'text-white'} text-white`}>
                    Next
                </Text>
            </Pressable>
        </View>
    );
}

export default Pagination;