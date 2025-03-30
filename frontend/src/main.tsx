import { createRoot } from 'react-dom/client'
import React from 'react'
import App from './App.jsx'
import { RouterProvider, createBrowserRouter } from 'react-router'
import './index.css'
import { Provider } from 'react-redux'
import { store } from './Store/Store.js'
import Signupform from './components/Auth/signup_page.tsx'
// import VerifyEmail from './components/Auth/VerifyEmail.jsx'
import LoginPage from './components/Auth/login_component.tsx'
import ResetPassword from './components/Auth/Resetpasword.tsx'
import AuthLayout from './components/AuthLayout.tsx'
import ProductsPage from './components/products/list_products.js'
import AboutPage from './components/Gernal_routes/AboutPage.js'
import ProductDetails from './components/products/product_page.js'
import Generate_qr from './components/Agent/Generate_qr.js'
import Agent_stats from './components/Agent/Agent_stats.js'
import Dashboard from './components/Admin/Dashboard.tsx'
import OrdersPage from './components/Admin/pages/OrdersPage.tsx'
import ReferralsPage from './components/Admin/pages/ReferralsPage.tsx'
import PaymentStatus from './components/products/checkout_page.tsx'
import AgentsPage from './components/Admin/pages/AgentsPage.tsx'


const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/', element: <ProductsPage />
      },
      {
        path: '/products/:id', element: <ProductDetails />
      },
      {
        path: '/about', element: <AboutPage />
      },
      {
        path: '/payment-status', element: <PaymentStatus />
      },
      {
        path: "/dashboard/*",
        element: (
          <AuthLayout authentication>
            <Dashboard />
          </AuthLayout>
        ),
        children: [
          { path: "", element: <Dashboard /> }, // Default dashboard page
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
      // { path: '/verifyEmail', element:<VerifyEmail /> },

    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider> 
  </React.StrictMode>,
)
