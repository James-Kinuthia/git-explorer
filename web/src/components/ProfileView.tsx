import React, { useState } from "react";
import { fetchRepos, fetchUserProfile} from "../services/githubApi";
import { Building, Calendar, Code, FileCode, Github, Link, Map, UserPlus, Users, type LucideIcon } from "lucide-react";
import type {GitHubRepo, GitHubUser} from '../services/githubApi'
import RepoCard from "./RepoCard";
import { formatDate } from "../utils/format";
import ErrorMessage from "./ErrorMessage";
import SearchForm from "./SearchForm";


export interface StatProps {
    icon: LucideIcon;
    label: string;
    value?: number | null;
    bgClass: string;
    borderClass: string;
    iconClass: string;
};

export interface InfoItemProps{
    condition?: string | null;
    icon: LucideIcon;
    label: string;
    value?: string | null;
    iconClass: string; 
    isLink?: boolean;
}

function ProfileView(){
    const [username, setUsername] = useState('');
    const [profile, setProfile] = useState<GitHubUser | null>(null);
    const [repos, setRepos] = useState<GitHubRepo[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSearch(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if(!username.trim()) return;

        setLoading(true);
        setError(null);
        setProfile(null);
        setRepos([]);

        try {
            const [userData, reposData] = await Promise.all([fetchUserProfile(username), fetchRepos(username)]);
            setProfile(userData);
            setRepos(reposData);
        } catch (error) {
             setError(error instanceof Error ? error.message : 'Something went wrong');
        } finally {
            setLoading(false);
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
            isLink: true
        },
    ];




    return(
        <div className={`bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 py-8 px-4 ${hasContent ? 'min-h-full' : 'h-full flex items-center justify-center'}`}>
            <div className={`max-w-6xl mx-auto ${hasContent ? '' : 'w-full'}`}>
                <div className='text-center mb-8'>
                    <h1 className='text-4xl font-bold text-white mb-2'>Github Profile Viewer</h1>
                    <p className='text-gray-400'>
                        Explore Github user profiles and their repositories
                    </p>
                </div>
                <SearchForm value={username} onChange={(e) => setUsername(e.target.value)} onSubmit={handleSearch} placeholder="Enter github username..." loading={loading} />
                <ErrorMessage message={error} />

                {profile && (
                    <div className='bg-linear-to-br from-gray-800 via-gray-800 to-gray-900 rounded-2xl shadow-2xl mb-8 border border-gray-700/50 backdrop-blur-sm'>
                        <div className='bg-linear-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 p-6 border-b border-gray-700/50'>
                            <div className='flex flex-col md:flex-row items-center md:items-start gap-6'>
                                <div className='relative shrink-0'>
                                    <div className='absolute inset-0 bg-linear-to-r from-blue-500 to-purple-500 rounded-full blur-lg opacity-50'></div>
                                    <img src={profile.avatar_url} alt={profile.name || profile.login} className='relative size-32 md:size-40 rounded-full border-4 border-gray-700 shadow-xl' />
                                </div>
                                <div className='flex-1 text-center md:text-left'>
                                    <h2 className='text-3xl md:text-4xl font-bold text-white mb-2'>
                                        {profile.name || profile.login}
                                    </h2>
                                    <p className="text-gray-400 text-lg mb-3 flex items-center justify-center md:justify-start">
                                        <Github className='text-gray-500' />
                                        @{profile.login}
                                    </p>
                                    {profile.bio &&
                                        <p className='text-gray-300 text-base mb-4 max-w-4xl'>
                                            {profile.bio}
                                        </p>
                                    }
                                    <a href={profile.html_url} target='_blank' rel='noopener noreferrer' className='inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105'>
                                        <Github />
                                        View on Github
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className='p-6 bg-gray-900/50'>
                            <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-6'>
                                {stats.map(({ icon: Icon, label, value, bgClass, borderClass, iconClass }) => (
                                    <div key={label} className={`bg-linear-to-br ${bgClass} p-4 rounded-xl border ${borderClass} transition-all duration-200 hover:scale-105`}>
                                        <div className={`flex items-center gap-2 ${iconClass} mb-2`}>
                                            <Icon className='text-lg' />
                                            <div className='text-gray-400 text-sm font-medium'>
                                                {label}
                                            </div>
                                            <div className='text-3xl font-bold text-white'>
                                                {value}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-700/50'>
                                {infoItems.map(({ condition, icon: Icon, label, value, iconClass, isLink }) => condition && (
                                    <div key={label} className='flex items-center gap-3 text-gray-300 p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors'>
                                        <Icon className={`${iconClass} shrink-0`} />
                                        <div className={isLink ? 'flex-1 min-w-0' : ''}>
                                            <div className='text-xs text-gray-500 uppercase tracking-wide'>
                                                {label}
                                            </div>
                                            {isLink ? <a href={value as string} target='_blank' rel='noopener noreferrer' className='text-blue-400 hover:underline font-semibold truncate block'>
                                                {value}
                                            </a> : <div className='font-semibold'>{value}</div>}
                                        </div>
                                    </div>
                                ))}
                                <div className='flex items-center gap-3 text-gray-300 p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors'>
                                    <Calendar className='text-purple-400 shrink-0' />
                                    <div>
                                        <div className='text-xs text-gray-500 uppercase tracking-wide'>
                                            Joined
                                            <div className='font-semibold'>
                                                {formatDate({dateString: profile.created_at})}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {repos.length > 0 && (
                    <div>
                        <h3 className='text-2xl font-bold text-white mb-4'>
                            Repositories ({repos.length})
                        </h3>
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                            {repos.map((repo) => <RepoCard key={repo.id} repo={repo} />)}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProfileView;