import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAppSelector } from "@/Store/Store";
import axios from "axios";
import ShopDetailPage from "./ShopDetailPage";

interface Shop {
    _id: string;
    name: string;
    location: {
        coordinates: number[];
    };
    status: string;
    contactPerson: {
        name: string;
        phone: string;
        email: string;
    };
    businessDetails: {
        businessType: string;
        panNumber: string;
    };
    commissionRate: number;
    isActive: boolean;
    agent: {
        username: string;
        email: string;
        phone: string;
    };
}

interface ShopsPageState {
    shops: Shop[];
    currentPage: number;
    totalPages: number;
    totalShops: number;
    loading: boolean;
    filters: {
        status: string;
        searchTerm: string;
        startDate: string;
        endDate: string;
        agentId: string;
    };
    agents: Array<{ _id: string; username: string; email: string }>;
}

export default function AgentsPage() {
        // State for dialog
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogname, setdialogname] = useState(false);
    const [state, setState] = useState<ShopsPageState>({
        shops: [],
        currentPage: 1,
        totalPages: 1,
        totalShops: 0,
        loading: true,
        filters: {
            status: "",
            searchTerm: "",
            startDate: "",
            endDate: "",
            agentId: "",
        },
        agents: [],
    });

    const userRole = useAppSelector((state) => state.Auth.user?.role);

    const fetchShops = async () => {
        try {
            const queryParams = new URLSearchParams({
                page: state.currentPage.toString(),
                limit: "10",
                ...(state.filters.status && { status: state.filters.status }),
                ...(state.filters.searchTerm && { search: state.filters.searchTerm }),
                ...(state.filters.startDate && { startDate: state.filters.startDate }),
                ...(state.filters.endDate && { endDate: state.filters.endDate }),
                ...(state.filters.agentId && { agentId: state.filters.agentId }),
            });

            const response = await axios.get(
                `${import.meta.env.VITE_SERVER_URI}admin/shop-list?${queryParams}`,
                { withCredentials: true }
            );

            console.log("the response we get:",response.data.data);
            

            setState(prev => ({
                ...prev,
                shops: response.data.data.shops,
                totalShops: response.data.data.pagination.totalShops,
                currentPage: response.data.data.pagination.currentPage,
                totalPages: response.data.data.pagination.totalPages,
                agents: response.data.data.filterOptions.agents,
                loading: false,
            }));
        } catch (error) {
            console.error("Error fetching shops:", error);
            setState(prev => ({ ...prev, loading: false }));
        }
    };

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

    const updateShopInState = (updatedShop:Shop) => {
        setState((prev) => ({
            ...prev,
            shops: prev.shops.map((shop) =>
                shop._id === updatedShop._id ? updatedShop : shop
            ),
        }));
    };
    useEffect(() => {
        fetchShops();
    }, [state.currentPage, state.filters]);

    const handleFilterChange = (key: string, value: string) => {
        setState(prev => ({
            ...prev,
            currentPage: 1,
            filters: { ...prev.filters, [key]: value },
        }));
    };

    return (
        <div className="max-w-7xl mx-auto p-6 space-y-8">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6">
                    <h3 className="text-lg font-semibold">Total Shops</h3>
                    <p className="text-3xl font-bold">{state.totalShops}</p>
                </Card>
                {/* Add more stat cards as needed */}
            </div>

            {/* Filters Section */}
            <div className="flex flex-wrap gap-4">
                <Input
                    placeholder="Search shops..."
                    value={state.filters.searchTerm}
                    onChange={(e) => handleFilterChange("searchTerm", e.target.value)}
                    className="w-full md:w-64"
                />
                <select
                    value={state.filters.status}
                    onChange={(e) => handleFilterChange("status", e.target.value)}
                    className="p-2 border rounded"
                >
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                </select>
                <select
                    value={state.filters.agentId}
                    onChange={(e) => handleFilterChange("agentId", e.target.value)}
                    className="p-2 border rounded"
                >
                    <option value="">All Agents</option>
                    {state.agents.map(agent => (
                        <option key={agent._id} value={agent._id}>{agent.username}</option>
                    ))}
                </select>
                <Input
                    type="date"
                    value={state.filters.startDate}
                    onChange={(e) => handleFilterChange("startDate", e.target.value)}
                    className="w-full md:w-auto"
                />
                <Input
                    type="date"
                    value={state.filters.endDate}
                    onChange={(e) => handleFilterChange("endDate", e.target.value)}
                    className="w-full md:w-auto"
                />
            </div>

            {/* Table Section */}
            <Card className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Shop Name</TableHead>
                            <TableHead>Contact Person</TableHead>
                            <TableHead>Agent</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Commission Rate</TableHead>
                            <TableHead>Locations coordinator</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {state.shops.map((shop) => (
                            <TableRow key={shop._id}>
                                <TableCell>{shop.name}</TableCell>
                                <TableCell>
                                    <div>
                                        <p>{shop.contactPerson.name}</p>
                                        <p className="text-sm text-gray-500">{shop.contactPerson.phone}</p>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div>
                                        <p>{shop.agent?.username}</p>
                                        <p className="text-sm text-gray-500">{shop.agent?.email}</p>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                        shop.status === 'approved' ? 'bg-green-100 text-green-800' :
                                        shop.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                        'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {shop.status}
                                    </span>
                                </TableCell>
                                <TableCell>{shop.commissionRate}%</TableCell>
                                <TableCell>
                                Longitude: {shop.location.coordinates[0]}, Latitude: {shop.location.coordinates[1]}
                                </TableCell><TableCell>
                                    <div className="flex gap-2">
                                        
                                        {userRole === "admin" && (
                                            <Button 
                                                variant="outline" 
                                                size="sm"
                                                onClick={() => handleViewDetails(shop._id)}
                                            >
                                                View
                                            </Button>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>

            {/* Pagination */}
            <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">
                    Page {state.currentPage} of {state.totalPages}
                </p>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={() => setState(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
                        disabled={state.currentPage === 1}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => setState(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                        disabled={state.currentPage === state.totalPages}
                    >
                        Next
                    </Button>
                </div>
            </div>

            {(selectedOrderId && dialogname==false) && (
        <ShopDetailPage
          shopId={selectedOrderId}
          onUpdateShop={updateShopInState}
          isOpen={isDialogOpen}
          onClose={closeDialog}
        />
      )}
        </div>
    );
}