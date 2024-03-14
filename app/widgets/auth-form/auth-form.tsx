import { FC } from "react";
import { useRemixForm, RemixFormProvider } from "remix-hook-form";
import { Form, useNavigation } from "@remix-run/react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { Button, buttonVariants } from "~/components/ui/button";
import {
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";

const schema = zod.object({
  login: zod.string(),
  password: zod.string(),
});

type FormData = zod.infer<typeof schema>;

export const AuthFormResolver = zodResolver(schema);

export const AuthenticationForm: FC = () => {
  const form = useRemixForm<FormData>({
    mode: "onSubmit",
    resolver: AuthFormResolver,
    submitConfig: {
      action: "/action/login",
    },
  });

  const navigation = useNavigation();

  const isLoading =
    navigation.state === "submitting" || navigation.state === "loading";

  return (
    <RemixFormProvider {...form}>
      <Form className="space-y-6 w-full" onSubmit={form.handleSubmit}>
        <FormField
          control={form.control}
          name="login"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Логин</FormLabel>
              <FormControl>
                <Input
                  errored={!!fieldState.error?.message}
                  type="text"
                  placeholder=""
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Пароль</FormLabel>
              <FormControl>
                <Input
                  errored={!!fieldState.error?.message}
                  type="text"
                  placeholder=""
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          isLoading={isLoading}
          className={buttonVariants({
            variant: "primary",
            className: "w-full",
          })}
        >
          Авторизоваться
        </Button>
      </Form>
    </RemixFormProvider>
  );
};
