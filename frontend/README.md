# Today I... (Frontend)

This is the frontend for the "Today I..." digital diary application, built with React, Vite, TypeScript, Tailwind CSS, and DaisyUI.

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- npm (comes with Node.js)

## Getting Started

1. **Install Dependencies**
   Navigate to the `frontend` directory and install the required packages:
   ```bash
   npm install
   ```

2. **Environment Variables**
   Currently, the frontend expects the backend to be running on `http://localhost:8000`. If your backend is running elsewhere, you may need to update the base URL in `src/api.ts`.

3. **Run the Development Server**
   Start the Vite development server:
   ```bash
   npm run dev
   ```
   This will typically start the application on `http://localhost:5173`. Open this URL in your browser to view the app.

## Project Structure

- `src/pages/`: Contains the main page components (Dashboard, NewEntry, SkillsGrowth, Profile, etc.).
- `src/Layout.tsx`: The main application layout, including the sidebar and navigation.
- `src/api.ts`: Axios configuration for communicating with the backend API.
