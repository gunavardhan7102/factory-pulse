# Authentication & Login System Documentation

## Overview
A role-based authentication system with two user roles: Manager and Technician, each with specific access permissions.

## Test Credentials

### 1. Manager
- **Email:** `manager@factory.com`
- **Password:** `manager123`
- **Name:** Sarah Manager
- **Role Badge:** Manager
- **Access:**
  - Executive Dashboard
  - Machine Fleet Management
  - Digital Twins
  - Connectivity Management
  - Predictive Analytics
  - Maintenance Command Center (work orders & parts management)
  - AI Copilot
  - Alerts & Notifications

### 2. Technician
- **Email:** `technician@factory.com`
- **Password:** `technician123`
- **Name:** John Technician
- **Role Badge:** Technician
- **Access:**
  - Mobile Workspace (assigned work orders)
  - Task Details (view sub-tasks, mark completion)
  - Parts Requests (request parts for maintenance jobs)

## Features

### Login Page (`/login`)
- Clean, professional design showing FactoryPulse AI branding
- Email and password input fields
- Sign In button with loading state
- Error message display for invalid credentials
- Test credentials displayed for easy reference
- Two role credentials visible on the login page

### Authentication System
- **Persistent Login:** User sessions are saved to localStorage
- **Protected Routes:** All dashboard pages require authentication
- **Role-Based Access:** Routes can be protected by specific roles
- **Automatic Redirect:** Unauthenticated users are redirected to login page
- **Unauthorized Page:** Users accessing restricted pages see `/unauthorized` page

### User Interface
- **Sidebar Footer:** Shows logged-in user information with:
  - User initials in a colored badge
  - Full name
  - Role (with formatting)
  - Logout button
- **Logout Functionality:** Click "Logout" button to sign out and return to login
- **Context Provider:** AuthProvider wraps the entire application for state management

## File Structure

```
/lib/auth-context.tsx          # Authentication context & hooks
/app/login/page.tsx            # Login page component
/app/unauthorized/page.tsx     # Unauthorized access page
/components/protected-route.tsx # Route protection wrapper
/components/app-sidebar.tsx    # Updated with user info & logout
/app/layout.tsx               # Added AuthProvider wrapper
/app/(dashboard)/layout.tsx   # Added ProtectedRoute wrapper
```

## How to Test

1. **Navigate to Login:**
   - Go to http://localhost:3000/login
   - Or try accessing http://localhost:3000 (will redirect to login if not authenticated)

2. **Test Manager Role:**
   - Enter: `manager@factory.com` / `manager123`
   - View all operational pages and the Maintenance Command Center
   - Manage work orders and add parts for maintenance jobs

3. **Test Technician Role:**
   - Enter: `technician@factory.com` / `technician123`
   - View Mobile Workspace with assigned tasks
   - Request additional parts if needed

4. **Test Logout:**
   - Click "Logout" button in the sidebar footer
   - You'll be redirected to the login page
   - Session will be cleared

5. **Test Protected Routes:**
   - Logout
   - Try accessing http://localhost:3000 directly
   - You'll be redirected to login page automatically

## Security Notes

- Currently using localStorage for session persistence (suitable for demo/development)
- Credentials are hardcoded for testing purposes
- For production, implement:
  - Proper backend authentication
  - JWT tokens or secure session management
  - Database user verification
  - Password hashing
  - HTTPS only transmission
  - CSRF protection

## Future Enhancements

- Two-factor authentication (2FA)
- Password reset functionality
- Role-based page access restrictions
- User activity logging
- Session timeout
- "Remember me" option
