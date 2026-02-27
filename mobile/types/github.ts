export interface GitHubUser {
    login: string;
    id: number;
    avatar_url: string;
    html_url: string;
    name: string | null;
    bio: string | null;
    public_repos: number;
    public_gists: number;
    followers: number;
    following: number;
    company: string | null;
    location: string | null;
    blog: string | null;
    created_at: string;
}

export interface GitHubRepo {
    id: number;
    name: string;
    full_name: string;
    html_url: string;
    description: string | null;
    stargazers_count: number;
    forks_count: number;
    language: string | null;
    updated_at: string;
    private: boolean;
    owner:{
        login: string;
        avatar_url: string;
    }
}

export interface SearchResponse<T> {
    total_count: number;
    incomplete_results: boolean;
    items: T[];
}