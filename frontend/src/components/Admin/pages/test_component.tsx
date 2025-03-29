import { Input } from "@/components/ui/input";
import React, { useState, ChangeEvent, FormEvent } from "react";

interface FileUploaderProps {
  onUpload?: (files: File[]) => void; // Optional prop for handling uploaded files
}

const FileUploader: React.FC<FileUploaderProps> = ({ onUpload }) => {
  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>): void => {
    console.log("the files",files,files?.length);
    if (event.target.files) {
      const selectedFiles = Array.from(event.target.files);
      setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
    }
  };

  const handleRemoveFile = (index: number): void => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = (event: FormEvent): void => {
    event.preventDefault();
    // Perform your upload logic here
    console.log("Files to be uploaded:", files);
    if (onUpload) {
      onUpload(files); // Pass files to the parent component if onUpload is provided
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-gray-100 shadow-md rounded-md">
      <h2 className="text-lg font-bold mb-2">Upload Your Files</h2>
      <form onSubmit={handleSubmit}>
        <Input
          type="file"
          multiple
          onChange={handleFileChange}
          className="mb-2"
        />
        <ul className="mb-2">
          {files.map((file, index) => (
            <li
              key={index}
              className="flex justify-between items-center bg-white p-2 rounded mb-1"
            >
              <span className="text-sm">{file.name}</span>
              <button
                type="button"
                onClick={() => handleRemoveFile(index)}
                className="text-red-500 text-sm"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default FileUploader;



const orderdetails = {
  ...customerData,
  id :product._id,
  referral: referral_data

}


CreateOder(orderdetails).then((response)=>{
  console.log(response.data,response);
  const data = response.data
  // return
  const options: RazorpayOptions = {
    key: data.key_id,
    amount: product.price ||data.product.price, // Amount in paisa
    currency: "INR",
    name: customerData.name,
    description: product.description,
    callbackurl:`${ import.meta.env.VITE_SERVER_URI}/payment/PaymentVerification`,
    prefill: {
      name: customerData.name,
      email: customerData.email,
      contact: customerData.phone,
    },
    theme: {
      color: "#6366F1",
    },
  };
  console.log("the build optons are :", options);
  
  const razorpay = new (window as any).Razorpay(options);
  razorpay.open();





