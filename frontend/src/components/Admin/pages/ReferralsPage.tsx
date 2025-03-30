import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

import axios from "axios";

interface Shop {
  name: string;
  contactPerson: {
    name: string;
    phone: string;
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
    businessType: 'individual' | 'partnership' | 'company';
    registrationNumber?: string;
  };
}

interface Transaction {
  totalAmount: number;
  customer: {
    name: string;
    phoneNumber: string;
    email: string;
  };
  orderDate: string;
  products: Array<{
    product: {
      name: string;
      price: number;
    };
    quantity: number;
    priceAtPurchase:number;
    name:string;
  }>;
  paymentStatus: 'pending' | 'completed' | 'failed';
}

interface Referral {
  _id: string;
  shop: Shop;
  transaction: Transaction;
  commissionAmount: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export default function ReferralsPage() {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [commissionStatus, setCommissionStatus] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedReferral, setSelectedReferral] = useState<Referral | null>(null);

  const handleApproveCommission = async (id: string) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_SERVER_URI}admin/approve-commission/${id}`,
        {},
        { withCredentials: true }
      );
      // Update the referral status in the list
      setReferrals((prev) =>
        prev.map((ref) =>
          ref._id === id ? { ...ref, commissionStatus: "approved" } : ref
        )
      );
    } catch (err) {
      console.error("Approve commission error:", err);
      setError("Failed to approve commission");
    }
  };

  const handleRejectCommission = async (id: string) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_SERVER_URI}admin/reject-commission/${id}`,
        {},
        { withCredentials: true }
      );
      // Update the referral status in the list
      setReferrals((prev) =>
        prev.map((ref) =>
          ref._id === id ? { ...ref, commissionStatus: "rejected" } : ref
        )
      );
    } catch (err) {
      console.error("Reject commission error:", err);
      setError("Failed to reject commission");
    }
  };

  const fetchReferrals = async () => {
    setLoading(true);
    try {
      console.log(dateFilter);
      
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URI}admin/list-referrals`,
        {
          params: {
            page: currentPage,
            limit: 5,
            status: commissionStatus,
            date: dateFilter,
            search: searchQuery,
          },
          withCredentials: true,
        }
      );
      // Ensure that the expected data exists
      const commissions = response.data?.data?.commissions || [];
      console.log("list the commsioms", commissions);
      
      setReferrals(commissions);
      setTotalPages(response.data?.data?.pagination?.totalPages || 1);
    } catch (err) {
      console.error("Error fetching referrals:", err);
      setError("Failed to fetch referrals");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (referralId: string) => {
    const referral = referrals.find((ref) => ref._id === referralId);
    if (referral) {
      setSelectedReferral(referral);
      setIsDialogOpen(true);
    }
  };

  useEffect(() => {
    fetchReferrals();
  }, [currentPage, commissionStatus, dateFilter, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Referrals List</h1>
      </div>

      {error && (
        <p className="text-red-500 font-medium text-center">{error}</p>
      )}

      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <Input
          placeholder="Search by referrer name..."
          className="w-full sm:w-96"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          value={commissionStatus}
          onChange={(e) => setCommissionStatus(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <Input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="w-full sm:w-40"
        />
      </div>

      <Card className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Referrer</TableHead>
              <TableHead>Shop</TableHead>
              <TableHead>Order Amount</TableHead>
              <TableHead>Commission</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : referrals.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  No referrals found.
                </TableCell>
              </TableRow>
            ) : (
              referrals.map((referral) => (
                <TableRow key={referral._id}>
                  <TableCell>{referral.shop.name}</TableCell>
                  <TableCell>{referral.shop.name}</TableCell>
                  <TableCell>₹{referral.transaction.totalAmount}</TableCell>
                  <TableCell>₹{referral.commissionAmount}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        referral.status === "approved"
                          ? "success"
                          : referral.status === "rejected"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {referral.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(referral.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {referral.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() =>
                              handleApproveCommission(referral._id)
                            }
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() =>
                              handleRejectCommission(referral._id)
                            }
                          >
                            Reject
                          </Button>
                          
                        </>
                      )}
                       <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewDetails(referral._id)}
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Referral Details</DialogTitle>
          </DialogHeader>
          {selectedReferral && (
            <div className="space-y-4">
              <p><strong>Referrer Name:</strong> {selectedReferral.shop.contactPerson.name}</p>
              <p><strong>Shop Name:</strong> {selectedReferral.shop.name}</p>
              <p><strong>Order Amount:</strong> ₹{selectedReferral.transaction.totalAmount}</p>
              <p><strong>Commission Amount:</strong> ₹{selectedReferral.commissionAmount}</p>
              <p><strong>Status:</strong> {selectedReferral.status}</p>
              <p><strong>Date:</strong> {new Date(selectedReferral.createdAt).toLocaleDateString()}</p>
              <p><strong>Products:</strong></p>
              <ul className="list-disc pl-5">
                {selectedReferral.transaction.products.map((product, index) => (
                  <li key={index}>
                    {product.name} - ₹{product.priceAtPurchase} x {product.quantity}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      {/* Pagination */}
      <div className="flex flex-col items-center">
        <p className="text-sm text-gray-500">
          Page {currentPage} of {totalPages}
        </p>
        <div className="flex gap-2 mt-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

