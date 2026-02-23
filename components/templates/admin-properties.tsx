"use client";
import { useState, useEffect, useCallback } from "react";
import PropertyItem from "../organisms/property-item";
import propertyService, {
  SearchPropertiesParams,
} from "@/services/properties/property-service";
import { Property } from "@/types";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Loading from "../atoms/loading";

export default function AdminProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minBedrooms, setMinBedrooms] = useState("");
  const [maxBedrooms, setMaxBedrooms] = useState("");
  const [minBathrooms, setMinBathrooms] = useState("");
  const [maxBathrooms, setMaxBathrooms] = useState("");
  const [propertyType, setPropertyType] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [isFeatured, setIsFeatured] = useState<boolean | null>(null);
  const [isActive, setIsActive] = useState<boolean | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(6);
  const [sortBy, setSortBy] = useState<
    | "created_at"
    | "updated_at"
    | "price"
    | "title"
    | "bedrooms"
    | "bathrooms"
    | "square_feet"
  >("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    try {
      const params: SearchPropertiesParams = {
        search_query: searchQuery || null,
        city: city || null,
        state: state || null,
        country: country || null,
        min_price: minPrice ? Number(minPrice) : null,
        max_price: maxPrice ? Number(maxPrice) : null,
        min_bedrooms: minBedrooms ? Number(minBedrooms) : null,
        max_bedrooms: maxBedrooms ? Number(maxBedrooms) : null,
        min_bathrooms: minBathrooms ? Number(minBathrooms) : null,
        max_bathrooms: maxBathrooms ? Number(maxBathrooms) : null,
        property_type: propertyType || null,
        status: status || null,
        is_featured: isFeatured,
        is_active: isActive,
        skip: (currentPage - 1) * limit,
        limit,
        sort_by: sortBy,
        sort_order: sortOrder,
      };

      const res = await propertyService.searchProperties(params);
      if (res.status === 200) {
        // API returns List[PropertyResponse] - just an array
        if (Array.isArray(res.data)) {
          setProperties(res.data);
        } else if (res.data?.items) {
          // Handle paginated response if API changes in future
          setProperties(res.data.items);
        } else {
          setProperties([]);
        }
      } else {
        toast.error(res.message || "Failed to fetch properties");
        setProperties([]);
      }
    } catch {
      toast.error("An error occurred while fetching properties");
      setProperties([]);
    } finally {
      setLoading(false);
    }
  }, [
    searchQuery,
    city,
    state,
    country,
    minPrice,
    maxPrice,
    minBedrooms,
    maxBedrooms,
    minBathrooms,
    maxBathrooms,
    propertyType,
    status,
    isFeatured,
    isActive,
    currentPage,
    limit,
    sortBy,
    sortOrder,
  ]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setCity("");
    setState("");
    setCountry("");
    setMinPrice("");
    setMaxPrice("");
    setMinBedrooms("");
    setMaxBedrooms("");
    setMinBathrooms("");
    setMaxBathrooms("");
    setPropertyType(null);
    setStatus(null);
    setIsFeatured(null);
    setIsActive(null);
    setCurrentPage(1);
  };

  // Since API doesn't return total count, we estimate based on results
  // If we got a full page, assume there might be more pages
  const hasMorePages = properties.length === limit;
  const estimatedTotalPages = hasMorePages ? currentPage + 1 : currentPage;
  const hasFilters =
    searchQuery ||
    city ||
    state ||
    country ||
    minPrice ||
    maxPrice ||
    minBedrooms ||
    maxBedrooms ||
    minBathrooms ||
    maxBathrooms ||
    propertyType ||
    status ||
    isFeatured !== null ||
    isActive !== null;

  return (
    <div className="flex flex-col gap-6">
      {/* Search and Filters Section */}
      <div className="flex flex-col gap-4 p-4 border rounded-lg bg-card">
        {/* Search Input */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search properties by title or description..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-9"
            />
          </div>
          {hasFilters && (
            <Button
              variant="outline"
              onClick={handleResetFilters}
              className="gap-2"
            >
              <X className="size-4" />
              Reset
            </Button>
          )}
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Location Filters */}
          <Input
            placeholder="City"
            value={city}
            onChange={(e) => {
              setCity(e.target.value);
              setCurrentPage(1);
            }}
          />
          <Input
            placeholder="State"
            value={state}
            onChange={(e) => {
              setState(e.target.value);
              setCurrentPage(1);
            }}
          />
          <Input
            placeholder="Country"
            value={country}
            onChange={(e) => {
              setCountry(e.target.value);
              setCurrentPage(1);
            }}
          />

          {/* Price Range */}
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Min Price"
              value={minPrice}
              onChange={(e) => {
                setMinPrice(e.target.value);
                setCurrentPage(1);
              }}
            />
            <Input
              type="number"
              placeholder="Max Price"
              value={maxPrice}
              onChange={(e) => {
                setMaxPrice(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          {/* Bedrooms */}
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Min Bedrooms"
              value={minBedrooms}
              onChange={(e) => {
                setMinBedrooms(e.target.value);
                setCurrentPage(1);
              }}
            />
            <Input
              type="number"
              placeholder="Max Bedrooms"
              value={maxBedrooms}
              onChange={(e) => {
                setMaxBedrooms(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          {/* Bathrooms */}
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Min Bathrooms"
              value={minBathrooms}
              onChange={(e) => {
                setMinBathrooms(e.target.value);
                setCurrentPage(1);
              }}
            />
            <Input
              type="number"
              placeholder="Max Bathrooms"
              value={maxBathrooms}
              onChange={(e) => {
                setMaxBathrooms(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          {/* Property Type */}
          <Select
            value={propertyType || undefined}
            onValueChange={(value) => {
              setPropertyType(value === "all" ? null : value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Property Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="house">House</SelectItem>
              <SelectItem value="apartment">Apartment</SelectItem>
              <SelectItem value="condo">Condo</SelectItem>
              <SelectItem value="townhouse">Townhouse</SelectItem>
              <SelectItem value="land">Land</SelectItem>
              <SelectItem value="commercial">Commercial</SelectItem>
            </SelectContent>
          </Select>

          {/* Status */}
          <Select
            value={status || undefined}
            onValueChange={(value) => {
              setStatus(value === "all" ? null : value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="for_sale">For Sale</SelectItem>
              <SelectItem value="for_rent">For Rent</SelectItem>
              <SelectItem value="sold">Sold</SelectItem>
              <SelectItem value="rented">Rented</SelectItem>
            </SelectContent>
          </Select>

          {/* Featured Filter */}
          <Select
            value={isFeatured === null ? "all" : isFeatured ? "true" : "false"}
            onValueChange={(value) => {
              setIsFeatured(
                value === "all" ? null : value === "true" ? true : false,
              );
              setCurrentPage(1);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Featured" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="true">Featured</SelectItem>
              <SelectItem value="false">Not Featured</SelectItem>
            </SelectContent>
          </Select>

          {/* Active Filter */}
          <Select
            value={isActive === null ? "all" : isActive ? "true" : "false"}
            onValueChange={(value) => {
              setIsActive(
                value === "all" ? null : value === "true" ? true : false,
              );
              setCurrentPage(1);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Active Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="true">Active</SelectItem>
              <SelectItem value="false">Inactive</SelectItem>
            </SelectContent>
          </Select>

          {/* Sort By */}
          <Select
            value={sortBy}
            onValueChange={(value) => {
              setSortBy(
                value as
                  | "created_at"
                  | "updated_at"
                  | "price"
                  | "title"
                  | "bedrooms"
                  | "bathrooms"
                  | "square_feet",
              );
              setCurrentPage(1);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created_at">Created Date</SelectItem>
              <SelectItem value="updated_at">Updated Date</SelectItem>
              <SelectItem value="price">Price</SelectItem>
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="bedrooms">Bedrooms</SelectItem>
              <SelectItem value="bathrooms">Bathrooms</SelectItem>
              <SelectItem value="square_feet">Square Feet</SelectItem>
            </SelectContent>
          </Select>

          {/* Sort Order */}
          <Select
            value={sortOrder}
            onValueChange={(value) => {
              setSortOrder(value as "asc" | "desc");
              setCurrentPage(1);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Ascending</SelectItem>
              <SelectItem value="desc">Descending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results Count */}
      {!loading && (
        <div className="text-sm text-muted-foreground">
          Showing {properties.length} {hasMorePages && "+"} properties
          {hasFilters && " (filtered)"}
          {currentPage > 1 && ` - Page ${currentPage}`}
        </div>
      )}

      {/* Properties Grid */}
      {loading ? (
        <Loading />
      ) : properties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {properties.map((property) => (
            <PropertyItem key={property.id} property={property} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          No properties found. Try adjusting your filters.
        </div>
      )}

      {/* Pagination */}
      {(currentPage > 1 || hasMorePages) && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1 || loading}
          >
            <ChevronLeft className="size-4" />
            Previous
          </Button>
          <div className="flex items-center gap-1">
            {/* Show current page and a few around it */}
            {Array.from(
              { length: Math.min(5, estimatedTotalPages) },
              (_, i) => {
                let pageNum: number;
                if (estimatedTotalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= estimatedTotalPages - 2) {
                  pageNum = estimatedTotalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                if (pageNum > estimatedTotalPages) return null;
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNum)}
                    disabled={loading}
                    className={cn(
                      "min-w-10",
                      currentPage === pageNum && "ring-2 ring-primary/20",
                    )}
                  >
                    {pageNum}
                  </Button>
                );
              },
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={!hasMorePages || loading}
          >
            Next
            <ChevronRight className="size-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
