import { Subscription, SubscriptionPlan } from "@/types";
import axios, { AxiosError } from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 200000,
  maxRedirects: 5,
  validateStatus: (status) => {
    return status >= 200 && status < 400;
  },
});
class SubscriptionService {
  async getSubscriptions(access_token: string) {
    try {
      const response = await axiosInstance.get(`/subscriptions/`, {
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
      return {
        status: 0,
        data: null,
        message: "No response from server. Please check your connection.",
      };
    }
  }

  async getMySubscriptions(access_token: string) {
    try {
      const response = await axiosInstance.get(`/subscriptions/user/all`, {
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
      return {
        status: 0,
        data: null,
        message: "No response from server. Please check your connection.",
      };
    }
  }

  async getMyActiveSubscription(access_token: string) {
    try {
      const response = await axiosInstance.get(`/subscriptions/user/active`, {
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
      return {
        status: 0,
        data: null,
        message: "No response from server. Please check your connection.",
      };
    }
  }

  async createSellerSubscriptionPlan(
    access_token: string,
    data: {
      name: string;
      description: string;
      price: number;
      currency: string;
      duration: number;
      duration_type: string;
      listing_limit: number;
    },
  ) {
    try {
      const response = await axiosInstance.post(
        `/seller_subscription/`,
        data,
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
          status: axiosError.response?.status,
          data: axiosError.response?.data,
        };
      }
      return {
        status: 0,
        data: null,
        message: "No response from server. Please check your connection.",
      };
    }
  }

  async getSellerSubscriptionsPlans(access_token: string) {
    try {
      const response = await axiosInstance.get(`/seller_subscription/`, {
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
      return {
        status: 0,
        data: null,
        message: "No response from server. Please check your connection.",
      };
    }
  }

  async getSellerSubscriptionPlan(
    access_token: string,
    subscription_plan_id: number,
  ) {
    try {
      const response = await axiosInstance.get(
        `/seller_subscription/${subscription_plan_id}`,
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
      return {
        status: 0,
        data: null,
        message: "No response from server. Please check your connection.",
      };
    }
  }

  async updateSellerSubscriptionPlan(
    access_token: string,
    subscription_plan_id: number,
    data: {
      name?: string;
      description?: string;
      price?: number;
      currency?: string;
      duration?: number;
      duration_type?: string;
      listing_limit?: number;
    },
  ) {
    try {
      const response = await axiosInstance.patch(
        `/seller_subscription/${subscription_plan_id}`,
        data,
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
          status: axiosError.response?.status,
          data: axiosError.response?.data,
        };
      }
      return {
        status: 0,
        data: null,
        message: "No response from server. Please check your connection.",
      };
    }
  }

  async deleteSellerSubscriptionPlan(
    access_token: string,
    subscription_plan_id: number,
  ) {
    try {
      const response = await axiosInstance.delete(
        `/seller_subscriptions/${subscription_plan_id}`,
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

  async createCheckoutSession(
    access_token: string,
    subscription_plan_id: number,
  ) {
    try {
      const response = await axiosInstance.post(
        `/stripe_checkout/`,
        {
          subscription_plan_id,
        },
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
      return {
        status: 0,
        data: null,
        message: "No response from server. Please check your connection.",
      };
    }
  }
}

const subscriptionService = new SubscriptionService();
export default subscriptionService;
