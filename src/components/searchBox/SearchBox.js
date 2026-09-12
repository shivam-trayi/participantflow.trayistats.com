import React from 'react';
import { Search, X } from 'lucide-react';
import { themeClasses } from '../../theme/themeConfig';

const SearchBox = ({ searchQuery, setSearchQuery }) => {
    return (
        <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search options..."
                className={`w-full h-10 sm:h-11 pl-9 pr-8 text-[14px] sm:text-[15px] rounded-xl border outline-none transition-all ${themeClasses.searchBox}`}
            />
            {searchQuery && (
                <button type="button" onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-slate-200">
                    <X className="w-3.5 h-3.5 text-slate-400" />
                </button>
            )}
        </div>
    );
};

export default SearchBox;
