import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import { StoreProvider } from './context/StoreContext'

// Lazy-loaded route-level components: each page (and its images) is only

const Home = lazy(() => import('./home/Home'))
const HomeWoman = lazy(() => import('./pages/woman/HomeWoman'))
const HomeMan = lazy(() => import('./pages/man/HomeMan'))
const Homeaccessories = lazy(() => import('./pages/accessories/Homeaccessories'))
const ProductDetailshome = lazy(() => import('./pages/ProductDetails/ProductDetailshome'))
const HomeShoppingBag = lazy(() => import('./pages/ShoppingBag/HomeShoppingBag'))
const HomeCheckout = lazy(() => import('./pages/Checkout/HomeCheckout'))
const HomeWishlist = lazy(() => import('./pages/Wishlist/HomeWishlist'))

const AdminLayout = lazy(() => import('./admin/AdminLayout'))
const AdminDashboard = lazy(() => import('./admin/AdminDashboard'))
const OrderManagement = lazy(() => import('./admin/OrderManagement'))
const BespokeManagement = lazy(() => import('./admin/BespokeManagement'))
const CustomerManagement = lazy(() => import('./admin/CustomerManagement'))

function PageLoader() {
  return <div className="route-loader">Loading...</div>
}

function App() {
  return (
    <StoreProvider>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* STOREFRONT */}
          <Route path="/" element={<Home />} />
          <Route path="/woman" element={<HomeWoman />} />
          <Route path="/man" element={<HomeMan />} />
          <Route path="/accessories" element={<Homeaccessories />} />
          <Route path="/product/:id" element={<ProductDetailshome />} />
          <Route path="/bag" element={<HomeShoppingBag />} />
          <Route path="/checkout" element={<HomeCheckout />} />
          <Route path="/wishlist" element={<HomeWishlist />} />

          {/* ADMIN */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="orders" element={<OrderManagement />} />
            <Route path="bespoke" element={<BespokeManagement />} />
            <Route path="customers" element={<CustomerManagement />} />
          </Route>
        </Routes>
      </Suspense>
    </StoreProvider>
  )
}

export default App
