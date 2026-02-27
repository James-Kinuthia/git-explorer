const GIT_BASE_URL = 'https://api.github.com';

// 1. Define the shapes of the data we expect from GitHub
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


const headers = {
    'Authorization': `Bearer ${import.meta.env.VITE_GITHUB_KEY}`,
    'Accept': 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28'
};

// 2. Use a Generic <T> so the helper returns the correct type
async function handleResponse<T>(response: Response, errorMsg: string): Promise<T> {
    if (!response.ok) {
        if (response.status === 404 && errorMsg.includes("User")) {
            throw new Error("User not found");
        }
        throw new Error(errorMsg);
    }

    return await response.json() as T; 
}

// 3. Explicitly type the return values of your functions
export async function fetchUserProfile(username: string): Promise<GitHubUser> {
    const response = await fetch(`${GIT_BASE_URL}/users/${username}`, {headers});
    return handleResponse<GitHubUser>(response, 'Failed to fetch user profile');
}

export async function fetchRepos(username: string, page = 1, perPage = 30): Promise<GitHubRepo[]> {
    const response = await fetch(
        `${GIT_BASE_URL}/users/${username}/repos?page=${page}&per_page=${perPage}&sort=updated`,
        {headers}
    );
    return handleResponse<GitHubRepo[]>(response, 'Failed to fetch user repositories');
}

export async function searchRepos(query: string, page = 1, perPage = 30, sort = 'stars', order = 'desc') {
    // Note: GitHub API uses per_page (snake_case)
    const params = new URLSearchParams({ 
        q: query, 
        page: page.toString(), 
        per_page: perPage.toString(), 
        sort, 
        order 
    });
    
    const response = await fetch(`${GIT_BASE_URL}/search/repositories?${params.toString()}`, {headers});
    return handleResponse<SearchResponse<GitHubRepo>>(response, 'Failed to find search queries');
}

export async function fetchRepoDetails(owner: string, repo: string): Promise<GitHubRepo> {
    const response = await fetch(`${GIT_BASE_URL}/repos/${owner}/${repo}`, {headers});
    return handleResponse<GitHubRepo>(response, 'Failed to fetch repository details');
}