import './App.css';
import {Route, Routes, BrowserRouter } from 'react-router-dom';
//Notification
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserProvider } from './UserProvider';

import PublicLayout from './components/layout/PublicLayout';
import Home from './components/Home';
import ProductDetailPage from './components/ProductDetailPage';
import SearchResultsPage from './components/SearchResultsPage';
import AdminLayout from './components/layout/AdminLayout';
import AdminDashboard from './components/AdminDashboard';
import ProfilePage from './components/ProfilePage';
import ProtectedRoute from './components/ProtetedRoute';

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <ToastContainer position="top-right" autoClose={2000} />
        <Routes>
          {/* Các route sử dụng PublicLayout (có Header và Footer) */}
          <Route path='/' element={<PublicLayout />}>
            <Route index element={<Home />}></Route>
            <Route path="product-detail" element={<ProductDetailPage />}></Route>
            <Route path="search" element={<SearchResultsPage />}></Route>
          </Route>

          {/* Các route dành cho admin */}
          <Route path='/admin' element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />}></Route>
          </Route>

          {/* Profile */}
          <Route path="/profile" element=
          {
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }></Route>
        </Routes>

      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
