"use client";

import { useEffect, useState } from "react";
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
import Loading from "../atoms/loading";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().min(0, "Price must be 0 or greater"),
  currency: z.string().length(3, "Currency must be 3 characters").default("USD"),
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

export default function UpdateSubscriptionPlanForm({
  subscriptionPlanId,
}: {
  subscriptionPlanId: number;
}) {
  const router = useRouter();
  const { access_token } = useAppSelector(
    (state: RootState) => state.auth,
  ) as AuthState;
  const [loadingPlan, setLoadingPlan] = useState(true);

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

  useEffect(() => {
    const fetchPlan = async () => {
      setLoadingPlan(true);
      const res = await subscriptionService.getSellerSubscriptionPlan(
        access_token as string,
        subscriptionPlanId,
      );
      if (res.status === 200 && res.data) {
        const plan = res.data;
        form.reset({
          name: plan.name ?? "",
          description: plan.description ?? "",
          price: plan.price ?? 0,
          currency: plan.currency ?? "USD",
          duration: plan.duration ?? 30,
          duration_type: (plan.duration_type ?? "month") as "day" | "month" | "year",
          listing_limit: plan.listing_limit ?? 30,
        });
      } else {
        toast.error("Failed to load subscription plan");
      }
      setLoadingPlan(false);
    };
    if (access_token && subscriptionPlanId) fetchPlan();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only run when id or token changes
  }, [access_token, subscriptionPlanId]);

  const handleSubmit = async (data: FormValues) => {
    const res = await subscriptionService.updateSellerSubscriptionPlan(
      access_token as string,
      subscriptionPlanId,
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
    if (res.status === 200) {
      toast.success("Subscription plan updated");
      router.push("/admin-dashboard/subscription-plans");
    } else {
      const msg =
        (res as { data?: { detail?: string } }).data?.detail ||
        (res as { message?: string }).message ||
        "Failed to update plan";
      toast.error(Array.isArray(msg) ? msg.join(", ") : msg);
    }
  };

  if (loadingPlan) return <Loading />;

  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Update subscription plan</CardTitle>
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
                {isSubmitting ? "Saving…" : "Save changes"}
              </Button>
            </fieldset>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
