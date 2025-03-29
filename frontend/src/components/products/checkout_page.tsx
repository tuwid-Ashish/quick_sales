import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { GetOrderDetails } from '@/api';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, XCircle, Clock, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router';

const PaymentStatus = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [status, setStatus] = useState('');
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const paymentStatus = queryParams.get('status');
        const orderId = queryParams.get('order_id');

        if (!(paymentStatus && orderId)) {
            alert("This page is not reachable");
            navigate('/');
            return;
        }
        
        setStatus(paymentStatus);

        const fetchOrderDetails = async () => {
            try {
                const response = await GetOrderDetails(orderId);
                console.log(response.data);
                
                setOrder(response.data.data);
            } catch (error) {
                console.error('Error fetching order details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [location.search]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin">
                    <Clock className="h-8 w-8" />
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <Alert className={`mb-6 ${status === 'success' ? 'bg-green-50' : 'bg-red-50'}`}>
                <div className="flex items-center gap-2">
                    {status === 'success' ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                    )}
                    <AlertTitle className={status === 'success' ? 'text-green-800' : 'text-red-800'}>
                        Payment {status === 'success' ? 'Successful' : 'Failed'}
                    </AlertTitle>
                </div>
                <AlertDescription className="mt-2">
                    {status === 'success' 
                        ? "Your payment has been processed successfully. We'll start processing your order soon."
                        : "We couldn't process your payment. Please try again or contact support if the issue persists."}
                </AlertDescription>
            </Alert>

            {order && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex justify-between items-center">
                            Order Details
                            <Badge variant={status === 'success' ? "success" : "destructive"}>
                                {order.paymentStatus}
                            </Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Order ID</p>
                                    <p className="font-medium">{order._id}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Order Date</p>
                                    <p className="font-medium">
                                        {new Date(order.orderDate).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            <Separator />

                            <div>
                                <h3 className="font-semibold mb-2">Customer Details</h3>
                                <div className="space-y-1">
                                    <p className="text-sm">Name: {order.customer.name}</p>
                                    <p className="text-sm">Phone: {order.customer.phoneNumber}</p>
                                    {order.customer.email && (
                                        <p className="text-sm">Email: {order.customer.email}</p>
                                    )}
                                    <p className="text-sm">adress: {order.shippingAddress}</p>
                                </div>
                            </div>

                            <Separator />

                            <div>
                                <h3 className="font-semibold mb-2">Order Summary</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span>Total Amount:</span>
                                        <span className="font-bold">₹{order.totalAmount}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span>Shipping Status:</span>
                                        <Badge variant={order.shipped ? "success" : "secondary"}>
                                            <Package className="w-4 h-4 mr-1" />
                                            {order.shipped ? "Shipped" : "Processing"}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="mt-6 flex justify-center gap-4">
                <Button onClick={() => navigate('/')}>
                    Back to Home
                </Button>
                {status === 'failed' && (
                    <Button variant="secondary" onClick={() => window.location.reload()}>
                        Try Again
                    </Button>
                )}
            </div>
        </div>
    );
};

export default PaymentStatus;
