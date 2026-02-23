"use client";
import { useAppSelector, AuthState, RootState } from "@/store";

import { Favorite } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/utils/helpers";

interface FavoriteItemProps {
  favorite: Favorite;
}

export default function FavoriteItem({ favorite }: FavoriteItemProps) {
  const { user } = useAppSelector(
    (state: RootState) => state.auth,
  ) as AuthState;

  let path = `/properties/${favorite.property_id}`;

  if (user?.role === "buyer") {
    path = `/buyer-dashboard/properties/${favorite.property_id}`;
  } else if (user?.role === "seller") {
    path = `/seller-dashboard/properties/${favorite.property_id}`;
  } else if (user?.role === "admin") {
    path = `/admin-dashboard/properties/${favorite.property_id}`;
  }
  return (
    <Link
      href={path}
      className="shadow-sm dark:bg-muted max-w-86 border rounded-lg"
    >
      <div className="flex flex-col gap-2">
        <Image
          src={
            favorite.overview_image && favorite.overview_image.length >= 10
              ? favorite.overview_image
              : "https://images.unsplash.com/photo-1760434875920-2b7a79ea163a?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          }
          alt={favorite.address}
          className="rounded-t-lg"
          width={344}
          height={360}
        />
      </div>
      <span className="block border-b px-2 text-primary">
        {favorite.currency} {favorite.price}
      </span>
      <span className="block border-b px-2">Built - {favorite.year_built}</span>
      <div className="flex flex-row justify-between items-center">
        <span className="block px-2 w-1/2 border-r">{favorite.address}</span>
        <span className="block px-2 w-1/2">
          Added on {`${formatDate(favorite.created_at)}`}
        </span>
      </div>
    </Link>
  );
}
