"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { authService } from "@/services";
import { AuthState, RootState, useAppSelector } from "@/store";
import { toast } from "sonner";
import { FormControl, FormField, FormItem, FormLabel, Form } from "../ui/form";
import { Input } from "../ui/input";
import IconButton from "../atoms/IconButton";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Lock } from "lucide-react";

const formSchema = z
  .object({
    current_password: z
      .string()
      .min(6, "Current password must be at least 6 characters"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirm_password: z
      .string()
      .min(6, "Confirm password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

export default function UpdatePasswordForm() {
  const { access_token } = useAppSelector(
    (state: RootState) => state.auth,
  ) as AuthState;
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      current_password: "",
      password: "",
      confirm_password: "",
    },
  });

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    setLoading(true);
    const response = await authService.updatePassword(
      access_token as string,
      data.current_password,
      data.password,
      data.confirm_password,
    );
    if (response.status === 200) {
      toast.success("Password updated successfully");
      form.reset();
    } else {
      //   toast.error(response.message as string);
      console.log(response);
    }
    setLoading(false);
  };

  const {
    formState: { isSubmitting, isValid },
  } = form;

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Update Password</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <fieldset disabled={loading} className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="current_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <FormControl>
                      <Input placeholder="Current Password" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input placeholder="New Password" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirm_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input placeholder="Confirm Password" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <IconButton
                Icon={Lock}
                title="Update Password"
                type="submit"
                disabled={!isValid}
                isLoading={isSubmitting}
              />
            </fieldset>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
