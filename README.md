# Expense Tracker Frontend

This is the frontend for the Expense Tracker application, built with React and Vite.

## Features
- Modern dashboard with charts and financial summaries
- AI-powered financial insights
- User authentication (login/signup)
- Budget and transaction management
- Responsive and clean UI

## Getting Started

### Prerequisites
- Node.js (v16 or higher recommended)
- npm or yarn

### Installation
1. Navigate to the `frontend` directory:
   ```sh
   cd frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   # or
   yarn install
   ```

### Running the App
Start the development server:
```sh
npm run dev
# or
yarn dev
```
The app will be available at `http://localhost:5173` by default.

## Project Structure
- `src/pages/` – Main pages (Dashboard, Login, Signup, etc.)
- `src/components/` – Reusable UI components
- `src/apiConfig.js` – API endpoint configuration
- `public/` – Static assets

## API Endpoints
The frontend expects the backend API to be running (see backend README for setup). Main endpoints:
- `/api/dashboard/summary`
- `/api/dashboard/categories`
- `/api/dashboard/transactions`
- `/api/dashboard/insights`
- `/api/dashboard/goals`

## Customization
- Update theme and styles in `App.css` and component files.
- Adjust API endpoints in `apiConfig.js` if your backend URL changes.

## License
MIT
