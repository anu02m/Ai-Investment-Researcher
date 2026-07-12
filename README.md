# AI-Researcher

AI-Researcher is a full-stack web application that helps users investigate companies and receive an AI-driven investment recommendation. The platform combines a modern React frontend with an Express backend to gather company information, financial data, market context, and news, then synthesize that information into a clear decision.

## Overview

This project is designed for users who want a faster, more structured way to evaluate a company before making an investment decision. It brings together:

- company identification and profile enrichment
- financial data analysis
- news-based sentiment and context review
- recommendation generation with risk insights

## Key Features

- Search companies by name through a simple web interface
- Display company metadata such as sector, founder, origin, and market value
- Analyze financial metrics and price history when available
- Retrieve recent news headlines relevant to the company
- Generate an investment recommendation with rationale and risk factors

## Architecture

The application is split into two main parts:

- Client: A React + Vite frontend that provides the user interface and displays research results
- Server: An Express backend that orchestrates the research workflow and integrates external services

## Deployment

The project is designed to be deployed in two parts:

- Frontend hosted on Vercel
- Backend hosted on Render

- Frontend: https://ai-investment-researcher.vercel.app/
- Backend: on render.

## Why These APIs Were Chosen

The app uses a combination of services to balance accuracy, coverage, and reliability:

- FMP (Financial Modeling Prep): used for structured financial statements, ratios, and company profile data where available
- Tavily: used as a fallback and supplemental research layer for web-based company and financial discovery when structured data is unavailable
- Groq / LangChain-based reasoning: used to process the gathered information and generate a recommendation with explanation and risk context

This combination was chosen because financial data providers often have strong structured coverage, while web search tools help fill gaps when a company is private, lightly covered, or temporarily unavailable in the primary data source.

## Fallback Strategy

If the FMP data request fails, the application does not stop processing. Instead, it gracefully falls back to Tavily-based research to continue building the analysis.

This ensures that:

- the app remains functional even when a primary data provider is unavailable
- users still receive a meaningful company analysis
- the experience is more resilient in production environments

## Tech Stack

### Frontend
- React
- Vite
- CSS

### Backend
- Node.js
- Express
- dotenv
- CORS
- LangChain-based integrations

## Project Structure

```text
AI-Researcher/
├── client/          # React frontend
├── server/          # Express API and research logic
└── README.md        # Project documentation
```

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v18 or newer recommended)
- npm

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd AI-Researcher
```

### 2. Install frontend dependencies

```bash
cd client
npm install
```

### 3. Install backend dependencies

```bash
cd ../server
npm install
```

## Environment Configuration

Create a `.env` file inside the `server` directory and add the required environment variables for the services used by the backend.

Example:

```env
PORT=5000
GROQ_API_KEY=your_groq_api_key
TAVILY_API_KEY=your_tavily_api_key
FMP_API_KEY=your_fmp_api_key
```

### Required Variables

- `PORT`: Port for the backend server
- `GROQ_API_KEY`: API key for the Groq-based language model integration
- `TAVILY_API_KEY`: API key for Tavily web research
- `FMP_API_KEY`: API key for Financial Modeling Prep data access


## Running the Application

### Start the backend

```bash
cd server
npm start
```

### Start the frontend

```bash
cd ../client
npm run dev
```

Once the frontend starts, open the local Vite URL shown in the terminal.

## Usage

1. Open the application in your browser.
2. Enter a company name in the search field.
3. Wait for the backend to collect research data.
4. Review the generated analysis, recommendation, and supporting context.

## Notes

- The backend relies on external services for financial and news data.
- If primary structured data is unavailable, the app can use fallback research methods.
- Proper environment configuration is required for the integrations to function correctly.
- The fallback mechanism is intentionally designed to improve reliability and reduce the impact of third-party API failures.

## License

This project is intended for educational, demonstration, and personal research purposes.
