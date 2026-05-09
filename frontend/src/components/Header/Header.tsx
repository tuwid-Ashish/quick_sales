import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, LogOut, QrCode, LayoutDashboard, ShoppingBag } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/Store/Store";
import { logoutUser } from "@/api";
import { logout } from "@/Store/AuthSlice";
import { useEffect, useRef, useState } from "react";

const Navbar: React.FC = () => {
  // const Status = useAppSelector((state) => state.Auth.status);
  const usertype = useAppSelector((state) => state.Auth.user);
  const navigator = useNavigate();
  const dispatch = useAppDispatch();
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollYRef = useRef(0);

  // DISABLED: Auth check - always show Buy Now button for now
  // const authDisabled = true; // Set to false to re-enable auth check

  useEffect(() => {
    lastScrollYRef.current = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY <= 20) {
        setIsVisible(true);
        lastScrollYRef.current = currentScrollY;
        return;
      }

      const movingDown = currentScrollY > lastScrollYRef.current;
      const delta = Math.abs(currentScrollY - lastScrollYRef.current);

      // Ignore tiny scroll jitter to keep the nav from flickering.
      if (delta < 6) {
        return;
      }

      if (movingDown) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      lastScrollYRef.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const logoutapp = () => {
    logoutUser()
      .then(() => {
        dispatch(logout());
        navigator("/login");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 border-b border-white/70 bg-white/30 shadow-[0_12px_30px_rgba(45,64,38,0.10)] backdrop-blur-xl transition-all duration-400 ${
        isVisible ? "translate-y-0" : "-translate-y-full pointer-events-none"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-18 items-center justify-between sm:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src="/images/logo.png"
              alt="Get Gardening"
              className="h-14 w-auto object-contain transition-transform duration-300 drop-shadow-[0_2px_8px_rgba(0,0,0,0.22)] sm:h-16"
            />
          </Link>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* DISABLED: Auth check - always show Buy Now button */}
            {true ? ( // Changed from !Status to true to disable auth check
              <>
                {/* Buy Now CTA */}
                <Link to="/products">
                  <Button
                    className="relative rounded-full border border-amber-300/50 bg-sun px-4 py-2.5 text-sm font-extrabold text-soil hover:bg-sun-light transition-all duration-300 animate-bounce-in shadow-md hover:shadow-lg sm:px-6"
                  >
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Buy Now — ₹749
                  </Button>
                </Link>
              </>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full ring-4 ring-sun/50 ring-offset-2 ring-offset-cream hover:ring-sun transition-all duration-300">
                    <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${usertype?.username || "User"}`}
                        alt="Profile"
                      />
                      <AvatarFallback className="bg-leaf text-sm font-bold text-white">
                        {usertype?.username?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-2xl border-cream-dark bg-white shadow-xl p-2">
                  <div className="flex items-center gap-3 p-3 bg-cream rounded-xl mb-2">
                    <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                      <AvatarFallback className="bg-leaf text-sm font-bold text-white">
                        {usertype?.username?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex min-w-0 flex-col">
                      <p className="truncate text-sm font-bold text-soil font-display">{usertype?.username}</p>
                      <p className="truncate text-xs text-soil/70">{usertype?.email}</p>
                    </div>
                  </div>
                  {usertype?.role?.toLowerCase() !== "agent" ? (
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard" className="flex cursor-pointer items-center gap-2 rounded-xl py-2 hover:bg-cream-dark transition-colors font-bold text-soil">
                        <LayoutDashboard className="h-4 w-4 text-leaf" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem asChild>
                      <Link to={`agent/${usertype?.username}/generateQR`} className="flex cursor-pointer items-center gap-2 rounded-xl py-2 hover:bg-cream-dark transition-colors font-bold text-soil">
                        <QrCode className="h-4 w-4 text-leaf" />
                        Generate QR
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator className="my-2 bg-cream-dark" />
                  <DropdownMenuItem onClick={logoutapp} className="cursor-pointer rounded-xl py-2 text-red-600 focus:bg-red-50 focus:text-red-700 font-bold">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Mobile menu for logged-in users only - DISABLED */}
            {false && ( // Changed from Status to false to disable auth check
              <div className="md:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-cream-dark transition-colors">
                      <Menu className="h-6 w-6 text-soil drop-shadow-sm" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 rounded-2xl bg-white shadow-xl p-2 border-cream-dark">
                    {usertype?.role?.toLowerCase() !== "agent" ? (
                      <DropdownMenuItem asChild>
                        <Link to="/dashboard" className="flex cursor-pointer items-center gap-2 rounded-xl py-2 font-bold text-soil hover:bg-cream-dark transition-colors">
                          <LayoutDashboard className="h-4 w-4 text-leaf" />
                          Dashboard
                        </Link>
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem asChild>
                        <Link to={`agent/${usertype?.username}/generateQR`} className="flex cursor-pointer items-center gap-2 rounded-xl py-2 font-bold text-soil hover:bg-cream-dark transition-colors">
                          <QrCode className="h-4 w-4 text-leaf" />
                          Generate QR
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator className="my-2 bg-cream-dark" />
                    <DropdownMenuItem onClick={logoutapp} className="cursor-pointer text-red-600 focus:bg-red-50 rounded-xl py-2 font-bold focus:text-red-700">
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
