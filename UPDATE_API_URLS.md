# API URL Configuration - Security Update

## Issue
Hardcoded `http://localhost:5000` URLs in client code are visible in GitHub repository, exposing backend structure.

## Solution
Use environment variables for all API URLs.

## Files to Update

### Client Files with Hardcoded URLs:

1. ✅ `client/src/config/api.js` - Already uses env vars
2. ✅ `client/src/pages/AdminLogin.jsx` - Updated
3. ✅ `client/src/pages/CheckoutNew.jsx` - Updated (3 instances)
4. ⏳ `client/src/pages/AdminDashboard.jsx` - Needs update (5 instances)
5. ⏳ `client/src/pages/CouponManager.jsx` - Needs update (3 instances)
6. ⏳ `client/src/pages/Home.jsx` - Needs update (1 instance)
7. ⏳ `client/src/pages/Menu.jsx` - Needs update (1 instance)
8. ⏳ `client/src/pages/QuickCheckout.jsx` - Needs update (2 instances)

### Server Files:
✅ Already using `process.env.CLIENT_URL`

## Pattern to Replace

### Before:
```javascript
fetch('http://localhost:5000/api/endpoint')
```

### After:
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
fetch(`${API_URL}/api/endpoint`)
```

### Or use the config file:
```javascript
import { API_ENDPOINTS } from '../config/api';
fetch(API_ENDPOINTS.ENDPOINT_NAME)
```

## Environment Variables

### Client (.env):
```env
VITE_API_URL=http://localhost:5000
```

### Production:
```env
VITE_API_URL=https://api.yourdomain.com
```

## Files Updated

### AdminLogin.jsx
```javascript
// Before
fetch('http://localhost:5000/api/admin/login', ...)

// After
fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/login`, ...)
```

### CheckoutNew.jsx
Updated 3 instances:
- `/api/validate-coupon`
- `/api/create-razorpay-order`
- `/api/orders`

## Remaining Updates Needed

Run these replacements in the following files:

### AdminDashboard.jsx
Replace all 5 instances of `'http://localhost:5000/api/` with:
```javascript
`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/`
```

### CouponManager.jsx
Replace all 3 instances

### Home.jsx
Replace 1 instance

### Menu.jsx
Replace 1 instance

### QuickCheckout.jsx
Replace 2 instances

## Automated Fix

Use find and replace in VS Code:

**Find:**
```
'http://localhost:5000/api/
```

**Replace:**
```
`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/
```

**Note:** Change single quotes to backticks!

## Verification

After updates, search for:
```
http://localhost:5000
```

Should only appear in:
- `.env` files
- `.env.example` files
- `config/api.js` (as fallback)
- Documentation files

## Security Benefits

✅ No hardcoded URLs in source code
✅ Easy to change backend URL
✅ Different URLs for dev/staging/production
✅ No exposure of backend structure in GitHub
✅ Centralized configuration

## Testing

1. Set `VITE_API_URL` in `.env`
2. Restart dev server
3. Test all API calls
4. Verify correct URL is used

## Production Deployment

1. Set production API URL:
   ```env
   VITE_API_URL=https://api.hoteldhanlakshmi.com
   ```

2. Build:
   ```bash
   npm run build
   ```

3. URLs will be replaced at build time

## Status

- ✅ Server: Already using env vars
- ✅ Client config: Using env vars
- ⏳ Client pages: Partially updated
- ⏳ Need to update remaining 6 files
