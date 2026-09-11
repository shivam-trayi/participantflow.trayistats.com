# Participant Flow - Unified Enterprise Architecture

This repository is a unified React application that consolidates 5 legacy frontend repositories into a single, domain-driven architecture utilizing Tailwind CSS.

## 🏗️ Folder Structure (Feature-Sliced Design)

\\\	ext
participantflow.trayistats.com/
│
├── .env.*                      # Environment variables for different stages (dev, staging, prod)
├── index.html                  # Root HTML template
├── tailwind.config.js          # Tailwind CSS Configuration
├── .eslintrc.json              # ESLint Configuration
│
└── src/
    ├── App.js                  # Main Router configuration
    ├── index.js                # React DOM entry point
    │
    ├── assets/                 # Global assets (App.css, index.css, Images)
    ├── components/             # Global reusable UI Components (Loader, AlertMessage)
    ├── contexts/               # Global React Contexts (ThemeContext, LanguageContext)
    ├── hooks/                  # Shared Custom Hooks (useBotDetector, useUserActivity)
    ├── locales/                # i18n Localization files (en.json, ar.json)
    ├── services/               # External connections (API Axios wrapper, Tracking SDKs)
    ├── store/                  # Global Redux Toolkit Store & Slices
    ├── theme/                  # Global Design System (colors.js, typography.js)
    ├── utils/                  # Shared Utility Functions (hash.js, getFingerprint)
    │
    ├── features/               # Core Business Logic & Feature Modules
    │   └── screening/          # Screening feature module
    │       ├── ui/             # Feature-specific components
    │       └── demographics.js # Feature logic
    │
    └── pages/                  # Route Entry Points (The 5 Legacy Repos)
        ├── entry/              # Route for user.trayistats.com
        ├── success/            # Route for success.trayistats.com
        ├── terminate/          # Route for terminate.trayistats.com
        ├── quotafail/          # Route for quotafail.trayistats.com
        └── securityfail/       # Route for securityfail.trayistats.com
\\\

## 🚀 Tech Stack
- React
- Redux Toolkit
- Tailwind CSS (Configured with Centralized Theme)
- ESLint (Standardized rules)
