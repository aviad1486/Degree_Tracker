import { useState } from 'react';
import { doc, setDoc, updateDoc, collection, getDocs } from 'firebase/firestore';
import { firestore } from '../firestore/config';
import type { User, UserRole } from '../models/User';

interface UseAdminReturn {
  loading: boolean;
  error: string | null;
  createUser: (userData: Omit<User, 'createdAt' | 'updatedAt'>) => Promise<boolean>;
  updateUserRole: (userId: string, newRole: UserRole) => Promise<boolean>;
  toggleUserStatus: (userId: string, isActive: boolean) => Promise<boolean>;
  getAllUsers: () => Promise<User[]>;
}

export const useAdmin = (): UseAdminReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createUser = async (userData: Omit<User, 'createdAt' | 'updatedAt'>): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const userDoc = doc(firestore, 'users', userData.uid);
      const timestamp = new Date().toISOString();
      
      await setDoc(userDoc, {
        ...userData,
        createdAt: timestamp,
        updatedAt: timestamp,
      });
      
      return true;
    } catch (err) {
      console.error('Error creating user:', err);
      setError(err instanceof Error ? err.message : 'Failed to create user');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: UserRole): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const userDoc = doc(firestore, 'users', userId);
      await updateDoc(userDoc, {
        role: newRole,
        updatedAt: new Date().toISOString(),
      });
      
      return true;
    } catch (err) {
      console.error('Error updating user role:', err);
      setError(err instanceof Error ? err.message : 'Failed to update user role');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId: string, isActive: boolean): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const userDoc = doc(firestore, 'users', userId);
      await updateDoc(userDoc, {
        isActive,
        updatedAt: new Date().toISOString(),
      });
      
      return true;
    } catch (err) {
      console.error('Error updating user status:', err);
      setError(err instanceof Error ? err.message : 'Failed to update user status');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getAllUsers = async (): Promise<User[]> => {
    setLoading(true);
    setError(null);
    
    try {
      const usersCollection = collection(firestore, 'users');
      const querySnapshot = await getDocs(usersCollection);
      
      const users: User[] = [];
      querySnapshot.forEach((doc) => {
        users.push({ ...doc.data() } as User);
      });
      
      return users;
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    createUser,
    updateUserRole,
    toggleUserStatus,
    getAllUsers,
  };
};