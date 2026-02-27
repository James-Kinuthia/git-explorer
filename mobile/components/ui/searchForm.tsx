import React from 'react';
import { View, TextInput, Pressable, Text, ActivityIndicator } from 'react-native';
import { SearchProps } from '@/types/search';

const SearchForm: React.FC<SearchProps> = ({
  value,
  onChangeText,
  placeholder,
  loading,
  buttonText = 'Search',
  onSubmit,
}) => {
  return (
    <View className="mb-8 max-w-2xl mx-auto h-20 w-screen">
      <View className="flex-row gap-1">
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#6b7280"
          editable={!loading}
          onSubmitEditing={onSubmit}
          returnKeyType="search"
          className="px-6 py-4 w-2/3 bg-gray-800 border border-gray-700 rounded-lg text-white"
        />
        <Pressable
          onPress={onSubmit}
          disabled={loading}
          className="px-8 py-4 bg-blue-600 rounded-lg justify-center active:bg-blue-700 disabled:bg-blue-800 disabled:opacity-50"
        >
          {loading
            ? <ActivityIndicator color="white" size="small" />
            : <Text className="text-white font-semibold">{buttonText}</Text>
          }
        </Pressable>
      </View>
    </View>
  );
};

export default SearchForm;