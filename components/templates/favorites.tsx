"use client";
import { useState, useEffect } from "react";
import { useAppSelector, AuthState, RootState } from "@/store";
import { Favorite } from "@/types";
import FavoriteItem from "../organisms/favorite-item";
import { propertyService } from "@/services";
import { toast } from "sonner";
import Loading from "../atoms/loading";

export default function Favorites() {
  const { access_token } = useAppSelector(
    (state: RootState) => state.auth as AuthState,
  );
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchFavorites = async () => {
      setLoading(true);
      const res = await propertyService.getMyFavorites(access_token as string);
      if (res.status === 200) {
        setFavorites(res.data);
      } else {
        toast.error(res.message || "Failed to fetch favorites");
      }
      setLoading(false);
    };
    fetchFavorites();
  }, [access_token]);
  if (loading) {
    return <Loading />;
  }
  if (favorites.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No favorites found.
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-items-center items-center gap-4 mb-12">
      {favorites.map((favorite) => (
        <FavoriteItem key={favorite.id} favorite={favorite} />
      ))}
    </div>
  );
}
