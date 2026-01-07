import { Link, Routes, Route, useLocation, useNavigate } from "react-router"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

// Import your page components
import ProductsPage from "@/components/Admin/pages/ProductPage"
import OrdersPage from "@/components/Admin/pages/OrdersPage"
import ReferralsPage from "@/components/Admin/pages/ReferralsPage"
import ProductDetailPage from "../products/product_page"
import { 
  Package, 
  ShoppingCart, 
  Users, 
  TrendingUp, 
  LayoutDashboard,
  ArrowLeft
} from "lucide-react"
import { useAppSelector } from "@/Store/Store"
import { useEffect } from "react"
import AgentsPage from "./pages/AgentsPage"

export default function DashboardPage() {
  const location = useLocation();
  const navigate = useNavigate()
  const usertype = useAppSelector((state)=> state.Auth.user?.role)
  const isMainDashboard = location.pathname.toLowerCase() === "/dashboard"
  
  useEffect(()=>{
    console.log(usertype);
    if(usertype !== "admin"){
      navigate("/")
    }
  },[usertype])

  const dashboardCards = [
    { 
      title: "Products", 
      icon: Package,
      description: "Manage your product inventory",
      gradient: "from-blue-500 to-indigo-600",
      to: "products",
      stats: "Total Items"
    },
    { 
      title: "Orders", 
      icon: ShoppingCart,
      description: "View and manage orders",
      gradient: "from-purple-500 to-pink-600",
      to: "orders",
      stats: "Active Orders"
    },
    { 
      title: "Referrals", 
      icon: TrendingUp,
      description: "Track referral performance",
      gradient: "from-green-500 to-emerald-600",
      to: "referrals",
      stats: "Total Referrals"
    },
    { 
      title: "Agents", 
      icon: Users,
      description: "Manage agent accounts",
      gradient: "from-orange-500 to-red-600",
      to: "agents",
      stats: "Active Agents"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              {!isMainDashboard && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate('/dashboard')}
                  className="hover:bg-blue-50"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              )}
              <LayoutDashboard className="h-6 w-6 text-blue-600" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
            </div>
            
            {!isMainDashboard && (
              <div className="flex items-center gap-2">
                <Link to="/dashboard/products">
                  <Button variant="ghost" size="sm" className="hover:bg-blue-50">
                    Products
                  </Button>
                </Link>
                <Link to="/dashboard/orders">
                  <Button variant="ghost" size="sm" className="hover:bg-blue-50">
                    Orders
                  </Button>
                </Link>
                <Link to="/dashboard/referrals">
                  <Button variant="ghost" size="sm" className="hover:bg-blue-50">
                    Referrals
                  </Button>
                </Link>
                <Link to="/dashboard/agents">
                  <Button variant="ghost" size="sm" className="hover:bg-blue-50">
                    Agents
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isMainDashboard ? (
          <>
            {/* Welcome Section */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back!</h2>
              <p className="text-gray-600">Here's what's happening with your store today.</p>
            </div>

            {/* Dashboard Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {dashboardCards.map((card, index) => {
                const Icon = card.icon;
                return (
                  <Link key={index} to={card.to}>
                    <Card className="group hover:shadow-2xl transition-all duration-300 border-0 overflow-hidden cursor-pointer transform hover:-translate-y-2">
                      <div className={`h-2 bg-gradient-to-r ${card.gradient}`} />
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className={`p-3 rounded-xl bg-gradient-to-r ${card.gradient} group-hover:scale-110 transition-transform`}>
                            <Icon className="h-6 w-6 text-white" />
                          </div>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                          {card.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">{card.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">{card.stats}</span>
                          <div className={`h-1 w-12 rounded-full bg-gradient-to-r ${card.gradient} opacity-50 group-hover:opacity-100 transition-opacity`} />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>

            {/* Quick Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-0 shadow-lg bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                      <p className="text-3xl font-bold text-gray-900">₹0</p>
                    </div>
                    <div className="p-4 rounded-full bg-green-100">
                      <TrendingUp className="h-8 w-8 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-lg bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Pending Orders</p>
                      <p className="text-3xl font-bold text-gray-900">0</p>
                    </div>
                    <div className="p-4 rounded-full bg-orange-100">
                      <ShoppingCart className="h-8 w-8 text-orange-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-lg bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Active Agents</p>
                      <p className="text-3xl font-bold text-gray-900">0</p>
                    </div>
                    <div className="p-4 rounded-full bg-blue-100">
                      <Users className="h-8 w-8 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        ) : (
          /* Page Content - Render Component Based on Route */
          <Routes>
            <Route path="products">
              <Route index element={<ProductsPage />} />
              <Route path=":id" element={<ProductDetailPage />} />
            </Route>
            <Route path="orders">
              <Route index element={<OrdersPage />} />
              <Route path=":id" element={<OrdersPage />} />
              <Route path="new" element={<OrdersPage />} />
            </Route>
            <Route path="referrals">
              <Route index element={<ReferralsPage />} />
              <Route path="stats" element={<ReferralsPage />} />
              <Route path=":code" element={<ReferralsPage />} />
            </Route>
            <Route path="agents" element={<AgentsPage />}/>
          </Routes>
        )}
      </div>
    </div>
  )
}
