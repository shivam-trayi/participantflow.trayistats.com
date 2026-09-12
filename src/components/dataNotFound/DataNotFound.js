import React from 'react';
import { Search } from 'lucide-react';
import { themeClasses } from '../../theme/themeConfig';

const DataNotFound = ({ searchQuery }) => {
    return (
        <div className="text-center py-10 flex flex-col items-center justify-center space-y-2.5 bg-white/80 rounded-2xl border border-dashed border-slate-300 p-6 shadow-xs">
            <Search className="w-7 h-7 text-slate-400" />
            <p className="text-sm font-medium text-slate-600">
                No options match <span className="font-bold text-slate-900">{searchQuery}</span>
            </p>
        </div>
    );
};

export default DataNotFound;
