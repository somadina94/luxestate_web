"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { propertyService } from "@/services";
import { AuthState, RootState, useAppSelector } from "@/store";
import { toast } from "sonner";
import { UploadIcon } from "lucide-react";
import IconButton from "../atoms/IconButton";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
export default function AddImage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const { id } = useParams();
  const { access_token } = useAppSelector(
    (state: RootState) => state.auth as AuthState,
  );
  const handleImageUpload = async () => {
    setIsLoading(true);
    if (!selectedFile) {
      toast.error("Please select an image");
      setIsLoading(false);
      return;
    }
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("alt_text", "Image of the property");
    formData.append("is_primary", "false");
    formData.append("order_index", "0");
    const res = await propertyService.uploadPhoto(
      Number(id),
      formData,
      access_token || "",
    );
    if (res.status === 200 || res.status === 201) {
      toast.success("Image uploaded successfully");
      router.back();
    } else {
      const detail = (res.data as { detail?: string | Array<{ msg?: string }> })
        ?.detail;
      const message = Array.isArray(detail)
        ? detail
            .map((d) => d.msg)
            .filter(Boolean)
            .join(", ") || "Failed to upload image"
        : (detail as string) ||
          (res as { message?: string }).message ||
          "Failed to upload image";
      toast.error(message);
    }
    setIsLoading(false);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };
  return (
    <Card className="w-full max-w-xl mx-auto">
      <CardHeader>
        <CardTitle>Add Image</CardTitle>
      </CardHeader>
      <CardContent>
        <Image
          src={
            previewUrl ||
            "https://images.unsplash.com/photo-1760434875920-2b7a79ea163a?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          }
          alt="Add Image"
          width={800}
          height={600}
          className="rounded-lg w-full h-full object-cover"
        />
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <Input
          type="file"
          onChange={handleImageSelect}
          accept="image/*"
          className="w-full"
        />
        <IconButton
          title="Upload Image"
          Icon={UploadIcon}
          onClick={handleImageUpload}
          className="w-full"
          disabled={isLoading}
          isLoading={isLoading}
        />
      </CardFooter>
    </Card>
  );
}
