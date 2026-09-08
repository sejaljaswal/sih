"use server";

import { getLocale } from "next-intl/server";
import { redirect } from "next/navigation";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import {
  loginSchema,
  registerSchema,
  type LoginInput,
  type RegisterInput,
} from "@/lib/schemas/auth";

type ActionResult<T = undefined> =
  | { ok: true; data: T }
  | { ok: false; code: string; messageKey: string };

// ARCHITECTURE-V2 §2.1: Supabase phone OTP needs a paid SMS provider, so the
// login field is a phone number but the plumbing is ordinary email/password —
// the app appends this fixed domain and never shows it to the user.
const SAHAAYAK_EMAIL_DOMAIN = "sahaayak.app";

function emailForPhone(phone: string) {
  return `${phone}@${SAHAAYAK_EMAIL_DOMAIN}`;
}

function homePathForRole(role: string) {
  switch (role) {
    case "CUSTOMER":
      return "/customer/home";
    case "WORKER":
      return "/worker/dashboard";
    case "SOCIETY_ADMIN":
      return "/society/overview";
    case "FEDERATION_ADMIN":
    case "SUPER_ADMIN":
      return "/federation/overview";
    default:
      return "/";
  }
}

async function signInAndRedirect(email: string, password: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.session) {
    return {
      ok: false,
      code: error?.code ?? "invalid_credentials",
      messageKey: "auth.errors.invalid_credentials",
    };
  }

  const role = data.session.user.app_metadata.role as string | undefined;
  const locale = await getLocale();
  redirect(`/${locale}${homePathForRole(role ?? "")}`);
}

// Self-registration is CUSTOMER-only. Workers register through the (larger)
// worker-onboarding flow (PRD §7.2); society/federation admin accounts are
// created by a super admin, not self-served.
export async function registerCustomer(input: RegisterInput): Promise<ActionResult> {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, code: "validation_error", messageKey: "auth.errors.invalid_input" };
  }

  const { phone, fullName, password, preferredLanguage } = parsed.data;
  const email = emailForPhone(phone);

  // Service-role only (CLAUDE.md rule #3) — sets app_metadata at creation so
  // role/phone/etc. land in the JWT immediately and the on_auth_user_created
  // trigger can provision the matching `profiles` row atomically.
  const admin = createServiceClient();
  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    app_metadata: {
      role: "CUSTOMER",
      phone,
      full_name: fullName,
      preferred_language: preferredLanguage,
    },
  });

  if (createError || !created.user) {
    const code = createError?.code ?? "unknown";
    const messageKey =
      code === "email_exists" ? "auth.errors.phone_already_registered" : "auth.errors.register_failed";
    return { ok: false, code, messageKey };
  }

  return signInAndRedirect(email, password);
}

export async function login(input: LoginInput): Promise<ActionResult> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, code: "validation_error", messageKey: "auth.errors.invalid_input" };
  }

  return signInAndRedirect(emailForPhone(parsed.data.phone), parsed.data.password);
}

export async function logout(): Promise<ActionResult> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  const locale = await getLocale();
  redirect(`/${locale}/login`);
}
