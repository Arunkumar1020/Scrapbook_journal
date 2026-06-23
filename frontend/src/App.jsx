import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
import CookieConsentBanner from "./components/CookieConsentBanner";

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
      <CookieConsentBanner />
    </AuthProvider>
  );
}

export default App;