import React, { useState } from "react";
import { searchRepos } from "../services/githubApi";
import type { GitHubRepo } from "../services/githubApi";
import SearchForm from "./SearchForm";
import ErrorMessage from "./ErrorMessage";
import RepoFilters, { type FilterProps } from "./RepoFilters";
import RepoCard from "./RepoCard";
import Pagination from "./Pagination";

export default function RepoExplorer() {
    const [query, setQuery] = useState('');
    const [repos, setRepos] = useState<GitHubRepo[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [totalCount, setTotalCount] = useState(0);
    const [page, setPage] = useState(1);
    const [hasSearched, setHasSearched] = useState(false);
    const [sort, setSort] = useState<FilterProps['sort']>('stars');
    const [order, setOrder] = useState<FilterProps['order']>('desc');

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
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Something went wrong');
            setRepos([]);
            setTotalCount(0);
        } finally {
            setLoading(false);
        }
    }

    async function handleSearch(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        await performSearch();
    }

    function handleFilterChange(type: 'sort' | 'order', value: FilterProps['sort'] | FilterProps['order']) {
        if (type === 'sort') setSort(value as FilterProps['sort']);
        else setOrder(value as FilterProps['order']);
        if (hasSearched && query.trim()) {
            performSearch(1, type === 'sort' ? value : sort, type === 'order' ? value : order);
        }
    }

    const totalPages = Math.ceil(totalCount / 30);
    const containerClass = `bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8 px-4 ${hasSearched ? 'min-h-full' : 'h-full items-center justify-center'}`;

    return (
        <div className={containerClass}>
            <div className={`max-w-7xl mx-auto ${hasSearched ? '' : 'w-full'}`}>
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">
                        Github Repository Explorer
                    </h1>
                    <p className="text-gray-400">Search and Explore Github Repositories</p>
                </div>
                <SearchForm value={query} onChange={(e) => setQuery(e.target.value)} onSubmit={handleSearch} placeholder={"Search repositories (e.g., react, python, expo)..."} loading={loading} />
                {hasSearched && <RepoFilters sort={sort} order={order} onSortChange={(v) => handleFilterChange('sort', v)} onOrderChange={(v) => handleFilterChange('order', v)} disabled={loading} />}
                <ErrorMessage message={error} className="max-w-3xl" />
                {hasSearched && !loading &&
                    <div className="mb-6 text-center">
                        <p className="text-gray-400">Found <span className="text-white font-semibold">{totalCount.toString()}</span> repositories</p>
                    </div>
                }
                {repos.length > 0 && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {repos.map((repo) => <RepoCard key={repo.id} repo={repo} showOwner={true} variant="enhanced" dateFormat={{ year: 'numeric', month: 'short', day: 'numeric' }} />)}
                        </div>
                        <Pagination currentPage={page} totalPages={totalPages} onPageChange={(pageNum) => performSearch(pageNum)} loading={loading} />
                    </>
                )}
                {hasSearched && repos.length === 0 && !loading && !error &&
                    <div className="text-center py-12">
                        <p className="text-gray-400 text-lg">No Repositories Found. Try a different search query.</p>
                    </div>
                }
            </div>
        </div>
    );
}