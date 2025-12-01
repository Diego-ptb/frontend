import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { TradesPage } from './pages/trades/TradesPage';
import { CreateTradePage } from './pages/trades/CreateTradePage';
import { HomePage } from './pages/home/HomePage';
import { WelcomePage } from './pages/welcome/WelcomePage';
import { AuthPage } from './pages/auth/AuthPage';
import { InventoryPage } from './pages/inventory/InventoryPage';
import { MarketplacePage } from './pages/marketplace/MarketplacePage';
import { ItemDetailPage } from './pages/catalog/ItemDetailPage';
import { FriendshipsPage } from './pages/friendships/FriendshipsPage';
import { ProfilePage } from './pages/profile/ProfilePage';
import { RechargeBalancePage } from './pages/profile/RechargeBalancePage';
import { PublicProfilePage } from './pages/users/PublicProfilePage';
import PrivateRoute from './components/PrivateRoute';
import { useGetCurrentUser } from './api/generated/users/users';
import { Header } from './components/ui';
import { LanguageProvider } from './context/LanguageContext';

const Layout = () => {
  const userId = localStorage.getItem('userId');
  const { data: user, refetch: refetchUser } = useGetCurrentUser({ query: { enabled: !!userId } });

  useEffect(() => {
    const handleBalanceChanged = () => {
      // Refresh user data to update balance
      refetchUser();
    };

    window.addEventListener('balance-changed', handleBalanceChanged);

    return () => {
      window.removeEventListener('balance-changed', handleBalanceChanged);
    };
  }, [refetchUser]);

  return (
    <div className="min-h-screen bg-dark-bg animated-bg">
      <Header user={user} userId={userId || undefined} />

      {/* Main Content */}
      <main>
        <Outlet />
      </main>
    </div>
  );
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    const checkAuth = () => {
      setIsAuthenticated(!!localStorage.getItem('token'));
    };

    // Check immediately
    checkAuth();

    // Listen for storage changes (in case token is set/removed in another tab)
    window.addEventListener('storage', checkAuth);

    // Also listen for custom auth events
    const handleAuthChange = () => checkAuth();
    window.addEventListener('auth-change', handleAuthChange);

    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('auth-change', handleAuthChange);
    };
  }, []);

  return (
    <LanguageProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={isAuthenticated ? <HomePage /> : <WelcomePage />} />
            <Route path="auth" element={<AuthPage />} />
            <Route path="catalog/:category/:id" element={<ItemDetailPage />} />
            <Route path="inventory" element={<InventoryPage />} />
            <Route path="friendships" element={<FriendshipsPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="recharge" element={
              <PrivateRoute>
                <RechargeBalancePage />
              </PrivateRoute>
            } />
            <Route path="trades" element={<TradesPage />} />
            <Route path="trades/new/:partnerId" element={<CreateTradePage />} />
            <Route path="marketplace" element={
              <PrivateRoute>
                <MarketplacePage />
              </PrivateRoute>
            } />
            <Route path="users/:username" element={<PublicProfilePage />} />
          </Route>
        </Routes>
      </Router>
    </LanguageProvider>
  );
}

export default App;
