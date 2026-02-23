"use client";
import { useState, useEffect, useCallback } from "react";
import PropertyItem from "../organisms/property-item";
import propertyService from "@/services/properties/property-service";
import { Property } from "@/types";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import Loading from "../atoms/loading";
import { useAppSelector, RootState, AuthState } from "@/store";

export default function SellerProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const { user, access_token } = useAppSelector(
    (state: RootState) => state.auth,
  ) as AuthState;

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(3);
  const [searchQuery, setSearchQuery] = useState("");
  const skip = (currentPage - 1) * limit;

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    try {
      const res = await propertyService.getAgentProperties(
        user?.id as number,
        access_token as string,
        skip,
        limit,
      );
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
  }, [access_token, user?.id, skip, limit]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  // Local search: filter current results by title/description
  const searchLower = searchQuery.trim().toLowerCase();
  const filteredProperties =
    searchLower === ""
      ? properties
      : properties.filter(
          (p) =>
            (p.title ?? "").toLowerCase().includes(searchLower) ||
            (p.description ?? "").toLowerCase().includes(searchLower),
        );

  // Since API doesn't return total count, we estimate based on results
  // If we got a full page, assume there might be more pages
  const hasMorePages = properties.length === limit;
  const estimatedTotalPages = hasMorePages ? currentPage + 1 : currentPage;

  return (
    <div className="flex flex-col gap-6">
      {/* Search and Filters Section */}
      <div className="flex flex-col gap-4 p-4 border rounded-lg bg-card">
        {/* Search Input */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search properties by title or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>
      {/* Results Count */}
      {!loading && (
        <div className="text-sm text-muted-foreground">
          {searchLower
            ? `Showing ${filteredProperties.length} of ${properties.length} properties`
            : `Showing ${properties.length} ${hasMorePages && "+"} properties`}
        </div>
      )}

      {/* Properties Grid */}
      {loading ? (
        <Loading />
      ) : filteredProperties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-items-center items-center gap-4">
          {filteredProperties.map((property) => (
            <PropertyItem key={property.id} property={property} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          {searchLower
            ? "No properties match your search."
            : "No properties found."}
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
