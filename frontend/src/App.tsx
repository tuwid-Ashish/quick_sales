import Header from "./components/Header/Header.tsx";
import Footer from "./components/Footer/Footer.tsx";
import { Outlet } from "react-router";
import "./App.css";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from '@/Store/Store'
import { login, logout } from "./Store/AuthSlice";
import { getCurrentUser } from "./api/index.ts";

function App() {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const userdata = useAppSelector((state) => state.Auth.user);
  console.log("Authstatus in app", userdata);

  useEffect(() => {
    getCurrentUser()
      .then((res) => {
        console.log(res);
        if (res) {
          dispatch(login(res.data.data));
        } else {
          dispatch(logout());
        }
      })
      .catch((err) => {
        console.log(`error while fetching user ${err}`);
      })
      .finally(() => setLoading(false));
  }, [dispatch]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-sky overflow-hidden">
        {/* Playful background elements */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/20 rounded-full blur-2xl animate-float" />
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-sun/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />

        <div className="relative flex flex-col items-center gap-8 z-10">
          {/* Logo */}
          <div className="bg-white p-6 rounded-[2rem] shadow-xl transform rotate-[-2deg] animate-bounce-in border-4 border-white/50">
            <img
              src="/images/logo.png"
              alt="Get Gardening"
              className="h-24 max-w-[280px] w-auto object-contain sm:h-28"
            />
          </div>

          {/* Animated loader */}
          <div className="flex items-center gap-3 bg-white/50 backdrop-blur-md px-6 py-3 rounded-full shadow-sm">
            <div className="h-3 w-3 rounded-full bg-leaf animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="h-3 w-3 rounded-full bg-sun animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="h-3 w-3 rounded-full bg-leaf-light animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>

          <p className="text-lg font-bold tracking-wide text-soil font-display bg-white/50 backdrop-blur-md px-6 py-2 rounded-full shadow-sm">
            Growing something special...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-cream">
      <Header />
      <main className="min-h-screen">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default App;