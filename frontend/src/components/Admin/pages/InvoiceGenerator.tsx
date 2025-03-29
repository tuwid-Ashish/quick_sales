import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import domtoimage from "dom-to-image";
import jsPDF from 'jspdf';
import { Button } from '@/components/ui/button';
import { GetOrderDetails } from '@/api';

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
        quantity: number;
    }>;
    totalAmount: number;
    status: string;
    shippingAddress: string; 
    createdAt: string|number|Date|undefined;
}

const InvoiceGenerator = ({ isOpen, onClose, orderId }:OrderDetailPageProps) => {
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


        const generatePDF = async () => {
            const invoice = document.getElementById("invoice");
            if (!invoice) return;
          
            try {
              const imgData = await domtoimage.toPng(invoice);
          
              const pdf = new jsPDF("p", "mm", "a4");
              const imgProps = pdf.getImageProperties(imgData);
              const pdfWidth = pdf.internal.pageSize.getWidth();
              const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
          
              pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
              pdf.save(`invoice-${orderData?._id}.pdf`);
            } catch (error) {
              console.error("Error generating PDF:", error);
            }
        };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[800px]">
                <DialogHeader>
                    <DialogTitle>Invoice</DialogTitle>
                    <Button onClick={generatePDF} className="absolute right-8 top-4">
                        Download PDF
                    </Button>
                </DialogHeader>

                <div id="invoice" className="bg-white p-8">
                    {/* Invoice Header */}
                    <div className="flex justify-between mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">INVOICE</h1>
                            <p className="text-gray-600">Quick Sales</p>
                        </div>
                        <div className="text-right">
                            <p className="font-bold">Invoice #: {orderData?._id}</p>
                            <p>Date: {new Date(orderData?.orderDate).toLocaleDateString()}</p>
                        </div>
                    </div>

                    {/* Bill To Section */}
                    <div className="grid grid-cols-2 gap-8 mb-8">
                        <div>
                            <h2 className="text-lg font-semibold mb-2">Bill To:</h2>
                            <p>{orderData?.customer?.name}</p>
                            <p>{orderData?.customer?.email}</p>
                            <p>{orderData?.customer?.phone}</p>
                            <p>{orderData?.shippingAddress}</p>
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold mb-2">Payment Status:</h2>
                            <p className="capitalize">{orderData?.paymentStatus}</p>
                            <p>Shipping Status: {orderData?.shipped ? 'Shipped' : 'Pending'}</p>
                        </div>
                    </div>

                    {/* Order Items Table */}
                    <table className="w-full mb-8">
                        <thead>
                            <tr className="border-b-2 border-gray-300">
                                <th className="text-left py-2">Item</th>
                                <th className="text-right py-2">Quantity</th>
                                <th className="text-right py-2">Price</th>
                                <th className="text-right py-2">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orderData?.products?.map((item, index) => (
                                <tr key={index} className="border-b border-gray-200">
                                    <td className="py-2">{item.product.name}</td>
                                    <td className="text-right py-2">{item.quantity}</td>
                                    <td className="text-right py-2">
                                    ₹{item.product.price.toFixed(2)}
                                    </td>
                                    <td className="text-right py-2">
                                    ₹{(item.product.price * item.quantity).toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Total Section */}
                    <div className="flex justify-end">
                        <div className="w-1/3">
                            <div className="flex justify-between mb-2">
                                <span className="font-semibold">Subtotal:</span>
                                <span>₹{orderData?.totalAmount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between border-t-2 border-gray-300 pt-2">
                                <span className="font-bold">Total:</span>
                                <span className="font-bold">
                                 ₹{orderData?.totalAmount.toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-8 text-center text-gray-600">
                        <p>Thank you for your business!</p>
                        <p className="text-sm">Quick Sales - Your Trusted Shopping Partner</p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default InvoiceGenerator;