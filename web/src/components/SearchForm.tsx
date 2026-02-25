export interface SearchProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
    loading: boolean;
    buttonText?: string;
    onSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void;
}

function SearchForm({ value, onSubmit, onChange, placeholder, loading, buttonText = 'Search' }: SearchProps) {

    return (
        <form onSubmit={onSubmit} className="mb-8">
            <div className="flex gap-4 max-w-2xl mx-auto">
                <input type="text" value={value} onChange={onChange} placeholder={placeholder}
                    className="flex-1 px-6 py-4 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                <button type="submit" disabled={loading} className="px-8 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors duration-200">
                    {loading ? 'Searching...' : buttonText}
                </button>
            </div>
        </form>
    )
}

export default SearchForm;