"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { registerSchema, type RegisterInput } from "@/lib/schemas/auth";
import { registerCustomer } from "@/app/actions/auth";
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

export function RegisterForm() {
  const t = useTranslations();
  const locale = useLocale() as "en" | "hi" | "pa";
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      phone: "",
      fullName: "",
      password: "",
      confirmPassword: "",
      preferredLanguage: locale,
    },
  });

  function onSubmit(values: RegisterInput) {
    setFormError(null);
    startTransition(async () => {
      const result = await registerCustomer(values);
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
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("auth.fullName")}</FormLabel>
              <FormControl>
                <Input autoComplete="name" {...field} />
              </FormControl>
              <FormMessage>
                {form.formState.errors.fullName &&
                  t(form.formState.errors.fullName.message as string)}
              </FormMessage>
            </FormItem>
          )}
        />
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
                <Input type="password" autoComplete="new-password" {...field} />
              </FormControl>
              <FormMessage>
                {form.formState.errors.password &&
                  t(form.formState.errors.password.message as string)}
              </FormMessage>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("auth.confirmPassword")}</FormLabel>
              <FormControl>
                <Input type="password" autoComplete="new-password" {...field} />
              </FormControl>
              <FormMessage>
                {form.formState.errors.confirmPassword &&
                  t(form.formState.errors.confirmPassword.message as string)}
              </FormMessage>
            </FormItem>
          )}
        />
        {formError && <p className="text-destructive text-sm">{formError}</p>}
        <Button type="submit" disabled={isPending}>
          {isPending ? t("auth.submitting") : t("auth.submitRegister")}
        </Button>
      </form>
    </Form>
  );
}
