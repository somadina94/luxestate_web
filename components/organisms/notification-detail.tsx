"use client";
import { useParams } from "next/navigation";
import { notificationService } from "@/services";
import { useAppSelector, RootState, AuthState } from "@/store";
import { Notification } from "@/types";
import { useState, useEffect } from "react";
import Loading from "../atoms/loading";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import IconButton from "../atoms/IconButton";
import { TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NotificationDetail() {
  const { id } = useParams();
  const [notification, setNotification] = useState<Notification | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const router = useRouter();
  const { access_token } = useAppSelector(
    (state: RootState) => state.auth as AuthState,
  );
  useEffect(() => {
    const fetchNotification = async () => {
      setLoading(true);
      const res = await notificationService.getNotification(
        Number(id),
        access_token as string,
      );
      if (res.status === 200) {
        setNotification(res.data);
        // Mark as read when viewing the detail page
        const markRes = await notificationService.markRead(
          [Number(id)],
          access_token as string,
        );
        if (markRes.status >= 200 && markRes.status < 300) {
          toast.success("Notification marked as read");
          window.dispatchEvent(new CustomEvent("notification:unread-changed"));
        } else {
          toast.error(markRes.message || "Failed to mark notification as read");
        }
      } else {
        toast.error(res.message || "Failed to fetch notification");
      }
      setLoading(false);
    };
    fetchNotification();
  }, [id, access_token]);

  async function handleDeleteNotification() {
    setIsDeleting(true);
    const res = await notificationService.deleteNotification(
      Number(id),
      access_token as string,
    );

    if (res.status === 204) {
      toast.success("Notification deleted successfully");
      router.back();
    } else {
      toast.error(res.message || "Failed to delete notification");
    }
    setIsDeleting(false);
  }

  if (loading) {
    return <Loading />;
  }
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Notification Detail</h1>
      <Card>
        <CardHeader>
          <CardTitle>{notification?.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{notification?.body}</p>
        </CardContent>
        <CardFooter>
          <IconButton
            title="Delete Notification"
            Icon={TrashIcon}
            variant="destructive"
            onClick={handleDeleteNotification}
            isLoading={isDeleting}
          />
        </CardFooter>
      </Card>
    </div>
  );
}
