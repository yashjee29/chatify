import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Auth from "./pages/auth/Auth.jsx";
import ChatPage from "./pages/chat/ChatPage.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import Verify from "./pages/auth/Verify.jsx";
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to="/" replace />;

  return children;
}
const App = () => {
  const { user } = useAuth();
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={user ? <Navigate to="/chat" replace /> : <Auth />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="*" element={<Navigate to={user ? "/chat" : "/auth"} replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
