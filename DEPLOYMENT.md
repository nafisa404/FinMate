# FinMate Production Deployment Guide

This guide covers deploying FinMate to production with Netlify and Hugging Face AI integration.

## ✅ Pre-Deployment Checklist

Run the deployment check to ensure everything is ready:

```bash
npm run deploy
```

## 🚀 Deployment Steps

### 1. Environment Variables

Set these environment variables in your Netlify dashboard:

```env
HUGGINGFACE_API_KEY=your_huggingface_api_key_here
NODE_ENV=production
```

**To get a Hugging Face API key:**

1. Go to [huggingface.co](https://huggingface.co)
2. Sign up/login
3. Go to Settings → Access Tokens
4. Create a new token with "Read" permissions
5. Copy the token to your Netlify environment variables

### 2. Netlify Deployment

#### Option A: Git-based Auto Deploy (Recommended)

1. Connect your repository to Netlify
2. Set build command: `npm run build:client`
3. Set publish directory: `dist/spa`
4. Add environment variables in Netlify dashboard
5. Deploy will trigger automatically on git push

#### Option B: Manual Deploy

1. Build the application:

   ```bash
   npm run build
   ```

2. Upload `dist/spa` folder to Netlify

3. Upload `netlify/functions` folder for API functions

### 3. Verification

After deployment, verify these endpoints:

- **Frontend**: `https://your-site.netlify.app`
- **API Health**: `https://your-site.netlify.app/api/ping`
- **Database Health**: `https://your-site.netlify.app/api/health/db`

## 🔧 Configuration Details

### Netlify Functions

The API runs as Netlify Functions with:

- Express server in serverless mode
- SQLite database in `/tmp` directory
- Auto-initialization with sample data
- Hugging Face AI model integration

### Database

- **Development**: Local SQLite file
- **Production**: Temporary SQLite in `/tmp` (resets on function cold starts)
- **Auto-initialization**: Creates tables and sample data on startup

### AI Models

- **Primary**: Hugging Face Inference API
- **Fallback**: Local response templates if API unavailable
- **Models Used**:
  - `ProsusAI/finbert` for financial Q&A
  - `cardiffnlp/twitter-roberta-base-sentiment-latest` for sentiment
  - `facebook/bart-large-mnli` for classification

## 🚨 Important Notes

### Database Persistence

- SQLite data is ephemeral in serverless environment
- Database resets on function cold starts
- For production with persistent data, consider:
  - Neon (PostgreSQL)
  - PlanetScale (MySQL)
  - MongoDB Atlas

### Performance Optimization

- Functions may have cold start delays
- Consider upgrading to Netlify Pro for better performance
- Database initializes on first request

### Security

- API key is required for full AI functionality
- Fallback responses work without API key
- All data processing happens server-side

## 🔍 Troubleshooting

### Common Issues

1. **"Internal Server Error"**

   - Check Netlify function logs
   - Verify environment variables are set
   - Check database initialization

2. **"AI Coach not responding"**

   - Verify HUGGINGFACE_API_KEY is set
   - Check API quota limits
   - Fallback responses should still work

3. **"Learning modules not loading"**
   - Database initialization may be in progress
   - Refresh page after a few seconds
   - Check API health endpoints

### Debug Commands

```bash
# Test build locally
npm run build
npm start

# Check deployment readiness
npm run deploy-check

# Test API endpoints
curl https://your-site.netlify.app/api/ping
curl https://your-site.netlify.app/api/health/db
```

## 📊 Monitoring

Monitor these metrics post-deployment:

- Function execution time and errors
- API response times
- Database initialization frequency
- Hugging Face API usage and quotas

## 🔄 Updates

To deploy updates:

1. Make changes to code
2. Run `npm run deploy` to verify
3. Commit and push changes
4. Netlify auto-deploys if connected

---

🎉 **Your FinMate application is now ready for production!**

For support, check the logs in Netlify dashboard or GitHub issues.
