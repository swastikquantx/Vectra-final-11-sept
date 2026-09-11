
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AdminRoute } from './components/AdminRoute';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import Studio from './pages/Studio';
import Admin from './pages/Admin';
import Operations from './pages/Operations';
import Performance from './pages/Performance';
import Distribution from './pages/Distribution';
import PublicLayout from './components/PublicLayout';
import Auth from './pages/Auth';

function ProtectedRoute({ children }) {
  return children;
}
function Layout({ children }) {
  return <div className="flex min-h-screen bg-black text-white"><Sidebar /><div className="flex-1 flex flex-col">{children}<Footer /></div></div>;
}
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PublicLayout />} />
          <Route path="/studio" element={<ProtectedRoute><Layout><Studio /></Layout></ProtectedRoute>} />
          <Route path="/admin" element={<AdminRoute><Layout><Admin /></Layout></AdminRoute>} />
          <Route path="/operations" element={<AdminRoute><Layout><Operations /></Layout></AdminRoute>} />
          <Route path="/performance" element={<AdminRoute><Layout><Performance /></Layout></AdminRoute>} />
          <Route path="/distribution" element={<ProtectedRoute><Layout><Distribution /></Layout></ProtectedRoute>} />
          <Route path="/auth" element={<Auth />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
