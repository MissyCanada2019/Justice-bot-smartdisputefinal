
# JusticeBot.AI - Local Development Setup Guide

This guide will help you set up and run both the Next.js frontend and Flask backend locally for development.

## Architecture Overview

- **Frontend**: Next.js 14 with Firebase Auth, running on port 9002
- **Backend**: Flask API with SQLAlchemy, running on port 5000
- **Database**: SQLite for development (PostgreSQL for production)
- **Communication**: REST API calls from frontend to backend with CORS enabled

## Prerequisites

- Node.js (version 18 or later)
- Python 3.8 or later
- pip (Python package manager)
- Git

## Setup Instructions

### 1. Clone and Navigate to Project

```bash
cd /path/to/your/project/studio
```

### 2. Set Up Flask Backend

#### Install Python Dependencies
```bash
cd Justice-bot-smartdisputefinal/export_pkg
pip install -r requirements.txt
```

#### Environment Variables
The Flask backend uses the `.env` file located at `Justice-bot-smartdisputefinal/export_pkg/.env`:

```env
DATABASE_URL=sqlite:///smartdispute.db
FLASK_ENV=development
FLASK_DEBUG=True
SESSION_SECRET=your-secret-key-here
FRONTEND_URL=http://localhost:9002
ALLOWED_ORIGINS=http://localhost:9002,http://localhost:3000
MAX_CONTENT_LENGTH=250MB
UPLOAD_FOLDER=uploads
LOG_LEVEL=DEBUG
```

#### Initialize Database
```bash
python3 -c "from app import app, db; app.app_context().push(); db.create_all(); print('Database initialized')"
```

#### Start Flask Backend
```bash
python3 main.py
```

The Flask backend will be available at: http://localhost:5000

### 3. Set Up Next.js Frontend

#### Install Node Dependencies
```bash
cd ../../  # Back to project root
npm install
```

#### Environment Variables
The Next.js frontend uses the `.env.local` file in the project root:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyD-qlOFRqRIl7Qpl90MevvN2nRVSBXYInc
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=justicebotai.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=justicebotai
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=justicebotai.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=259991262013
NEXT_PUBLIC_FIREBASE_APP_ID=1:259991262013:web:32a1e42fa3484e9a676b54
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6LdDBn4rAAAAADuEa2UqVQRkdrHRD-25aqWhWaYj
NEXT_PUBLIC_FREE_TIER_ENABLED=true
NODE_ENV=development
```

#### Start Next.js Frontend
```bash
npm run dev
```

The Next.js frontend will be available at: http://localhost:9002

## Development Workflow

### Running Both Services

1. **Terminal 1** - Flask Backend:
   ```bash
   cd Justice-bot-smartdisputefinal/export_pkg
   python3 main.py
   ```

2. **Terminal 2** - Next.js Frontend:
   ```bash
   npm run dev
   ```

### API Integration

The frontend communicates with the backend through the API service located at `src/lib/apiService.ts`. Key endpoints include:

- **Authentication**: `/api/auth/login`, `/api/auth/register`, `/api/auth/logout`
- **Cases**: `/api/cases` (GET, POST)
- **Documents**: `/api/cases/{id}/documents` (GET, POST)
- **Analysis**: `/api/cases/{id}/analyze` (POST)
- **Chat**: `/api/chat` (POST)
- **Forms**: `/api/generate-form` (POST)

### Testing the Integration

1. Start both services
2. Visit http://localhost:9002
3. Create an account or log in
4. Test features like:
   - Creating a new case
   - Uploading documents
   - Running case analysis
   - Using the AI chat
   - Generating legal forms

### Health Checks

- **Backend Health**: http://localhost:5000/health
- **Frontend**: http://localhost:9002

## File Structure

```
/studio/
├── Justice-bot-smartdisputefinal/export_pkg/    # Flask Backend
│   ├── app.py                                   # Flask app configuration
│   ├── models.py                               # Database models
│   ├── routes.py                               # API routes
│   ├── main.py                                 # Entry point
│   ├── requirements.txt                        # Python dependencies
│   ├── .env                                    # Backend environment variables
│   └── utils/                                  # Utility modules
│       ├── ai_chat.py
│       ├── canlii_api.py
│       ├── document_generator.py
│       ├── legal_analyzer.py
│       ├── mailing_service.py
│       └── ocr.py
├── src/                                        # Next.js Frontend
│   ├── app/                                    # App router pages
│   ├── components/                             # React components
│   ├── hooks/                                  # Custom hooks
│   └── lib/                                    # Utility libraries
│       ├── apiService.ts                       # Backend API integration
│       ├── firebase.ts                         # Firebase configuration
│       └── uploadService.ts                    # File upload service
├── package.json                                # Node.js dependencies
├── .env.local                                  # Frontend environment variables
└── LOCAL_DEVELOPMENT_SETUP.md                  # This file
```

## Common Issues and Troubleshooting

### Backend Issues

**Import Errors**:
```bash
cd Justice-bot-smartdisputefinal/export_pkg
pip install -r requirements.txt
```

**Database Issues**:
```bash
python3 -c "from app import app, db; app.app_context().push(); db.create_all()"
```

**Port Already in Use**:
```bash
lsof -ti:5000 | xargs kill -9
```

### Frontend Issues

**Module Not Found**:
```bash
npm install
```

**Port Already in Use**:
```bash
lsof -ti:9002 | xargs kill -9
```

### CORS Issues

If you encounter CORS errors, verify:
1. Flask backend CORS configuration in `app.py`
2. Frontend API base URL in `.env.local`
3. Both services are running on correct ports

## Production Deployment Strategy

### Flask Backend Deployment

1. **Firebase Cloud Run**:
   - Build Docker container with Flask app
   - Deploy to Cloud Run with environment variables
   - Configure custom domain

2. **Alternative: Heroku/Railway**:
   - Push to git repository
   - Configure environment variables
   - Deploy with PostgreSQL database

### Next.js Frontend Deployment

1. **Firebase App Hosting**:
   - Already configured with `apphosting.yaml`
   - Deploy with `firebase deploy`
   - Update `NEXT_PUBLIC_API_BASE_URL` to backend URL

### Environment Variables for Production

Update environment variables to point to production backend:
- `NEXT_PUBLIC_API_BASE_URL=https://your-backend-url.com`
- Configure database URL for PostgreSQL
- Set production secrets and API keys

## Support

If you encounter issues:
1. Check both service logs
2. Verify environment variables
3. Ensure all dependencies are installed
4. Test API endpoints individually with curl or Postman