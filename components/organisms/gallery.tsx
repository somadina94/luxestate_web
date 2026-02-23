"use client";
import { useState, useEffect } from "react";
import { propertyService } from "@/services";
import { useParams } from "next/navigation";
import { PropertyImage } from "@/types";
import { toast } from "sonner";
import Image from "next/image";
import IconButton from "../atoms/IconButton";
import { PencilIcon, PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardFooter } from "../ui/card";
export default function Gallery() {
  const { id } = useParams();
  const [images, setImages] = useState<PropertyImage[]>([]);
  const router = useRouter();
  useEffect(() => {
    const fetchImages = async () => {
      const res = await propertyService.getPropertyImages(Number(id));
      if (res.status === 200) {
        setImages(res.data);
      } else {
        toast.error(res.message || "Failed to fetch images");
      }
    };
    fetchImages();
  }, [id]);
  return (
    <div className="flex flex-col gap-4 max-w-xl mx-auto">
      <header className="flex flex-row justify-between items-center">
        <h1 className="text-2xl font-bold">Gallery</h1>
        <IconButton
          title="Add Image"
          Icon={PlusIcon}
          onClick={() =>
            router.push(`/seller-dashboard/properties/${id}/gallery/add-image`)
          }
        />
      </header>
      {images.map((image) => (
        <Card key={image.id} className="relative">
          <CardContent>
            <Image
              key={image.id}
              src={image.file_url}
              alt={image.alt_text}
              width={800}
              height={600}
              className="rounded-lg cursor-pointer"
            />
          </CardContent>
          <CardFooter>
            <IconButton
              title="Update Image"
              Icon={PencilIcon}
              onClick={() =>
                router.push(
                  `/seller-dashboard/properties/${id}/gallery/edit-image/${image.id}`,
                )
              }
              className="w-full"
            />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
