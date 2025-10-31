import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { SubscriptionProvider } from './contexts/SubscriptionContext';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import Home from './screens/Home';
import Login from './screens/Login';
import Register from './screens/Register';
import PasswordRecovery from './screens/PasswordRecovery';
import UserHome from './screens/UserHome';
import Checkout from './screens/Checkout';
import AuthCallback from './screens/AuthCallback';
import SessionExpired from './components/SessionExpired';

function App() {
  return (
    <AuthProvider>
      <SubscriptionProvider>
        <Router>
          <Routes>
            {/* Rutas públicas */}
            <Route path="/" element={<Home />} />
            
            {/* Rutas de autenticación (solo para usuarios NO autenticados) */}
            <Route path="/login" element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } />
            <Route path="/register" element={<Register />} />
            <Route path="/password-recovery" element={
              <PublicRoute>
                <PasswordRecovery />
              </PublicRoute>
            } />
            
            {/* Rutas protegidas (solo para usuarios autenticados) */}
            <Route path="/user-home" element={
              <ProtectedRoute>
                <UserHome />
              </ProtectedRoute>
            } />

            <Route path="/checkout" element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            } />

            {/* Callback de OAuth (accesible para todos) */}
            <Route path="/auth/callback" element={<AuthCallback />} />
            
            {/* Ruta para sesión expirada */}
            <Route path="/session-expired" element={<SessionExpired />} />
            
            {/* Ruta por defecto */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </SubscriptionProvider>
    </AuthProvider>
  );
}

export default App;
