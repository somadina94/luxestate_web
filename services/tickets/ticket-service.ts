import { Ticket, TicketMessage } from "@/types";
import axios, { AxiosError } from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 200000,
  maxRedirects: 5,
  validateStatus: (status) => {
    return status >= 200 && status < 400;
  },
});

class TicketService {
  async createTicket(ticket: Ticket, access_token: string) {
    try {
      const response = await axiosInstance.post("/ticket/", ticket, {
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
  async getTickets(access_token: string) {
    try {
      const response = await axiosInstance.get("/ticket/", {
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
        };
      }
    }
    return {
      status: 0,
      data: null,
      message: "No response from server. Please check your connection.",
    };
  }
  async getTicket(ticket_id: number, access_token: string) {
    try {
      const response = await axiosInstance.get(`/ticket/${ticket_id}`, {
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
        };
      }
    }
    return {
      status: 0,
      data: null,
      message: "No response from server. Please check your connection.",
    };
  }
  async getTicketMessages(ticket_id: number, access_token: string) {
    try {
      const response = await axiosInstance.get(
        `/ticket/${ticket_id}/messages`,
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
        };
      }
    }
    return {
      status: 0,
      data: null,
      message: "No response from server. Please check your connection.",
    };
  }
  async createTicketMessage(
    ticket_message: TicketMessage,
    access_token: string,
  ) {
    try {
      const response = await axiosInstance.post(
        `/ticket/message/${ticket_message.ticket_id}`,
        { message: ticket_message.message },
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
        };
      }
    }
    return {
      status: 0,
      data: null,
      message: "No response from server. Please check your connection.",
    };
  }
  async updateTicket(ticket: Ticket, access_token: string) {
    try {
      const response = await axiosInstance.patch(`/ticket/${ticket.id}`, ticket, {
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
        };
      }
    }
    return {
      status: 0,
      data: null,
      message: "No response from server. Please check your connection.",
    };
  }
  async deleteTicket(ticket_id: number, access_token: string) {
    try {
      const response = await axiosInstance.delete(`/ticket/${ticket_id}`, {
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
        };
      }
    }
    return {
      status: 0,
      data: null,
      message: "No response from server. Please check your connection.",
    };
  }
  async getUserTickets(access_token: string) {
    try {
      const response = await axiosInstance.get(`/ticket/user`, {
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
        };
      }
    }
    return {
      status: 0,
      data: null,
      message: "No response from server. Please check your connection.",
    };
  }
}

const ticketService = new TicketService();
export default ticketService;
