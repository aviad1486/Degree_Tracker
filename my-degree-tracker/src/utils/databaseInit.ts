import { bootstrapFirestore, createInitialAdminUser } from '../models/seed';
import { auth } from '../firestore/config';

/**
 * Setup helper function for browser console
 */
export const setupAdminConsoleHelper = (): void => {
  if (typeof window !== 'undefined') {
    // Function to seed the database
    (window as any).seedDatabase = async () => {
      const user = auth.currentUser;
      if (!user) {
        console.error('❌ No user signed in. Please sign in first.');
        return;
      }
      
      try {
        console.log('🌱 Seeding database...');
        await bootstrapFirestore(true);
        console.log('✅ Database seeded successfully!');
      } catch (error) {
        console.error('❌ Error seeding database:', error);
      }
    };

    // Function to create admin user
    (window as any).createAdmin = async () => {
      const user = auth.currentUser;
      if (!user) {
        console.error('❌ No user signed in. Please sign in first.');
        return;
      }
      
      try {
        await createInitialAdminUser(user.uid, user.email || '');
        console.log('🎉 Admin user created! Refresh the page.');
        setTimeout(() => window.location.reload(), 1000);
      } catch (error) {
        console.error('❌ Error creating admin:', error);
      }
    };
    
    console.log('✨ Helper functions loaded!');
    console.log('📝 Available commands:');
    console.log('   seedDatabase() - Add sample data to database');
    console.log('   createAdmin() - Make current user an admin');
  }
};