const themeColors = {
    primary: {
        gradientFrom: '#6b42d3',
        gradientTo: '#455cd9',
        gradientHoverFrom: '#5f38c2',
        gradientHoverTo: '#3e50c4',
    },
    background: {
        gradientFrom: '#f5f7ff',
        gradientVia: '#f8faff',
        gradientTo: '#f5f3ff',
    },
    button: {
        gradientFrom: '#6b42d3',
        gradientTo: '#455cd9',
        gradientHoverFrom: '#5f38c2',
        gradientHoverTo: '#3e50c4',
    },
    optionCard: {
        selectedBg: '#eef2ff',
        selectedBorder: '#6366f1',
        selectedText: '#3730a3',
        unselectedBorderHover: '#cbd5e1',
        unselectedBgHover: '#f8fafc',
    },
    loader: {
        textColor: '#4f46e5',
    },
    alert: {
        gradientFrom: '#ef4444',
        gradientTo: '#dc2626',
        iconBg: '#fef2f2',
        iconColor: '#ef4444',
    }
};

const themeClasses = {
    // Buttons
    buttonGradient: "bg-gradient-to-r from-brandButton-from to-brandButton-to hover:from-brandButton-hoverFrom hover:to-brandButton-hoverTo",
    buttonShadow: "shadow-md shadow-brandButton-from/15 hover:shadow-lg hover:shadow-brandButton-from/25",
    
    // Backgrounds & Surfaces
    mainBackground: "bg-gradient-to-br from-brand-bgFrom via-brand-bgVia to-brand-bgTo",
    surfaceBlur: "backdrop-blur-xl bg-white/90 border-t border-slate-200/70 shadow-lg",
    surfaceCard: "bg-white rounded-3xl shadow-xl shadow-indigo-500/10 border border-slate-200/60",
    surfaceFooter: "bg-slate-50/80 border-t border-slate-100",
    surfaceEmptyState: "bg-gradient-to-b from-white/90 to-indigo-50/50 border-2 border-dashed border-indigo-200/80 shadow-sm",
    
    // Components
    optionCard: {
        selected: "bg-brandCard-selectedBg border-brandCard-selectedBorder text-brandCard-selectedText shadow-md shadow-indigo-500/5 ring-1 ring-indigo-500/20 font-semibold",
        unselected: "bg-white border-slate-200/70 hover:bg-brandCard-unselectedBgHover hover:border-brandCard-unselectedBorderHover hover:shadow-sm hover:text-slate-900",
        checkboxSelected: "bg-brandCard-selectedBorder border-brandCard-selectedBorder text-white shadow-2xs scale-105",
        checkboxUnselected: "border-2 border-slate-300 bg-white group-hover:border-slate-400"
    },
    searchBox: "bg-slate-100/90 border-slate-200 text-slate-900 focus:border-indigo-600 focus:bg-white shadow-2xs",
    
    
    // Progress Bar
    progressBar: {
        wrapper: "backdrop-blur-md bg-white/85 border-b border-slate-200/70 shadow-xs",
        backButton: "hover:bg-slate-100 text-slate-700 border-slate-200/80 shadow-2xs hover:border-slate-300",
        track: "bg-slate-200/80 shadow-inner",
        pill: "text-brand-from bg-brand-bgFrom border-brand-bgTo shadow-2xs",
        nextButton: "hover:bg-brand-bgFrom text-brand-to border-brand-bgVia shadow-2xs"
    },
        // Loader
    loader: {
        text: "text-brandLoader-text"
    },
    // Alert & Error specific
    errorAccentBar: "bg-gradient-to-r from-brandAlert-from to-brandAlert-to",
    errorIconWrapper: "bg-brandAlert-iconBg ring-8 ring-brandAlert-iconBg/50",
    errorIconDot: "bg-brandAlert-to border-white shadow-sm",
    emptyStateIconWrapper: "bg-brand-bgFrom text-brand-to shadow-inner ring-4 ring-white",
    
    // Ambient Orbs
    ambientOrb1: "bg-indigo-200/35 blur-3xl",
    ambientOrb2: "bg-indigo-200/25 blur-3xl",
    ambientOrb3: "bg-sky-200/35 blur-3xl",

    // Colors
    text: {
        primary: "text-slate-800",
        secondary: "text-slate-500",
        tertiary: "text-slate-400",
        accent: "text-brand-to",
        pill: "text-brand-from",
        error: "text-brandAlert-from",
        errorIcon: "text-brandAlert-iconColor",
        optionSelected: "text-indigo-900",
        optionUnselected: "text-slate-700",
    },
    bg: {
        pill: "bg-brand-bgFrom border-brand-bgTo",
        error: "bg-brandAlert-iconBg border-brandAlert-from/20",
    },
    
    // Typography Examples based on your list
    typography: {
        displayLarge: "text-4xl sm:text-5xl font-bold tracking-tight",
        displayMedium: "text-3xl sm:text-4xl font-bold tracking-tight",
        displaySmall: "text-2xl sm:text-3xl font-bold tracking-tight",
        
        headlineLarge: "text-xl sm:text-2xl md:text-[28px] font-bold tracking-tight leading-snug",
        headlineMedium: "text-[22px] sm:text-2xl font-bold tracking-tight leading-snug",
        headlineSmall: "text-[17px] sm:text-[18px] font-bold tracking-tight leading-[1.35]",
        
        titleLarge: "text-[16px] sm:text-[18px] font-semibold leading-normal",
        titleMedium: "text-[15px] sm:text-[16px] font-medium leading-normal",
        titleSmall: "text-[14px] sm:text-[15px] font-medium leading-normal",
        
        bodyLarge: "text-[15px] sm:text-[16px] font-medium leading-relaxed",
        bodyMedium: "text-[13px] sm:text-[14.5px] font-medium",
        bodySmall: "text-[12.5px] sm:text-[13.5px] font-medium",
        
        labelLarge: "text-[14px] font-semibold tracking-wide",
        labelMedium: "text-[12px] font-semibold tracking-wider uppercase",
        labelSmall: "text-[10px] sm:text-[11px] font-bold tracking-wider uppercase",
    }
};

module.exports = { themeColors, themeClasses };
