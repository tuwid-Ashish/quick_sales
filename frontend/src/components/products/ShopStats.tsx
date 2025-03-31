import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Toaster } from '@/components/ui/sonner';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
 

interface ShopStats {
    totalSales: number;
    totalVisitors: number;
    conversionRate: number;
    shopName: string;
    panCard: string;
}

interface FormInputs {
    shopName: string;
    panCard: string;
}

export default function ShopStats() {
    const [stats, setStats] = useState<ShopStats | null>(null);
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm<FormInputs>();

    const onSubmit = async (data: FormInputs) => {
        try {
            setLoading(true);
            const response = await axios.post(`${import.meta.env.VITE_SERVER_URI}agent/referal-vists`, data);
            setStats(response.data);
            toast.success("Stats fetched successfully");
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                    <Card key={i}>
                        <CardHeader>
                            <Skeleton className="h-4 w-[150px]" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-8 w-[100px]" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <Toaster />
            
            <Card className="w-full max-w-md mx-auto">
                <CardHeader>
                    <CardTitle>Shop Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="shopName">Shop Name</label>
                            <Input
                                {...register("shopName", { required: "Shop name is required" })}
                                placeholder="Enter shop name"
                            />
                            {errors.shopName && (
                                <p className="text-red-500 text-sm">{errors.shopName.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="panCard">PAN Card</label>
                            <Input
                                {...register("panCard", { 
                                    required: "PAN card is required",
                                    pattern: {
                                        value: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
                                        message: "Invalid PAN card format"
                                    }
                                })}
                                placeholder="Enter PAN card number"
                            />
                            {errors.panCard && (
                                <p className="text-red-500 text-sm">{errors.panCard.message}</p>
                            )}
                        </div>

                        <Button type="submit" className="w-full">
                            Fetch Stats
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {stats && (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalSales}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalVisitors}</div>
                        </CardContent>
                    </Card>

                    {/* <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.conversionRate}%</div>
                        </CardContent>
                    </Card> */}

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Shop Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-1">
                                <p className="text-sm font-medium">Name: {stats.shopName}</p>
                                <p className="text-sm font-medium">PAN: {stats.panCard}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}