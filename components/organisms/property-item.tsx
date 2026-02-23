import { Property } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/utils/helpers";

interface propertyItemProps {
  property: Property;
}

export default function PropertyItem({ property }: propertyItemProps) {
  console.log(property.overview_image);
  return (
    <Link
      href={`/admin-dashboard/properties/${property.id}`}
      className="shadow-sm dark:bg-muted max-w-86 border rounded-lg"
    >
      <div className="flex flex-col gap-2">
        <Image
          src={
            property.overview_image && property.overview_image.length >= 10
              ? property.overview_image
              : "https://images.unsplash.com/photo-1760434875920-2b7a79ea163a?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          }
          alt={property.title}
          className="rounded-t-lg"
          width={344}
          height={360}
        />
      </div>
      <span className="block border-b px-2 text-primary">
        {property.currency} {property.price}
      </span>
      <span className="block border-b px-2">Built - {property.year_built}</span>
      <div className="flex flex-row justify-between items-center">
        <span className="block px-2 w-1/2 border-r">{property.address}</span>
        <span className="block px-2 w-1/2">
          Added on {`${formatDate(property.created_at)}`}
        </span>
      </div>
    </Link>
  );
}
