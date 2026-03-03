"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { chatService, propertyService } from "@/services";
import { useAppSelector, RootState, AuthState } from "@/store";
import { Favorite, Property } from "@/types";
import { formatDate } from "@/utils/helpers";
import { formatAmount } from "@/utils/helpers";
import { toast } from "sonner";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { PropertyImage } from "@/types";
import {
  BedDoubleIcon,
  HouseIcon,
  ShowerHeadIcon,
  RulerDimensionLine,
  PencilIcon,
  TrashIcon,
  StarIcon,
  MailIcon,
  ImageIcon,
} from "lucide-react";
import IconButton from "@/components/atoms/IconButton";
import Loading from "../atoms/loading";

export default function PropertyDetail() {
  const { id } = useParams();
  const [property, setProperty] = useState<Property | null>(null);
  const [images, setImages] = useState<PropertyImage[]>([]);
  const { user, access_token } = useAppSelector(
    (state: RootState) => state.auth as AuthState,
  );
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [primaryImage, setPrimaryImage] = useState<string | null>(
    images[0]?.file_url ||
      "https://images.unsplash.com/photo-1760434875920-2b7a79ea163a?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isContactingAgent, setIsContactingAgent] = useState<boolean>(false);
  const router = useRouter();
  const [isDeletingProperty, setIsDeletingProperty] = useState<boolean>(false);
  useEffect(() => {
    async function fetchProperty() {
      setIsLoading(true);
      const res = await propertyService.getProperty(Number(id));
      if (res.status === 200) {
        setProperty(res.data);
      } else {
        toast.error(res.message || "Failed to fetch property");
      }
      setIsLoading(false);
    }
    const fetchImages = async () => {
      const res = await propertyService.getPropertyImages(Number(id));
      if (res.status === 200) {
        setImages(res.data);
        setPrimaryImage(res.data[0]?.file_url || null);
      } else {
        toast.error(res.message || "Failed to fetch images");
      }
    };
    const fetchFavorites = async () => {
      const res = await propertyService.getMyFavorites(access_token as string);
      if (res.status === 200) {
        const favorite = res.data.some(
          (prop: Favorite) =>
            prop.property_id === Number(id) && user?.id === prop.user_id,
        );
        if (favorite) {
          setIsFavorite(true);
        }
      }
    };

    fetchProperty();
    fetchImages();
    fetchFavorites();
  }, [id, access_token, user?.id]);

  async function addToFavorite() {
    const res = await propertyService.markAsFavorite(
      Number(id),
      access_token || "",
    );
    if (res.status === 201) {
      setIsFavorite(!isFavorite);
      toast.success("Property added to favorites");
    } else {
      toast.error(res.message || "Failed to toggle favorite");
    }
  }
  async function removeFromFavorite() {
    const res = await propertyService.removeFromFavorite(
      Number(id),
      access_token || "",
    );
    if (res.status === 204) {
      setIsFavorite(false);
      toast.success("Property removed from favorites");
    } else {
      toast.error(res.message || "Failed to remove from favorites");
    }
  }

  async function handleContactAgent() {
    setIsContactingAgent(true);
    const res = await chatService.createConversation(
      {
        user_id: user?.id || 0,
        agent_id: property?.agent_id || 0,
        property_id: Number(id),
        type: "user-agent",
      },
      access_token || "",
    );
    if (res.status === 200) {
      toast.success("Agent contacted successfully");
      router.push(`/buyer-dashboard/messages/${res.data.id}`);
    } else {
      toast.error(res.message || "Failed to contact agent");
    }
    setIsContactingAgent(false);
  }

  async function deleteProperty() {
    setIsDeletingProperty(true);
    const res = await propertyService.deleteProperty(
      Number(id),
      access_token || "",
    );
    if (res.status === 204) {
      toast.success("Property deleted successfully");
      router.push(`/${user?.role}-dashboard/properties`);
    } else {
      toast.error(res.message || "Failed to delete property");
    }
    setIsDeletingProperty(false);
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col gap-4">
      <Card className="w-full max-w-xl mx-auto relative">
        <div className="absolute top-6 right-6">
          {isFavorite ? (
            <StarIcon
              className="w-6 h-6 cursor-pointer text-primary"
              onClick={removeFromFavorite}
            />
          ) : (
            <StarIcon
              className="w-6 h-6 cursor-pointer"
              onClick={addToFavorite}
            />
          )}
        </div>
        <CardHeader>
          <CardTitle className="flex flex-col gap-2">
            <span className="text-2xl font-bold">{property?.title}</span>
            <span className="text-sm text-primary">
              {property?.currency} {formatAmount(property?.price || 0)}
            </span>
            <span className="text-[10px] text-gray-500">
              {property?.address}, {property?.city}, {property?.state},{" "}
              {property?.zip_code}, {property?.country}
            </span>
            <span className="text-sm text-gray-500">
              Added on {formatDate(property?.created_at || new Date())}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Image
            src={
              primaryImage ||
              "https://images.unsplash.com/photo-1760434875920-2b7a79ea163a?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            }
            alt={property?.title || "Property Image"}
            width={600}
            height={320}
            className="rounded-lg"
          />
        </CardContent>
        <CardFooter className="flex flex-row gap-2 overflow-x-scroll">
          {images.map((image) => (
            <Image
              key={image.id}
              src={image.file_url}
              alt={image.alt_text}
              width={100}
              height={100}
              className="rounded-lg cursor-pointer"
              onClick={() => setPrimaryImage(image.file_url)}
            />
          ))}
        </CardFooter>
      </Card>
      {user?.role === "seller" && (
        <div className="w-full max-w-xl mx-auto flex">
          <IconButton
            title="Gallery"
            Icon={ImageIcon}
            className="w-full"
            onClick={() =>
              router.push(`/seller-dashboard/properties/${id}/gallery`)
            }
          />
        </div>
      )}
      <Card className="w-full max-w-xl mx-auto">
        <CardContent>
          <div className="grid grid-cols-2 gap-2 justify-items-start">
            <div className="flex flex-row items-center gap-2">
              <HouseIcon className="w-4 h-4" />
              <span className="text-sm text-gray-500">Property Type</span>
              <span className="text-sm text-primary">
                {property?.property_type}
              </span>
            </div>
            <div className="flex flex-row items-center gap-2">
              <BedDoubleIcon className="w-4 h-4" />
              <span className="text-sm text-gray-500">Bedrooms</span>
              <span className="text-sm text-primary">{property?.bedrooms}</span>
            </div>
            <div className="flex flex-row items-center gap-2">
              <ShowerHeadIcon className="w-4 h-4" />
              <span className="text-sm text-gray-500">Bathrooms</span>
              <span className="text-sm text-primary">
                {property?.bathrooms}
              </span>
            </div>
            <div className="flex flex-row items-center gap-2">
              <RulerDimensionLine className="w-4 h-4" />
              <span className="text-sm text-gray-500">Square Feet</span>
              <span className="text-sm text-primary">
                {property?.square_feet}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="w-full max-w-xl mx-auto">
        <CardHeader>
          <CardTitle>Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2 justify-items-start">
            {property?.features.map((feature) => (
              <div key={feature} className="flex flex-row items-center gap-2">
                <span className="text-sm text-gray-500">{feature}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card className="w-full max-w-xl mx-auto">
        <CardHeader>
          <CardTitle>Amenities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2 justify-items-start">
            {property?.amenities.map((amenity) => (
              <div key={amenity} className="flex flex-row items-center gap-2">
                <span className="text-sm text-gray-500">{amenity}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card className="w-full max-w-xl mx-auto">
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          <span className="text-sm text-gray-500">{property?.description}</span>
        </CardContent>
      </Card>
      {user?.role === "seller" && (
        <Card className="w-full max-w-xl mx-auto">
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-row gap-2 justify-between">
              <IconButton
                title="Update Property"
                Icon={PencilIcon}
                onClick={() =>
                  router.push(
                    `/seller-dashboard/properties/${property?.id}/update-property`,
                  )
                }
              />
              <IconButton
                title="Delete Property"
                Icon={TrashIcon}
                variant="destructive"
                onClick={deleteProperty}
                isLoading={isDeletingProperty}
              />
            </div>
          </CardContent>
        </Card>
      )}
      {user?.role === "buyer" && (
        <Card className="w-full max-w-xl mx-auto">
          <CardContent>
            <IconButton
              title="Contact Agent"
              Icon={MailIcon}
              className="w-full"
              onClick={handleContactAgent}
              disabled={isContactingAgent}
              isLoading={isContactingAgent}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
