"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { ticketService } from "@/services";
import { Input } from "../ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import IconButton from "../atoms/IconButton";
import { AuthState, RootState, useAppSelector } from "@/store";
import { PlusIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
});

export default function TicketForm() {
  const router = useRouter();
  const { access_token, user } = useAppSelector(
    (state: RootState) => state.auth,
  ) as AuthState;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
    },
  });

  const {
    formState: { isSubmitting, isValid },
  } = form;

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    const res = await ticketService.createTicket(data, access_token as string);
    if (res.status === 201) {
      toast.success("Ticket created successfully");
      let path = "/tickets";
      if (user?.role === "admin") {
        path = `/admin-dashboard/tickets/${res.data.id}`;
      } else if (user?.role === "buyer") {
        path = `/buyer-dashboard/tickets/${res.data.id}`;
      } else if (user?.role === "seller") {
        path = `/seller-dashboard/tickets/${res.data.id}`;
      }
      router.push(path);
      form.reset();
    } else {
      toast.error(res.message);
    }
  };

  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Create Ticket</CardTitle>
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
                      <Input placeholder="Title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <IconButton
                type="submit"
                onClick={form.handleSubmit(handleSubmit)}
                disabled={!isValid}
                title="Create Ticket"
                isLoading={isSubmitting}
                Icon={PlusIcon}
              />
            </fieldset>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
