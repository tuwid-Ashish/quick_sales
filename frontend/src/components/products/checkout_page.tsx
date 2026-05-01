import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { GetOrderDetails } from '@/api';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle, Package, MapPin, User, Mail, Phone, Calendar, CreditCard, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

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
                setOrder(response.data.data);
            } catch (error) {
                console.error('Error fetching order details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [location.search, navigate]);

    if (loading) {
        return (
            <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-forest">
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-[400px] w-[400px] rounded-full bg-sage/10 blur-[100px]" />
                </div>
                <div className="relative flex flex-col items-center gap-8">
                    <img src="/images/logo.png" alt="Get Gardening" className="h-24 w-auto object-contain brightness-0 invert drop-shadow-2xl" />
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-gold animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="h-2 w-2 rounded-full bg-gold animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="h-2 w-2 rounded-full bg-gold animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                    <p className="text-sm font-medium tracking-widest uppercase text-sage font-nunito">
                        Confirming your order...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-cream font-nunito py-16 px-4">
            <div className="container mx-auto max-w-3xl">
                {/* Status Banner */}
                <div className={`mb-8 rounded-3xl overflow-hidden shadow-2xl border ${
                    status === 'success' 
                        ? 'bg-forest border-forest-light' 
                        : 'bg-red-950 border-red-900'
                } relative`}>
                    <div className="grain absolute inset-0 opacity-20" />
                    <div className="relative z-10 p-10 text-center">
                        <div className="flex justify-center mb-6">
                            {status === 'success' ? (
                                <div className="bg-gold/20 rounded-full p-4 ring-8 ring-gold/10">
                                    <CheckCircle2 className="h-16 w-16 text-gold" />
                                </div>
                            ) : (
                                <div className="bg-red-500/20 rounded-full p-4 ring-8 ring-red-500/10">
                                    <XCircle className="h-16 w-16 text-red-400" />
                                </div>
                            )}
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-display font-bold text-white mb-4">
                            {status === 'success' ? 'Payment Successful!' : 'Payment Failed'}
                        </h1>
                        <p className="text-lg text-white/80 max-w-lg mx-auto leading-relaxed">
                            {status === 'success' 
                                ? "Thank you! We've received your order and will start packing your kit right away."
                                : "We couldn't process your payment. Please try again to complete your order."}
                        </p>
                    </div>
                </div>

                {order && (
                    <div className="space-y-6 animate-fade-up">
                        <Card className="border-cream-dark shadow-lg rounded-3xl overflow-hidden bg-white">
                            <CardHeader className="bg-cream-dark border-b border-cream-dark/50 pb-6">
                                <div className="flex justify-between items-center">
                                    <CardTitle className="text-2xl font-display font-bold text-forest">Order Details</CardTitle>
                                    <Badge className={`text-sm px-4 py-1.5 rounded-full uppercase tracking-wider font-bold ${
                                        status === 'success' 
                                            ? 'bg-forest text-gold hover:bg-forest-light' 
                                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                                    } border-0`}>
                                        {order.paymentStatus}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="p-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                    <div className="flex items-start gap-4">
                                        <div className="bg-cream rounded-xl p-3 text-forest border border-cream-dark">
                                            <CreditCard className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-sage uppercase tracking-wider mb-1">Order ID</p>
                                            <p className="font-bold text-forest text-lg">{order._id}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="bg-cream rounded-xl p-3 text-forest border border-cream-dark">
                                            <Calendar className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-sage uppercase tracking-wider mb-1">Order Date</p>
                                            <p className="font-bold text-forest text-lg">{order.orderDate}</p>
                                        </div>
                                    </div>
                                </div>

                                <Separator className="my-8 border-cream-dark" />

                                {/* Customer Details */}
                                <div className="mb-8">
                                    <h3 className="text-xl font-display font-bold text-forest mb-6 flex items-center gap-3">
                                        <div className="bg-sage/10 p-2 rounded-lg"><User className="h-5 w-5 text-forest" /></div>
                                        Delivery Information
                                    </h3>
                                    <div className="bg-cream rounded-2xl p-6 border border-cream-dark/50 grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                <User className="h-4 w-4 text-sage" />
                                                <span className="text-forest font-bold">{order.customer.name}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Phone className="h-4 w-4 text-sage" />
                                                <span className="text-forest font-medium">{order.customer.phoneNumber}</span>
                                            </div>
                                            {order.customer.email && (
                                                <div className="flex items-center gap-3">
                                                    <Mail className="h-4 w-4 text-sage" />
                                                    <span className="text-forest font-medium">{order.customer.email}</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex items-start gap-3 bg-white p-4 rounded-xl border border-cream-dark/50">
                                            <MapPin className="h-5 w-5 text-forest flex-shrink-0" />
                                            <span className="text-forest/80 leading-relaxed text-sm">{order.shippingAddress}</span>
                                        </div>
                                    </div>
                                </div>

                                <Separator className="my-8 border-cream-dark" />

                                {/* Order Summary */}
                                <div>
                                    <h3 className="text-xl font-display font-bold text-forest mb-6 flex items-center gap-3">
                                        <div className="bg-sage/10 p-2 rounded-lg"><Package className="h-5 w-5 text-forest" /></div>
                                        Order Summary
                                    </h3>
                                    <div className="bg-forest rounded-2xl p-6 text-white relative overflow-hidden">
                                        <div className="grain absolute inset-0 opacity-10" />
                                        <div className="relative z-10 space-y-6">
                                            <div className="flex justify-between items-center">
                                                <span className="text-white/80 font-medium">Shipping Status</span>
                                                <Badge 
                                                    className={`${
                                                        order.shipped 
                                                            ? 'bg-gold text-forest hover:bg-gold-light' 
                                                            : 'bg-white/20 text-white hover:bg-white/30'
                                                    } border-0 rounded-full px-3 py-1`}
                                                >
                                                    <Package className="w-4 h-4 mr-2" />
                                                    {order.shipped ? "Shipped" : "Processing"}
                                                </Badge>
                                            </div>
                                            <Separator className="bg-white/10" />
                                            <div className="flex justify-between items-end">
                                                <span className="text-white/80 font-bold uppercase tracking-wider text-sm">Total Paid</span>
                                                <span className="text-4xl font-display font-bold text-gold">
                                                    ₹{order.totalAmount}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                            {status === 'failed' ? (
                                <Button 
                                    size="lg"
                                    onClick={() => window.location.reload()}
                                    className="h-14 px-8 rounded-full bg-forest text-gold font-bold hover:bg-forest-light shadow-lg w-full sm:w-auto"
                                >
                                    Try Payment Again
                                </Button>
                            ) : (
                                <Button 
                                    size="lg"
                                    onClick={() => navigate('/')}
                                    className="h-14 px-8 rounded-full bg-gold text-forest font-bold hover:bg-gold-light shadow-lg w-full sm:w-auto"
                                >
                                    Back to Store <ArrowRight className="ml-2 w-5 h-5" />
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
