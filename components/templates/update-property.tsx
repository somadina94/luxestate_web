"use client";
import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppSelector, RootState } from "@/store";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import propertyService from "@/services/properties/property-service";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { fetchCountries } from "@/utils";
import { Combobox } from "../ui/combobox";
import { Country, State, City } from "country-state-city";
import IconButton from "../atoms/IconButton";
import { Pencil } from "lucide-react";
import type { Property } from "@/types";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().min(1, "Price is required"),
  currency: z.string().min(1, "Currency is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zip_code: z.string().min(1, "Zip code is required"),
  country: z.string().min(1, "Country is required"),
  latitude: z.number().min(1, "Latitude is required"),
  longitude: z.number().min(1, "Longitude is required"),
  property_type: z.string().min(1, "Property type is required"),
  bedrooms: z.number().min(1, "Bedrooms is required"),
  bathrooms: z.number().min(1, "Bathrooms is required"),
  square_feet: z.number().min(1, "Square feet is required"),
  lot_size: z.number().min(1, "Lot size is required"),
  year_built: z.number().min(1, "Year built is required"),
  features: z.array(z.string()).min(1, "Features are required"),
  amenities: z.array(z.string()).min(1, "Amenities are required"),
  listing_type: z.string().min(1, "Listing type is required"),
  is_featured: z.boolean(),
});

const allCountriesCsc = Country.getAllCountries();

const PROPERTY_TYPES = [
  { label: "Apartment", value: "apartment" },
  { label: "House", value: "house" },
  { label: "Condo", value: "condo" },
  { label: "Townhouse", value: "townhouse" },
  { label: "Villa", value: "villa" },
  { label: "Penthouse", value: "penthouse" },
  { label: "Studio", value: "studio" },
];

const LISTING_TYPES = [
  { label: "Sale", value: "sale" },
  { label: "Rent", value: "rent" },
  { label: "Lease", value: "lease" },
];

const FEATURE_OPTIONS = [
  "Parking",
  "Garden",
  "Pool",
  "Balcony",
  "Garage",
  "Security",
  "Elevator",
  "Air Conditioning",
  "Heating",
  "Storage",
];

const AMENITY_OPTIONS = [
  "WiFi",
  "Gym",
  "Laundry",
  "Dishwasher",
  "Pets Allowed",
  "Furnished",
  "Wheelchair Accessible",
  "Smoke Detector",
  "Fireplace",
];

function getCountryCodeByName(name: string): string | null {
  if (!name) return null;
  const c = allCountriesCsc.find(
    (x) =>
      x.name === name ||
      (x.name && name.includes(x.name)) ||
      (x.name && x.name.includes(name)),
  );
  return c?.isoCode ?? null;
}

function propertyToFormValues(p: Property): z.infer<typeof formSchema> {
  return {
    title: p.title ?? "",
    description: p.description ?? "",
    price: typeof p.price === "number" ? p.price : 0,
    currency: p.currency ?? "USD",
    address: p.address ?? "",
    city: p.city ?? "",
    state: p.state ?? "",
    zip_code: p.zip_code ?? "",
    country: p.country ?? "",
    latitude: typeof p.latitude === "number" ? p.latitude : 0,
    longitude: typeof p.longitude === "number" ? p.longitude : 0,
    property_type: p.property_type ?? "",
    bedrooms: typeof p.bedrooms === "number" ? p.bedrooms : 0,
    bathrooms: typeof p.bathrooms === "number" ? p.bathrooms : 0,
    square_feet: typeof p.square_feet === "number" ? p.square_feet : 0,
    lot_size: typeof p.lot_size === "number" ? p.lot_size : 0,
    year_built: typeof p.year_built === "number" ? p.year_built : 0,
    features: Array.isArray(p.features) ? p.features : [],
    amenities: Array.isArray(p.amenities) ? p.amenities : [],
    listing_type: p.listing_type ?? "",
    is_featured: Boolean(p.is_featured),
  };
}

export default function UpdateProperty() {
  const params = useParams();
  const propertyId = Number(params?.id);
  const [countries, setCountries] = useState<
    { label: string; value: string }[]
  >([]);
  const [currencies, setCurrencies] = useState<
    { label: string; value: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const { access_token } = useAppSelector((state: RootState) => state.auth);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      currency: "USD",
      address: "",
      city: "",
      state: "",
      zip_code: "",
      country: "",
      latitude: 0,
      longitude: 0,
      property_type: "",
      bedrooms: 0,
      bathrooms: 0,
      square_feet: 0,
      lot_size: 0,
      year_built: 0,
      features: [],
      amenities: [],
      listing_type: "",
      is_featured: false,
    },
  });

  useEffect(() => {
    if (!propertyId || Number.isNaN(propertyId)) {
      setLoading(false);
      return;
    }
    const fetchProperty = async () => {
      setLoading(true);
      const res = await propertyService.getProperty(propertyId);
      setLoading(false);
      if (res.status === 200 && res.data) {
        form.reset(propertyToFormValues(res.data as Property));
      } else {
        toast.error(res.message ?? "Failed to load property");
      }
    };
    fetchProperty();
  }, [propertyId, form]);

  useEffect(() => {
    const fetchCountriesData = async () => {
      const res = await fetchCountries();
      if (res) {
        const countryEntries = res.map((el: { name: string }) => [
          el.name,
          { label: el.name, value: el.name },
        ]) as [string, { label: string; value: string }][];
        setCountries(Array.from(new Map(countryEntries).values()));
        const currencyEntries = res.map((el: { currencyCode: string }) => [
          el.currencyCode,
          {
            label: el.currencyCode,
            value: el.currencyCode,
          },
        ]) as [string, { label: string; value: string }][];
        setCurrencies(Array.from(new Map(currencyEntries).values()));
      }
    };
    fetchCountriesData();
  }, [setCountries, setCurrencies]);

  const selectedCountryName = form.watch("country");
  const selectedStateName = form.watch("state");
  const countryCode = getCountryCodeByName(selectedCountryName ?? "");
  const statesOfCountry = useMemo(
    () => (countryCode ? State.getStatesOfCountry(countryCode) : []),
    [countryCode],
  );
  const selectedState = statesOfCountry.find(
    (s) => s.name === selectedStateName,
  );
  const stateCode = selectedState?.isoCode ?? null;
  const citiesOfState = useMemo(
    () =>
      countryCode && stateCode
        ? City.getCitiesOfState(countryCode, stateCode)
        : [],
    [countryCode, stateCode],
  );

  useEffect(() => {
    if (
      selectedStateName &&
      statesOfCountry.length > 0 &&
      !statesOfCountry.some((s) => s.name === selectedStateName)
    ) {
      form.setValue("state", "");
      form.setValue("city", "");
    }
  }, [countryCode, form, selectedStateName, statesOfCountry]);

  useEffect(() => {
    const city = form.getValues("city");
    if (
      city &&
      citiesOfState.length > 0 &&
      !citiesOfState.some((c) => c.name === city)
    ) {
      form.setValue("city", "");
    }
  }, [stateCode, form, citiesOfState]);

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    const response = await propertyService.updateProperty(
      data,
      propertyId,
      access_token as string,
    );
    if (response.status === 200) {
      toast.success("Property updated successfully");
      router.back();
    } else {
      toast.error(response.message);
    }
  };

  const {
    formState: { isSubmitting, isValid },
  } = form;

  if (!propertyId || Number.isNaN(propertyId)) {
    return (
      <Card className="w-lg mx-auto">
        <CardContent className="pt-6">
          <p className="text-destructive">Invalid property ID.</p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="maxw-lg mx-auto">
        <CardContent className="pt-6">
          <p className="text-muted-foreground">Loading property...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Update Property</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <fieldset disabled={isSubmitting} className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Property title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        placeholder="Price"
                        value={field.value || ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? 0
                              : Number(e.target.value) || 0,
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Currency</FormLabel>
                    <FormControl>
                      <Combobox
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Select currency"
                        searchPlaceholder="Search currency..."
                        options={Array.from(
                          new Map(
                            [...currencies]
                              .filter((c) => c.value)
                              .map((c) => [
                                c.value,
                                { label: c.label, value: c.value },
                              ]),
                          ).values(),
                        ).sort((a, b) => a.label.localeCompare(b.label))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Combobox
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Select a country"
                        searchPlaceholder="Search country..."
                        options={Array.from(
                          new Map(
                            [...countries].map((el) => [
                              el.label,
                              { label: el.label, value: el.label },
                            ]),
                          ).values(),
                        ).sort((a, b) => a.label.localeCompare(b.label))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Combobox
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Select a state"
                        searchPlaceholder="Search state..."
                        options={statesOfCountry
                          .map((s) => ({ label: s.name, value: s.name }))
                          .sort((a, b) => a.label.localeCompare(b.label))}
                        disabled={
                          !selectedCountryName || statesOfCountry.length === 0
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Combobox
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Select a city"
                        searchPlaceholder="Search city..."
                        options={citiesOfState
                          .map((c) => ({ label: c.name, value: c.name }))
                          .sort((a, b) => a.label.localeCompare(b.label))}
                        disabled={
                          !selectedStateName || citiesOfState.length === 0
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="zip_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Zip code</FormLabel>
                    <FormControl>
                      <Input placeholder="Zip code" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="latitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Latitude</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="any"
                          placeholder="Latitude"
                          value={field.value || ""}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === ""
                                ? 0
                                : Number(e.target.value) || 0,
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="longitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Longitude</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="any"
                          placeholder="Longitude"
                          value={field.value || ""}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === ""
                                ? 0
                                : Number(e.target.value) || 0,
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="property_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property type</FormLabel>
                    <FormControl>
                      <Combobox
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Select property type"
                        searchPlaceholder="Search..."
                        options={PROPERTY_TYPES.map((t) => ({
                          label: t.label,
                          value: t.value,
                        }))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="listing_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Listing type</FormLabel>
                    <FormControl>
                      <Combobox
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Select listing type"
                        searchPlaceholder="Search..."
                        options={LISTING_TYPES.map((t) => ({
                          label: t.label,
                          value: t.value,
                        }))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="bedrooms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bedrooms</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          placeholder="Bedrooms"
                          value={field.value || ""}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === ""
                                ? 0
                                : Number(e.target.value) || 0,
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bathrooms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bathrooms</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          placeholder="Bathrooms"
                          value={field.value || ""}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === ""
                                ? 0
                                : Number(e.target.value) || 0,
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <FormField
                  control={form.control}
                  name="square_feet"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Square feet</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          placeholder="Square feet"
                          value={field.value || ""}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === ""
                                ? 0
                                : Number(e.target.value) || 0,
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lot_size"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lot size</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          placeholder="Lot size"
                          value={field.value || ""}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === ""
                                ? 0
                                : Number(e.target.value) || 0,
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="year_built"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year built</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1800}
                          max={new Date().getFullYear() + 1}
                          placeholder="Year built"
                          value={field.value || ""}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === ""
                                ? 0
                                : Number(e.target.value) || 0,
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="features"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Features</FormLabel>
                    <FormControl>
                      <div className="flex flex-wrap gap-3 rounded-md border p-3">
                        {FEATURE_OPTIONS.map((opt) => (
                          <div
                            key={opt}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={`feature-${opt}`}
                              checked={field.value?.includes(opt)}
                              onCheckedChange={(checked) => {
                                const next = checked
                                  ? Array.from(
                                      new Set([...(field.value || []), opt]),
                                    )
                                  : (field.value || []).filter(
                                      (v) => v !== opt,
                                    );
                                field.onChange(next);
                              }}
                            />
                            <Label
                              htmlFor={`feature-${opt}`}
                              className="cursor-pointer text-sm font-normal"
                            >
                              {opt}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amenities"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amenities</FormLabel>
                    <FormControl>
                      <div className="flex flex-wrap gap-3 rounded-md border p-3">
                        {AMENITY_OPTIONS.map((opt) => (
                          <div
                            key={opt}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={`amenity-${opt}`}
                              checked={field.value?.includes(opt)}
                              onCheckedChange={(checked) => {
                                const next = checked
                                  ? Array.from(
                                      new Set([...(field.value || []), opt]),
                                    )
                                  : (field.value || []).filter(
                                      (v) => v !== opt,
                                    );
                                field.onChange(next);
                              }}
                            />
                            <Label
                              htmlFor={`amenity-${opt}`}
                              className="cursor-pointer text-sm font-normal"
                            >
                              {opt}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="is_featured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="cursor-pointer font-normal">
                        Featured listing
                      </FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Show this property in featured sections.
                      </p>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Description"
                        rows={4}
                        className="resize-y"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </fieldset>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <IconButton
          Icon={Pencil}
          type="submit"
          onClick={form.handleSubmit(handleSubmit)}
          disabled={!isValid}
          title="Update Property"
          isLoading={isSubmitting}
        />
      </CardFooter>
    </Card>
  );
}
