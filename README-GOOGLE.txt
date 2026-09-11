GOOGLE CLOUD CONSOLE DEPLOY - VECTRA (Single App like Emergent)
================================================================

WHY THIS WORKS:
- Render split frontend/backend = broke
- Emergent = 1 app where backend serves frontend/build = worked
- Google Cloud Run = same as Emergent, but on Google, cheaper + custom domain

STEPS IN GOOGLE CONSOLE (5 mins):

1. Go to console.cloud.google.com -> New Project -> vectra-portal

2. Search top bar: "Cloud Run" -> Enable API

3. Cloud Run -> Create Service -> "Continuously deploy from source"

4. Connect GitHub: swastikquarta/Vectra-final-11-sept, branch main

5. Build Type: Dockerfile (we provided Dockerfile in repo root)
   - It will auto-build frontend + backend in one image

6. Add Environment Variables (same as your other 4 Emergent portals):
   MONGODB_URI = ...
   JWT_SECRET = ...
   FOUNDER_EMAILS = akhil718@gmail.com
   GEMINI_API_KEY = ...
   UPI_ID = 7359777788@UPI

7. Allow unauthenticated invocations -> Yes
   Port: 8080
   Region: asia-south1 (Mumbai, close to you)

8. Create -> Wait 4-5 mins -> Google gives you URL like:
   https://vectra-final-xyz-uc.a.run.app
   Your portal is LIVE, backend+frontend together, /docs also works.

9. Custom Domain (GoDaddy):
   Cloud Run -> Service -> Custom Domains -> Add Mapping
   Enter your GoDaddy domain (e.g. vectra.yourdomain.com)
   Google gives you DNS records (CNAME / A)
   Go to GoDaddy -> DNS -> Add those records -> Domain points to Google.

DONE. Same as Emergent flow, but hosted on Google.

COST: Free tier 2M requests/month, then ~$5/mo for your scale.

WHAT TO PUSH TO GITHUB:
- Put Dockerfile (provided) in REPO ROOT (same level as server.py / backend/ / frontend/)
- Add server.py patch (mount frontend/build)
- Push.

Then Google auto-redeploys on every GitHub push.