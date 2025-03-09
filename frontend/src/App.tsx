import { AuthProvider } from '@/contexts/AuthContext';
import { useAuth } from '@/contexts/AuthContext';
import { LoginForm } from '@/components/LoginForm';
import { LandTitleList } from '@/components/LandTitleList';
import { CreateLandTitle } from '@/components/CreateLandTitle';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/toaster';

function Dashboard() {
  const { logout } = useAuth();

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Land Title Management</h1>
        <Button variant="outline" onClick={logout}>
          Logout
        </Button>
      </div>
      <div className="flex justify-end">
        <CreateLandTitle />
      </div>
      <LandTitleList />
    </div>
  );
}

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {!isAuthenticated ? (
        <div className="min-h-screen flex items-center justify-center">
          <LoginForm />
        </div>
      ) : (
        <Dashboard />
      )}
      <Toaster />
    </div>
  );
}

function AppWithProviders() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}

export default AppWithProviders;