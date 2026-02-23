"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import { propertyService } from "@/services";
import { useAppSelector, AuthState, RootState } from "@/store";
import { toast } from "sonner";

import IconButton from "../atoms/IconButton";
import { CheckIcon, PencilIcon, TrashIcon } from "lucide-react";

import { Card, CardContent, CardTitle, CardHeader } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
export default function EditImage() {
  const { image_id } = useParams();
  const { access_token } = useAppSelector(
    (state: RootState) => state.auth as AuthState,
  );
  const [orderIndex, setOrderIndex] = useState<number>(0);
  const [isUpdatingOrder, setIsUpdatingOrder] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isMarkingPrimary, setIsMarkingPrimary] = useState<boolean>(false);

  const updateImageOrder = async () => {
    setIsUpdatingOrder(true);
    const res = await propertyService.updateImageOrder(
      Number(image_id),
      orderIndex,
      access_token || "",
    );
    if (res.status === 200) {
      toast.success("Image order updated successfully");
    } else {
      toast.error(res.message || "Failed to update image order");
    }
    setIsUpdatingOrder(false);
  };

  const deleteImage = async () => {
    setIsDeleting(true);
    const res = await propertyService.deleteImage(
      Number(image_id),
      access_token || "",
    );
    if (res.status === 204) {
      toast.success("Image deleted successfully");
    } else {
      toast.error(res.message || "Failed to delete image");
    }
    setIsDeleting(false);
  };

  const markImagePrimary = async () => {
    setIsMarkingPrimary(true);
    const res = await propertyService.markImagePrimary(
      Number(image_id),
      access_token || "",
    );
    if (res.status === 200) {
      toast.success("Image marked as primary successfully");
    } else {
      toast.error(res.message || "Failed to mark image as primary");
    }
    setIsMarkingPrimary(false);
  };

  return (
    <Card className="flex flex-col gap-4 max-w-xl mx-auto">
      <CardHeader>
        <CardTitle>Edit Image</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Label>Order Index</Label>
        <Input
          type="number"
          placeholder="Enter Order Index"
          value={orderIndex || ""}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setOrderIndex(parseInt(e.target.value))
          }
        />
        <IconButton
          title="Update Image Order"
          Icon={PencilIcon}
          onClick={() => updateImageOrder()}
          isLoading={isUpdatingOrder}
        />
        <IconButton
          title="Mark Image as Primary"
          Icon={CheckIcon}
          onClick={() => markImagePrimary()}
          isLoading={isMarkingPrimary}
        />
        <IconButton
          title="Delete Image"
          Icon={TrashIcon}
          onClick={() => deleteImage()}
          variant="destructive"
          isLoading={isDeleting}
        />
      </CardContent>
    </Card>
  );
}
