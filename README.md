# FinMate - AI-Powered Financial Management Platform

A comprehensive financial management application powered by Hugging Face AI models and SQL database backend.

## Features

- 🤖 **AI Financial Coach** with Hugging Face models
- 📊 **Investment Portfolio Management** with ML optimization
- 💰 **Smart Budget Planning** with AI insights
- 🎯 **Goal Tracking** with achievement probability
- 📚 **Interactive Learning Modules** with gamification
- 🛡️ **Security & Risk Analysis** with anomaly detection
- 📋 **Tax Optimization** strategies
- 🔮 **Financial Forecasting** with ML predictions

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set up Hugging Face API Key

1. Go to [Hugging Face](https://huggingface.co/) and create an account
2. Navigate to Settings → Access Tokens
3. Create a new token with "Read" permissions
4. Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```
5. Add your Hugging Face API key to the `.env` file:
   ```env
   HUGGINGFACE_API_KEY=your_actual_api_key_here
   ```

### 3. Database Setup

The application uses SQLite with Better-SQLite3 for high performance. The database will be automatically initialized on first run with sample data.

Database file location:

- Development: `server/database/finmate.dev.db`
- Production: `finmate.db`

### 4. Start Development Server

```bash
npm run dev
```

This will start:

- Frontend (React + Vite): http://localhost:3000
- Backend (Express + SQLite): http://localhost:3001

## API Endpoints

### Chat & AI Coach

- `POST /api/chat/conversations` - Create new conversation
- `GET /api/chat/conversations` - Get user conversations
- `POST /api/chat/messages` - Send message and get AI response
- `POST /api/chat/ai-coach` - Select specific AI coach

### Learning Modules

- `GET /api/learning/modules` - Get all learning modules
- `GET /api/learning/modules/:id` - Get specific module
- `POST /api/learning/modules/:id/complete` - Complete module
- `GET /api/learning/achievements` - Get user achievements
- `GET /api/learning/leaderboard` - Get learning leaderboard

### User Profile

- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile

## Hugging Face Models Used

The application leverages multiple Hugging Face models for different financial tasks:

### Primary Models

- **Financial Q&A**: `ProsusAI/finbert` - Financial domain-specific language model
- **Sentiment Analysis**: `cardiffnlp/twitter-roberta-base-sentiment-latest`
- **Text Classification**: `facebook/bart-large-mnli`
- **Summarization**: `facebook/bart-large-cnn`

### AI Coach Capabilities

- Investment portfolio optimization
- Budget planning and expense analysis
- Credit score improvement strategies
- Financial goal achievement planning
- Tax optimization recommendations
- Risk assessment and security analysis

## Database Schema

The application uses a comprehensive SQLite schema including:

- **Users & Profiles**: User accounts and financial profiles
- **Conversations & Messages**: Chat history with AI coaches
- **Learning System**: Modules, progress, achievements
- **Financial Data**: Transactions, goals, budgets, investments

## Features in Detail

### 🤖 AI Financial Coach

- 5 specialized AI coaches for different financial domains
- Real-time response generation using Hugging Face models
- Context-aware conversations with memory
- Confidence scoring and sentiment analysis

### 📚 Learning Hub

- Interactive financial education modules
- Gamification with tokens and badges
- Progress tracking and achievement system
- Prerequisites-based module unlocking

### 📊 Financial Management

- Portfolio analysis with ML insights
- Budget optimization with AI recommendations
- Goal tracking with probability predictions
- Transaction categorization and analysis

## Development

### Backend Development

- Express.js server with TypeScript
- SQLite database with Drizzle ORM
- Hugging Face Inference API integration
- RESTful API design

### Frontend Development

- React 18 with TypeScript
- Tailwind CSS for styling
- Shadcn/ui component library
- React Router for navigation
- Recharts for data visualization

## Production Deployment

1. Set production environment variables
2. Build the application:
   ```bash
   npm run build
   ```
3. Start production server:
   ```bash
   npm start
   ```

## Environment Variables

```env
# Required
HUGGINGFACE_API_KEY=your_huggingface_api_key

# Optional
NODE_ENV=development
PORT=3001
DATABASE_URL=./finmate.db
CORS_ORIGIN=http://localhost:3000
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
