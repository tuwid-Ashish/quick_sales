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
import { Menu, LogOut, QrCode, LayoutDashboard, Home, HelpCircle, Sprout, ShoppingBag, ShieldCheck, Package } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/Store/Store";
import { logoutUser } from "@/api";
import { logout } from "@/Store/AuthSlice";

const Navbar: React.FC = () => {
  const Status = useAppSelector((state) => state.Auth.status);
  const usertype = useAppSelector((state) => state.Auth.user);
  const navigator = useNavigate();
  const dispatch = useAppDispatch();

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
    <nav className="sticky top-0 z-50 border-b border-[#e7dfca] bg-white/95 font-nunito shadow-sm backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-md bg-[#1f5b2b] shadow-sm">
                <Sprout className="h-6 w-6 text-white" />
              </div>
              <div className="leading-none">
                <span className="block text-2xl font-extrabold tracking-normal text-[#17381f]">Get Gardening</span>
                <span className="mt-1 block text-[10px] font-bold uppercase tracking-widest text-[#60705f]">
                  Kids starter kit
                </span>
              </div>
            </Link>

            <div className="hidden items-center gap-1 md:flex">
              <Link to="/">
                <Button variant="ghost" className="gap-2 rounded-md font-bold text-[#425442] hover:bg-[#eef7eb] hover:text-[#1f5b2b]">
                  <Home className="h-4 w-4" />
                  Home
                </Button>
              </Link>
              <Link to="/#inside-kit">
                <Button variant="ghost" className="gap-2 rounded-md font-bold text-[#425442] hover:bg-[#eef7eb] hover:text-[#1f5b2b]">
                  <Package className="h-4 w-4" />
                  What's Inside
                </Button>
              </Link>
              <Link to="/#faq">
                <Button variant="ghost" className="gap-2 rounded-md font-bold text-[#425442] hover:bg-[#eef7eb] hover:text-[#1f5b2b]">
                  <HelpCircle className="h-4 w-4" />
                  FAQ
                </Button>
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-md bg-[#fffaf0] px-3 py-2 text-xs font-bold text-[#425442] lg:flex">
              <ShieldCheck className="h-4 w-4 text-[#2d6a3a]" />
              Secure checkout
            </div>
            {!Status ? (
              <div className="hidden gap-3 md:flex">
                <Link to="/products">
                  <Button className="rounded-md bg-[#1f5b2b] px-5 font-extrabold text-white hover:bg-[#174621]">
                    Buy Kit
                  </Button>
                </Link>
              </div>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-11 w-11 rounded-full ring-2 ring-[#b8d9b7] ring-offset-2">
                    <Avatar className="h-11 w-11">
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${usertype?.username || "User"}`}
                        alt="Profile"
                      />
                      <AvatarFallback className="bg-[#1f5b2b] font-bold text-white">
                        {usertype?.username?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-lg shadow-lg">
                  <div className="flex items-center gap-3 p-2">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-[#1f5b2b] text-sm font-bold text-white">
                        {usertype?.username?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex min-w-0 flex-col space-y-1">
                      <p className="truncate text-sm font-bold text-[#17381f]">{usertype?.username}</p>
                      <p className="truncate text-xs text-[#60705f]">{usertype?.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  {usertype?.role?.toLowerCase() !== "agent" ? (
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard" className="flex cursor-pointer items-center gap-2 rounded-md">
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem asChild>
                      <Link to={`agent/${usertype.username}/generateQR`} className="flex cursor-pointer items-center gap-2 rounded-md">
                        <QrCode className="h-4 w-4" />
                        Generate QR
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logoutapp} className="cursor-pointer rounded-md text-red-600 focus:bg-red-50 focus:text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <div className="md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-md hover:bg-[#eef7eb]">
                    <Menu className="h-6 w-6 text-[#17381f]" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-lg shadow-lg">
                  <DropdownMenuItem asChild>
                    <Link to="/" className="flex cursor-pointer items-center gap-2 rounded-md">
                      <Home className="h-4 w-4" />
                      Home
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/#inside-kit" className="flex cursor-pointer items-center gap-2 rounded-md">
                      <Package className="h-4 w-4" />
                      What's Inside
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/#faq" className="flex cursor-pointer items-center gap-2 rounded-md">
                      <HelpCircle className="h-4 w-4" />
                      FAQ
                    </Link>
                  </DropdownMenuItem>
                  {!Status ? (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/products" className="flex cursor-pointer items-center gap-2 rounded-md">
                          <ShoppingBag className="h-4 w-4" />
                          Buy Kit
                        </Link>
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuSeparator />
                      {usertype?.role?.toLowerCase() !== "agent" ? (
                        <DropdownMenuItem asChild>
                          <Link to="/dashboard" className="flex cursor-pointer items-center gap-2 rounded-md">
                            <LayoutDashboard className="h-4 w-4" />
                            Dashboard
                          </Link>
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem asChild>
                          <Link to={`agent/${usertype.username}/generateQR`} className="flex cursor-pointer items-center gap-2 rounded-md">
                            <QrCode className="h-4 w-4" />
                            Generate QR
                          </Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={logoutapp} className="cursor-pointer rounded-md text-red-600 focus:bg-red-50 focus:text-red-600">
                        <LogOut className="mr-2 h-4 w-4" />
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
