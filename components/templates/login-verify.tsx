"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { authService } from "@/services";
import { useAppDispatch, login } from "@/store";
import { setAuthCookie } from "@/lib/auth-cookie";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import IconButton from "../atoms/IconButton";

const formSchema = z.object({
  otp: z.string().length(6, "Enter the 6-digit code from your email"),
});

export default function LoginVerify() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      otp: "",
    },
  });

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    const response = await authService.verifyLogin(data.otp);

    if (response.status === 200 && response.data) {
      const accessToken = (response.data as { access_token?: string })
        ?.access_token;
      if (accessToken) {
        dispatch(login(accessToken));
        setAuthCookie(accessToken);
        const userResponse = await authService.getUser(accessToken);
        if (userResponse.status === 200 && userResponse.data) {
          dispatch(login(response.data));
        }
        toast.success("Login verified successfully");
        form.reset();
        let path = "/";
        if (userResponse.data.role === "admin") {
          path = "/admin-dashboard";
        } else if (userResponse.data.role === "buyer") {
          path = "/buyer-dashboard";
        } else if (userResponse.data.role === "seller") {
          path = "/seller-dashboard";
        }
        router.push(path);
      } else {
        toast.error("Invalid response from server");
      }
    } else {
      toast.error(
        (response as { message?: string }).message || "Verification failed",
      );
    }
  };

  const {
    formState: { isSubmitting, isValid },
  } = form;

  return (
    <div className="max-w-120 mx-auto my-24 p-2">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Verify login</CardTitle>
          <CardDescription>
            Enter the 6-digit code we sent to your email
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <fieldset disabled={isSubmitting} className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Verification code</FormLabel>
                      <FormControl>
                        <InputOTP
                          maxLength={6}
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                          containerClassName="justify-center"
                        >
                          <InputOTPGroup className="gap-1 sm:gap-2">
                            {Array.from({ length: 6 }).map((_, i) => (
                              <InputOTPSlot key={i} index={i} />
                            ))}
                          </InputOTPGroup>
                        </InputOTP>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <IconButton
                  Icon={ShieldCheck}
                  title="VERIFY"
                  type="submit"
                  disabled={!isValid || isSubmitting}
                  isLoading={isSubmitting}
                />
              </fieldset>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <p>
            Didn&apos;t receive the code?{" "}
            <Link href="/login" className="text-primary">
              Back to login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
