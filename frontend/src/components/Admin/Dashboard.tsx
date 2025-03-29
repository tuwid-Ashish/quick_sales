import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Link, Routes, Route, useLocation, useNavigate } from "react-router"

// Import your page components
import ProductsPage from "@/components/Admin/pages/ProductPage"
import OrdersPage from "@/components/Admin/pages/OrdersPage"
import ReferralsPage from "@/components/Admin/pages/ReferralsPage"
import ProductDetailPage from "../products/product_page"
import { Boxes, ReceiptIndianRupee, ShoppingCart } from "lucide-react"
import { useAppSelector } from "@/Store/Store"
import { useEffect } from "react"
import AgentsPage from "./pages/AgentsPage"

export default function DashboardPage() {
  const location = useLocation(); // Get current route
  const navigate = useNavigate()
  const usertype = useAppSelector((state)=> state.Auth.user?.role)
  const pathSegments = location.pathname.split("/").filter(Boolean);
  console.log("the page segment", pathSegments,location.pathname);
  useEffect(()=>{
    console.log(usertype);
    if(usertype !== "admin"){
      
      navigate("/")
    }
  },[usertype])
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Header */}
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          
          {/* Dynamic Breadcrumb */}
          <Breadcrumb>
            <BreadcrumbList> 
              {pathSegments.map((segment, index) => (
                <>
                <BreadcrumbItem key={index}>
                  {index === pathSegments.length - 1 ? (
                    <BreadcrumbPage>{segment}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={`/${segment}`}>{segment}</BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                </>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        {/* Cards Section */
        (location.pathname.toLowerCase() === "/dashboard") &&
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            {[
              { title:<>Products <ReceiptIndianRupee className="inline" /></>, bg: "https://img.freepik.com/free-vector/futuristic-shopping-online-landing-page-cart_52683-38515.jpg?t=st=1742740560~exp=1742744160~hmac=60e6cf005aa368263f51fdab7495023cb23c362867178b998a227b5e6761c64d&w=1380", to: "products" },
              { title: <>Orders  <ShoppingCart className="inline" /></>, bg: "https://img.freepik.com/free-vector/3d-black-podium-background-product-sale-banner_107791-32152.jpg?t=st=1742740744~exp=1742744344~hmac=b83998f3d7ba7799144482e6de6835af5b7c85483c17120b19f417b9e23c3b33&w=1380", to: "orders" },
              { title: <>Referrals <Boxes className="inline" /></>, bg: "https://img.freepik.com/free-vector/black-podium-gift-boxes-sale-banner_107791-32862.jpg?t=st=1742740775~exp=1742744375~hmac=252ddd894a0da524fe97db8c60059850c3b3269e7a4f700ce5b4d4ee8e2f628a&w=1800", to: "referrals" },
              { title: <>agents <Boxes className="inline" /></>, bg: "https://img.freepik.com/free-vector/black-podium-gift-boxes-sale-banner_107791-32862.jpg?t=st=1742740775~exp=1742744375~hmac=252ddd894a0da524fe97db8c60059850c3b3269e7a4f700ce5b4d4ee8e2f628a&w=1800", to: "agents" },
            ].map((card, index) => (
              <Link key={index} to={card.to} className="hover:no-underline">
                <div
                  className="relative aspect-video overflow-hidden rounded-xl bg-cover bg-center shadow-md transition-transform duration-300 hover:scale-105"
                  style={{ backgroundImage: `url(${card.bg})` }}
                  >
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md opacity-0 transition-opacity duration-300 hover:opacity-100">
                    <h3 className="text-white text-lg font-semibold">{card.title}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
          }

        {/* Page Content - Render Component Based on Route */}
        <div className="p-4">
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
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
