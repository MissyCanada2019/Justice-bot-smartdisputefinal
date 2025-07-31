# JusticeBot.AI Domain Deployment Guide

## ✅ Current Status

Your Next.js application is running successfully on `http://localhost:9002` and is ready for deployment with your custom domain `Justice-bot.com`.

## 🚀 Deployment Steps

### 1. **Build and Export Your Application**

```bash
# Build the application for production
npm run build

# Export as static files (uses next.config.js settings)
npx next export
```

This creates a static version of your app in the `out` directory that can be served by any static hosting provider.

### 2. **Firebase Hosting Setup**

Since you have Firebase configuration files, you can deploy using Firebase Hosting:

```bash
# Install Firebase CLI if not already installed
npm install -g firebase-tools

# Login to Firebase
firebase login

# Deploy to Firebase Hosting
firebase deploy --only hosting
```

### 3. **Cloudflare DNS Configuration (Already Done)**

You mentioned you've already configured Cloudflare. Ensure these settings are in place:

1. **DNS Records**:
   - A record pointing to Firebase Hosting IP addresses
   - CNAME record for www subdomain (if needed)

2. **SSL/TLS Settings**:
   - Full SSL encryption
   - Always Use HTTPS enabled

3. **Page Rules**:
   - Redirect non-www to www (or vice versa)
   - Cache settings for static assets

### 4. **Domain Configuration**

#### Firebase Console Setup:
1. Go to Firebase Console → Hosting
2. Add custom domain: `Justice-bot.com`
3. Follow verification steps
4. Update DNS records as provided by Firebase

#### Environment Variables:
Ensure these are set in your production environment:
```bash
NEXT_PUBLIC_API_BASE_URL=https://your-backend-url.com
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_recaptcha_site_key
```

### 5. **Production Build Configuration**

Update `next.config.js` for production:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export
  output: 'export',
  
  // Image optimization for static export
  images: {
    unoptimized: true,
  },
  
  // Custom domain settings
  assetPrefix: 'https://justice-bot.com',
  basePath: '',
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-UA-Compatible',
            value: 'ie=edge',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
```

## 🔄 Continuous Deployment

### GitHub Actions Workflow (`.github/workflows/deploy.yml`):

```yaml
name: Deploy to Firebase

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build and export
        run: |
          npm run build
          npx next export
          
      - name: Deploy to Firebase
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: ${{ secrets.GITHUB_TOKEN }}
          firebaseServiceAccount: ${{ secrets.FIREBASE_SERVICE_ACCOUNT }}
          channelId: live
        env:
          FIREBASE_CLI_PRETTYPRINT: false
```

## 📈 Monitoring and Analytics

### Performance Monitoring:
1. Google Analytics integration
2. Firebase Performance Monitoring
3. Error tracking with Sentry

### Uptime Monitoring:
1. UptimeRobot for domain monitoring
2. Status page integration

## 🔧 Troubleshooting Common Issues

### Domain Not Resolving:
1. Check DNS propagation with `dig justice-bot.com`
2. Verify Cloudflare proxy status (orange cloud)
3. Check SSL certificate status

### Mixed Content Warnings:
1. Ensure all assets use HTTPS
2. Update API endpoints to HTTPS
3. Check third-party services for HTTPS support

### Deployment Failures:
1. Check build logs in Firebase Console
2. Verify environment variables
3. Check file size limits (Firebase 100MB limit)

## 🎯 Success Criteria

### Deployment Verification:
- ✅ `Justice-bot.com` loads your Next.js application
- ✅ All API endpoints work correctly
- ✅ Authentication functions properly
- ✅ Legal forms generate and download
- ✅ Legal journey guidance works
- ✅ Mobile responsiveness maintained

### Performance Metrics:
- Load time < 3 seconds
- Lighthouse scores > 90
- No console errors
- SSL certificate valid

## 🚀 Next Steps

1. **Test Deployment**: Deploy to a preview channel first
2. **Verify Functionality**: Test all user flows
3. **Monitor Performance**: Set up analytics
4. **Configure Redirects**: Set up proper 301 redirects
5. **SSL Certificate**: Ensure valid SSL for custom domain

Your application is ready for production deployment with your custom domain `Justice-bot.com`!