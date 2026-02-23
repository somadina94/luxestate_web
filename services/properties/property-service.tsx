import axios, { AxiosError } from "axios";
import { Property } from "@/types";

export interface SearchPropertiesParams {
  city?: string | null;
  state?: string | null;
  country?: string | null;
  zip_code?: string | null;
  min_price?: number | null;
  max_price?: number | null;
  currency?: string | null;
  property_type?: string | null;
  status?: string | null;
  min_bedrooms?: number | null;
  max_bedrooms?: number | null;
  min_bathrooms?: number | null;
  max_bathrooms?: number | null;
  min_square_feet?: number | null;
  max_square_feet?: number | null;
  min_lot_size?: number | null;
  max_lot_size?: number | null;
  min_year_built?: number | null;
  max_year_built?: number | null;
  features?: string[] | null;
  amenities?: string[] | null;
  search_query?: string | null;
  is_featured?: boolean | null;
  is_active?: boolean | null;
  skip?: number;
  limit?: number;
  sort_by?:
    | "created_at"
    | "updated_at"
    | "price"
    | "title"
    | "bedrooms"
    | "bathrooms"
    | "square_feet";
  sort_order?: "asc" | "desc";
}

// Normalize baseURL to remove trailing slash
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "");
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 200000, // 30 seconds timeout
  maxRedirects: 5, // Follow redirects (default is 5, but being explicit)
  validateStatus: (status) => {
    // Don't throw error for redirects (3xx)
    return status >= 200 && status < 400;
  },
});

class PropertyService {
  async createProperty(data: unknown, access_token: string) {
    try {
      const response = await axiosInstance.post("/properties/", data, {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
      });
      return { status: response.status, data: response.data };
    } catch (error: unknown) {
      // Extract error message from axios error response
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

  async updateProperty(
    data: Property,
    propertyId: number,
    access_token: string,
  ) {
    try {
      const response = await axiosInstance.patch(
        `/properties/${propertyId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json",
          },
        },
      );
      return { status: response.status, data: response.data };
    } catch (error: unknown) {
      // Extract error message from axios error response
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
  async uploadPhoto(
    propertyId: string | number,
    formData: FormData,
    access_token: string,
  ) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/property_images/${propertyId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
          body: formData,
        },
      );

      const data = await response.json();

      return {
        status: response.status,
        data,
      };
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
  async getPropertyImages(propertyId: number) {
    try {
      const response = await axiosInstance.get(
        `/property_images/${propertyId}`,
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

  async updateImageOrder(
    imageId: number,
    orderIndex: number,
    access_token: string,
  ) {
    try {
      const response = await axiosInstance.patch(
        `/property_images/${imageId}`,
        null, // no body
        {
          params: { order_index: orderIndex }, // ← QUERY PARAM
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        },
      );

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

  async markImagePrimary(imageId: number, access_token: string) {
    try {
      const response = await axiosInstance.patch(
        `/property_images/${imageId}/primary`,
        null,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json",
          },
        },
      );

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

  async deleteImage(imageId: number, access_token: string) {
    try {
      const response = await axiosInstance.delete(
        `/property_images/${imageId}`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        },
      );

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

  async deleteProperty(propertyId: number, access_token: string) {
    try {
      const response = await axiosInstance.delete(`/properties/${propertyId}`, {
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

  // Get /properties/agent/agent_id/
  async getPropertiesByAgent(agentId: string, access_token: string) {
    try {
      const response = await axiosInstance.get(
        `/properties/agent/${agentId}/`,
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
  async getAllProperties() {
    try {
      const response = await axiosInstance.get(`/properties/`);
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

  async searchProperties(params: SearchPropertiesParams = {}) {
    try {
      // Build query parameters, filtering out null/undefined values
      // Using a union type to allow arrays for features and amenities
      const queryParams: Record<string, string | number | boolean | string[]> =
        {};

      // Add string parameters
      if (params.city !== undefined && params.city !== null) {
        queryParams.city = params.city;
      }
      if (params.state !== undefined && params.state !== null) {
        queryParams.state = params.state;
      }
      if (params.country !== undefined && params.country !== null) {
        queryParams.country = params.country;
      }
      if (params.zip_code !== undefined && params.zip_code !== null) {
        queryParams.zip_code = params.zip_code;
      }
      if (params.currency !== undefined && params.currency !== null) {
        queryParams.currency = params.currency;
      }
      if (params.property_type !== undefined && params.property_type !== null) {
        queryParams.property_type = params.property_type;
      }
      if (params.status !== undefined && params.status !== null) {
        queryParams.status = params.status;
      }
      if (params.search_query !== undefined && params.search_query !== null) {
        queryParams.search_query = params.search_query;
      }

      // Add number parameters
      if (params.min_price !== undefined && params.min_price !== null) {
        queryParams.min_price = params.min_price;
      }
      if (params.max_price !== undefined && params.max_price !== null) {
        queryParams.max_price = params.max_price;
      }
      if (params.min_bedrooms !== undefined && params.min_bedrooms !== null) {
        queryParams.min_bedrooms = params.min_bedrooms;
      }
      if (params.max_bedrooms !== undefined && params.max_bedrooms !== null) {
        queryParams.max_bedrooms = params.max_bedrooms;
      }
      if (params.min_bathrooms !== undefined && params.min_bathrooms !== null) {
        queryParams.min_bathrooms = params.min_bathrooms;
      }
      if (params.max_bathrooms !== undefined && params.max_bathrooms !== null) {
        queryParams.max_bathrooms = params.max_bathrooms;
      }
      if (
        params.min_square_feet !== undefined &&
        params.min_square_feet !== null
      ) {
        queryParams.min_square_feet = params.min_square_feet;
      }
      if (
        params.max_square_feet !== undefined &&
        params.max_square_feet !== null
      ) {
        queryParams.max_square_feet = params.max_square_feet;
      }
      if (params.min_lot_size !== undefined && params.min_lot_size !== null) {
        queryParams.min_lot_size = params.min_lot_size;
      }
      if (params.max_lot_size !== undefined && params.max_lot_size !== null) {
        queryParams.max_lot_size = params.max_lot_size;
      }
      if (
        params.min_year_built !== undefined &&
        params.min_year_built !== null
      ) {
        queryParams.min_year_built = params.min_year_built;
      }
      if (
        params.max_year_built !== undefined &&
        params.max_year_built !== null
      ) {
        queryParams.max_year_built = params.max_year_built;
      }

      // Add boolean parameters
      if (params.is_featured !== undefined && params.is_featured !== null) {
        queryParams.is_featured = params.is_featured;
      }
      if (params.is_active !== undefined && params.is_active !== null) {
        queryParams.is_active = params.is_active;
      }

      // Add array parameters (features and amenities)
      // Axios handles arrays natively, serializing them as ?features=value1&features=value2
      if (
        params.features !== undefined &&
        params.features !== null &&
        params.features.length > 0
      ) {
        queryParams.features = params.features;
      }
      if (
        params.amenities !== undefined &&
        params.amenities !== null &&
        params.amenities.length > 0
      ) {
        queryParams.amenities = params.amenities;
      }

      // Add pagination and sorting parameters
      if (params.skip !== undefined) {
        queryParams.skip = params.skip;
      }
      if (params.limit !== undefined) {
        queryParams.limit = params.limit;
      }
      if (params.sort_by !== undefined) {
        queryParams.sort_by = params.sort_by;
      }
      if (params.sort_order !== undefined) {
        queryParams.sort_order = params.sort_order;
      }

      const response = await axiosInstance.get("/properties/search", {
        params: queryParams,
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
            "Search failed",
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
  async getProperty(propertyId: number) {
    try {
      const response = await axiosInstance.get(`/properties/${propertyId}`, {});
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
  async markAsFavorite(propertyId: number, access_token: string) {
    console.log("markAsFavorite", propertyId, access_token);
    try {
      const response = await axiosInstance.post(
        `/favorites/${propertyId}`,
        {},
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
  async removeFromFavorite(propertyId: number, access_token: string) {
    try {
      const response = await axiosInstance.delete(`/favorites/${propertyId}`, {
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
  async getMyFavorites(access_token: string) {
    try {
      const response = await axiosInstance.get(`/favorites/me`, {
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
}

const propertyService = new PropertyService();
export default propertyService;
