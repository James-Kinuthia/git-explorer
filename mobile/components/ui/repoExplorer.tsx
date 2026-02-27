import { searchRepos } from "@/services/githubApi";
import { GitHubRepo } from "@/types/github";
import type { RepoFilterProps } from "@/types/repo";
import { useRef, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import SearchForm from "./searchForm";
import RepoFilters from "./repoFilters";
import ErrorMessage from "./errorMessage";
import RepoCard from "./repoCard";
import Pagination from "./pagination";
import { useSafeAreaInsets } from "react-native-safe-area-context";



export default function RepoExplorer() {
    const [query, setQuery] = useState('');
    const [repos, setRepos] = useState<GitHubRepo[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [totalCount, setTotalCount] = useState(0);
    const [page, setPage] = useState(1);
    const [hasSearched, setHasSearched] = useState(false);
    const [sort, setSort] = useState<RepoFilterProps['sort']>('stars');
    const [order, setOrder] = useState<RepoFilterProps['order']>('desc');

    const insets = useSafeAreaInsets();
    const flatListRef = useRef<FlatList>(null);

    async function performSearch(
        pageNum: number = 1,
        sortValue: string = sort ?? 'stars',
        orderValue: string = order ?? 'desc'
    ) {
        if (!query.trim()) return;
        setLoading(true);
        setError(null);
        setPage(pageNum);
        try {
            const data = await searchRepos(query, pageNum, 30, sortValue, orderValue);
            setRepos(data.items);
            setTotalCount(data.total_count);
            setHasSearched(true);

            //scroll to top after page loads next data from pagination
            flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Something went wrong');
            setRepos([]);
            setTotalCount(0);
        } finally {
            setLoading(false);
        }

    }

    async function handleSearch() {
        await performSearch();
    }

    function handleFilterChange(type: 'sort' | 'order', value: RepoFilterProps['sort'] | RepoFilterProps['order']) {
        if (type === 'sort') setSort(value as RepoFilterProps['sort']);
        else setOrder(value as RepoFilterProps['order']);
        if (hasSearched && query.trim()) {
            performSearch(1, type === 'sort' ? value : sort, type === 'order' ? value : order);
        }
    }
    const totalPages = Math.ceil(totalCount / 30);


    return (
        <LinearGradient
            colors={['#111287', '#1f2937', '#111287']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ flex: 1 }}
        >
            <FlatList
                data={repos}
                numColumns={1}
                contentContainerStyle={{ paddingTop: 32, paddingBottom: insets.bottom + 30, paddingHorizontal: 12, gap: 6 }}
                keyExtractor={(item) => item.id.toString()}
                ListHeaderComponent={
                    <View style={{ marginTop: hasSearched ? 0 : 40, marginBottom: 30 }}>
                        <View className="mb-8">
                            <Text className="text-white text-4xl text-center mb-2 font-bold">
                                Github Repository Explorer
                            </Text>
                            <Text className="text-gray-400 text-base text-center">
                                Search and Explore Github Repositories
                            </Text>
                        </View>
                        <SearchForm
                            value={query}
                            onChangeText={setQuery}
                            onSubmit={handleSearch}
                            placeholder="Search repositories (e.g., react, python, expo)..."
                            loading={loading}
                        />
                        {hasSearched && (
                            <RepoFilters
                                sort={sort}
                                order={order}
                                onSortChange={(v) => handleFilterChange('sort', v)}
                                onOrderChange={(v) => handleFilterChange('order', v)}
                                disabled={loading}
                            />
                        )}
                        <ErrorMessage message={error} className="max-w-3xl" />
                        {hasSearched && !loading && (
                            <View className="mb-6 flex-row gap-2  items-center">
                                <Text className="text-gray-400 text-base">Found:</Text>
                                <Text className="text-white font-semibold text-base">
                                    {totalCount.toString()} repositories
                                </Text>
                            </View>
                        )}
                    </View>
                }
                ListFooterComponent={
                    totalPages > 1 ? (
                        <Pagination
                            currentPage={page}
                            totalPages={totalPages}
                            onPageChange={(pageNum) => performSearch(pageNum)}
                            loading={loading}
                        />
                    ) : null
                }
                ListEmptyComponent={
                    hasSearched && !loading && !error ? (
                        <View className="py-12 items-center">
                            <Text className="text-gray-400 text-base">
                                No Repositories Found. Try a different search query
                            </Text>
                        </View>
                    ) : null
                }
                renderItem={({ item }) => (
                    <RepoCard
                        repo={item}
                        showOwner={false}
                        variant="enhanced"
                        dateFormat={{ year: 'numeric', month: 'short', day: 'numeric' }}
                    />
                )}
            />
        </LinearGradient>
    );
}