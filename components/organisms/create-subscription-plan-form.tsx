"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { subscriptionService } from "@/services";
import { Input } from "../ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { AuthState, RootState, useAppSelector } from "@/store";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().min(0, "Price must be 0 or greater"),
  currency: z.string().length(3, "Currency must be 3 characters"),
  duration: z.number().int().min(1, "Duration must be at least 1"),
  duration_type: z.enum(["day", "month", "year"]),
  listing_limit: z.number().int().min(1, "Listing limit must be at least 1"),
});

type FormValues = z.infer<typeof formSchema>;

const DURATION_TYPES = [
  { value: "day", label: "Day" },
  { value: "month", label: "Month" },
  { value: "year", label: "Year" },
] as const;

export default function CreateSubscriptionPlanForm() {
  const router = useRouter();
  const { access_token } = useAppSelector(
    (state: RootState) => state.auth,
  ) as AuthState;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      currency: "USD",
      duration: 30,
      duration_type: "month",
      listing_limit: 30,
    },
  });

  const {
    formState: { isSubmitting, isValid },
  } = form;

  const handleSubmit = async (data: FormValues) => {
    const res = await subscriptionService.createSellerSubscriptionPlan(
      access_token as string,
      {
        name: data.name,
        description: data.description,
        price: data.price,
        currency: data.currency,
        duration: data.duration,
        duration_type: data.duration_type,
        listing_limit: data.listing_limit,
      },
    );
    if (res.status === 201) {
      toast.success("Subscription plan created");
      router.push("/admin-dashboard/subscription-plans");
      form.reset();
    } else {
      const msg =
        (res as { data?: { detail?: string } }).data?.detail ||
        (res as { message?: string }).message ||
        "Failed to create plan";
      toast.error(Array.isArray(msg) ? msg.join(", ") : msg);
    }
  };

  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Create subscription plan</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col gap-4"
          >
            <fieldset disabled={isSubmitting} className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Basic Monthly" {...field} />
                    </FormControl>
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
                        placeholder="Plan description"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          min={0}
                          {...field}
                          onChange={(e) =>
                            field.onChange(e.target.valueAsNumber ?? 0)
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
                        <Input
                          placeholder="USD"
                          maxLength={3}
                          className="uppercase"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          {...field}
                          onChange={(e) =>
                            field.onChange(e.target.valueAsNumber ?? 1)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="duration_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {DURATION_TYPES.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="listing_limit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Listing limit</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        {...field}
                        onChange={(e) =>
                          field.onChange(e.target.valueAsNumber ?? 1)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={!isValid || isSubmitting}>
                {isSubmitting ? "Creating…" : "Create plan"}
              </Button>
            </fieldset>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
