import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { GetOrderDetails } from "@/api";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
// import { format } from "date-f";

interface OrderDetailPageProps {
    orderId: string;
    isOpen: boolean;
    onClose: () => void;
}

interface OrderDetail {
    _id: string;
    customer: {
        name: string;
        email: string;
        phone: string;
    };
    products: Array<{
        product: {
            name: string;
            price: number;
            images: string[];
        };
        priceAtPurchase: number;
        quantity: number;
    }>;
    totalAmount: number;
    paymentStatus: string;
    shippingAddress: string; 
    // {
    //     street: string;
    //     city: string;
    //     state: string;
    //     zipCode: string;
    // };
    orderDate: string;
}

function OrderDetailPage({ orderId, isOpen, onClose }: OrderDetailPageProps) {
    const [orderData, setOrderData] = useState<OrderDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const response = await GetOrderDetails(orderId);
                console.log(response.data.data);
                
                setOrderData(response.data.data);
                console.log("lets check what order",orderData);
                
            } catch (error) {
                console.error("Error fetching order details:", error);
            } finally {
                setLoading(false);
            }
        };

        if (isOpen && orderId) {
            fetchOrderDetails();
        }
    }, [orderId, isOpen]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[120vw] w-full h-[90vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle>Order Details #{orderId}</DialogTitle>
            </DialogHeader>

            {orderData && (
                <div className="grid grid-cols-2 gap-4">
                {/* Customer and Order Summary in first column */}
                <div className="space-y-4">
                    <Card>
                    <CardContent className="p-4">
                        <h3 className="text-lg font-semibold mb-2">Customer Information</h3>
                        <p>Name: {orderData.customer.name}</p>
                        <p>Email: {orderData.customer.email}</p>
                    </CardContent>
                    </Card>

                    <Card>
                    <CardContent className="p-4">
                        <h3 className="text-lg font-semibold mb-2">Order Summary</h3>
                        <div className="space-y-2">
                        <p>Status: <span className="capitalize">{orderData.paymentStatus}</span></p>
                        <p>Order Date: {orderData.orderDate}</p>
                        <p>Total Amount: ₹{orderData.totalAmount.toFixed(2)}</p>
                        </div>
                    </CardContent>
                    </Card>

                    <Card>
                    <CardContent className="p-4">
                        <h3 className="text-lg font-semibold mb-2">Shipping Address</h3>
                        <p>{orderData.shippingAddress}</p>
                    </CardContent>
                    </Card>
                </div>

                {/* Products in second column */}
                {orderData.products?(
                    <Card className="h-full">
                    <CardContent className="p-4">
                    <h3 className="text-lg font-semibold mb-2">Products</h3>
                    <div className="space-y-4">
                        {orderData.products.map((item, index) => (
                        <div key={index} className="flex items-start gap-4 border-b pb-4 last:border-b-0">
                            {item.product != null && item.product.images.length > 0 && (
                            <img
                                src={item.product.images[0]}
                                alt={item.product.name}
                                className="w-24 h-24 object-cover rounded"
                            />
                            )}
                            <div className="flex-1">
                            <p className={`font-medium ${!item.product && 'text-red-400'}`}>{item.product?item.product.name: "the product has been deleted"}</p>
                            <p className="text-sm text-gray-600 mt-1">Quantity: {item.quantity}</p>
                            <p className="text-sm font-medium mt-1">
                                Price: ₹{(item.priceAtPurchase * item.quantity).toFixed(2)}
                            </p>
                            </div>
                        </div>
                        ))}
                    </div>
                    <Separator className="my-4" />
                    <div className="flex justify-end">
                        <p className="font-semibold">
                        Total: ₹{orderData.totalAmount.toFixed(2)}
                        </p>
                    </div>
                    </CardContent>
                </Card>): (
                   <Card className="h-full">
                   <CardContent className="p-4">
                   <h3 className="text-lg font-semibold mb-2">Products</h3>
                   <div className="space-y-4">
                     the product has been deleted
                   </div>
                   <Separator className="my-4" />
                   <div className="flex justify-end">
                       <p className="font-semibold">
                       Total: ₹{orderData.totalAmount.toFixed(2)}
                       </p>
                   </div>
                   </CardContent>
               </Card>
                ) }
                
                </div>
            )}
            </DialogContent>
        </Dialog>
    );
}

export default OrderDetailPage;