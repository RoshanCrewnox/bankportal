import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './components/common/ThemeContext';
import { store } from './store';
import PrivateLayout from './layouts/PrivateLayout';
import { publicRoutes, privateRoutes } from './routes/routesConfig';
import ErrorBoundary from './components/common/ErrorBoundary';
import './App.css';

// Auth guard - redirects to login if not authenticated
const ProtectedRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem("isUserLogged") === "true";
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <ThemeProvider>
          <Router>
            <Routes>
              {/* Public routes */}
              {publicRoutes.map((route) => (
                <Route
                  key={route.path}
                  path={route.path}
                  index={route.index}
                  element={route.element}
                />
              ))}

              {/* Protected routes */}
              <Route path="/" element={
                <ProtectedRoute>
                  <PrivateLayout />
                </ProtectedRoute>
              }>
                {privateRoutes.map((route) => (
                  <Route
                    key={route.path ?? route.name}
                    path={route.path}
                    index={route.index}
                    element={route.element}
                  >
                    {route.children && route.children.map((child) => (
                      <Route
                        key={child.path ?? child.name}
                        path={child.path}
                        index={child.index}
                        element={child.element}
                      />
                    ))}
                  </Route>
                ))}
              </Route>
            </Routes>
            <Toaster />
          </Router>
        </ThemeProvider>
      </Provider>
    </ErrorBoundary>
  );
}

export default App;
