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
import { useEffect, useState } from "react";

const Navbar: React.FC = () => {
  const Status = useAppSelector((state) => state.Auth.status);
  const usertype = useAppSelector((state) => state.Auth.user);
  const navigator = useNavigate();
  const dispatch = useAppDispatch();
  const [scrolled, setScrolled] = useState(false);

  // DISABLED: Auth check - always show Buy Now button for now
  // const authDisabled = true; // Set to false to re-enable auth check

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
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
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/95 shadow-lg shadow-black/5 backdrop-blur-xl border-b border-cream-dark"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src="/images/logo.png"
              alt="Get Gardening"
              className={`h-16 w-auto object-contain transition-all duration-300 sm:h-20 drop-shadow-sm ${
                scrolled ? "scale-90" : "scale-100"
              }`}
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
                    className="relative rounded-full bg-sun px-6 py-2.5 text-sm font-extrabold text-soil hover:bg-sun-light transition-all duration-300 animate-bounce-in shadow-md hover:shadow-lg"
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
                      <Menu className={`h-6 w-6 ${scrolled ? "text-soil" : "text-soil drop-shadow-sm"}`} />
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
