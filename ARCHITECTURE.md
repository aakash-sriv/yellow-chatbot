# System Architecture

## Overview

The Chatbot Platform is designed as a monolithic-repository application with a clear separation of concerns between the Client (Frontend) and Server (Backend). It leverages modern web technologies to ensure high performance, scalability, and maintainability.

## Architecture Diagram

```mermaid
graph TD
    User[User Client] -->|HTTP/HTTPS| FE[Frontend (React/Vite)]
    FE -->|REST API| BE[Backend API (Node.js/Express)]
    BE -->|Query| DB[(Supabase / PostgreSQL)]
    BE -->|Inference| AI[AI Service (OpenAI/Gemini)]
    BE -->|Auth| Auth[JWT Authentication]
```

## Component Details

### 1. Frontend (Client)
-   **Framework**: React 18 with TypeScript.
-   **Build Tool**: Vite for lightning-fast HMR and optimized production builds.
-   **State Management**: Zustand for global state (Auth, Projects).
-   **Styling**: Tailwind CSS v4 for utility-first, responsive design.
-   **Routing**: React Router v6.

### 2. Backend (Server)
-   **Runtime**: Node.js.
-   **Framework**: Express.js for RESTful API routing.
-   **Language**: TypeScript for type safety and developer experience.
-   **ORM**: Prisma for type-safe database interactions.

### 3. Database
-   **Provider**: Supabase (Managed PostgreSQL).
-   **Schema**: Relational schema handling Users, Projects, Chats, Messages, and Prompts.

## Scalability & Performance

-   **Stateless Authentication**: JWT-based auth allows the backend to be horizontally scaled without sticky sessions.
-   **Connection Pooling**: Prisma and Supabase manage database connections efficiently to handle concurrent users.
-   **Optimized Assets**: Vite produces highly optimized, minified static assets for the frontend, which can be served via CDN.

## Security Measures

-   **Data Protection**: Passwords are hashed using `bcrypt` before storage.
-   **Transport Security**: All API communication is designed to run over HTTPS.
-   **Input Validation**: Strict validation on all API endpoints to prevent injection attacks.
-   **CORS Policy**: Configured to restrict access to trusted domains.

## Extensibility

The modular design allows for easy addition of new features:
-   **Analytics**: Middleware can be added to track token usage and user activity.
-   **Vector Database**: Ready to integrate with Supabase `pgvector` for RAG (Retrieval-Augmented Generation) implementations.
-   **File Processing**: Structure supports strictly typed file handling services.
