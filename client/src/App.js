import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PublicLayout from './components/layout/PublicLayout';
import Home from './components/Home';
import ProductDetailPage from './components/ProductDetailPage';
import SearchResultsPage from './components/SearchResultsPage';
import AdminLayout from './components/layout/AdminLayout';
import AdminDashboard from './components/AdminDashboard';

function App() {
  return (
    <Router>
      <Routes>
        {/* Các route sử dụng PublicLayout (có Header và Footer) */}
        <Route path='/' element={<PublicLayout/>}>
          <Route index element={<Home/>}></Route>
          <Route path="product-detail" element={<ProductDetailPage/>}></Route>
          <Route path="search" element={<SearchResultsPage/>}></Route>
        </Route>

        {/* Các route dành cho admin */}
        <Route path='/admin' element={<AdminLayout/>}>
          <Route path="dashboard" element={<AdminDashboard/>}></Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
