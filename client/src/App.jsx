import { Route, Routes, BrowserRouter } from 'react-router-dom';
//Notification
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './styles/App.css';
import { UserProvider } from './contexts/UserProvider';

import Public from './components/layout/Public';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import ProductPage from './pages/ProductPage';
import SearchResultsPage from './pages/SearchResultsPage';
import AddressPage from './pages/AddressPage';
import CheckoutPage from './pages/CheckoutPage';
import PaymentResultPage from './pages/PaymentResultPage';
import CartPage from './pages/CartPage';
import WishlistPage from './pages/WishlistPage';
import OrderPage from './pages/OrderPage';
import InfoPayment from './components/comon/InfoPayment';

import User from './components/layout/User';
import UserAuth from './hooks/userAuth';
import ProfilePage from './pages/ProfilePage';
import PointPage from './pages/PointPage';


import Admin from './components/layout/Admin';
import Overview from './pages/admin/Overview';
import OrderManagement from './pages/admin/OrderManagement';

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <ToastContainer position="top-right" autoClose={2000} />
        <Routes>

          <Route path='check-modal' element={<InfoPayment/>}></Route>

          {/* Các route chính */}
          <Route path="login" element={<LoginPage />}></Route>
          <Route path="register" element={<RegisterPage />}></Route>
          <Route path='/' element={<Public />}>
            <Route index element={<HomePage />}></Route>
            <Route path="product" element={<ProductPage />}></Route>
            <Route path="search" element={<SearchResultsPage />}></Route>
            <Route path="product/checkout" element={<CheckoutPage />}></Route>
            <Route path="payment-result" element={<PaymentResultPage />}></Route>
            <Route path='cart' element={<CartPage />}></Route>
            <Route path='wishlist' element={<WishlistPage />}></Route>
            <Route path='order' element={<OrderPage />}></Route>
          </Route>

          {/* Các route danh cho User */}
          <Route path="/user" element={<User />}>
            <Route index path='profile' element={<UserAuth><ProfilePage /></UserAuth>}></Route>
            <Route path='address' element={<UserAuth><AddressPage /></UserAuth>}></Route>
            <Route path='order' element={<UserAuth><OrderPage /></UserAuth>}></Route>
            <Route path='point' element={<UserAuth><PointPage /></UserAuth>}></Route>
          </Route>


          {/* Các route dành cho admin */}
          <Route path="/admin" element={<Admin />}>
            <Route index path="overview" element={<Overview />}></Route>
            <Route path="orders" element={<OrderManagement />}></Route>
          </Route>
        </Routes>

      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
