# Chatbot Platform

A robust, scalable, and modern Chatbot Platform designed for managing AI agents, prompts, and conversations. Built with React, TypeScript, Node.js, and Supabase.

## Features

-   **Authentication**: Secure user registration and login using JWT.
-   **Project & Agent Management**: specific workspaces for different AI agents.
-   **Prompt Engineering**: Store, Version, and associate prompts with projects.
-   **Real-time Chat Interface**: Interact with your agents using a modern, responsive chat UI.
-   **AI Integration**: Integrated with OpenAI/Gemini for intelligent responses.
-   **File Upload Support**: comprehensive support for uploading files to agents for context-aware conversations (OpenAI Files API integration).
-   **Responsive Design**: Fully optimized for desktop and mobile experience.

## Tech Stack

-   **Frontend**: React, Vite, TypeScript, Tailwind CSS (v4).
-   **Backend**: Node.js, Express, TypeScript.
-   **Database**: Supabase (PostgreSQL).
-   **Authentication**: JWT & Supabase Auth.
-   **AI**: OpenAI API / Google Gemini / OpenRouter.

## Prerequisites

-   Node.js (v18+)
-   npm or yarn
-   Supabase Account

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/projyellow.git
cd projyellow
```

### 2. Backend Setup

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `backend` directory with the following credentials:
    ```env
    PORT=5000
    DATABASE_URL="postgresql://user:password@host:port/dbname"
    JWT_SECRET="your_very_secure_secret"
    JWT_EXPIRES_IN="7d"
    GEMINI_API_KEY="your_gemini_key"
    # or OPENAI_API_KEY="your_openai_key"
    ```
4.  Run database migrations (Prisma):
    ```bash
    npx prisma migrate dev --name init
    ```
5.  Start the server:
    ```bash
    npm run dev
    ```

### 3. Frontend Setup

1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `frontend` directory:
    ```env
    VITE_API_URL=http://localhost:5000/api
    ```
4.  Start the development server:
    ```bash
    npm run dev
    ```

## Deployment

The application is production-ready.
-   **Frontend**: Optimized for Vercel/Netlify.
-   **Backend**: Optimized for Render/Railway/DigitalOcean.

## Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed design and scalability information.
