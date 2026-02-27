import { GitHubRepo } from "./github";

export interface RepoCardProps {
    dateFormat?: Intl.DateTimeFormatOptions;
    repo: GitHubRepo;
    showOwner?: boolean;
    variant?: 'default' | 'enhanced';
}

export interface RepoFilterProps {
    sort?: 'stars' | 'forks' | 'updates' | 'help-wanted-issues';
    order?: 'asc' | 'desc';
    disabled: boolean;
    onSortChange: (value: NonNullable<RepoFilterProps['sort']>) => void;
    onOrderChange: (value: NonNullable<RepoFilterProps['order']>) => void;
}