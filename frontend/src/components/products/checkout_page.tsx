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
    const [error, setError] = useState('');

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const paymentStatus = queryParams.get('status');
        const orderId = queryParams.get('order_id');

        if (!(paymentStatus && orderId)) {
            setError('Missing payment status or order reference. Please return to the store and try again.');
            setLoading(false);
            return;
        }
        
        setStatus(paymentStatus);
        setError('');

        const fetchOrderDetails = async () => {
            try {
                const response = await GetOrderDetails(orderId);
                setOrder(response.data.data);
            } catch (error) {
                console.error('Error fetching order details:', error);
                setError('We could not load the order details right now. The payment may still have been recorded.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [location.search, navigate]);

    if (loading) {
        return (
            <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(58,139,60,0.18),_transparent_40%),linear-gradient(135deg,_#FFF9E6_0%,_#FFFFFF_45%,_#F2E9CD_100%)] px-4 py-16 font-nunito">
                <div className="absolute -top-28 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-sage/20 blur-3xl" />
                <div className="absolute bottom-[-5rem] right-[-4rem] h-72 w-72 rounded-full bg-gold/20 blur-3xl" />
                <div className="relative mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center">
                    <div className="w-full max-w-xl rounded-[2rem] border border-white/70 bg-white/85 p-10 text-center shadow-[0_30px_80px_rgba(45,64,38,0.14)] backdrop-blur-md">
                        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-forest/10 ring-8 ring-forest/5">
                            <img src="/images/logo.png" alt="Get Gardening" className="h-11 w-auto object-contain" />
                        </div>
                        <div className="mx-auto flex items-center justify-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-forest animate-bounce" style={{ animationDelay: '0ms' }} />
                            <div className="h-3 w-3 rounded-full bg-gold animate-bounce" style={{ animationDelay: '150ms' }} />
                            <div className="h-3 w-3 rounded-full bg-leaf-light animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                        <p className="mt-6 text-xs font-bold uppercase tracking-[0.32em] text-sage">
                            Confirming your order
                        </p>
                        <h1 className="mt-3 text-3xl font-display font-bold text-forest sm:text-4xl">
                            Loading payment status
                        </h1>
                        <p className="mt-4 text-sm leading-7 text-soil/80 sm:text-base">
                            We are checking the transaction details and order record before showing the final receipt.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(58,139,60,0.14),_transparent_35%),linear-gradient(135deg,_#FFF9E6_0%,_#FFFCF2_50%,_#F2E9CD_100%)] px-4 py-12 font-nunito sm:py-16">
            <div className="container mx-auto max-w-4xl">
                <div className={`relative mb-8 overflow-hidden rounded-[2rem] border shadow-[0_30px_80px_rgba(45,64,38,0.16)] ${
                    status === 'success'
                        ? 'border-forest-light bg-gradient-to-br from-forest via-leaf-dark to-forest'
                        : 'border-red-900 bg-gradient-to-br from-red-950 via-red-900 to-red-800'
                }`}>
                    <div className="absolute inset-0 opacity-20" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.18),_transparent_45%)]" />
                    <div className="relative z-10 px-6 py-10 text-center sm:px-10 sm:py-12">
                        <div className="mb-6 flex justify-center">
                            {status === 'success' ? (
                                <div className="rounded-full bg-gold/15 p-4 ring-8 ring-gold/10">
                                    <CheckCircle2 className="h-16 w-16 text-gold" />
                                </div>
                            ) : (
                                <div className="rounded-full bg-white/10 p-4 ring-8 ring-white/10">
                                    <XCircle className="h-16 w-16 text-red-200" />
                                </div>
                            )}
                        </div>
                        <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-white/70">
                            {status === 'success' ? 'Payment confirmed' : 'Payment issue'}
                        </p>
                        <h1 className="text-4xl font-display font-bold text-white sm:text-5xl">
                            {status === 'success' ? 'Payment Successful!' : 'Payment Failed'}
                        </h1>
                        <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-white/82 sm:text-lg">
                            {status === 'success'
                                ? "Thank you. We have received your order and the next steps are already in motion."
                                : "We could not process your payment. Please try again to complete your order."}
                        </p>
                        {error && (
                            <div className="mx-auto mt-6 max-w-2xl rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm leading-6 text-white/90 backdrop-blur-sm">
                                {error}
                            </div>
                        )}
                    </div>
                </div>

                {order && (
                    <div className="space-y-6 animate-fade-up">
                        <Card className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/90 shadow-[0_24px_70px_rgba(45,64,38,0.14)] backdrop-blur-sm">
                            <CardHeader className="border-b border-cream-dark/60 bg-gradient-to-r from-cream to-white pb-6">
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
                            <CardContent className="p-6 sm:p-8">
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
                                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-forest via-leaf-dark to-forest p-6 text-white shadow-lg">
                                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.15),_transparent_40%)]" />
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

                {!order && error && (
                    <div className="mx-auto max-w-2xl rounded-[2rem] border border-white/70 bg-white/90 p-8 text-center shadow-[0_24px_70px_rgba(45,64,38,0.14)] backdrop-blur-sm">
                        <h2 className="text-2xl font-display font-bold text-forest">Unable to load order details</h2>
                        <p className="mt-3 text-sm leading-7 text-soil/80">{error}</p>
                        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                            <Button
                                size="lg"
                                onClick={() => navigate('/')}
                                className="h-14 rounded-full bg-gold px-8 font-bold text-forest hover:bg-gold-light"
                            >
                                Back to Store
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                onClick={() => window.location.reload()}
                                className="h-14 rounded-full border-forest/20 px-8 font-bold text-forest hover:bg-forest hover:text-white"
                            >
                                Retry Loading
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentStatus;
