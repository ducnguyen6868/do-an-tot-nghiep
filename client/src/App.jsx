import { Route, Routes, BrowserRouter } from 'react-router-dom';
//Notification
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './styles/App.css';
import { UserProvider } from './contexts/UserProvider';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import ProductDetailPage from './pages/ProductDetailPage';
import SearchResultsPage from './pages/SearchResultsPage';
import AdminDashboard from './pages/AdminDashboard';
import ProfilePage from './pages/ProfilePage';
import UserAuth from './hooks/userAuth';

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <ToastContainer position="top-right" autoClose={2000} />
        <Routes>
          <Route index element={<HomePage />}></Route>
          <Route path="login" element={<LoginPage />}></Route>
          <Route path="register" element={<RegisterPage />}></Route>
          <Route path="product-detail" element={<ProductDetailPage />}></Route>
          <Route path="search" element={<SearchResultsPage />}></Route>


          {/* Profile */}
          <Route path="/profile" element=
            {
              <UserAuth>
                <ProfilePage />
              </UserAuth>
            }>

          </Route>
          {/* Các route dành cho admin */}
          <Route path="admin/dashboard" element={<AdminDashboard />}></Route>
        </Routes>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
