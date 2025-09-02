# Deployment Instructions

## Quick Deploy to Vercel

### Option 1: Deploy from GitHub (Recommended)

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: AG3 Mini Trust Engine"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/ag3-mini-trust-engine.git
   git push -u origin main
   ```

2. **Deploy on Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Import your repository
   - Add environment variables:
     - `OPENAI_API_KEY`: Your OpenAI API key
     - `OPENAI_MODEL`: `gpt-4o-mini` (optional)
   - Click "Deploy"

### Option 2: Deploy with Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login and Deploy**:
   ```bash
   vercel login
   vercel
   ```

3. **Set Environment Variables**:
   ```bash
   vercel env add OPENAI_API_KEY
   vercel env add OPENAI_MODEL
   ```

## Testing the Deployment

1. **Visit your deployed URL**
2. **Test with default values** (should work immediately)
3. **Try different preferences** to verify functionality
4. **Check error handling** by temporarily removing API key

## Environment Variables Required

- `OPENAI_API_KEY`: Your OpenAI API key (required)
- `OPENAI_MODEL`: Model to use (optional, defaults to `gpt-4o-mini`)

## Expected Behavior

✅ **Working correctly**:
- Form loads with default values
- "Get My 3 Options" button works
- Shows loading state
- Displays top 3 contractor matches
- Shows trust scores and reasons
- Displays processing time and model info

❌ **Error scenarios**:
- Missing API key shows friendly error
- Invalid requests show appropriate messages
- Network issues are handled gracefully

## Performance Expectations

- **First load**: ~2-3 seconds (cold start)
- **Subsequent requests**: ~500-1000ms
- **AI processing**: ~300-800ms
- **Total response time**: ~1-2 seconds

## Troubleshooting

### Common Issues

1. **"OpenAI API key not configured"**
   - Check environment variables in Vercel dashboard
   - Ensure variable name is exactly `OPENAI_API_KEY`

2. **"Invalid OpenAI API key"**
   - Verify your API key is correct
   - Check if you have sufficient credits

3. **Build failures**
   - Check that all dependencies are in `package.json`
   - Verify TypeScript compilation

4. **Runtime errors**
   - Check Vercel function logs
   - Verify API endpoint is accessible

### Debug Steps

1. **Check Vercel logs**:
   ```bash
   vercel logs
   ```

2. **Test API endpoint directly**:
   ```bash
   curl -X POST https://your-app.vercel.app/api/score \
     -H "Content-Type: application/json" \
     -d '{"homeowner":{"city":"Salt Lake City","project_type":"roofing","notes":"test","weights":{"experience":0.4,"reviews":0.25,"rating":0.2,"price":0.1,"speed":0.05}},"contractors":[...]}'
   ```

3. **Verify environment variables**:
   - Go to Vercel dashboard → Project → Settings → Environment Variables
   - Ensure variables are set for Production environment

## Success Criteria Checklist

- [ ] App deploys successfully to Vercel
- [ ] Environment variables are configured
- [ ] Default test case works
- [ ] Custom preferences work
- [ ] Error handling works (try without API key)
- [ ] Results display correctly
- [ ] Trust scores are reasonable (60-95 range)
- [ ] Reasons are relevant and helpful
- [ ] UI is responsive and clean
- [ ] Processing time is displayed

## Final Notes

The application is designed to be production-ready with:
- Proper error handling
- Type safety with TypeScript
- Responsive design
- Clean code structure
- Comprehensive documentation

Once deployed, you'll have a fully functional AI-powered contractor matching system that meets all the specified requirements!
