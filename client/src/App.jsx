import { Route, Routes, BrowserRouter } from 'react-router-dom';
//Notification
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './styles/App.css';
import { UserProvider } from './contexts/UserProvider';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import ProductPage from './pages/ProductPage';
import SearchResultsPage from './pages/SearchResultsPage';
import AdminDashboard from './pages/AdminDashboard';
import ProfilePage from './pages/ProfilePage';
import AddressPage from './pages/AddressPage';
import CheckoutPage from './pages/CheckoutPage';
import PaymentResultPage from './pages/PaymentResultPage';
import CartPage from './pages/CartPage';
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
          <Route path="product" element={<ProductPage />}></Route>
          <Route path="search" element={<SearchResultsPage />}></Route>
          <Route path="product/checkout" element={<CheckoutPage/>}></Route>
          <Route path="payment-result" element={<PaymentResultPage/>}></Route>
          <Route path='cart' element={<CartPage/>}></Route>
          {/* Profile */}
          <Route path="/profile" element=
            {
              <UserAuth>
                <ProfilePage />
              </UserAuth>
            }>

          </Route>

          <Route path='/profile/address' element={
            <UserAuth>
              <AddressPage/>
            </UserAuth>
          }></Route>
          {/* Các route dành cho admin */}
          <Route path="/admin/dashboard" element={<AdminDashboard />}></Route>
        </Routes>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
