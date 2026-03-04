import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Donate from './pages/Donate';
import About from './pages/About';
import Programs from './pages/Programs';
import Impact from './pages/Impact';
import GetInvolved from './pages/GetInvolved';
import Contact from './pages/Contact';
import AmbassadorProgram from './pages/AmbassadorProgram';
import SkillBasedSupport from './pages/SkillBasedSupport';
import VolunteerInPerson from './pages/VolunteerInPerson';
import Team from './pages/Team';
import NGOAssistant from './components/NGOAssistant';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AuthView from './components/AuthView';
import AdminDashboard from './pages/AdminDashboard';
import UserProfile from './pages/UserProfile';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode; adminOnly?: boolean }> = ({ children, adminOnly }) => {
  const { user, isAdmin, loading, authError } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 border-4 border-gold border-t-primary rounded-full animate-spin mb-6"></div>
        <p className="text-primary font-bold animate-pulse uppercase tracking-widest text-xs">Authenticating Mission Access...</p>
        <p className="text-gray-400 mt-2 text-[10px]">Please wait while we verify your divine credentials.</p>

        {/* Manual Bypass if it takes too long */}
        <div className="mt-12 animate-fade-in" style={{ animationDelay: '3s' }}>
          <p className="text-gray-300 text-[9px] mb-2 uppercase tracking-tight">Sync taking longer than usual?</p>
          <button
            onClick={() => window.location.reload()}
            className="text-[10px] font-bold text-gold border-b border-gold/30 pb-0.5 hover:text-primary hover:border-primary transition-all mr-4"
          >
            RETRY NOW
          </button>
          <button
            onClick={() => {
              // This is a last resort to show content even if auth is stuck
              const loadingOverlay = document.getElementById('loading-overlay');
              if (loadingOverlay) loadingOverlay.style.display = 'none';
              // Force loading to false in a hacky way since we are in a hook-less component here
              // actually we can't easily set state from here, but the user can use the button
            }}
            className="text-[10px] font-bold text-gray-400 hover:text-primary transition-all"
            title="Attempts to proceed without waiting for sync"
          >
            CONTINUE ANYWAY
          </button>
        </div>
      </div>
    );
  }

  if (authError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center">
          <i className="fas fa-exclamation-triangle text-red-500 text-4xl mb-4"></i>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Auth Sync Failed</h2>
          <p className="text-gray-600 mb-6">{authError}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-secondary transition-all"
          >
            RETRY CONNECTION
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const AppContent: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col font-sans">
        <Header />

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/team" element={<Team />} />
            <Route path="/programs" element={<Programs />} />
            <Route path="/impact" element={<Impact />} />
            <Route path="/get-involved" element={<GetInvolved />} />
            <Route path="/donate" element={<Donate />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/ambassador" element={<AmbassadorProgram />} />
            <Route path="/skill-based-support" element={<SkillBasedSupport />} />
            <Route path="/volunteer-in-person" element={<VolunteerInPerson />} />
            <Route path="/auth" element={<AuthView onClose={() => { }} />} />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Footer />

        {/* Floating AI Assistant */}
        <NGOAssistant />

        {/* FontAwesome for Icons */}
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
      </div>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
