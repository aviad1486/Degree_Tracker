import { doc, setDoc } from 'firebase/firestore';
import { firestore } from '../firestore/config';
import type { User } from '../models/User';

/**
 * Creates an admin user in Firestore
 * Call this function once with your Firebase Auth UID to create the first admin
 * 
 * Usage:
 * 1. Sign in to your app first (so you have a Firebase Auth user)
 * 2. Get your UID from Firebase Auth
 * 3. Call this function with your details
 */
export const createAdminUser = async (
  uid: string,
  email: string,
  displayName?: string
): Promise<boolean> => {
  try {
    const adminUser: User = {
      uid,
      email,
      displayName,
      role: 'admin',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const userDoc = doc(firestore, 'users', uid);
    await setDoc(userDoc, adminUser);
    
    console.log('✅ Admin user created successfully!');
    console.log('User details:', adminUser);
    return true;
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    return false;
  }
};

/**
 * Quick setup function - call this from browser console
 * First sign in to your app, then run this in the browser console:
 * 
 * // In browser console:
 * window.createFirstAdmin()
 */
export const setupFirstAdmin = () => {
  if (typeof window !== 'undefined') {
    (window as any).createFirstAdmin = async () => {
      try {
        // Get current Firebase user
        const { auth } = await import('../firestore/config');
        const user = auth.currentUser;
        
        if (!user) {
          console.error('❌ No user is currently signed in. Please sign in first.');
          return;
        }
        
        console.log('Creating admin user for:', user.email);
        const success = await createAdminUser(
          user.uid,
          user.email || '',
          user.displayName || undefined
        );
        
        if (success) {
          console.log('🎉 Admin user created! Refresh the page to see changes.');
          // Optionally refresh the page
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      } catch (error) {
        console.error('❌ Error in createFirstAdmin:', error);
        if (error instanceof Error && error.message.includes('permission')) {
          console.log('💡 Tip: Make sure you are signed in and Firestore rules allow user creation.');
        }
      }
    };
    
    console.log('✨ Helper function loaded! Type "createFirstAdmin()" in console to create admin user.');
  }
};