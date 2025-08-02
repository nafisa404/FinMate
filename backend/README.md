# FinMate Backend

A FastAPI-based backend for the FinMate AI-powered personal finance assistant.

## Features

- **Authentication & Authorization**: JWT-based authentication with secure password hashing
- **Transaction Management**: CRUD operations for expenses and income tracking
- **Investment Tracking**: Portfolio management and investment analytics
- **Subscription Management**: Track and analyze subscription costs
- **Learning Modules**: Educational content with progress tracking
- **AI-Powered Insights**: Transaction categorization and financial recommendations
- **Analytics**: Comprehensive financial analytics and reporting

## Tech Stack

- **Framework**: FastAPI
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Authentication**: JWT with bcrypt password hashing
- **AI/ML**: OpenAI GPT for transaction categorization and insights
- **Documentation**: Auto-generated OpenAPI/Swagger docs

## Quick Start

### Prerequisites

- Python 3.11+
- PostgreSQL
- Redis (optional, for caching)

### Installation

1. **Clone the repository**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Set up the database**
   ```bash
   # Create database
   createdb finmate
   
   # Run migrations
   alembic upgrade head
   ```

5. **Run the application**
   ```bash
   uvicorn app.main:app --reload
   ```

The API will be available at `http://localhost:8000`
Documentation will be available at `http://localhost:8000/docs`

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/me` - Get current user info
- `POST /api/v1/auth/refresh` - Refresh access token

### Transactions
- `GET /api/v1/transactions/` - Get user transactions
- `POST /api/v1/transactions/` - Create new transaction
- `GET /api/v1/transactions/{id}` - Get specific transaction
- `PUT /api/v1/transactions/{id}` - Update transaction
- `DELETE /api/v1/transactions/{id}` - Delete transaction
- `GET /api/v1/transactions/analytics/summary` - Get transaction summary
- `GET /api/v1/transactions/analytics/categories` - Get category breakdown

### Investments
- `GET /api/v1/investments/portfolios` - Get user portfolios
- `GET /api/v1/investments/investments` - Get user investments
- `POST /api/v1/investments/investments` - Create new investment
- `GET /api/v1/investments/recommendations` - Get AI investment recommendations

### Subscriptions
- `GET /api/v1/subscriptions/` - Get user subscriptions
- `POST /api/v1/subscriptions/` - Create new subscription
- `PUT /api/v1/subscriptions/{id}` - Update subscription
- `DELETE /api/v1/subscriptions/{id}` - Cancel subscription
- `GET /api/v1/subscriptions/analytics/summary` - Get subscription analytics

### Learning
- `GET /api/v1/learning/courses` - Get available courses
- `GET /api/v1/learning/courses/{id}` - Get course details
- `POST /api/v1/learning/courses/{id}/start` - Start a course
- `PUT /api/v1/learning/courses/{id}/progress` - Update course progress
- `GET /api/v1/learning/achievements` - Get user achievements
- `GET /api/v1/learning/leaderboard` - Get learning leaderboard

### Analytics
- `GET /api/v1/analytics/dashboard` - Get comprehensive dashboard analytics
- `GET /api/v1/analytics/spending-trends` - Get spending trends
- `GET /api/v1/analytics/savings-analysis` - Get savings analysis

## Database Schema

### Core Tables
- `users` - User accounts and profiles
- `transactions` - Financial transactions
- `investments` - Investment positions
- `portfolios` - Investment portfolios
- `subscriptions` - Subscription tracking
- `courses` - Learning content
- `user_course_progress` - Learning progress
- `achievements` - Gamification achievements

## AI Features

### Transaction Categorization
- Automatic categorization of transactions using AI
- Fallback to keyword-based categorization
- Confidence scoring for AI predictions

### Financial Insights
- Spending pattern analysis
- Savings recommendations
- Budget optimization suggestions
- Investment recommendations based on user profile

## Development

### Running Tests
```bash
pytest
```

### Code Formatting
```bash
black .
flake8 .
```

### Database Migrations
```bash
# Create new migration
alembic revision --autogenerate -m "Description"

# Apply migrations
alembic upgrade head

# Rollback migration
alembic downgrade -1
```

### Docker

Build and run with Docker Compose:
```bash
docker-compose up --build
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://finmate:finmate@localhost:5432/finmate` |
| `SECRET_KEY` | JWT secret key | `your-secret-key-change-in-production` |
| `OPENAI_API_KEY` | OpenAI API key for AI features | - |
| `REDIS_URL` | Redis connection string | `redis://localhost:6379` |

## Security

- JWT-based authentication
- Password hashing with bcrypt
- CORS configuration
- Input validation with Pydantic
- SQL injection protection with SQLAlchemy

## Performance

- Database connection pooling
- Async/await for I/O operations
- Caching support (Redis)
- Efficient query optimization

## Monitoring

- Health check endpoint at `/health`
- Structured logging
- Error tracking and reporting
- Performance metrics

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

This project is licensed under the MIT License. 