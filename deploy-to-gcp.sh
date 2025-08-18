#!/bin/bash

# Google Cloud Platform Deployment Script
# This script builds and deploys your Docker containers to Google Cloud Run

set -e  # Exit on any error

# Configuration
PROJECT_ID="justice-bot-final"
REGION="us-central1"
FRONTEND_SERVICE="justicebotai-frontend"
PYTHON_BACKEND_SERVICE="justicebotai-python-backend"

echo "🚀 Starting deployment to Google Cloud Platform..."
echo "Project: $PROJECT_ID"
echo "Region: $REGION"

# Check if gcloud is installed and authenticated
if ! command -v gcloud &> /dev/null; then
    echo "❌ gcloud CLI is not installed. Please install it first:"
    echo "https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Set the project
echo "📋 Setting project to $PROJECT_ID..."
gcloud config set project $PROJECT_ID

# Enable required APIs
echo "🔧 Enabling required APIs..."
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable artifactregistry.googleapis.com

# Configure Docker for Artifact Registry (recommended over gcr.io)
echo "🐳 Configuring Docker authentication..."
gcloud auth configure-docker us-central1-docker.pkg.dev

# Create Artifact Registry repository if it doesn't exist
echo "📦 Setting up Artifact Registry..."
gcloud artifacts repositories create justicebotai-containers \
    --repository-format=docker \
    --location=$REGION \
    --description="JusticeBot.AI containers" || echo "Repository already exists"

# Build and push Frontend (Next.js + Node.js backend)
echo "🏗️  Building and pushing frontend container..."
FRONTEND_IMAGE="$REGION-docker.pkg.dev/$PROJECT_ID/justicebotai-containers/$FRONTEND_SERVICE:latest"

docker build -t $FRONTEND_IMAGE .
docker push $FRONTEND_IMAGE

# Build and push Python backend
echo "🐍 Building and pushing Python backend container..."
PYTHON_IMAGE="$REGION-docker.pkg.dev/$PROJECT_ID/justicebotai-containers/$PYTHON_BACKEND_SERVICE:latest"

cd Justice-bot-smartdisputefinal/export_pkg
docker build -t $PYTHON_IMAGE .
docker push $PYTHON_IMAGE
cd ../..

# Deploy Python Backend to Cloud Run
echo "🚀 Deploying Python backend to Cloud Run..."
gcloud run deploy $PYTHON_BACKEND_SERVICE \
    --image $PYTHON_IMAGE \
    --platform managed \
    --region $REGION \
    --allow-unauthenticated \
    --port 5000 \
    --memory 2Gi \
    --cpu 2 \
    --min-instances 0 \
    --max-instances 10 \
    --set-env-vars "FLASK_ENV=production" \
    --set-env-vars "DATABASE_URL=postgresql://postgres:password@/smartdispute?host=/cloudsql/$PROJECT_ID:$REGION:justicebotai-db"

# Get Python backend URL
PYTHON_BACKEND_URL=$(gcloud run services describe $PYTHON_BACKEND_SERVICE --region=$REGION --format="value(status.url)")
echo "Python backend deployed at: $PYTHON_BACKEND_URL"

# Deploy Frontend to Cloud Run
echo "🌐 Deploying frontend to Cloud Run..."
gcloud run deploy $FRONTEND_SERVICE \
    --image $FRONTEND_IMAGE \
    --platform managed \
    --region $REGION \
    --allow-unauthenticated \
    --port 3000 \
    --memory 2Gi \
    --cpu 2 \
    --min-instances 0 \
    --max-instances 10 \
    --set-env-vars "NODE_ENV=production" \
    --set-env-vars "NEXT_PUBLIC_API_BASE_URL=$PYTHON_BACKEND_URL" \
    --set-env-vars "NEXT_PUBLIC_FIREBASE_PROJECT_ID=$PROJECT_ID" \
    --set-env-vars "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=$PROJECT_ID.firebaseapp.com" \
    --set-env-vars "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=$PROJECT_ID.appspot.com"

# Get frontend URL
FRONTEND_URL=$(gcloud run services describe $FRONTEND_SERVICE --region=$REGION --format="value(status.url)")

echo "✅ Deployment completed successfully!"
echo ""
echo "🌐 Your application is now live:"
echo "Frontend: $FRONTEND_URL"
echo "Python Backend: $PYTHON_BACKEND_URL"
echo ""
echo "🔧 Next steps:"
echo "1. Set up Cloud SQL PostgreSQL database"
echo "2. Configure environment variables in Cloud Run console"
echo "3. Set up custom domain (optional)"
echo "4. Configure Firebase secrets for sensitive data"

# Optional: Set up Cloud SQL database
read -p "Do you want to create a Cloud SQL PostgreSQL database? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🗄️  Creating Cloud SQL PostgreSQL database..."
    gcloud sql instances create justicebotai-db \
        --database-version=POSTGRES_15 \
        --tier=db-f1-micro \
        --region=$REGION \
        --storage-size=10GB \
        --storage-type=SSD
    
    gcloud sql databases create smartdispute --instance=justicebotai-db
    
    echo "Database created! Update your DATABASE_URL environment variable in Cloud Run."
fi

echo "🎉 Deployment script completed!"