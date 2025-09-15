export type UserRole = 'admin' | 'user';

export interface User {
  uid: string;               // Firebase Auth UID
  email: string;
  displayName?: string;
  fullName?: string;
  role: UserRole;           // admin can access management screens, user can only see personal screens
  studentId?: string;       // Link to Student document if user is a student
  isActive: boolean;        // To enable/disable user access
  createdAt: string;        // ISO timestamp
  updatedAt: string;        // ISO timestamp
  lastLoginAt?: string;     // ISO timestamp
}

export interface UserProfile extends User {
  // Additional profile information that might be needed
  phoneNumber?: string;
  dateOfBirth?: string;
  profilePicture?: string;
}

// Helper type for user permissions
export interface UserPermissions {
  canViewManagement: boolean;
  canEditStudents: boolean;
  canEditCourses: boolean;
  canEditPrograms: boolean;
  canAssignRoles: boolean;
  canViewReports: boolean;
}

// Helper function to get user permissions based on role
export const getUserPermissions = (role: UserRole): UserPermissions => {
  switch (role) {
    case 'admin':
      return {
        canViewManagement: true,
        canEditStudents: true,
        canEditCourses: true,
        canEditPrograms: true,
        canAssignRoles: true,
        canViewReports: true,
      };
    case 'user':
    default:
      return {
        canViewManagement: false,
        canEditStudents: false,
        canEditCourses: false,
        canEditPrograms: false,
        canAssignRoles: false,
        canViewReports: false,
      };
  }
};

// Helper function to check if user has specific permission
export const hasPermission = (user: User, permission: keyof UserPermissions): boolean => {
  const permissions = getUserPermissions(user.role);
  return permissions[permission];
};