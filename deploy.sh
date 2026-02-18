#!/bin/bash

# My Word Marketplace - Deployment Script
# Usage: ./deploy.sh [dev|prod]

set -e

ENV=${1:-dev}

echo "🚀 Deploying My Word Marketplace in $ENV mode..."

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}Error: Docker is not running${NC}"
    exit 1
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}Creating .env from template...${NC}"
    cp .env.example .env
    echo -e "${YELLOW}Please edit .env with your configuration${NC}"
fi

if [ "$ENV" == "prod" ]; then
    echo -e "${GREEN}Building production images...${NC}"
    docker-compose -f docker-compose.yml build --no-cache
    
    echo -e "${GREEN}Starting services...${NC}"
    docker-compose -f docker-compose.yml up -d
    
    echo -e "${GREEN}Running database migrations...${NC}"
    # Wait for database to be ready
    sleep 10
    
    echo -e "${GREEN}✅ Deployment complete!${NC}"
    echo ""
    echo "Services running:"
    echo "  - API: http://localhost:3001"
    echo "  - Admin: http://localhost:3000"
    echo "  - Database: localhost:5432"
    
else
    echo -e "${GREEN}Starting development environment...${NC}"
    docker-compose -f docker-compose.yml up postgres -d
    
    echo "Database started. Run the following commands in separate terminals:"
    echo ""
    echo "  Backend:"
    echo "    cd backend && npm install && npm run dev"
    echo ""
    echo "  Web Admin:"
    echo "    cd web-admin && npm install && npm run dev"
    echo ""
    echo "  Mobile App:"
    echo "    cd my-word-app && flutter run"
fi

echo ""
echo -e "${GREEN}🎉 Done!${NC}"
