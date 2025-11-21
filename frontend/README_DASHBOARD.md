# WPForms Dashboard - Setup Guide

A production-ready React + TypeScript dashboard for viewing and managing WPForms submissions from your WordPress site.

## Features

- ✅ **Authentication**: Secure login for admin access
- ✅ **Form Submissions Table**: View all submissions with search and filters
- ✅ **Advanced Search**: Search by name, email, course
- ✅ **Date Filters**: Filter submissions by date range
- ✅ **Pagination**: Server-side pagination with customizable per-page options
- ✅ **Entry Details**: View full submission details in a drawer
- ✅ **File Downloads**: Direct download links for uploaded documents
- ✅ **Responsive Design**: Works on all screen sizes
- ✅ **Professional UI**: Modern, clean design with smooth animations

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# WordPress Configuration
VITE_WORDPRESS_BASE_URL=https://online.jaipuria.ac.in/Lmslogin
VITE_WPFORMS_FORM_ID=1234

# WordPress Basic Auth (if your endpoint requires it)
VITE_WORDPRESS_AUTH_USER=your_username
VITE_WORDPRESS_AUTH_PASSWORD=your_password

# Dashboard Admin Credentials
VITE_DASHBOARD_ADMIN_EMAIL=admin@jaipuria.ac.in
VITE_DASHBOARD_ADMIN_PASSWORD=your_secure_password
```

### 3. Run Development Server

```bash
npm run dev
```

The dashboard will be available at `http://localhost:8080`

### 4. Default Login Credentials

- **Email**: `admin@jaipuria.ac.in`
- **Password**: `admin123` (change this in `.env.local`)

## WordPress Integration

### Expected API Endpoint

The dashboard expects a WordPress REST API endpoint at:

```
GET /wp-json/custom-wpforms/v1/entries
```

### Query Parameters

- `form_id` - The WPForms form ID to fetch entries from
- `page` - Current page number (default: 1)
- `per_page` - Number of entries per page (default: 20)
- `search` - Search term (optional)
- `date_from` - Start date filter (optional, format: YYYY-MM-DD)
- `date_to` - End date filter (optional, format: YYYY-MM-DD)

### Expected Response Format

```json
{
  "entries": [
    {
      "entry_id": 1001,
      "form_id": 1234,
      "date": "2025-11-15T10:30:00",
      "status": "read",
      "fields": {
        "student_name": {
          "label": "Student Name",
          "value": "Rahul Sharma",
          "type": "text"
        },
        "email": {
          "label": "Email",
          "value": "rahul@example.com",
          "type": "email"
        },
        "course": {
          "label": "Course",
          "value": "PGDM 2026",
          "type": "text"
        },
        "document_1": {
          "label": "Document 1",
          "value": "https://online.jaipuria.ac.in/uploads/doc1.pdf",
          "type": "file"
        }
      }
    }
  ],
  "pagination": {
    "page": 1,
    "per_page": 20,
    "total": 125
  }
}
```

## Customization

### Changing the Form ID

Update the `VITE_WPFORMS_FORM_ID` in your `.env.local` file.

### Adjusting Table Columns

Edit `src/components/EntriesTable.tsx` to customize which fields appear in the table.

### Modifying API Endpoint

Update the endpoint URL in `src/lib/wpforms-api.ts`:

```typescript
const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_WORDPRESS_BASE_URL,
  // ... other config
};
```

### Field Mapping

The dashboard automatically detects these field keys:
- `student_name` - Student's name
- `email` - Student's email
- `course` - Course name
- Any field with `type: "file"` - Uploaded documents

To change field mappings, edit the `getFieldValue` function in `src/components/EntriesTable.tsx`.

## File Structure

```
src/
├── components/
│   ├── AppSidebar.tsx           # Navigation sidebar
│   ├── EntriesTable.tsx         # Main submissions table
│   ├── EntryDetailsDrawer.tsx   # Entry detail view
│   ├── SearchFilters.tsx        # Search and filter UI
│   ├── PaginationControls.tsx   # Pagination component
│   └── ProtectedRoute.tsx       # Route protection
├── contexts/
│   └── AuthContext.tsx          # Authentication state
├── lib/
│   └── wpforms-api.ts           # WordPress API integration
├── pages/
│   ├── Login.tsx                # Login page
│   └── Dashboard.tsx            # Main dashboard
├── types/
│   └── wpforms.ts               # TypeScript interfaces
└── App.tsx                       # App root with routing
```

## Authentication

The dashboard uses simple client-side authentication. For production use:

1. **Recommended**: Replace with proper JWT or session-based auth
2. Store credentials securely on the server
3. Validate against your WordPress user database
4. Consider implementing role-based access

Current implementation is in `src/contexts/AuthContext.tsx`.

## Production Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` folder.

### Environment Variables in Production

Make sure to set all environment variables in your hosting platform:

- Vercel: Project Settings → Environment Variables
- Netlify: Site Settings → Build & Deploy → Environment
- Custom server: Use `.env.production` file (not committed to git)

### Security Considerations

1. **Never commit `.env.local`** - It's already in `.gitignore`
2. **Use HTTPS** in production for all API calls
3. **Implement proper authentication** with your backend
4. **Enable CORS** on your WordPress endpoint
5. **Add rate limiting** to prevent abuse

## Troubleshooting

### CORS Errors

If you see CORS errors, add these headers to your WordPress REST API endpoint:

```php
header('Access-Control-Allow-Origin: https://your-dashboard-domain.com');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Authorization, Content-Type');
```

### API Connection Issues

1. Check that `VITE_WORDPRESS_BASE_URL` is correct
2. Verify the endpoint path matches your WordPress setup
3. Check network tab in browser DevTools for exact error
4. Ensure WordPress REST API is accessible

### Authentication Not Working

1. Verify credentials in `.env.local` match what you're entering
2. Check browser console for errors
3. Clear localStorage: `localStorage.clear()` in console

## Support

For issues or questions:
1. Check the browser console for errors
2. Review the API response in Network tab
3. Verify environment variables are loaded correctly
4. Check WordPress error logs for endpoint issues

## License

This dashboard is built for Jaipuria Institute. Modify as needed for your use case.
