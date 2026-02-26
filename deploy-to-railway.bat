@echo off
echo Deploying to Railway...

rem Navigate to project directory
cd /d "c:/Users/Tapas/Projects/Ai_hub/ai-engineering-hub/streaming-ai-chatbot"

rem Login to Railway (requires browser interaction)
echo Step 1: Login to Railway (will open browser for authentication)
railway login

rem Link to your project (interactive)
echo Step 2: Select your project from the list when prompted
railway link

rem Deploy to Railway
echo Step 3: Deploying your application...
railway up

echo Deployment complete!
pause