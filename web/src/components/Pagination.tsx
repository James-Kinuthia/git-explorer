export interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    loading: boolean;
}

const Pagination = ({ currentPage, totalPages, onPageChange, loading }: PaginationProps) => {
    if (totalPages <= 1) return null;
    const btnClass = 'px-4 py-2 bg-gray-800 hover:bg-gray-700 disabled:bg-gray-900 disabled:cursor-not-allowed disabled:text-gray-600 text-white rounded-lg transition-colors border border-gray-700';

    return (
        <div className="flex justify-center items-baseline gap-2">
            <button
                type="button"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1 || loading}
                className={btnClass}
            >
                Previous
            </button>
            <span className="px-4 py-2 text-gray-400">
                Page {currentPage} of {totalPages}
            </span>
            <button
                type="button"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === 1 || loading}
                className={btnClass}
            >
                Next
            </button>

        </div>
    );
}

export default Pagination;