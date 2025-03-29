import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import axios from "axios";
import OrderDetailPage from "./OrderDetailPage";
import { ShipOrder } from "@/api";
import InvoiceGenerator from "./InvoiceGenerator";

interface Order {
    _id: string;
    customer: { name: string };
    shippingAddress: string;
    orderDate: string;
    totalAmount: number;
    paymentStatus: "pending" | "completed" | "failed";
    shipped:boolean;
}

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [paymentStatus, setPaymentStatus] = useState("");
    const [orderDate, setOrderDate] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    // State for dialog
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogname, setdialogname] = useState(false);



    const handleShipping = (id: string) => {
        ShipOrder(id)
            .then(() => {
                // Update the specific order's shipped status in the orders array
                setOrders(orders.map(order => 
                    order._id === id 
                        ? { ...order, shipped: true }
                        : order
                ));
            })
            .catch((error) => {
                // Handle error case
                console.error("Failed to ship order:", error);
                // Optionally show an error message to the user
                setError("Failed to update shipping status");
            });
    };

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_SERVER_URI}admin/get-orders`, {
                params: { page: currentPage, limit: 5, customerName: searchQuery, paymentStatus, orderDate },
                withCredentials:true
            });

            setOrders(data.data.orders);
            setTotalPages(data.data.pagination.totalPages);
        } catch (err) {
            setError("Failed to fetch orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [currentPage, searchQuery, paymentStatus, orderDate]);

    const handleViewDetails = (orderId: string) => {
        setSelectedOrderId(orderId);
        setdialogname(false);
        setIsDialogOpen(true);
      };
    
      const closeDialog = () => {
        setIsDialogOpen(false);
        setSelectedOrderId(null);
        setdialogname(false);
      };
    const handleInvoiceDetails = (orderId: string) => {
        setSelectedOrderId(orderId);
        setdialogname(true);
        setIsDialogOpen(true);
      };
    
    return (
        <div className="max-w-7xl mx-auto p-6 space-y-8">
            {/* Header Section */}
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Order List</h1>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <Input
                    placeholder="Search by customer name..."
                    className="w-full sm:w-96"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <select value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)} className="p-2 border rounded">
                    <option value="">All Status</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                </select>
                <Input
                    type="date"
                    value={orderDate}
                    onChange={(e) => setOrderDate(e.target.value)}
                    className="w-full sm:w-40"
                />
                <Button variant="outline" onClick={fetchOrders}>
                    Filter
                </Button>
            </div>

            {/* Order Table */}
            <Card className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50">
                            <TableHead className="font-semibold">Order ID</TableHead>
                            <TableHead className="font-semibold">Customer</TableHead>
                            <TableHead className="font-semibold">Date</TableHead>
                            <TableHead className="font-semibold">Amount</TableHead>
                            <TableHead className="font-semibold">Status</TableHead>
                            <TableHead className="font-semibold">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center">Loading...</TableCell>
                            </TableRow>
                        ) : error ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center text-red-500">{error}</TableCell>
                            </TableRow>
                        ) : (
                            orders.map((order) => (
                                <TableRow key={order._id} className="hover:bg-gray-50">
                                    <TableCell>{order._id}</TableCell>
                                    {/* <TableCell>{order.customer.name}</TableCell> */}
                                    <TableCell>
                                    <div className="flex items-center gap-3">
                                        <div>
                                            <p className="font-medium">{order.customer.name}</p>
                                            <p className="text-sm text-gray-500">{order.shippingAddress}</p>
                                        </div>
                                    </div>
                                </TableCell>
                                    <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                                        <Badge variant={order.paymentStatus === "completed" ? "success" : order.paymentStatus === "pending" ? "secondary" : "destructive"}>
                                            {order.paymentStatus}
                                        </Badge>
                                            {/* {order.paymentStatus}
                                        </Badge> */}
                                    {/* </TableCell> */}
                                    <TableCell>
                                    <div className="flex gap-2">
                                         <Button 
                                             size="sm" 
                                             variant={!order.shipped ? "secondary" : "default"}
                                             className="min-w-[80px]"
                                             onClick={() => handleShipping(order._id)}
                                         >
                                             {order.shipped ? "Shipped" : "Ship"}
                                         </Button>
                                        <Button
                                        size="sm"
                                        variant="outline"
                                        className="min-w-[100px]"
                                        onClick={() => handleInvoiceDetails(order._id)}
                                    >
                                        generate invoice
                                    </Button>
                                        <Button
                                        size="sm"
                                        variant="outline"
                                        className="min-w-[100px]"
                                        onClick={() => handleViewDetails(order._id)}
                                    >
                                        View Details
                                    </Button>
                                     </div>
                                 </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </Card>

            {/* Pagination */}
            <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">
                    Page {currentPage} of {totalPages}
                </p>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
                        Previous
                    </Button>
                    <Button variant="outline" onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
                        Next
                    </Button>
                </div>
            </div>

             {/* Order Detail Dialog */}
      {(selectedOrderId && dialogname==false) && (
        <OrderDetailPage
          orderId={selectedOrderId}
          isOpen={isDialogOpen}
          onClose={closeDialog}
        />
      )}
             {/* Order Detail Dialog */}
      {(selectedOrderId  && dialogname==true) && (
        <InvoiceGenerator
          orderId={selectedOrderId}
          isOpen={isDialogOpen}
          onClose={closeDialog}
        />
      )}
        </div>
    );
}
