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
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 to-slate-800 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[90rem] mx-auto">
        <div className="flex w-full justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
              Land Title Management
            </h1>
            <p className="mt-2 text-slate-400">Secure and transparent property management</p>
          </div>
          <Button variant="outline" onClick={logout} className="border-slate-700 text-slate-300 hover:bg-slate-800">
            Logout
          </Button>
        </div>
        <div className="flex justify-end mb-8">
          <CreateLandTitle />
        </div>
        <LandTitleList />
      </div>
    </div>
  );
}

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 to-slate-800 text-slate-100">
      {!isAuthenticated ? (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
              Land Title Management
            </h1>
            <LoginForm />
          </div>
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