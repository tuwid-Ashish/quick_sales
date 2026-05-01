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
import Generate_qr from './components/Agent/Generate_qr.js'
import Agent_stats from './components/Agent/Agent_stats.js'
import Dashboard from './components/Admin/Dashboard.tsx'
import OrdersPage from './components/Admin/pages/OrdersPage.tsx'
import ReferralsPage from './components/Admin/pages/ReferralsPage.tsx'
import PaymentStatus from './components/products/checkout_page.tsx'
import AgentsPage from './components/Admin/pages/AgentsPage.tsx'
import ShopStats from './components/products/ShopStats.tsx'
import HomePage from './components/Home/HomePage.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const ProductDetails = lazy(() => import('./components/products/product_page.js'));

const queryClient = new QueryClient();

const ProductFallback = () => (
  <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-forest">
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="h-[400px] w-[400px] rounded-full bg-sage/10 blur-[100px]" />
    </div>
    <div className="relative flex flex-col items-center gap-8">
      <img src="/images/logo.png" alt="Get Gardening" className="h-24 w-auto object-contain brightness-0 invert drop-shadow-2xl" />
      <div className="flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-gold animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="h-2 w-2 rounded-full bg-gold animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="h-2 w-2 rounded-full bg-gold animate-bounce" style={{ animationDelay: '300ms' }} />
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
        path: '/products/:id', element: <Suspense fallback={<ProductFallback />}><ProductDetails /></Suspense>
      },
      {
        path: '/payment-status', element: <PaymentStatus />
      },
      {
        path: '/shop-status', element: <ShopStats />
      },
      {
        path: "/dashboard/*",
        element: (
          <AuthLayout authentication>
            <Dashboard />
          </AuthLayout>
        ),
        children: [
          { path: "", element: <Dashboard /> },
          { path: "products", element: <ProductsPage /> },
          { path: "orders", element: <OrdersPage /> },
          { path: "referrals", element: <ReferralsPage /> },
          { path: "agents", element: <AgentsPage /> },
        ],
      },
      {
        path: "/agent/:id/stats",
        element: <AuthLayout authentication>
           <Agent_stats/>
        </AuthLayout>
      },
      {
        path: "/agent/:id/generateQR",
        element: <AuthLayout authentication>
          <Generate_qr/>
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
