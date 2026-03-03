"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  useAppSelector,
  useAppDispatch,
  RootState,
  AuthState,
  setUser,
} from "@/store";
import { authService } from "@/services";
import { toast } from "sonner";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  Form,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import IconButton from "@/components/atoms/IconButton";
import { User } from "@/types";
import { useEffect, useRef } from "react";
import { Save } from "lucide-react";

const formSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

function getDefaultValues(user: User | null): FormValues {
  return {
    first_name: user?.first_name ?? "",
    last_name: user?.last_name ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
  };
}

export default function ProfileItem() {
  const dispatch = useAppDispatch();
  const { user, access_token } = useAppSelector(
    (state: RootState) => state.auth,
  ) as AuthState;
  const hasInitialized = useRef(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: getDefaultValues(user),
  });

  useEffect(() => {
    if (user?.id != null && !hasInitialized.current) {
      form.reset(getDefaultValues(user));
      hasInitialized.current = true;
    }
  }, [user, form]);

  const handleSubmit = async (data: FormValues) => {
    if (!access_token) return;
    const response = await authService.updateUser(access_token, {
      first_name: data.first_name,
      last_name: data.last_name,
      phone: data.phone || undefined,
    });
    if (response.status === 200 && response.data) {
      const updated = response.data as User;
      dispatch(setUser(updated));
      form.reset(getDefaultValues(updated));
      toast.success("Profile updated successfully");
    } else {
      toast.error((response.message as string) || "Failed to update profile");
    }
  };

  const {
    formState: { isSubmitting, isDirty },
  } = form;

  const canSubmit = !isSubmitting && isDirty;

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>My Details</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First name</FormLabel>
                  <FormControl>
                    <Input placeholder="First name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last name</FormLabel>
                  <FormControl>
                    <Input placeholder="Last name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Email"
                      disabled
                      className="bg-muted"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                  <p className="text-muted-foreground text-xs">
                    Email cannot be changed here.
                  </p>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="Phone" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-2 pt-2">
              <p className="text-muted-foreground text-sm">
                Account type: {user?.role?.toUpperCase() ?? ""}
              </p>
            </div>
            <IconButton
              Icon={Save}
              title={isSubmitting ? "Saving…" : "Save changes"}
              type="submit"
              isLoading={isSubmitting}
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
