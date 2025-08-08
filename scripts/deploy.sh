#!/bin/bash

# VTopup Production Deployment Script
set -e

echo "🚀 Starting VTopup deployment..."

# Check if required environment variables are set
required_vars=("DATABASE_URL" "NEXTAUTH_SECRET" "PAYSTACK_SECRET_KEY" "FLUTTERWAVE_SECRET_KEY")
for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        echo "❌ Error: $var is not set"
        exit 1
    fi
done

# Build the application
echo "📦 Building application..."
npm run build

# Run database migrations
echo "🗄️ Running database migrations..."
npm run db:migrate

# Run tests
echo "🧪 Running tests..."
npm run test

# Build Docker image
echo "🐳 Building Docker image..."
docker build -t vtopup:latest .

# Tag for registry
docker tag vtopup:latest your-registry.com/vtopup:latest

# Push to registry
echo "📤 Pushing to registry..."
docker push your-registry.com/vtopup:latest

# Deploy to Kubernetes (if using K8s)
if command -v kubectl &> /dev/null; then
    echo "☸️ Deploying to Kubernetes..."
    kubectl apply -f kubernetes/
    kubectl rollout status deployment/vtopup-app
fi

# Deploy using Docker Compose (if using Docker Compose)
if [ -f "docker-compose.prod.yml" ]; then
    echo "🐳 Deploying with Docker Compose..."
    docker-compose -f docker-compose.prod.yml up -d
fi

# Health check
echo "🏥 Performing health check..."
sleep 30
if curl -f http://localhost/health; then
    echo "✅ Deployment successful!"
else
    echo "❌ Health check failed!"
    exit 1
fi

# Send deployment notification
echo "📧 Sending deployment notification..."
curl -X POST "https://api.slack.com/api/chat.postMessage" \
  -H "Authorization: Bearer $SLACK_BOT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "channel": "#deployments",
    "text": "🚀 VTopup has been successfully deployed to production!"
  }'

echo "🎉 Deployment completed successfully!"
