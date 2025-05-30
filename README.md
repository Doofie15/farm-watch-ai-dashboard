# FarmWatch AI Dashboard

An admin dashboard for visualizing and managing farm watch incidents reported via WhatsApp and analyzed by AI. Displays incident details, locations on a map, and provides analytics.

## Features

*   **Dashboard Overview**: Summary statistics, recent incidents table, and key charts (incidents over time, by type, by severity).
*   **Live Incident Map**: Real-time (mocked) view of incidents on Google Maps, with heatmap and clustering options. Supports manual and AI-powered natural language search for filtering incidents.
*   **Incident Management**:
    *   Manually add new incidents with detailed information, including location pinning on a map.
    *   View detailed information for each incident in a modal.
    *   Update incident status and admin notes.
*   **Reporter Directory**:
    *   List all reporters with search and sort functionality.
    *   Add new reporters and edit existing reporter details (including contact info, user type, trusted status, farm name, agricultural union membership, city, and home GPS location).
    *   View detailed reporter profiles including their reporting history and statistics.
*   **WhatsApp Message Log**:
    *   View a list of (mock) incoming WhatsApp messages.
    *   Link messages to existing incidents or mark as read/unread.
    *   View message details.
*   **Enhanced Analytics Hub**:
    *   Geographic distribution charts (by town, municipality, district, province).
    *   Interactive charts with multiple visualization options:
        *   Incidents by type (pie/donut/bar chart) with time range filtering.
        *   Incidents by severity (pie/donut/bar chart) with time range filtering.
        *   Severity breakdown by incident type (stacked/vertical/horizontal bar chart) with time range filtering.
        *   Incidents over time (line/area/bar chart) with time range filtering and statistical context.
        *   Top reporters by incident count (bar chart).
        *   Incident reports by reporter type (pie/donut chart).
    *   All charts include enhanced tooltips and empty state handling.
*   **Comprehensive Configuration Management**:
    *   Separate configuration pages for:
        *   **Incident Types**: Manage labels, active status, and dynamically add/delete custom types.
        *   **Severities**: Manage labels, active status, and dynamically add/delete custom severities.
        *   **Statuses**: Manage labels, active status, and dynamically add/delete custom statuses.
        *   **User Types**: Manage labels, active status, and dynamically add/delete custom user types.
        *   **AI Settings**: Configure AI model and confidence threshold.
        *   **Integrations**: Manage (mock) webhook URLs.
        *   **System Settings**: Configure data retention and admin alert email.
    *   All configurations are persisted in `localStorage`.
*   **Simulated Authentication**:
    *   Login and Registration pages.
    *   User session managed via `sessionStorage`.
    *   User credentials (simulated) stored as part of app configuration in `localStorage`.
*   **Responsive Design**: Adapts to various screen sizes.
*   **Enhanced User Profile Page**: Comprehensive user profile with tabs for personal information, security settings, notifications, activity logs, and farm details.
*   **User Settings Page**: Placeholder for theme, language, and notification preferences.

## Recent Updates

### May 2025 Update

* **Enhanced Charts and Visualizations**:
  * Added multiple visualization options to all charts (pie/donut/bar for type and severity charts, line/area/bar for time-based charts)
  * Implemented time range filtering (week/month/all) across all charts
  * Added improved tooltips with percentage calculations and better formatting
  * Implemented consistent empty state handling for all charts

* **User Experience Improvements**:
  * Added pagination to incident tables (10 rows per page)
  * Implemented a comprehensive user profile page with multiple tabs
  * Added quick admin login option for development purposes

* **Code Quality and Performance**:
  * Fixed React hooks issues in chart components
  * Improved TypeScript type safety throughout the application
  * Implemented barrel exports for profile components

## Tech Stack

*   **React 19**: Frontend library (using ES modules via esm.sh).
*   **TypeScript**: For static typing.
*   **Tailwind CSS**: Utility-first CSS framework (via CDN).
*   **Google Maps API**: For displaying incident locations.
*   **Google Gemini API (`@google/genai`)**: For AI-powered search and future AI features.
*   **Recharts**: For data visualization and charts.
*   **@googlemaps/markerclusterer**: For clustering map markers.

## Prerequisites

*   A modern web browser (e.g., Chrome, Firefox, Edge, Safari).
*   For AI features, a valid Google Gemini API key.
*   For map features, a valid Google Maps API key.

## Setup and Running Locally

This project is designed to run directly in the browser using ES modules and CDNs, requiring no local build step for basic execution.

1.  **Download/Clone Files**: Get all the project files (`index.html`, `index.tsx`, `components/`, `hooks/`, etc.) into a local directory.
2.  **API Keys**:
    *   **Google Gemini API Key**:
        *   The application expects this key to be available via `process.env.API_KEY`.
        *   For local testing *without a build step that injects environment variables*, you would need to manually replace `process.env.API_KEY` in `components/LiveMapView.tsx` (and any other files directly calling the Gemini API) with your actual API key string.
    *   **Google Maps API Key**:
        *   This key is currently included in the `<script>` tag in `index.html`:
            ```html
            <script async defer src="https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY&libraries=visualization,marker&callback=initMap" id="google-maps-script"></script>
            ```
        *   Replace `YOUR_GOOGLE_MAPS_API_KEY` with your actual Google Maps API key. The provided key `AIzaSyD3wWF2a8TwWnXG7W_8ALtydF1si4JCpOY` is already in place.
3.  **Open in Browser**:
    *   Simply open the `index.html` file directly in your web browser.
    *   Alternatively, serve the project directory using a simple local HTTP server (e.g., using the "Live Server" extension in VS Code, or `python -m http.server` in the project's root directory).

## Building for Production

No explicit "build" step (like `npm run build`) is required due to the CDN-based setup. The existing files are static assets ready for deployment.

## GitHub Repository

The FarmWatch AI Dashboard is hosted on GitHub, where you can find the latest code, contribute to the project, or report issues:

* **Repository**: [github.com/Doofie15/farm-watch-ai-dashboard](https://github.com/Doofie15/farm-watch-ai-dashboard)
* **Issues**: Please report any bugs or feature requests through the GitHub issues page
* **Contributions**: Pull requests are welcome! Please see our contributing guidelines

## Deployment to Netlify

1.  **Push to a Git Repository**:
    *   Ensure your project is on GitHub, GitLab, or Bitbucket.
2.  **Sign up/Login to Netlify**.
3.  **Create a New Site**:
    *   Click "New site from Git".
    *   Connect to your Git provider and select your repository.
4.  **Build Settings**:
    *   **Branch to deploy**: Usually `main` or `master`.
    *   **Build command**: You can leave this empty or use a simple command like `echo "No build step required"`.
    *   **Publish directory**: Set this to `/` (or the root directory where your `index.html` file is located).
5.  **Environment Variables (Crucial for Gemini API)**:
    *   In Netlify's site settings, go to "Build & deploy" > "Environment".
    *   Add an environment variable:
        *   **Key**: `API_KEY`
        *   **Value**: Your Google Gemini API key.
    *   **Important Note**: For the `process.env.API_KEY` to be accessible in the client-side JavaScript on Netlify *without a build tool*, you would typically need to:
        1.  Modify the source code (e.g., `components/LiveMapView.tsx`) to fetch this key from a global variable injected at build time (e.g., using Netlify's snippet injection or a simple build script to create a config file).
        2.  Or, for the simplest deployment of the *current code*, you might manually replace `process.env.API_KEY` in the JavaScript files with your actual key before pushing to Git for deployment. This is not ideal for security or key management.
        *   *The project assumes `process.env.API_KEY` is accessible in the execution context. For Netlify, ensuring this involves careful consideration of how environment variables are exposed to client-side code.*
6.  **Google Maps API Key**:
    *   Ensure the Google Maps API key in `index.html` is correct and has appropriate restrictions (e.g., HTTP referrers) for your Netlify domain.
7.  **Deploy Site**: Click the "Deploy site" button. Netlify will pull your files and host them.

## Key Dependencies (via CDN Import Map)

*   `react` & `react-dom`
*   `recharts`
*   `@googlemaps/markerclusterer`
*   `@google/genai`

## File Structure Overview

```
/
├── components/
│   ├── charts/           # Reusable chart components
│   ├── config/           # Configuration page components
│   ├── ui/               # Generic UI elements (Badge, Modal, Select, Icons, etc.)
│   ├── AddIncidentForm.tsx
│   ├── AddIncidentView.tsx
│   ├── AddReporterModal.tsx
│   ├── AnalyticsView.tsx
│   ├── App.tsx               # Main application component
│   ├── AuthPage.tsx
│   ├── DashboardView.tsx
│   ├── Footer.tsx
│   ├── Header.tsx
│   ├── IncidentDetailModal.tsx
│   ├── IncidentMap.tsx
│   ├── IncidentTable.tsx
│   ├── LiveMapView.tsx
│   ├── LoginForm.tsx
│   ├── RegisterForm.tsx
│   ├── ReporterDetailView.tsx
│   ├── ReporterDirectoryView.tsx
│   └── Sidebar.tsx
│   └── WhatsAppMessagesView.tsx
├── hooks/
│   ├── useAppConfig.ts     # Hook for managing application configuration
│   ├── useAuth.ts          # Hook for authentication logic
│   └── useIncidents.ts     # Hook for managing incident and reporter data
├── utils/
│   └── time.ts             # Time utility functions
├── constants.ts            # Mock data and application constants
├── index.html              # Main HTML file
├── index.tsx               # React entry point
├── metadata.json           # App metadata for project generation tools
└── types.ts                # TypeScript type definitions
```

## Important Notes

*   **Simulated Backend**: This application uses the browser's `localStorage` to persist data like incidents, reporters, configurations, and user credentials. It does not have a real backend database. Data will be local to the user's browser.
*   **API Keys**:
    *   The Google Gemini API key (`API_KEY`) is critical for AI search features.
    *   The Google Maps API key is necessary for all map functionalities.
*   **Authentication**: The login and registration system is a **simulation for frontend demonstration purposes only**. User credentials (including passwords) are stored in plain text in `localStorage` as part of the application's configuration. **This is highly insecure and should NOT be used in a production environment.** Real-world applications require a secure backend for authentication and user management.
*   **Development Model**: The application is structured to run directly using ES modules and CDNs, simplifying the local setup by avoiding a complex build pipeline.
```