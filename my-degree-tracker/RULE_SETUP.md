# Role-Based Access Control Implementation Guide

## Overview
This implementation adds role-based access control to your Degree Tracker application, allowing you to restrict access to management screens based on user roles.

## Features Added

### 1. User Model with Roles (src/models/User.ts)
- Defines UserRole type: 'admin' | 'user'
- User interface with role, permissions, and profile information
- Permission helper functions to check user capabilities

### 2. Firestore Security Rules (firestore.rules)
- Server-side security enforcement
- Role-based read/write access to collections
- Users can only access their own data unless they're admin

### 3. Authentication Hooks
- useUserRole: Real-time user role and permissions tracking
- useAdmin: Admin functions for user management

### 4. Enhanced Components
- ProtectedRoute: Updated to support role checking
- RoleProtectedRoute: Advanced protection with specific permission requirements
- Navigation components (MainDrawer, HamburgerDrawer): Show/hide based on permissions
- Header: User menu with role display and logout

### 5. Admin Interface (src/pages/admin.tsx)
- User management interface for administrators
- Role assignment and user status management
- Real-time user list with permissions display

## Setup Instructions

### 1. Deploy Firestore Security Rules
bash
# In your project directory
firebase deploy --only firestore:rules


### 2. Create Initial Admin User
Since the system requires an admin to manage other users, you'll need to manually create the first admin user in Firestore:

1. Go to Firebase Console > Firestore Database
2. Create a new collection called users
3. Add a document with your Firebase Auth UID as the document ID
4. Add the following fields:
   json
   {
     "uid": "your-firebase-auth-uid",
     "email": "your-email@example.com",
     "role": "admin",
     "isActive": true,
     "createdAt": "2025-09-15T10:00:00.000Z",
     "updatedAt": "2025-09-15T10:00:00.000Z"
   }
   

### 3. Update Your App Routes
Add the new admin route to your routing configuration:

tsx
// In your main App.tsx or routing file
import AdminPage from './pages/admin';
import RoleProtectedRoute from './components/RoleProtectedRoute';

// Add this route
<Route path="/admin" element={
  <RoleProtectedRoute requireAdmin={true}>
    <AdminPage />
  </RoleProtectedRoute>
} />


### 4. Protect Management Routes
Update your existing management routes to use role protection:

tsx
// Example for protecting students list
<Route path="/students" element={
  <RoleProtectedRoute requiredPermission="canEditStudents">
    <StudentList />
  </RoleProtectedRoute>
} />

// Example for protecting courses list
<Route path="/courses" element={
  <RoleProtectedRoute requiredPermission="canEditCourses">
    <CourseList />
  </RoleProtectedRoute>
} />


## User Permissions

### Admin Users Can:
- View and access all management screens
- Edit students, courses, and programs
- Assign roles to other users
- View system reports
- Access user management interface

### Regular Users Can:
- View their own progress and grades
- Access personal dashboard
- View help and support
- Cannot access any management screens

## Default Behavior
- New users are automatically assigned the 'user' role
- Users must be manually promoted to 'admin' by existing admins
- Inactive users are blocked from accessing the system
- All navigation automatically adjusts based on user permissions

## Security Features
- Server-side security rules enforce permissions
- Real-time role updates (changes take effect immediately)
- Inactive account detection and blocking
- Audit trail with creation and update timestamps

## Usage Examples

### Check if user is admin:
tsx
const { isAdmin } = useUserRole();


### Check specific permission:
tsx
const { hasPermission } = useUserRole();
const canEditStudents = hasPermission('canEditStudents');


### Admin functions:
tsx
const { updateUserRole, toggleUserStatus } = useAdmin();
await updateUserRole(userId, 'admin');
await toggleUserStatus(userId, false); // Deactivate user


## Troubleshooting

### Common Issues:
1. *"Access denied" errors*: Ensure Firestore security rules are deployed
2. *Navigation not updating*: Check that components are using useUserRole hook
3. *First admin setup*: Manually create the first admin user in Firestore console

### Firebase Console Access:
- Go to Firebase Console > Authentication to see all registered users
- Go to Firestore Database > users collection to manage user roles
- Check Console > Rules to verify security rules are active