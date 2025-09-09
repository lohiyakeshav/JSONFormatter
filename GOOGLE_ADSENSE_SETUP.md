# Google AdSense Setup Guide

## What You Need From Your Side

To complete the Google AdSense integration, you'll need to provide the following information:

### 1. **Google AdSense Publisher ID**
- Format: `ca-pub-XXXXXXXXXXXXXXXXX`
- This is your unique publisher ID from Google AdSense
- Found in: AdSense Dashboard → Account → Account Information

### 2. **Ad Unit IDs**
You'll need to create 8 ad units in your AdSense account and provide their slot IDs:

| Ad Position | Ad Type | Recommended Size | Location in Code |
|------------|---------|------------------|------------------|
| Hero Banner | Display Ad | 728x90 (Leaderboard) | Line 30 |
| Vertical Side | Display Ad | 300x600 (Half Page) | Line 65 |
| In-Content 1 | In-feed Ad | Fluid/Responsive | Line 92 |
| Native Feature | Native Ad | Auto/Responsive | Line 116 |
| In-Content 2 | Display Ad | 336x280 (Large Rectangle) | Line 129 |
| Footer Banner | Display Ad | 728x90 (Leaderboard) | Line 158 |
| Sticky Side | Display Ad | 160x600 (Wide Skyscraper) | Line 176 |

## Step-by-Step Setup Instructions

### Step 1: Create a Google AdSense Account
1. Go to [Google AdSense](https://www.google.com/adsense/)
2. Sign up with your Google account
3. Add your website URL
4. Wait for approval (usually 24-48 hours)

### Step 2: Create Ad Units
Once approved, create the following ad units:

1. **Display Ads (5 units)**:
   - Go to Ads → By ad unit → Display ads
   - Create Square/Rectangle ads for different positions
   - Name them clearly (e.g., "JSON_Formatter_Hero", "JSON_Formatter_Sidebar")

2. **In-feed Ads (1 unit)**:
   - Go to Ads → By ad unit → In-feed ads
   - Select "Manual ads" option
   - Customize to match your site's design

3. **Native Ads (1 unit)**:
   - Go to Ads → By ad unit → In-article ads
   - Configure to blend with your content

### Step 3: Update the Code

Replace all instances of `ca-pub-XXXXXXXXXXXXXXXXX` with your publisher ID and `XXXXXXXXXX` with the respective ad slot IDs in `index.html`.

Example:
```html
<!-- Before -->
data-ad-client="ca-pub-XXXXXXXXXXXXXXXXX"
data-ad-slot="XXXXXXXXXX"

<!-- After -->
data-ad-client="ca-pub-1234567890123456"
data-ad-slot="9876543210"
```

### Step 4: Additional Optimizations (Optional)

1. **Enable Auto Ads**:
   - In AdSense: Ads → By site → Your site → Auto ads
   - Toggle on for additional automated placements

2. **Page-level ads**:
   - Enable anchor ads (stick to top/bottom)
   - Enable vignette ads (full-screen ads between pages)

3. **Ad Balance**:
   - Adjust in AdSense to optimize between user experience and revenue

## Testing Your Ads

### Development Testing
1. Use AdSense test parameter: Add `?google_adtest=on` to your URL
2. This shows test ads instead of real ones during development

### Production Testing
1. Deploy your site
2. Ads may take 30-60 minutes to start showing
3. Check browser console for any AdSense errors

## Important Notes

### Ad Placement Policy
- ✅ Current implementation follows Google's policies:
  - Adequate spacing between ads
  - Clear labeling of ads
  - No misleading placement
  - Mobile-friendly implementation

### Revenue Optimization Tips
1. **Content is King**: More quality content = more page views = more revenue
2. **SEO Optimization**: Better rankings = more organic traffic
3. **User Experience**: Fast loading, clean design keeps users engaged
4. **Ad Viewability**: Our sticky and in-content ads have high viewability

### Compliance Checklist
- [x] Ads are clearly distinguishable from content
- [x] No more than 3 ads above the fold
- [x] Mobile ads don't push content below fold
- [x] No ads in pop-ups or overlays
- [x] Privacy Policy and Terms pages linked

## Troubleshooting

### Ads Not Showing?
1. Check if AdSense account is approved
2. Verify publisher ID and slot IDs are correct
3. Clear browser cache
4. Check for ad blockers
5. Wait 30-60 minutes after deployment

### Low Revenue?
1. Improve content quality
2. Increase traffic through SEO/marketing
3. Experiment with ad placement
4. Use AdSense experiments feature
5. Enable Auto ads for additional placements

## File Locations to Update

1. **index.html**:
   - Line 11: Publisher ID in script tag
   - Lines 30, 65, 92, 116, 129, 158, 176: Individual ad unit configurations

## Contact Support

If you need help with implementation:
- Google AdSense Help: https://support.google.com/adsense
- Community Forum: https://support.google.com/adsense/community

---

**Note**: Remember to add a Privacy Policy and Cookie Consent banner to comply with GDPR and other privacy regulations when using Google AdSense.