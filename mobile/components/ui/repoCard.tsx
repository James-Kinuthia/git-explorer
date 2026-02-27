import { Image, Pressable, View, Text } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import type { RepoCardProps } from '@/types/repo';
import { formatDate, formatNumber } from '@/types/time';
import { Clock, Star } from 'lucide-react-native';

export default function RepoCard({ repo, showOwner = false, variant = 'default', dateFormat }: RepoCardProps) {
    const isEnhanced = variant === 'enhanced';

    const baseClasses = isEnhanced
        ? 'rounded-xl p-6 gap-2 border border-gray-700'
        : 'rounded-lg p-4 gap-2 border border-gray-700';
    const statsLayout = isEnhanced ? 'flex-wrap flex-row items-center gap-4' : 'flex-row items-center gap-4';
    /*text-sm text-gray-500 */

    async function OpenLink() {
        await WebBrowser.openBrowserAsync(repo.html_url);
    }

    return (
        <Pressable
            className={`${baseClasses} bg-gray-800`}
            style={({ pressed }) => ({
                backgroundColor: pressed
                    ? '#2d2d2d'
                    : isEnhanced ? '#323232' : '#1f2937',
                borderRadius: isEnhanced ? 12 : 8,
                padding: 24,
                borderWidth: 1,
                borderColor: pressed && isEnhanced ? '#3b82f6' : '#374151',
                shadowColor: isEnhanced ? '#3b82f6' : 'transparent',
                shadowOpacity: isEnhanced ? 0.2 : 0,
                shadowRadius: 8,
                shadowOffset: { width: 0, height: 4 },
                elevation: isEnhanced ? 4 : 0, // Android shadow
            })}
        >
            <View className='flex items-start justify-between mb-3'>
                {isEnhanced ? (
                    <View className='flex-1 min-w-0'>
                        <Pressable className='mb-1' onPress={OpenLink}>
                            <Text className='text-lg text-gray-500 font-semibold truncate'>
                                {repo.full_name || repo.name}
                            </Text>
                            {showOwner && repo.owner &&
                                <Text className='text-base text-gray-200'>
                                    by {repo.owner.login}
                                </Text>
                            }
                        </Pressable>
                    </View>
                ) : (
                    <Pressable onPress={OpenLink} className='flex-1'>
                        <Text className='font-semibold text-base text-white truncate flex-1'>
                            {repo.full_name || repo.name}
                        </Text>
                    </Pressable>
                )}
                {repo.private &&
                    <View className='bg-yellow-600 rounded' style={{ flexShrink: isEnhanced ? 0 : 1 }}>
                        <Text className='ml-2 px-2 py-1 text-xs text-white'>
                            Private
                        </Text>
                    </View>
                }
            </View>
            {repo.description &&
                <Text numberOfLines={isEnhanced ? 2 : 3} className="text-gray-400 text-sm mb-4">
                    {repo.description}
                </Text>
            }
            <View className='flex flex-col gap-4'>
                {repo.language &&
                    <View className='flex mb-5 items-center flex-row'>
                        <View className='size-3 rounded-full bg-blue-500 mr-2' />
                        <Text className='text-gray-500 text-sm'>
                            {repo.language}
                        </Text>
                    </View>
                }
                <View className={`${statsLayout} flex-row w-full`}>
                    <View className='flex-row items-center gap-2'>
                        <Star size={18} color={"#030712"} />
                        <Text className='text-sm flex-row gap-1.5 items-center justify-center text-gray-700'>
                            {formatNumber(repo.stargazers_count)}
                        </Text>
                    </View>
                    <View className="flex-row items-center gap-2">
                        <Clock size={16} color={"#030712"} />
                        <Text className='text-sm  gap-1.5 justify-center items-center text-gray-700'>
                            {formatDate({ dateString: repo.updated_at, options: dateFormat })}
                        </Text>
                    </View>
                </View>
            </View>
            {showOwner && repo.owner && !isEnhanced &&
                <View className='flex-row items-center gap-2 mt-4'>
                    <Image source={{ uri: repo.owner.avatar_url }} className='size-6 rounded-full' />
                    <Text className='text-gray-500 text-sm'>
                        {repo.owner.login}
                    </Text>
                </View>
            }
        </Pressable>
    );
}