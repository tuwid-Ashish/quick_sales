import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { GetShopById, EditShop } from "@/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
interface ShopDetail {
    _id: string;
    name: string;
    agent: {
        username: string;
        email: string;
    };
    bankDetails: {
        accountNumber: string;
        ifscCode: string;
        accountHolderName: string;
        bankName: string;
    };
    businessDetails: {
        gstNumber?: string;
        panNumber: string;
        businessType: string;
        registrationNumber?: string;
    };
    status: 'pending' | 'approved' | 'rejected';
    commissionRate: number;
    contactPerson: {
        name: string;
        phone: string;
        email: string;
    };
    isActive: boolean;
}

interface ShopDetailPageProps {
    shopId: string;
    isOpen: boolean;
    onClose: () => void;
    onUpdateShop?: (updatedShop: ShopDetail) => void; 
}

function ShopDetailPage({ shopId, isOpen, onClose,onUpdateShop }: ShopDetailPageProps) {
    const [shopData, setShopData] = useState<ShopDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState({
        status: '',
        commissionRate: 0
    });

    useEffect(() => {
        const fetchShopDetails = async () => {
            try {
                const response = await GetShopById(shopId);
                console.log("the shop response", response.data);
                
                setShopData(response.data.data);
                setEditedData({
                    status: response.data.data.status,
                    commissionRate: response.data.data.commissionRate
                });
            } catch (error) {
                console.error("Error fetching shop details:", error);
            } finally {
                setLoading(false);
            }
        };

        if (isOpen && shopId) {
            fetchShopDetails();
        }
    }, [shopId, isOpen]);

    const handleSave = async () => {
        try {
            console.log("does it get hit");
            
            const modifiedShop = await EditShop(shopId, {
                status: editedData.status,
                rate: editedData.commissionRate,
            });
            console.log("does it get hit",modifiedShop);
            setIsEditing(false);
            console.log("this comes from shop edit", modifiedShop.data.agents);
    
            // Update the shop data in the parent component
            if (onUpdateShop) {
                onUpdateShop(modifiedShop.data.data.agents);
            }
    
            // Update the local state in the dialog
            setShopData(modifiedShop.data.data.agents);
        } catch (error) {
            console.error("Error updating shop:", error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[120vw] w-full h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Shop Details {shopData?.name}</DialogTitle>
                </DialogHeader>

                {shopData && (
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-4">
                            <Card>
                                <CardContent className="p-4">
                                    <h3 className="text-lg font-semibold mb-2">Basic Information</h3>
                                    <p>Shop Name: {shopData.name}</p>
                                    <p>Status: {isEditing ? (
                                        <Select value={editedData.status} onValueChange={(value) => setEditedData(prev => ({ ...prev, status: value }))}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="pending">Pending</SelectItem>
                                                <SelectItem value="approved">Approved</SelectItem>
                                                <SelectItem value="rejected">Rejected</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    ) : shopData.status}</p>
                                    <p>Commission Rate: {isEditing ? (
                                        <Input
                                            type="number"
                                            value={editedData.commissionRate}
                                            onChange={(e) => setEditedData(prev => ({ ...prev, commissionRate: parseFloat(e.target.value) }))}
                                        />
                                    ) : `${shopData.commissionRate}%`}</p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-4">
                                    <h3 className="text-lg font-semibold mb-2">Contact Person Details</h3>
                                    <p>Name: {shopData.contactPerson.name}</p>
                                    <p>Phone: {shopData.contactPerson.phone}</p>
                                    <p>Email: {shopData.contactPerson.email}</p>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="space-y-4">
                            <Card>
                                <CardContent className="p-4">
                                    <h3 className="text-lg font-semibold mb-2">Business Details</h3>
                                    <p>Business Type: {shopData.businessDetails.businessType}</p>
                                    <p>PAN Number: {shopData.businessDetails.panNumber}</p>
                                    {shopData.businessDetails.gstNumber && <p>GST Number: {shopData.businessDetails.gstNumber}</p>}
                                    {shopData.businessDetails.registrationNumber && <p>Registration Number: {shopData.businessDetails.registrationNumber}</p>}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-4">
                                    <h3 className="text-lg font-semibold mb-2">Bank Details</h3>
                                    <p>Account Holder: {shopData.bankDetails.accountHolderName}</p>
                                    <p>Bank Name: {shopData.bankDetails.bankName}</p>
                                    <p>Account Number: {shopData.bankDetails.accountNumber}</p>
                                    <p>IFSC Code: {shopData.bankDetails.ifscCode}</p>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="col-span-2 flex justify-end gap-2">
                            {isEditing ? (
                                <>
                                    <Button onClick={() => setIsEditing(false)}>Cancel</Button>
                                    <Button onClick={handleSave}>Save Changes</Button>
                                </>
                            ) : (
                                <Button onClick={() => setIsEditing(true)}>Edit Details</Button>
                            )}
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}

export default ShopDetailPage;