import axios, { AxiosError } from "axios";
import { PushSubscription } from "web-push";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 200000,
  maxRedirects: 5,
  validateStatus: (status) => {
    return status >= 200 && status < 400;
  },
});

class NotificationService {
  async getUnreadCount(access_token: string) {
    try {
      const response = await axiosInstance.get("/notifications/unread-count", {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      return { status: response.status, data: response.data };
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        return {
          status: axiosError.response.status,
          data: axiosError.response.data,
          message:
            (axiosError.response.data as { message?: string })?.message ||
            "An error occurred",
        };
      } else if (axiosError.request) {
        return {
          status: 0,
          data: null,
          message: "No response from server. Please check your connection.",
        };
      } else {
        return {
          status: 0,
          data: null,
          message: axiosError.message || "An error occurred",
        };
      }
    }
  }
  async listNotifications(access_token: string) {
    try {
      const response = await axiosInstance.get("/notifications/", {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      return { status: response.status, data: response.data };
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        return {
          status: axiosError.response.status,
          data: axiosError.response.data,
          message:
            (axiosError.response.data as { message?: string })?.message ||
            "An error occurred",
        };
      } else if (axiosError.request) {
        return {
          status: 0,
          data: null,
          message: "No response from server. Please check your connection.",
        };
      } else {
        return {
          status: 0,
          data: null,
          message: axiosError.message || "An error occurred",
        };
      }
    }
  }
  /** Request body schema: object with optional additional properties (e.g. { ids?: number[] }) */
  async markRead(ids: number[], access_token: string) {
    try {
      const body: Record<string, unknown> = { ids };
      const response = await axiosInstance.patch(
        "/notifications/read",
        body,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json",
          },
        },
      );
      return { status: response.status, data: response.data };
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        return {
          status: axiosError.response.status,
          data: axiosError.response.data,
          message:
            (axiosError.response.data as { message?: string })?.message ||
            "An error occurred",
        };
      } else if (axiosError.request) {
        return {
          status: 0,
          data: null,
          message: "No response from server. Please check your connection.",
        };
      } else {
        return {
          status: 0,
          data: null,
          message: axiosError.message || "An error occurred",
        };
      }
    }
  }

  async subscribeWebPush(
    subscription: { subscription: PushSubscription },
    access_token: string,
  ) {
    try {
      const response = await axiosInstance.post(
        "/notifications/webpush/subscribe",
        { subscription },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        },
      );
      return { status: response.status, data: response.data };
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        return {
          status: axiosError.response.status,
          data: axiosError.response.data,
          message:
            (axiosError.response.data as { message?: string })?.message ||
            "An error occurred",
        };
      } else if (axiosError.request) {
        return {
          status: 0,
          data: null,
          message: "No response from server. Please check your connection.",
        };
      } else {
        return {
          status: 0,
          data: null,
          message: axiosError.message || "An error occurred",
        };
      }
    }
  }
  async getNotification(notificationId: number, access_token: string) {
    try {
      const response = await axiosInstance.get(
        `/notifications/${notificationId}`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        },
      );
      return { status: response.status, data: response.data };
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        return {
          status: axiosError.response.status,
          data: axiosError.response.data,
          message:
            (axiosError.response.data as { message?: string })?.message ||
            "An error occurred",
        };
      } else if (axiosError.request) {
        return {
          status: 0,
          data: null,
          message: "No response from server. Please check your connection.",
        };
      } else {
        return {
          status: 0,
          data: null,
          message: axiosError.message || "An error occurred",
        };
      }
    }
  }
  async deleteNotification(notificationId: number, access_token: string) {
    try {
      const response = await axiosInstance.delete(
        `/notifications/${notificationId}`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        },
      );
      return { status: response.status, data: response.data };
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        return {
          status: axiosError.response.status,
          data: axiosError.response.data,
          message:
            (axiosError.response.data as { message?: string })?.message ||
            "An error occurred",
        };
      } else if (axiosError.request) {
        return {
          status: 0,
          data: null,
          message: "No response from server. Please check your connection.",
        };
      } else {
        return {
          status: 0,
          data: null,
          message: axiosError.message || "An error occurred",
        };
      }
    }
  }
}

const notificationService = new NotificationService();
export default notificationService;
