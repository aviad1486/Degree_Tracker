import { useEffect } from 'react';
import StubPage from './stubpage';

export default function Logout() {
  useEffect(() => {
    // אם תרצה בהמשך: ניקוי טוקן/סטייט התחברות
    // localStorage.removeItem('authToken');
  }, []);
  return (
    <StubPage
      title="Logout"
      subtitle="You have reached the logout screen. Authentication will be implemented later."
    />
  );
}
