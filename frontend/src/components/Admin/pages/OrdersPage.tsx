import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ShoppingCart, Search, Filter, FileText, Package, Eye } from "lucide-react";
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
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogname, setdialogname] = useState(false);



    const handleShipping = (id: string) => {
        ShipOrder(id)
            .then(() => {
                setOrders(orders.map(order => 
                    order._id === id 
                        ? { ...order, shipped: true }
                        : order
                ));
            })
            .catch((error) => {
                console.error("Failed to ship order:", error);
                setError("Failed to update shipping status");
            });
    };

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_SERVER_URI}/admin/get-orders`, {
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
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-600">
                        <ShoppingCart className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
                        <p className="text-sm text-gray-600">View and manage customer orders</p>
                    </div>
                </div>
            </div>

            {/* Filters & Search */}
            <Card className="p-6 border-0 shadow-lg">
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search by customer name..."
                            className="pl-10 h-11"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    
                    <select 
                        value={paymentStatus} 
                        onChange={(e) => setPaymentStatus(e.target.value)} 
                        className="px-4 py-2 border rounded-lg h-11 bg-white hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">All Payment Status</option>
                        <option value="completed">Completed</option>
                        <option value="pending">Pending</option>
                        <option value="failed">Failed</option>
                    </select>
                    
                    <Input
                        type="date"
                        value={orderDate}
                        onChange={(e) => setOrderDate(e.target.value)}
                        className="w-full lg:w-48 h-11"
                    />
                    
                    <Button 
                        onClick={fetchOrders}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 h-11 gap-2"
                    >
                        <Filter className="h-4 w-4" />
                        Apply Filters
                    </Button>
                </div>
            </Card>

            {/* Order Table */}
            <Card className="border-0 shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-100">
                                <TableHead className="font-bold text-gray-900">Order ID</TableHead>
                                <TableHead className="font-bold text-gray-900">Customer</TableHead>
                                <TableHead className="font-bold text-gray-900">Date</TableHead>
                                <TableHead className="font-bold text-gray-900">Amount</TableHead>
                                <TableHead className="font-bold text-gray-900">Payment</TableHead>
                                <TableHead className="font-bold text-gray-900">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-12">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                            <p className="text-gray-500">Loading orders...</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : error ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center text-red-500 py-8">{error}</TableCell>
                                </TableRow>
                            ) : orders.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-12">
                                        <div className="flex flex-col items-center gap-2">
                                            <ShoppingCart className="h-12 w-12 text-gray-300" />
                                            <p className="text-gray-500">No orders found</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                orders.map((order) => (
                                    <TableRow key={order._id} className="hover:bg-blue-50 transition-colors">
                                        <TableCell className="font-mono text-xs">
                                            {order._id.slice(0, 8)}...
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <p className="font-semibold text-gray-900">{order.customer.name}</p>
                                                <p className="text-xs text-gray-500 line-clamp-1">{order.shippingAddress}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {new Date(order.orderDate).toLocaleDateString('en-IN', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        </TableCell>
                                        <TableCell className="font-bold text-gray-900">
                                            ₹{order.totalAmount}
                                        </TableCell>
                                        <TableCell>
                                            <Badge 
                                                className={
                                                    order.paymentStatus === "completed" 
                                                        ? "bg-green-100 text-green-800 hover:bg-green-200" 
                                                        : order.paymentStatus === "pending" 
                                                        ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200" 
                                                        : "bg-red-100 text-red-800 hover:bg-red-200"
                                                }
                                            >
                                                {order.paymentStatus}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-2 flex-wrap">
                                                <Button 
                                                    size="sm" 
                                                    variant={order.shipped ? "default" : "secondary"}
                                                    className={`gap-1 ${order.shipped ? 'bg-green-600 hover:bg-green-700' : ''}`}
                                                    onClick={() => handleShipping(order._id)}
                                                    disabled={order.shipped}
                                                >
                                                    <Package className="h-3 w-3" />
                                                    {order.shipped ? "Shipped" : "Ship"}
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="gap-1 hover:bg-blue-50"
                                                    onClick={() => handleInvoiceDetails(order._id)}
                                                >
                                                    <FileText className="h-3 w-3" />
                                                    Invoice
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="gap-1 hover:bg-indigo-50"
                                                    onClick={() => handleViewDetails(order._id)}
                                                >
                                                    <Eye className="h-3 w-3" />
                                                    Details
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </Card>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border">
                    <p className="text-sm text-gray-600">
                        Page <span className="font-semibold text-gray-900">{currentPage}</span> of <span className="font-semibold text-gray-900">{totalPages}</span>
                    </p>
                    <div className="flex gap-2">
                        <Button 
                            variant="outline" 
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} 
                            disabled={currentPage === 1}
                            className="hover:bg-blue-50"
                        >
                            Previous
                        </Button>
                        <Button 
                            variant="outline" 
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} 
                            disabled={currentPage === totalPages}
                            className="hover:bg-blue-50"
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}

            {/* Dialogs */}
            {(selectedOrderId && !dialogname) && (
                <OrderDetailPage
                    orderId={selectedOrderId}
                    isOpen={isDialogOpen}
                    onClose={closeDialog}
                />
            )}
            {(selectedOrderId && dialogname) && (
                <InvoiceGenerator
                    orderId={selectedOrderId}
                    isOpen={isDialogOpen}
                    onClose={closeDialog}
                />
            )}
        </div>
    );
}
