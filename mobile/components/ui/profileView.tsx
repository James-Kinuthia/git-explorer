import { fetchRepos, fetchUserProfile } from "@/services/githubApi";
import { GitHubRepo, GitHubUser } from "@/types/github";
import { InfoItemProps, StatProps } from "@/types/profile";
import { LinearGradient } from "expo-linear-gradient";
import { Building, Calendar, Code, FileCode, Github, Link, Map, UserPlus, Users } from "lucide-react-native";
import { useState } from "react";
import { Image, Pressable, ScrollView, View, Text, useWindowDimensions } from "react-native";
import SearchForm from "./searchForm";
import ErrorMessage from "./errorMessage";
import * as WebBrowser from 'expo-web-browser';
import RepoCard from "./repoCard";
import StatCard from "./statCard";
import { useSafeAreaInsets } from "react-native-safe-area-context";



// Info item component
function InfoItem({ condition, icon: Icon, label, value, iconClass, isLink }: InfoItemProps) {
    if (!condition) return null;

    const iconColorMap: Record<string, string> = {
        'text-blue-400': '#60a5fa',
        'text-red-400': '#f87171',
        'text-green-400': '#4ade80',
        'text-purple-400': '#c084fc',
    };

    const iconColor = iconColorMap[iconClass] ?? '#60a5fa';

    async function handlePress() {
        if (isLink && value) {
            const url = value.startsWith('http') ? value : `https://${value}`;
            await WebBrowser.openBrowserAsync(url);
        }
    }

    return (
        <View className="flex-row items-center gap-3 p-3 rounded-lg bg-gray-800/50 mb-2">
            <Icon size={18} color={iconColor} />
            <View className="flex-1 min-w-0">
                <Text className="text-xs text-gray-500 uppercase tracking-wide">{label}</Text>
                {isLink ? (
                    <Pressable onPress={handlePress}>
                        <Text className="text-blue-400 font-semibold line-clamp-1">
                            {value}
                        </Text>
                    </Pressable>
                ) : (
                    <Text className="text-gray-200 font-semibold">{value}</Text>
                )}
            </View>
        </View>
    );
}

function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

export default function ProfileView() {
    const [username, setUsername] = useState('');
    const [profile, setProfile] = useState<GitHubUser | null>(null);
    const [repos, setRepos] = useState<GitHubRepo[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { height } = useWindowDimensions();

    async function handleSearch() {
        if (!username.trim()) return;

        setLoading(true);
        setError(null);
        setProfile(null);
        setRepos([]);

        try {
            const [userData, reposData] = await Promise.all([
                fetchUserProfile(username),
                fetchRepos(username),
            ]);
            setProfile(userData);
            setRepos(reposData);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Something went wrong');
        } finally {
            setLoading(false);
        }
    }

    async function openBrowserLink() {
        if (profile?.html_url) {
            await WebBrowser.openBrowserAsync(profile.html_url);
        }
    }

    const hasContent = profile || repos.length > 0;

    const stats: StatProps[] = [
        {
            icon: Code,
            label: 'Repositories',
            value: profile?.public_repos,
            bgClass: 'from-blue-600/20 to-blue-800/20',
            borderClass: 'border-blue-500/30 hover:border-blue-400/50',
            iconClass: 'text-blue-400',
        },
        {
            icon: Users,
            label: 'Followers',
            value: profile?.followers,
            bgClass: 'from-green-600/20 to-green-800/20',
            borderClass: 'border-green-500/30 hover:border-green-400/50',
            iconClass: 'text-green-400',
        },
        {
            icon: UserPlus,
            label: 'Following',
            value: profile?.following,
            bgClass: 'from-purple-600/20 to-purple-800/20',
            borderClass: 'border-purple-500/30 hover:border-purple-400/50',
            iconClass: 'text-purple-400',
        },
        {
            icon: FileCode,
            label: 'Gists',
            value: profile?.public_gists,
            bgClass: 'from-orange-600/20 to-orange-800/20',
            borderClass: 'border-orange-500/30 hover:border-orange-400/50',
            iconClass: 'text-orange-400',
        },
    ];

    const infoItems: InfoItemProps[] = [
        {
            condition: profile?.company,
            icon: Building,
            label: 'Company',
            value: profile?.company,
            iconClass: 'text-blue-400',
        },
        {
            condition: profile?.location,
            icon: Map,
            label: 'Location',
            value: profile?.location,
            iconClass: 'text-red-400',
        },
        {
            condition: profile?.blog,
            icon: Link,
            label: 'Blog',
            value: profile?.blog,
            iconClass: 'text-green-400',
            isLink: true,
        },
    ];

    const insets = useSafeAreaInsets();

    return (
        <LinearGradient
            colors={['#111287', '#1f2937', '#111287']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ flex: 1, minHeight: height }}
        >
            <ScrollView
                showsVerticalScrollIndicator={true}
                style={{  paddingBottom: insets.bottom + 80, paddingHorizontal: 12, minHeight: height }}
                contentContainerStyle={!hasContent ? { flex: 1, alignItems: 'center', justifyContent: 'center' } : undefined}
            >
                <View style={hasContent ? { width: '100%' } : undefined} className="max-w-6xl mt-20 mx-auto gap-3">
                    {/* Header */}
                    <View className="w-screen mx-auto flex-1">
                        <View className="items-center jutify-center w-full mb-3.5">
                            <Text className="text-white text-center text-3xl font-bold mb-2">
                                Github Profile Viewer
                            </Text>
                            <Text className="text-gray-400 text-base text-center">
                                Explore Github user profiles and their repositories
                            </Text>
                        </View>
                        <SearchForm
                            value={username}
                            onChangeText={setUsername}
                            onSubmit={handleSearch}
                            placeholder="Enter github username..."
                            loading={loading}
                        />
                        <ErrorMessage message={error} />
                    </View>


                    {/* Profile card */}
                    {profile && (
                        <LinearGradient
                            colors={['#1f2937', '#1f2937', '#111827']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={{ borderRadius: 16, marginBottom: 32, borderWidth: 1, borderColor: 'rgba(55,65,81,0.5)' }}
                        >
                            {/* Avatar + bio section */}
                            <LinearGradient
                                colors={['rgba(37,99,235,0.2)', 'rgba(147,51,234,0.2)', 'rgba(219,39,119,0.2)']}
                                start={{ x: 0, y: 0.5 }}
                                end={{ x: 1, y: 0.5 }}
                                style={{ padding: 24, borderBottomWidth: 1, borderBottomColor: 'rgba(55,65,81,0.5)', borderTopLeftRadius: 16, borderTopRightRadius: 16 }}
                            >
                                <View className="items-center gap-6">
                                    {/* Avatar */}
                                    <View className="relative">
                                        <Image
                                            source={{ uri: profile.avatar_url }}
                                            style={{ width: 128, height: 128, borderRadius: 64, borderWidth: 4, borderColor: '#374151' }}
                                        />
                                    </View>

                                    {/* Name / login / bio / CTA */}
                                    <View className="flex-1 items-center">
                                        <Text className="text-white text-2xl font-bold text-center mb-1">
                                            {profile.name || profile.login}
                                        </Text>
                                        <View className="flex-row items-center gap-1 mb-3">
                                            <Github size={16} color="#6b7280" />
                                            <Text className="text-gray-400 text-base">
                                                @{profile.login}
                                            </Text>
                                        </View>
                                        {profile.bio && (
                                            <Text className="text-gray-300 mb-4 text-center">
                                                {profile.bio}
                                            </Text>
                                        )}
                                        <Pressable onPress={openBrowserLink}>
                                            {({ pressed }) => (
                                                <LinearGradient
                                                    colors={pressed ? ['#1d4ed8', '#7e22ce'] : ['#2563eb', '#9333ea']}
                                                    start={{ x: 0, y: 0 }}
                                                    end={{ x: 1, y: 0 }}
                                                    style={{
                                                        flexDirection: 'row',
                                                        alignItems: 'center',
                                                        gap: 8,
                                                        paddingHorizontal: 24,
                                                        paddingVertical: 12,
                                                        borderRadius: 8,
                                                        opacity: pressed ? 0.9 : 1,
                                                    }}
                                                >
                                                    <Github size={18} color="#fff" />
                                                    <Text className="text-white text-base">
                                                        View on Github
                                                    </Text>
                                                </LinearGradient>
                                            )}
                                        </Pressable>
                                    </View>
                                </View>
                            </LinearGradient>

                            {/* Stats grid */}
                            <View style={{ padding: 24, backgroundColor: 'rgba(17,24,39,0.5)' }}>
                                {/* 2-column grid using two rows of FlatList */}
                                <View style={{ flexDirection: 'column', marginBottom: 8 }}>
                                    {stats.slice(0, 2).map((stat) => (
                                        <StatCard key={stat.label} {...stat} />
                                    ))}
                                </View>
                                <View style={{ flexDirection: 'column', marginBottom: 24 }}>
                                    {stats.slice(2, 4).map((stat) => (
                                        <StatCard key={stat.label} {...stat} />
                                    ))}
                                </View>

                                {/* Info items */}
                                <View style={{ borderTopWidth: 1, borderTopColor: 'rgba(55,65,81,0.5)', paddingTop: 16 }}>
                                    {infoItems.map((item) => (
                                        <InfoItem key={item.label} {...item} />
                                    ))}

                                    {/* Joined date */}
                                    <View className="flex-row items-center gap-3 p-3 rounded-lg bg-gray-800/50 mb-2">
                                        <Calendar size={18} color="#c084fc" />
                                        <View>
                                            <Text className="text-xs text-gray-500 uppercase tracking-wide">Joined</Text>
                                            <Text className="text-gray-200 font-semibold">
                                                {formatDate(profile.created_at)}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </LinearGradient>
                    )}

                    {/* Repos list */}
                    {repos.length > 0 && (
                        <View style={{marginBottom: 24}}>
                            <Text className="text-white text-xl font-bold mb-4">
                                Repositories ({repos.length})
                            </Text>
                            <View style={{ gap: 10 }}>
                                {repos.map((repo) => (
                                    <RepoCard
                                        key={repo.id}
                                        repo={repo}
                                        showOwner={false}
                                        variant="enhanced"
                                        dateFormat={{ year: 'numeric', month: 'short', day: 'numeric' }}
                                    />
                                ))}
                            </View>
                        </View>
                    )}
                </View>
            </ScrollView>
        </LinearGradient>
    );
}