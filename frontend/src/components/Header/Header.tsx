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
import { Menu, Leaf, User, LogOut, QrCode, LayoutDashboard, Home, Info, Sprout, ShoppingBag } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/Store/Store";
import { logoutUser } from "@/api";
import { logout } from "@/Store/AuthSlice";

const Navbar: React.FC = () => {
  const Status = useAppSelector((state) => state.Auth.status);
  const usertype = useAppSelector((state) => state.Auth.user);
  const navigator = useNavigate();
  const dispatch = useAppDispatch();
 
  const logoutapp = () => {
    console.log("logout");
    logoutUser()
      .then((res) => {
        console.log(res);
        dispatch(logout());
        navigator("/login");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-green-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Menu */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="bg-gradient-to-br from-[#2d5016] to-[#3a6b1e] p-2 rounded-xl group-hover:scale-110 transition-transform shadow-sm">
                <Leaf className="h-5 w-5 text-lime-300" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-xl font-extrabold text-[#2d5016] tracking-tight">
                  GetGardening
                </span>
                <span className="text-[10px] text-green-600/70 font-medium tracking-widest uppercase">
                  Grow · Nurture · Bloom
                </span>
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              <Link to="/">
                <Button variant="ghost" className="gap-2 text-gray-700 hover:bg-green-50 hover:text-green-800 font-medium">
                  <Home className="h-4 w-4" />
                  Home
                </Button>
              </Link>
              <Link to="/products">
                <Button variant="ghost" className="gap-2 text-gray-700 hover:bg-green-50 hover:text-green-800 font-medium">
                  <Sprout className="h-4 w-4" />
                  Garden Kits
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="ghost" className="gap-2 text-gray-700 hover:bg-green-50 hover:text-green-800 font-medium">
                  <Info className="h-4 w-4" />
                  Our Story
                </Button>
              </Link>
            </div>
          </div>

          {/* Authentication & Profile */}
          <div className="flex items-center gap-3">
            {!Status ? (
              <div className="hidden md:flex gap-3">
                <Link to="/signup">
                  <Button variant="outline" className="border-green-700 text-green-800 hover:bg-green-50">
                    Sign Up
                  </Button>
                </Link>
                <Link to="/login">
                  <Button className="bg-[#2d5016] hover:bg-[#3a6b1e] text-white">
                    Login
                  </Button>
                </Link>
              </div>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full ring-2 ring-green-200 hover:ring-green-300">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=User"
                        alt="Profile"
                      />
                      <AvatarFallback className="bg-[#2d5016] text-lime-100">
                        {usertype?.username?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center gap-2 p-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-[#2d5016] text-lime-100 text-sm">
                        {usertype?.username?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{usertype?.username}</p>
                      <p className="text-xs text-gray-500">{usertype?.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  {usertype?.role?.toLowerCase() !== "agent" ? (
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard" className="flex items-center gap-2 cursor-pointer">
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem asChild>
                      <Link to={`agent/${usertype.username}/generateQR`} className="flex items-center gap-2 cursor-pointer">
                        <QrCode className="h-4 w-4" />
                        Generate QR
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logoutapp} className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Mobile Menu */}
            <div className="md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="hover:bg-green-50">
                    <Menu className="h-6 w-6" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link to="/" className="flex items-center gap-2 cursor-pointer">
                      <Home className="h-4 w-4" />
                      Home
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/products" className="flex items-center gap-2 cursor-pointer">
                      <ShoppingBag className="h-4 w-4" />
                      Products
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/about" className="flex items-center gap-2 cursor-pointer">
                      <Info className="h-4 w-4" />
                      About
                    </Link>
                  </DropdownMenuItem>
                  {!Status ? (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/signup" className="flex items-center gap-2 cursor-pointer">
                          <User className="h-4 w-4" />
                          Sign Up
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/login" className="flex items-center gap-2 cursor-pointer">
                          <User className="h-4 w-4" />
                          Login
                        </Link>
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuSeparator />
                      {usertype?.role?.toLowerCase() !== "agent" ? (
                        <DropdownMenuItem asChild>
                          <Link to="/dashboard" className="flex items-center gap-2 cursor-pointer">
                            <LayoutDashboard className="h-4 w-4" />
                            Dashboard
                          </Link>
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem asChild>
                          <Link to={`agent/${usertype.username}/generateQR`} className="flex items-center gap-2 cursor-pointer">
                            <QrCode className="h-4 w-4" />
                            Generate QR
                          </Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={logoutapp} className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer">
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
