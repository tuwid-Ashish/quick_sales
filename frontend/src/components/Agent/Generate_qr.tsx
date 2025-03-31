import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GeneratorQR } from "@/api";

export const formSchema = z.object({
name: z.string().min(2),
contactPerson: z.object({
  name: z.string().min(2),
  phone: z.string().min(10),
  email: z.string().email(),
}),
bankDetails: z.object({
  accountNumber: z.string().min(9),
  ifscCode: z.string().min(11),
  accountHolderName: z.string().min(2),
  bankName: z.string().min(2),
}),
businessDetails: z.object({
  panNumber: z.string().max(10),
  businessType: z.enum(["individual", "partnership", "company"]),
  gstNumber: z.string().optional(),
  registrationNumber: z.string().optional(),
}),
location: z.object({
  coordinates: z.tuple([z.number(), z.number()]),
}),
commissionRate: z.string()
.transform((value) => parseFloat(value))
.refine((value) => !isNaN(value) && value >= 5, {
  message: "Commission rate must be a number greater than or equal to 5",
}),
});

function Generate_qr() {
const [coordinates, setCoordinates] = useState<[number, number]>([0, 0]);
const [existing,setExisting] = useState<boolean>(false)
const [qrCode, setQrCode] = useState<string>("");

const form = useForm<z.infer<typeof formSchema>>({
  resolver: zodResolver(formSchema),
  defaultValues: {
    location: {
      coordinates: [0, 0],
    },
  },
});

useEffect(() => {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition((position) => {
      setCoordinates([position.coords.longitude, position.coords.latitude]);
      form.setValue("location.coordinates", [
        position.coords.longitude,
        position.coords.latitude,
      ]);
    });
  }
}, []);

async function onSubmit(values: z.infer<typeof formSchema>) {
  try {
    // API call will go here
    GeneratorQR(values,existing).then((res)=>{
      console.log("this is what we get:",res.data);
      
      setQrCode(res.data.data.qrCode)
    }).catch((error)=>{
      console.log("this is what we get in error:",error);

    })
    console.log(values);
    // After successful submission, setQrCode with the response
    // setQrCode(response.qrCode);
  } catch (error) {
    console.error(error);
  }
}

return (
  <div className="container mx-auto p-4">
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">Shop Registration</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Shop Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Contact Person Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Person Details</h3>
            <FormField
              control={form.control}
              name="contactPerson.name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Person Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contactPerson.phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input {...field} type="tel" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contactPerson.email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Bank Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Bank Details</h3>
            <FormField
              control={form.control}
              name="bankDetails.accountNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Number</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bankDetails.ifscCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>IFSC Code</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bankDetails.accountHolderName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Holder Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="commissionRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>commission Rate</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bankDetails.bankName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bank Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Business Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Business Details</h3>
            <FormField
              control={form.control}
              name="businessDetails.businessType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select business type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="individual">Individual</SelectItem>
                      <SelectItem value="partnership">Partnership</SelectItem>
                      <SelectItem value="company">Company</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="businessDetails.panNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>PAN Number</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="businessDetails.gstNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GST Number</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
                
              )}
            />
            <div className="flex items-center space-x-2 p-4 border rounded-lg shadow-sm">
      <Checkbox checked={existing} onCheckedChange={setExisting} />
      <label className="text-sm font-medium">Gener register shop qrCode </label>
    </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Location</h3>
            <p>Current Location: {coordinates[0]}, {coordinates[1]}</p>
          </div>

          <Button type="submit">Generate QR Code</Button>
        </form>
      </Form>

      {qrCode && (
        <div className="mt-8">
          <img src={qrCode} alt="QR Code" className="mx-auto" />
          <Button
            onClick={() => {
              const link = document.createElement('a');
              link.href = qrCode;
              link.download = 'shop-qr-code.png';
              link.click();
            }}
            className="mt-4"
          >
            Download QR Code
          </Button>
        </div>
      )}
    </Card>
  </div>
);
}
export default Generate_qr;