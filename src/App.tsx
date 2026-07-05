import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import HomePage from './pages/HomePage';

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen">
            <Toaster position="top-right" toastOptions={{ 
              style: { background: '#1e293b', color: '#fff', border: '1px solid #334155' } 
            }} />
            <Routes>
              <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
              <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
              <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />
              <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
