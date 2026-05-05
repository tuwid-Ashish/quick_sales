import { createRoot } from 'react-dom/client'
import React, { Suspense, lazy } from 'react'
import App from './App.jsx'
import { RouterProvider, createBrowserRouter } from 'react-router'
import './index.css'
import { Provider } from 'react-redux'
import { store } from './Store/Store.js'
import Signupform from './components/Auth/signup_page.tsx'
import LoginPage from './components/Auth/login_component.tsx'
import ResetPassword from './components/Auth/Resetpasword.tsx'
import AuthLayout from './components/AuthLayout.tsx'
import ProductsPage from './components/products/list_products.js'
import HomePage from './components/Home/HomePage.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Lazy load heavy components for better initial load
const ProductDetails = lazy(() => import('./components/products/product_page.js'));
const Dashboard = lazy(() => import('./components/Admin/Dashboard.tsx'));
const OrdersPage = lazy(() => import('./components/Admin/pages/OrdersPage.tsx'));
const ReferralsPage = lazy(() => import('./components/Admin/pages/ReferralsPage.tsx'));
const AgentsPage = lazy(() => import('./components/Admin/pages/AgentsPage.tsx'));
const Generate_qr = lazy(() => import('./components/Agent/Generate_qr.js'));
const Agent_stats = lazy(() => import('./components/Agent/Agent_stats.js'));
const PaymentStatus = lazy(() => import('./components/products/checkout_page.tsx'));
const ShopStats = lazy(() => import('./components/products/ShopStats.tsx'));

const queryClient = new QueryClient();

// Loading fallback component
const LoadingFallback = () => (
  <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-sky overflow-hidden">
    <div className="absolute top-10 left-10 w-32 h-32 bg-white/20 rounded-full blur-2xl animate-float" />
    <div className="absolute bottom-10 right-10 w-48 h-48 bg-sun/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
    <div className="relative flex flex-col items-center gap-8 z-10">
      <img src="/images/logo.png" alt="Get Gardening" className="h-24 w-auto object-contain drop-shadow-lg" />
      <div className="flex items-center gap-3 bg-white/50 backdrop-blur-md px-6 py-3 rounded-full shadow-sm">
        <div className="h-3 w-3 rounded-full bg-leaf animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="h-3 w-3 rounded-full bg-sun animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="h-3 w-3 rounded-full bg-leaf-light animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  </div>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/', element: <HomePage />
      },
      {
        path: '/products', element: <ProductsPage />
      },
      {
        path: '/products/:id', element: <Suspense fallback={<LoadingFallback />}><ProductDetails /></Suspense>
      },
      {
        path: '/payment-status', element: <Suspense fallback={<LoadingFallback />}><PaymentStatus /></Suspense>
      },
      {
        path: '/shop-status', element: <Suspense fallback={<LoadingFallback />}><ShopStats /></Suspense>
      },
      {
        path: "/dashboard/*",
        element: (
          <AuthLayout authentication>
            <Suspense fallback={<LoadingFallback />}>
              <Dashboard />
            </Suspense>
          </AuthLayout>
        ),
        children: [
          { path: "", element: <Suspense fallback={<LoadingFallback />}><Dashboard /></Suspense> },
          { path: "products", element: <ProductsPage /> },
          { path: "orders", element: <Suspense fallback={<LoadingFallback />}><OrdersPage /></Suspense> },
          { path: "referrals", element: <Suspense fallback={<LoadingFallback />}><ReferralsPage /></Suspense> },
          { path: "agents", element: <Suspense fallback={<LoadingFallback />}><AgentsPage /></Suspense> },
        ],
      },
      {
        path: "/agent/:id/stats",
        element: <AuthLayout authentication>
           <Suspense fallback={<LoadingFallback />}><Agent_stats /></Suspense>
        </AuthLayout>
      },
      {
        path: "/agent/:id/generateQR",
        element: <AuthLayout authentication>
          <Suspense fallback={<LoadingFallback />}><Generate_qr /></Suspense>
        </AuthLayout>
      },
      {
        path: '/login', element: <AuthLayout authentication={false}>
          <LoginPage />
        </AuthLayout>
      },
      {
        path: '/signup', element: <AuthLayout authentication={false}>
          <Signupform />
        </AuthLayout>
      },
      { path: '/reset-password', element:<ResetPassword />},
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </QueryClientProvider>
  </React.StrictMode>,
)
