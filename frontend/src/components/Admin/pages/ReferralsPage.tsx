import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import axios from "axios";
// import ReferralDetailPage from "./ReferralDetailPage"; // You'll need to create this component

interface Referral {
  _id: string;
  referrer: { name: string };
  shop: { name: string };
  orderAmount: number;
  commissionAmount: number;
  commissionStatus: "pending" | "approved" | "rejected";
  createdAt: string;
}

export default function ReferralsPage() {
  const [referrals, setReferrals] = useState<Referral[]>([
    {
      _id: "1",
      referrer: { name: "John Doe" },
      shop: { name: "Sample Shop" },
      orderAmount: 100,
      commissionAmount: 10,
      commissionStatus: "pending",
      createdAt: new Date().toISOString()
    },
    {
      _id: "2",
      referrer: { name: "Jane Smith" },
      shop: { name: "Test Store" },
      orderAmount: 200,
      commissionAmount: 20,
      commissionStatus: "approved",
      createdAt: new Date().toISOString()
    }
  ]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [commissionStatus, setCommissionStatus] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  // const [selectedReferralId, setSelectedReferralId] = useState<string | null>(null);
  // const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleApproveCommission = async (id: string) => {
    try {
      await axios.post(`${import.meta.env.VITE_SERVER_URI}admin/approve-commission/${id}`, {}, {
        withCredentials: true
      });
      // Update the referral status in the list
      setReferrals(referrals.map(ref => 
        ref._id === id ? { ...ref, commissionStatus: 'approved' } : ref
      ));
    } catch (err) {
      setError("Failed to approve commission");
    }
  };

  const handleRejectCommission = async (id: string) => {
    try {
      await axios.post(`${import.meta.env.VITE_SERVER_URI}admin/reject-commission/${id}`, {}, {
        withCredentials: true
      });
      // Update the referral status in the list
      setReferrals(referrals.map(ref => 
        ref._id === id ? { ...ref, commissionStatus: 'rejected' } : ref
      ));
    } catch (err) {
      setError("Failed to reject commission");
    }
  };

  const fetchReferrals = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_SERVER_URI}admin/list-referrals`, {
        params: { 
          page: currentPage, 
          limit: 5, 
          status: commissionStatus, 
          date: dateFilter,
          search: searchQuery 
        },
        withCredentials: true
      });
      console.log("the datain return we get", data.data);
      // if(data.data.commissions.length == 0 ) return
      setReferrals(data.data.referrals);
      setTotalPages(data.data.pagination.totalPages);
    } catch (err) {
      setError("Failed to fetch referrals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReferrals();
  }, [currentPage, commissionStatus, dateFilter, searchQuery]);

  // const handleViewDetails = (referralId: string) => {
  //   setSelectedReferralId(referralId);
  //   setIsDialogOpen(true);
  // };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Referrals List</h1>
      </div>

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
                <TableCell colSpan={7} className="text-center">Loading...</TableCell>
              </TableRow>
            ) : referrals.map((referral) => (
              <TableRow key={referral._id}>
                <TableCell>{referral.referrer.name}</TableCell>
                <TableCell>{referral.shop.name}</TableCell>
                <TableCell>${referral.orderAmount}</TableCell>
                <TableCell>${referral.commissionAmount}</TableCell>
                <TableCell>
                  <Badge variant={
                    referral.commissionStatus === "approved" ? "success" : 
                    referral.commissionStatus === "rejected" ? "destructive" : 
                    "secondary"
                  }>
                    {referral.commissionStatus}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(referral.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {referral.commissionStatus === "pending" && (
                      <>
                        <Button 
                          size="sm" 
                          variant="default"
                          onClick={() => handleApproveCommission(referral._id)}
                        >
                          Approve
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleRejectCommission(referral._id)}
                        >
                          Reject
                        </Button>
                      </>
                    )}
                    {/* <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewDetails(referral._id)}
                    >
                      View Details
                    </Button> */}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Pagination */}
      <div className="flex justify-between items-center"></div>
        <p className="text-sm text-gray-500">
          Page {currentPage} of {totalPages}
        </p>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} 
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} 
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
  );
}
