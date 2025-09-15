import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, firestore } from '../firestore/config';
import { getUserPermissions, hasPermission } from '../models/User';
import type { User, UserPermissions } from '../models/User';

interface UseUserRoleReturn {
  user: User | null;
  loading: boolean;
  error: Error | null;
  isAdmin: boolean;
  permissions: UserPermissions;
  hasPermission: (permission: keyof UserPermissions) => boolean;
}

export const useUserRole = (): UseUserRoleReturn => {
  const [firebaseUser, authLoading, authError] = useAuthState(auth);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (authLoading) return;
    
    if (!firebaseUser) {
      setUser(null);
      setLoading(false);
      return;
    }

    // Listen to user document changes in real-time
    const userDocRef = doc(firestore, 'users', firebaseUser.uid);
    
    const unsubscribe = onSnapshot(
      userDocRef,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const userData = docSnapshot.data() as User;
          setUser(userData);
        } else {
          // User document doesn't exist, create default user
          const defaultUser: User = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || undefined,
            role: 'user', // Default role
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          setUser(defaultUser);
          console.log('👤 User document not found. Default user data loaded. Run createFirstAdmin() in console to become admin.');
        }
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Error fetching user role:', err);
        // On permission error, still create a default user for better UX
        if (err.code === 'permission-denied') {
          const defaultUser: User = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || undefined,
            role: 'user', // Default role
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          setUser(defaultUser);
          console.log('👤 Permission denied accessing user document. Default user loaded. Run createFirstAdmin() in console to become admin.');
        } else {
          setError(err as Error);
        }
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [firebaseUser, authLoading]);

  const isAdmin = user?.role === 'admin';
  const permissions = user ? getUserPermissions(user.role) : getUserPermissions('user');
  
  const checkPermission = (permission: keyof UserPermissions): boolean => {
    return user ? hasPermission(user, permission) : false;
  };

  return {
    user,
    loading: authLoading || loading,
    error: authError || error,
    isAdmin,
    permissions,
    hasPermission: checkPermission,
  };
};