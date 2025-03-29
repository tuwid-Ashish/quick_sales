import { Link, useNavigate } from "react-router"; // If using React Router
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/Store/Store";
import { logoutUser } from "@/api";
import { logout } from "@/Store/AuthSlice";

const Navbar: React.FC = () => {
  // const userdata = useAppSelector((state)=>state.Auth.user)
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
    <nav className="bg-white shadow-md px-6 py-3 flex justify-between items-center">
      {/* Logo & Menu */}
      <div className="flex items-center gap-6">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          MyShop
        </Link>

        <div className="hidden md:flex gap-4">
          <Link to="/" className="text-gray-700 hover:text-blue-600">
            Home
          </Link>
          <Link to="/about" className="text-gray-700 hover:text-blue-600">
            About
          </Link>
        </div>
      </div>

      {/* Authentication & Profile */}
      <div className="flex items-center gap-4">
        {!Status ? (
          <div className="hidden md:flex gap-3">
            <Link to="/signup">
              <Button variant="outline">Sign Up</Button>
            </Link>
            <Link to="/login">
              <Button>Login</Button>
            </Link>
          </div>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer">
                <AvatarImage
                  src="https://via.placeholder.com/40"
                  alt="Profile"
                />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
            {usertype?.role?.toLowerCase() !== "agent" ? (
                    <DropdownMenuItem>
                      <Link to="/dashboard">Dashboard</Link>
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem>
                      <Link to={`agent/${usertype.username}/generateQR`}>Generator QR</Link>
                    </DropdownMenuItem>
                  )}
              <DropdownMenuItem onClick={logoutapp} className="text-red-600">
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Mobile Menu */}
        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">
                <Menu />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Link to="/">Home</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to="/about">About</Link>
              </DropdownMenuItem>
              {!Status ? (
                <>
                  <DropdownMenuItem>
                    <Link to="/signup">Sign Up</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="/login">Login</Link>
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  {usertype?.role?.toLowerCase() !== "agent" ? (
                    <DropdownMenuItem>
                      <Link to="/dashboard">Dashboard</Link>
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem>
                      <Link to={`agent/${usertype.username}/generateQR`}>Generator QR</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    onClick={logoutapp}
                    className="text-red-600"
                  >
                    Logout
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
