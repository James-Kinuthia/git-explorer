import { GitHubRepo, GitHubUser, SearchResponse } from "@/types/github";

const GIT_BASE_URL = process.env.EXPO_PUBLIC_GIT_BASE_URL || 'https://api.github.com';

const getHeaders = () => {
    const token = process.env.EXPO_PUBLIC_GITHUB_KEY;
    if (!token) throw new Error('GitHub API key is not defined. Check your .env file.');
    
    return {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28'
    };
};


async function handleResponse<T>(response: Response, errorMsg: string): Promise<T> {
    if (!response.ok) {
        if (response.status === 404 && errorMsg.includes("User")) {
            throw new Error("User not found");
        }
        throw new Error(errorMsg);
    }

    return await response.json() as T;
}

export async function fetchUserProfile(username: string): Promise<GitHubUser> {
    const response = await fetch(`${GIT_BASE_URL}/users/${username}`, { headers: getHeaders() });
    return handleResponse<GitHubUser>(response, 'failed to fetch user profile');
}

export async function fetchRepos(username: string, page = 1, perPage = 30): Promise<GitHubRepo[]> {
    const response = await fetch(`${GIT_BASE_URL}/users/${username}/repos?page=${page}&per_page=${perPage}&sort=updated`,
        { headers: getHeaders() }
    );
    return handleResponse<GitHubRepo[]>(response, 'Failed to fetch repositories');
}

export async function searchRepos(query: string, page = 1, perPage = 30, sort = 'stars', order = "desc") {
    const params = new URLSearchParams({
        q: query,
        page: page.toString(),
        per_page: perPage.toString(),
        sort,
        order
    });
    const response = await fetch(`${GIT_BASE_URL}/search/repositories?${params.toString()}`, { headers: getHeaders() });
    return handleResponse<SearchResponse<GitHubRepo>>(response, 'Failed to find search queries');
}

export async function fetchRepoDetails(owner: string, repo: string): Promise<GitHubRepo> {
    const response = await fetch(`${GIT_BASE_URL}/repos/${owner}/${repo}`, {headers: getHeaders()});
    return handleResponse<GitHubRepo>(response, 'Failed to fetch repository details');
}