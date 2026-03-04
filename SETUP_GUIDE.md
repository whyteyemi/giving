# Supabase Authentication & Team Management Setup Guide

## 🎯 Overview
This guide will help you set up the complete authentication and team management system for Giving Without Limit using Supabase.

## 📋 Prerequisites
- A Supabase account (free tier is fine)
- Node.js and npm installed
- Your project running locally

---

## 🚀 Step 1: Create Supabase Project

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Click "New Project"
3. Fill in the details:
   - **Name**: Giving Without Limit
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Choose closest to your users
4. Click "Create new project"
5. Wait for the project to be created (takes ~2 minutes)

---

## 🔑 Step 2: Get Your API Keys

1. In your Supabase project dashboard, click on the **Settings** icon (gear icon) in the left sidebar
2. Click on **API** in the settings menu
3. You'll see two important values:
   - **Project URL** (looks like: `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon public** key (a long string starting with `eyJ...`)

4. Copy these values and update your `.env.local` file:

```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

---

## 🗄️ Step 3: Set Up Database Schema

1. In your Supabase dashboard, click on the **SQL Editor** icon in the left sidebar
2. Click **New Query**
3. Open the file `database/schema.sql` in your project
4. Copy the **entire contents** of that file
5. Paste it into the Supabase SQL Editor
6. Click **Run** (or press Ctrl+Enter)
7. You should see "Success. No rows returned" - this is good!

This creates:
- ✅ `profiles` table for user information
- ✅ Row Level Security (RLS) policies for data protection
- ✅ Automatic triggers for profile creation
- ✅ Helper functions for role checking

---

## 📧 Step 4: Configure Email Authentication

1. In Supabase dashboard, go to **Authentication** → **Providers**
2. Make sure **Email** is enabled (it should be by default)
3. Scroll down to **Email Templates** (optional but recommended):
   - Customize the confirmation email
   - Customize the password reset email
   - Add your organization's branding

### Email Settings (Optional):
1. Go to **Authentication** → **Settings**
2. Configure:
   - **Site URL**: `http://localhost:5173` (for development)
   - **Redirect URLs**: Add `http://localhost:5173/reset-password`

---

## 👤 Step 5: Create Your First Admin User

### Method 1: Through the App (Recommended)
1. Start your development server: `npm run dev`
2. Navigate to the sign-up page
3. Create an account with your email (e.g., `bisowilly@yahoo.com`)
4. Check your email and verify your account
5. Go back to Supabase dashboard → **SQL Editor**
6. Run this query to make yourself an admin:

```sql
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'bisowilly@yahoo.com';
```

### Method 2: Through Supabase Dashboard
1. Go to **Authentication** → **Users**
2. Click **Add User**
3. Enter email and password
4. Click **Create User**
5. Then run the SQL query above to set the role to admin

---

## 🔐 Step 6: Update Your App.tsx

Update your `App.tsx` to include the AuthProvider and routing:

```tsx
import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AuthView from './components/AuthView';
import AdminDashboard from './pages/AdminDashboard';
// ... other imports

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <i className="fas fa-spinner fa-spin text-4xl text-primary"></i>
      </div>
    );
  }

  // If user is not logged in, show auth view
  if (!user) {
    return <AuthView />;
  }

  // If user is logged in, show your main app
  // You can add routing here based on user role
  return (
    <div>
      {/* Your existing app content */}
      {/* Add a link to admin dashboard for admins */}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
```

---

## 🧪 Step 7: Test the System

### Test Sign Up:
1. Go to your app
2. Click "Sign Up"
3. Enter name, email, and password
4. Check your email for verification link
5. Click the verification link

### Test Sign In:
1. Go to your app
2. Click "Sign In"
3. Enter your email and password
4. You should be logged in!

### Test Forgot Password:
1. Click "Forgot Password"
2. Enter your email
3. Check your email for reset link
4. Click the link and set a new password

### Test Admin Dashboard:
1. Make sure you've set your role to 'admin' (Step 5)
2. Navigate to `/admin` or create a button to access `<AdminDashboard />`
3. You should see all users and be able to manage them

---

## 🎨 Step 8: Add Navigation

Create a simple navigation component to access the admin dashboard:

```tsx
// In your main app component
import { useAuth } from './contexts/AuthContext';

function Navigation() {
  const { profile, signOut } = useAuth();

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-xl font-bold text-primary">Giving Without Limit</div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            Welcome, {profile?.full_name}
          </span>
          {profile?.role === 'admin' && (
            <a href="/admin" className="text-primary hover:text-secondary">
              Admin Dashboard
            </a>
          )}
          <button
            onClick={signOut}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
}
```

---

## 🔒 Security Features Included

✅ **Row Level Security (RLS)**: Users can only see/edit what they're allowed to
✅ **Role-Based Access Control**: Admin, Team Member, and Volunteer roles
✅ **Email Verification**: Users must verify their email
✅ **Password Reset**: Secure password reset flow
✅ **Automatic Profile Creation**: Profiles are created automatically on signup
✅ **Secure API Keys**: Using environment variables

---

## 📊 Database Structure

### Profiles Table
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key (references auth.users) |
| email | TEXT | User's email |
| full_name | TEXT | User's full name |
| role | TEXT | admin, team_member, or volunteer |
| location | TEXT | User's location (optional) |
| phone | TEXT | Phone number (optional) |
| department | TEXT | Department (optional) |
| position | TEXT | Position/title (optional) |
| bio | TEXT | Biography (optional) |
| avatar_url | TEXT | Profile picture URL (optional) |
| created_at | TIMESTAMP | Account creation date |
| updated_at | TIMESTAMP | Last update date |

---

## 🎯 User Roles Explained

### 👑 Admin
- Full access to admin dashboard
- Can view all users
- Can edit any user's profile
- Can change user roles
- Can delete users

### 👔 Team Member
- Can view team directory
- Can edit own profile
- Limited admin access (can be customized)

### 🤝 Volunteer
- Can view public content
- Can edit own profile
- No admin access

---

## 🐛 Troubleshooting

### "Invalid API key" error:
- Check that you've copied the correct keys from Supabase
- Make sure there are no extra spaces in your `.env.local` file
- Restart your dev server after updating `.env.local`

### Email not sending:
- Check your spam folder
- In Supabase dashboard, go to Authentication → Settings
- Make sure email provider is configured
- For production, you'll need to set up a custom SMTP provider

### "Access Denied" on admin dashboard:
- Make sure you've run the SQL query to set your role to 'admin'
- Check in Supabase dashboard → Table Editor → profiles
- Verify your user's role is set to 'admin'

### Database errors:
- Make sure you've run the entire `schema.sql` file
- Check for any error messages in the SQL Editor
- Try running the schema again (it's safe to run multiple times)

---

## 🚀 Next Steps

1. ✅ Set up Supabase project
2. ✅ Configure environment variables
3. ✅ Run database schema
4. ✅ Create admin user
5. ✅ Test authentication
6. ✅ Access admin dashboard
7. 🎨 Customize the UI to match your brand
8. 📱 Add more features (team directory, volunteer applications, etc.)
9. 🌐 Deploy to production

---

## 📞 Need Help?

If you run into any issues:
1. Check the browser console for error messages
2. Check the Supabase dashboard logs
3. Review the troubleshooting section above
4. Check Supabase documentation: https://supabase.com/docs

---

## 🎉 You're All Set!

You now have a complete authentication and team management system with:
- ✅ User sign up and sign in
- ✅ Email verification
- ✅ Password reset
- ✅ Role-based access control
- ✅ Admin dashboard
- ✅ Team member management
- ✅ Secure database with RLS

Happy coding! 🚀
