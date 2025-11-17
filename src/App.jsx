import { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

function App() {
  const [route, setRoute] = useState(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => setRoute(window.location.pathname);
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  // Simple router
  const routes = {
    '/': HomePage,
    '/login': LoginPage,
    '/signup': SignupPage,
  };

  const Component = routes[route] || HomePage;

  return (
    <AuthProvider>
      <Component />
    </AuthProvider>
  );
}

export default App;