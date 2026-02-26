Write-Host "Deploying to Railway..." -ForegroundColor Green

# Navigate to project directory
Set-Location "c:/Users/Tapas/Projects/Ai_hub/ai-engineering-hub/streaming-ai-chatbot"

# Login to Railway (requires browser interaction)
Write-Host "Step 1: Login to Railway (will open browser for authentication)" -ForegroundColor Yellow
railway login

# Link to your project (interactive)
Write-Host "Step 2: Select your project from the list when prompted" -ForegroundColor Yellow
railway link

# Deploy to Railway
Write-Host "Step 3: Deploying your application..." -ForegroundColor Yellow
railway up

Write-Host "Deployment complete!" -ForegroundColor Green
Read-Host "Press Enter to exit"