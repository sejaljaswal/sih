"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { loginSchema, type LoginInput } from "@/lib/schemas/auth";
import { login } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export function LoginForm() {
  const t = useTranslations();
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { phone: "", password: "" },
  });

  function onSubmit(values: LoginInput) {
    setFormError(null);
    startTransition(async () => {
      const result = await login(values);
      if (!result.ok) {
        setFormError(t(result.messageKey));
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("auth.phone")}</FormLabel>
              <FormControl>
                <Input
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  maxLength={10}
                  {...field}
                />
              </FormControl>
              <FormMessage>
                {form.formState.errors.phone && t(form.formState.errors.phone.message as string)}
              </FormMessage>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("auth.password")}</FormLabel>
              <FormControl>
                <Input type="password" autoComplete="current-password" {...field} />
              </FormControl>
              <FormMessage>
                {form.formState.errors.password &&
                  t(form.formState.errors.password.message as string)}
              </FormMessage>
            </FormItem>
          )}
        />
        {formError && <p className="text-destructive text-sm">{formError}</p>}
        <Button type="submit" disabled={isPending}>
          {isPending ? t("auth.submitting") : t("auth.submitLogin")}
        </Button>
      </form>
    </Form>
  );
}
