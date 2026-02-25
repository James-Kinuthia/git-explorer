export interface FormatDateArgs{
    dateString: string;
    //Date has a special built-in Type to get autocompletions for date metrics
    options?: Intl.DateTimeFormatOptions;
}

export function formatDate({dateString, options = {}}: FormatDateArgs): string{
    // return the formatted result
    return new Date(dateString).toLocaleDateString('en-Ke', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        ...options
    });
}

//handle k formatting for numbers exceeding 1000
export const formatNumber = (num: number): string => num >= 1000 ? (num/1000).toFixed(1) + 'k': num.toString();