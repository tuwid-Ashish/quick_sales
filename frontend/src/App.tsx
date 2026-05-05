import Header from "./components/Header/Header.tsx";
import Footer from "./components/Footer/Footer.tsx";
import { Outlet } from "react-router";
import "./App.css";
import { useEffect } from "react";
import { useLocation } from "react-router";
import { useAppDispatch } from '@/Store/Store'
import { login, logout } from "./Store/AuthSlice";
import { getCurrentUser } from "./api/index.ts";

function App() {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const isPaymentStatusPage = location.pathname === '/payment-status';

  // Fetch user data in the background - non-blocking
  useEffect(() => {
    if (isPaymentStatusPage) return;

    // Don't block rendering - fetch in background
    getCurrentUser()
      .then((res) => {
        if (res) {
          dispatch(login(res.data.data));
        } else {
          dispatch(logout());
        }
      })
      .catch((err) => {
        console.log(`error while fetching user ${err}`);
        dispatch(logout());
      });
  }, [dispatch, isPaymentStatusPage]);

  return (
    <div className="w-full bg-cream min-h-screen">
      {!isPaymentStatusPage && <Header />}
      <main className="min-h-screen">
        <Outlet />
      </main>
      {!isPaymentStatusPage && <Footer />}
    </div>
  );
}

export default App;