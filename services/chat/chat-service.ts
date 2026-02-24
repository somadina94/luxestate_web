import axios, { AxiosError } from "axios";
import { Conversation } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 200000,
  maxRedirects: 5,
  validateStatus: (status) => {
    return status >= 200 && status < 400;
  },
});

class ChatService {
  async createConversation(data: Conversation, access_token: string) {
    try {
      const response = await axiosInstance.post("/chat/create", data, {
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

  async getConversations(access_token: string) {
    try {
      const response = await axiosInstance.get("/chat/conversations", {
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
  async deleteConversation(conversationId: number, access_token: string) {
    try {
      const response = await axiosInstance.delete(
        `/chat/conversations/${conversationId}`,
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

  async getUnreadCount(access_token: string) {
    try {
      const response = await axiosInstance.get("/chat/unread-count", {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      return {
        status: response.status,
        data: response.data as { unread_count: number },
      };
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        return {
          status: axiosError.response.status,
          data: { unread_count: 0 },
          message:
            (axiosError.response.data as { message?: string })?.message ||
            "An error occurred",
        };
      }
      return {
        status: 0,
        data: { unread_count: 0 },
        message: "No response from server.",
      };
    }
  }

  async getMessages(conversationId: number, access_token: string) {
    try {
      const response = await axiosInstance.get(
        `/chat/messages/${conversationId}`,
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

export const chatService = new ChatService();
