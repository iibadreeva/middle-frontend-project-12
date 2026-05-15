import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import RequireAuth from './features/auth/require-auth.jsx';
import HomePage from './pages/home-page/home-page.jsx';
import LoginPage from './pages/login-page/login-page.jsx';
import NotFoundPage from './pages/not-found-page/not-found-page.jsx';
import './App.css';

const App = () => (
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
              <Route path="/login" element={<LoginPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
        </BrowserRouter>
      </div>
    </div>
  </div>
);

export default App;
