"use client";
import { useState, useEffect, useCallback } from "react";
import { propertyService, SearchPropertiesParams } from "@/services";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Property } from "@/types";
import { toast } from "sonner";
import { Button } from "../ui/button";
import Loading from "../atoms/loading";
import PropertyItem from "./property-item";
import { cn } from "@/lib/utils";

export default function Featured() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(6);
  const fetchProperties = useCallback(async () => {
    setLoading(true);
    try {
      const params: SearchPropertiesParams = {
        is_featured: true,
        skip: (currentPage - 1) * limit,
        limit,
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
  }, [currentPage, limit]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const hasMorePages = properties.length === limit;
  const estimatedTotalPages = hasMorePages ? currentPage + 1 : currentPage;

  return (
    <div className="relative px-2 md:px-24 py-24">
      <div className="max-w-200 absolute mx-auto flex flex-row items-center justify-center text-center rounded-lg h-24 p-4 left-0 right-0 top-[-48] bg-[#ffc078] shadow-sm">
        <h4 className="text-2xl text-white">FEATURED PROPERTIES</h4>
      </div>
      {/* Properties Grid */}
      {loading ? (
        <Loading />
      ) : properties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-items-center items-center gap-4 mb-12">
          {properties.map((property) => (
            <PropertyItem key={property.id} property={property} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          No properties featured yet.
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
