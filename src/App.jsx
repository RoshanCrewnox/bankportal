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

/**
 * Recursive function to render routes from a configuration array
 */
const renderRoutes = (routes) => {
  return routes.map((route, index) => (
    <Route 
      key={index} 
      path={route.path} 
      index={route.index}
      element={route.element}
    >
      {route.children && renderRoutes(route.children)}
    </Route>
  ));
};

function App() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <ThemeProvider>
          <Router>
            <Routes>
              {/* Public routes */}
              {renderRoutes(publicRoutes)}

              {/* Protected routes */}
              <Route path="/" element={
                <ProtectedRoute>
                  <PrivateLayout />
                </ProtectedRoute>
              }>
                {renderRoutes(privateRoutes)}
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
