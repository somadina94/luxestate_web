import axios, { AxiosError } from "axios";

// Normalize baseURL to remove trailing slash
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "");
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout
  maxRedirects: 5, // Follow redirects (default is 5, but being explicit)
  validateStatus: (status) => {
    // Don't throw error for redirects (3xx)
    return status >= 200 && status < 400;
  },
});

class AuthService {
  async login(email: string, password: string) {
    try {
      // OAuth2PasswordRequestForm expects form data (application/x-www-form-urlencoded), not JSON
      const params = new URLSearchParams();
      params.append("username", email);
      params.append("password", password);

      const response = await axiosInstance.post(
        "auth/login",
        params.toString(),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
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
            (axiosError.response.data as { detail?: string })?.detail ||
            "Login failed",
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

  async signup(
    email: string | undefined,
    password: string | undefined,
    first_name: string | undefined,
    last_name: string | undefined,
    phone_number: string | undefined,
    role: string | undefined,
  ) {
    try {
      const requestPayload = {
        email,
        password,
        first_name,
        last_name,
        phone: phone_number, // Backend expects 'phone', not 'phone_number'
        role,
      };
      const response = await axiosInstance.post("/auth/", requestPayload, {
        timeout: 30000,
        headers: {
          "Content-Type": "application/json",
        },
      });

      return { status: response.status, data: response.data };
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      // Handle timeout specifically
      if (
        axiosError.code === "ECONNABORTED" ||
        axiosError.message.includes("timeout")
      ) {
        return {
          status: 0,
          data: null,
          message: "Request timeout - server took too long to respond",
        };
      }

      if (axiosError.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        return {
          status: axiosError.response.status,
          data: axiosError.response.data,
          message:
            (axiosError.response.data as { detail?: string })?.detail ||
            (axiosError.response.data as { message?: string })?.message ||
            "Signup failed",
        };
      } else if (axiosError.request) {
        // The request was made but no response was received
        return {
          status: 0,
          data: null,
          message: "No response from server. Please check your connection.",
        };
      } else {
        // Something happened in setting up the request
        return {
          status: 0,
          data: null,
          message: axiosError.message || "An error occurred",
        };
      }
    }
  }

  async forgotPassword(email: string | undefined) {
    //for query params
    const response = await axiosInstance.post(
      `/auth/forgot_password?email=${email}`,
    );
    return { status: response.status, data: response.data };
  }

  async resetPassword(
    new_password: string | undefined,
    confirm_password: string | undefined,
    access_token: string | undefined,
  ) {
    try {
      const response = await axiosInstance.patch(
        `/auth/reset_password?new_password=${encodeURIComponent(new_password ?? "")}&confirm_password=${encodeURIComponent(confirm_password ?? "")}&access_token=${encodeURIComponent(access_token ?? "")}`,
        undefined,
        {
          headers: { Accept: "application/json" },
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
            (axiosError.response.data as { detail?: string })?.detail ||
            (axiosError.response.data as { message?: string })?.message ||
            "Password reset failed",
        };
      }
      if (axiosError.request) {
        return {
          status: 0,
          data: null,
          message: "No response from server. Please check your connection.",
        };
      }
      return {
        status: 0,
        data: null,
        message: axiosError.message || "An error occurred",
      };
    }
  }

  async verifyLogin(otp: string) {
    try {
      const response = await axiosInstance.post(
        `/auth/verify-login/${otp}`,
        undefined,
        {
          headers: {
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
            (axiosError.response.data as { detail?: string })?.detail ||
            "Verification failed",
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
  async getUser(access_token: string) {
    try {
      const response = await axiosInstance.get("/users/", {
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
            (axiosError.response.data as { detail?: string })?.detail ||
            "Verification failed",
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

  async getAllUsers(access_token: string) {
    try {
      const response = await axiosInstance.get("/admin/users", {
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
            (axiosError.response.data as { detail?: string })?.detail ||
            "Error fetching users",
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

  async deactivateUser(access_token: string) {
    try {
      const response = await axiosInstance.delete("/users/deactivate", {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      return {
        status: response.status,
        data: response.data,
        message: response.data?.message,
      };
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
      }
      return {
        status: 0,
        data: null,
        message: axiosError.message || "An error occurred",
      };
    }
  }

  async updatePassword(
    access_token: string,
    current_password: string,
    new_password: string,
    confirm_password: string,
  ) {
    console.log(access_token, current_password, new_password, confirm_password);
    try {
      const response = await axiosInstance.patch(
        `/auth/update_password?current_password=${current_password}&new_password=${new_password}&confirm_password=${confirm_password}`,
        undefined,
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
            (axiosError.response.data as { detail?: string })?.detail ||
            "Error updating password",
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

const authService = new AuthService();
export default authService;
