import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { GetOrderDetails } from '@/api';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, XCircle, Package, MapPin, User, Mail, Phone, Calendar, CreditCard } from "lucide-react";
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
            <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading order details...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 py-12">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Status Banner */}
                <div className={`mb-8 rounded-2xl overflow-hidden shadow-lg ${
                    status === 'success' 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
                        : 'bg-gradient-to-r from-red-500 to-rose-600'
                }`}>
                    <div className="p-8 text-white text-center">
                        <div className="flex justify-center mb-4">
                            {status === 'success' ? (
                                <div className="bg-white rounded-full p-4">
                                    <CheckCircle2 className="h-16 w-16 text-green-600" />
                                </div>
                            ) : (
                                <div className="bg-white rounded-full p-4">
                                    <XCircle className="h-16 w-16 text-red-600" />
                                </div>
                            )}
                        </div>
                        <h1 className="text-4xl font-bold mb-2">
                            {status === 'success' ? 'Payment Successful!' : 'Payment Failed'}
                        </h1>
                        <p className="text-xl text-white/90">
                            {status === 'success' 
                                ? "Thank you for your order. We'll start processing it right away."
                                : "We couldn't process your payment. Please try again or contact support."}
                        </p>
                    </div>
                </div>

                {order && (
                    <div className="space-y-6">
                        {/* Order Summary Card */}
                        <Card className="border-0 shadow-xl">
                            <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
                                <div className="flex justify-between items-center">
                                    <CardTitle className="text-2xl">Order Details</CardTitle>
                                    <Badge className={`text-sm px-3 py-1 ${
                                        status === 'success' 
                                            ? 'bg-green-500 hover:bg-green-600' 
                                            : 'bg-red-500 hover:bg-red-600'
                                    }`}>
                                        {order.paymentStatus}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div className="flex items-start gap-3">
                                        <div className="bg-green-100 rounded-full p-2">
                                            <CreditCard className="h-5 w-5 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Order ID</p>
                                            <p className="font-semibold text-gray-900">{order._id}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="bg-emerald-100 rounded-full p-2">
                                            <Calendar className="h-5 w-5 text-emerald-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Order Date</p>
                                            <p className="font-semibold text-gray-900">{order.orderDate}</p>
                                        </div>
                                    </div>
                                </div>

                                <Separator className="my-6" />

                                {/* Customer Details */}
                                <div className="mb-6">
                                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                        <User className="h-5 w-5 text-green-600" />
                                        Customer Information
                                    </h3>
                                    <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                                        <div className="flex items-center gap-3">
                                            <User className="h-4 w-4 text-gray-500" />
                                            <span className="text-gray-900 font-medium">{order.customer.name}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Phone className="h-4 w-4 text-gray-500" />
                                            <span className="text-gray-900">{order.customer.phoneNumber}</span>
                                        </div>
                                        {order.customer.email && (
                                            <div className="flex items-center gap-3">
                                                <Mail className="h-4 w-4 text-gray-500" />
                                                <span className="text-gray-900">{order.customer.email}</span>
                                            </div>
                                        )}
                                        <div className="flex items-start gap-3">
                                            <MapPin className="h-4 w-4 text-gray-500 mt-1" />
                                            <span className="text-gray-900">{order.shippingAddress}</span>
                                        </div>
                                    </div>
                                </div>

                                <Separator className="my-6" />

                                {/* Order Summary */}
                                <div>
                                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                        <Package className="h-5 w-5 text-green-600" />
                                        Order Summary
                                    </h3>
                                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-700 text-lg">Total Amount:</span>
                                            <span className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                                ₹{order.totalAmount}
                                            </span>
                                        </div>
                                        <Separator />
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-700">Shipping Status:</span>
                                            <Badge 
                                                variant={order.shipped ? "default" : "secondary"}
                                                className={`${
                                                    order.shipped 
                                                        ? 'bg-green-500 hover:bg-green-600' 
                                                        : 'bg-gray-400'
                                                } text-white`}
                                            >
                                                <Package className="w-4 h-4 mr-2" />
                                                {order.shipped ? "Shipped" : "Processing"}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button 
                                size="lg"
                                onClick={() => navigate('/')}
                                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                            >
                                Continue Shopping
                            </Button>
                            {status === 'failed' && (
                                <Button 
                                    size="lg"
                                    variant="outline" 
                                    onClick={() => window.location.reload()}
                                    className="border-2 border-red-600 text-red-600 hover:bg-red-50"
                                >
                                    Try Again
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentStatus;
