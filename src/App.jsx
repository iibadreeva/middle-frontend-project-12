import { Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import GuestRoute from './features/auth/guest-route.jsx';
import { clearCredentials } from './features/auth/auth-slice';
import { clearAuth } from './features/auth/auth-storage.js';
import { disconnectChatSocket } from './features/chat/chat-socket';
import RequireAuth from './features/auth/require-auth.jsx';
import { resetChat } from './features/chat/chat-slice';
import HomePage from './pages/home-page/home-page.jsx';
import LoginPage from './pages/login-page/login-page.jsx';
import NotFoundPage from './pages/not-found-page/not-found-page.jsx';
import './App.css';

const App = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const handleLogout = () => {
    disconnectChatSocket();
    clearAuth();
    dispatch(clearCredentials());
    dispatch(resetChat());
  };

  return (
    <div className="h-100 bg-light">
      <div className="h-100">
        <div className="d-flex flex-column h-100">
          <BrowserRouter>
            <header>
              <nav
                className="shadow-sm navbar navbar-expand-lg navbar-light bg-white"
                aria-label="Основная навигация"
              >
                <div className="container">
                  <NavLink to="/" end className="navbar-brand">
                    Hexlet Chat
                  </NavLink>
                  {isAuthenticated && (
                    <Button variant="primary" onClick={handleLogout}>
                      Выйти
                    </Button>
                  )}
                </div>
              </nav>
            </header>
            <main className="h-100">
              <Routes>
                <Route
                  path="/"
                  element={(
                    <RequireAuth>
                      <HomePage />
                    </RequireAuth>
                  )}
                />
                <Route
                  path="/login"
                  element={(
                    <GuestRoute>
                      <LoginPage />
                    </GuestRoute>
                  )}
                />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
          </BrowserRouter>
        </div>
      </div>
    </div>
  );
};

export default App;
