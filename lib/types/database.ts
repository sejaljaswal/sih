// Hand-authored to match supabase/migrations/*.sql exactly.
//
// This was NOT produced by `supabase gen types typescript` — this environment has
// no Docker (so `supabase start` can't run) and no linked remote project. Regenerate
// for real once either exists:
//   npx supabase gen types typescript --local  > lib/types/database.ts   (local stack)
//   npx supabase gen types typescript --linked > lib/types/database.ts   (linked project)
//
// `geography(Point,4326)` columns are typed `unknown` — this mirrors what the real
// generator emits for PostGIS types, since there's no built-in Postgres->TS mapping
// for them. Read/write them through the `st_*` helpers in server actions, not directly.

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      federations: {
        Row: {
          id: string;
          name: string;
          state: string;
          code: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          state: string;
          code: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          state?: string;
          code?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      societies: {
        Row: {
          id: string;
          federation_id: string;
          name: string;
          registration_no: string;
          district: string;
          location: unknown | null;
          service_radius_km: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          federation_id: string;
          name: string;
          registration_no: string;
          district: string;
          location?: unknown | null;
          service_radius_km?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          federation_id?: string;
          name?: string;
          registration_no?: string;
          district?: string;
          location?: unknown | null;
          service_radius_km?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          phone: string;
          email: string | null;
          full_name: string;
          role: Database["public"]["Enums"]["user_role"];
          preferred_language: string;
          society_id: string | null;
          federation_id: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id: string;
          phone: string;
          email?: string | null;
          full_name: string;
          role: Database["public"]["Enums"]["user_role"];
          preferred_language?: string;
          society_id?: string | null;
          federation_id?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          phone?: string;
          email?: string | null;
          full_name?: string;
          role?: Database["public"]["Enums"]["user_role"];
          preferred_language?: string;
          society_id?: string | null;
          federation_id?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Relationships: [];
      };
      service_categories: {
        Row: {
          id: string;
          name_key: string;
          icon: string | null;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name_key: string;
          icon?: string | null;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name_key?: string;
          icon?: string | null;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      skills: {
        Row: {
          id: string;
          name_key: string;
          category_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name_key: string;
          category_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name_key?: string;
          category_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      services: {
        Row: {
          id: string;
          category_id: string;
          name_key: string;
          required_skill_id: string | null;
          default_duration_min: number;
          emergency_enabled: boolean;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          category_id: string;
          name_key: string;
          required_skill_id?: string | null;
          default_duration_min?: number;
          emergency_enabled?: boolean;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          category_id?: string;
          name_key?: string;
          required_skill_id?: string | null;
          default_duration_min?: number;
          emergency_enabled?: boolean;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      workers: {
        Row: {
          id: string;
          user_id: string;
          society_id: string;
          membership_no: string | null;
          verification_status: Database["public"]["Enums"]["verification_status"];
          base_location: unknown | null;
          service_radius_km: number;
          is_available: boolean;
          rating_avg: number;
          total_ratings: number;
          jobs_completed: number;
          jobs_last_7d: number;
          acceptance_rate: number;
          eshram_id: string | null;
          upi_vpa: string | null;
          verified_at: string | null;
          verified_by: string | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          society_id: string;
          membership_no?: string | null;
          verification_status?: Database["public"]["Enums"]["verification_status"];
          base_location?: unknown | null;
          service_radius_km?: number;
          is_available?: boolean;
          rating_avg?: number;
          total_ratings?: number;
          jobs_completed?: number;
          jobs_last_7d?: number;
          acceptance_rate?: number;
          eshram_id?: string | null;
          upi_vpa?: string | null;
          verified_at?: string | null;
          verified_by?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          society_id?: string;
          membership_no?: string | null;
          verification_status?: Database["public"]["Enums"]["verification_status"];
          base_location?: unknown | null;
          service_radius_km?: number;
          is_available?: boolean;
          rating_avg?: number;
          total_ratings?: number;
          jobs_completed?: number;
          jobs_last_7d?: number;
          acceptance_rate?: number;
          eshram_id?: string | null;
          upi_vpa?: string | null;
          verified_at?: string | null;
          verified_by?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Relationships: [];
      };
      worker_documents: {
        Row: {
          id: string;
          worker_id: string;
          doc_type: Database["public"]["Enums"]["worker_doc_type"];
          file_path: string;
          status: Database["public"]["Enums"]["document_status"];
          rejection_reason: string | null;
          reviewed_by: string | null;
          reviewed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          worker_id: string;
          doc_type: Database["public"]["Enums"]["worker_doc_type"];
          file_path: string;
          status?: Database["public"]["Enums"]["document_status"];
          rejection_reason?: string | null;
          reviewed_by?: string | null;
          reviewed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          worker_id?: string;
          doc_type?: Database["public"]["Enums"]["worker_doc_type"];
          file_path?: string;
          status?: Database["public"]["Enums"]["document_status"];
          rejection_reason?: string | null;
          reviewed_by?: string | null;
          reviewed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      worker_skills: {
        Row: {
          id: string;
          worker_id: string;
          skill_id: string;
          years_experience: number;
          society_certified: boolean;
          certificate_path: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          worker_id: string;
          skill_id: string;
          years_experience?: number;
          society_certified?: boolean;
          certificate_path?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          worker_id?: string;
          skill_id?: string;
          years_experience?: number;
          society_certified?: boolean;
          certificate_path?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      worker_availability: {
        Row: {
          id: string;
          worker_id: string;
          day_of_week: number;
          start_time: string;
          end_time: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          worker_id: string;
          day_of_week: number;
          start_time: string;
          end_time: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          worker_id?: string;
          day_of_week?: number;
          start_time?: string;
          end_time?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      society_service_rates: {
        Row: {
          id: string;
          society_id: string;
          service_id: string;
          customer_price_paise: number;
          floor_wage_paise: number;
          commission_pct: number;
          welfare_pct: number;
          platform_pct: number;
          emergency_surcharge_pct: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          society_id: string;
          service_id: string;
          customer_price_paise: number;
          floor_wage_paise: number;
          commission_pct: number;
          welfare_pct: number;
          platform_pct: number;
          emergency_surcharge_pct?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          society_id?: string;
          service_id?: string;
          customer_price_paise?: number;
          floor_wage_paise?: number;
          commission_pct?: number;
          welfare_pct?: number;
          platform_pct?: number;
          emergency_surcharge_pct?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      addresses: {
        Row: {
          id: string;
          user_id: string;
          label: string | null;
          line1: string;
          city: string;
          pincode: string;
          location: unknown;
          is_default: boolean;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          label?: string | null;
          line1: string;
          city: string;
          pincode: string;
          location: unknown;
          is_default?: boolean;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          label?: string | null;
          line1?: string;
          city?: string;
          pincode?: string;
          location?: unknown;
          is_default?: boolean;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Relationships: [];
      };
      bookings: {
        Row: {
          id: string;
          booking_code: string;
          customer_id: string;
          service_id: string;
          address_id: string;
          society_id: string;
          worker_id: string | null;
          status: Database["public"]["Enums"]["booking_status"];
          is_emergency: boolean;
          scheduled_at: string | null;
          quoted_price_paise: number;
          materials_cost_paise: number;
          final_price_paise: number | null;
          rate_snapshot: Json;
          start_otp: string | null;
          customer_notes: string | null;
          started_at: string | null;
          completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          booking_code: string;
          customer_id: string;
          service_id: string;
          address_id: string;
          society_id: string;
          worker_id?: string | null;
          status?: Database["public"]["Enums"]["booking_status"];
          is_emergency?: boolean;
          scheduled_at?: string | null;
          quoted_price_paise: number;
          materials_cost_paise?: number;
          final_price_paise?: number | null;
          rate_snapshot: Json;
          start_otp?: string | null;
          customer_notes?: string | null;
          started_at?: string | null;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          booking_code?: string;
          customer_id?: string;
          service_id?: string;
          address_id?: string;
          society_id?: string;
          worker_id?: string | null;
          status?: Database["public"]["Enums"]["booking_status"];
          is_emergency?: boolean;
          scheduled_at?: string | null;
          quoted_price_paise?: number;
          materials_cost_paise?: number;
          final_price_paise?: number | null;
          rate_snapshot?: Json;
          start_otp?: string | null;
          customer_notes?: string | null;
          started_at?: string | null;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      booking_offers: {
        Row: {
          id: string;
          booking_id: string;
          worker_id: string;
          rank_position: number;
          match_score: number;
          score_breakdown: Json;
          distance_m: number;
          response: Database["public"]["Enums"]["offer_response"];
          sent_at: string;
          expires_at: string;
          responded_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          booking_id: string;
          worker_id: string;
          rank_position: number;
          match_score: number;
          score_breakdown: Json;
          distance_m: number;
          response?: Database["public"]["Enums"]["offer_response"];
          sent_at?: string;
          expires_at: string;
          responded_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          booking_id?: string;
          worker_id?: string;
          rank_position?: number;
          match_score?: number;
          score_breakdown?: Json;
          distance_m?: number;
          response?: Database["public"]["Enums"]["offer_response"];
          sent_at?: string;
          expires_at?: string;
          responded_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      booking_status_history: {
        Row: {
          id: string;
          booking_id: string;
          from_status: Database["public"]["Enums"]["booking_status"] | null;
          to_status: Database["public"]["Enums"]["booking_status"];
          changed_by: string | null;
          reason: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          booking_id: string;
          from_status?: Database["public"]["Enums"]["booking_status"] | null;
          to_status: Database["public"]["Enums"]["booking_status"];
          changed_by?: string | null;
          reason?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          booking_id?: string;
          from_status?: Database["public"]["Enums"]["booking_status"] | null;
          to_status?: Database["public"]["Enums"]["booking_status"];
          changed_by?: string | null;
          reason?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      payments: {
        Row: {
          id: string;
          booking_id: string;
          provider: string;
          provider_order_id: string | null;
          provider_payment_id: string | null;
          amount_paise: number;
          method: Database["public"]["Enums"]["payment_method"] | null;
          status: Database["public"]["Enums"]["payment_status"];
          paid_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          booking_id: string;
          provider?: string;
          provider_order_id?: string | null;
          provider_payment_id?: string | null;
          amount_paise: number;
          method?: Database["public"]["Enums"]["payment_method"] | null;
          status?: Database["public"]["Enums"]["payment_status"];
          paid_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          booking_id?: string;
          provider?: string;
          provider_order_id?: string | null;
          provider_payment_id?: string | null;
          amount_paise?: number;
          method?: Database["public"]["Enums"]["payment_method"] | null;
          status?: Database["public"]["Enums"]["payment_status"];
          paid_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      payment_splits: {
        Row: {
          id: string;
          payment_id: string;
          worker_amount_paise: number;
          society_commission_paise: number;
          welfare_amount_paise: number;
          platform_fee_paise: number;
          calculation_snapshot: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          payment_id: string;
          worker_amount_paise: number;
          society_commission_paise: number;
          welfare_amount_paise: number;
          platform_fee_paise: number;
          calculation_snapshot: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          payment_id?: string;
          worker_amount_paise?: number;
          society_commission_paise?: number;
          welfare_amount_paise?: number;
          platform_fee_paise?: number;
          calculation_snapshot?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      invoices: {
        Row: {
          id: string;
          booking_id: string;
          invoice_no: string;
          pdf_path: string | null;
          issued_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          booking_id: string;
          invoice_no: string;
          pdf_path?: string | null;
          issued_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          booking_id?: string;
          invoice_no?: string;
          pdf_path?: string | null;
          issued_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      ratings: {
        Row: {
          id: string;
          booking_id: string;
          rated_by: string;
          rated_user: string;
          stars: number;
          tags: Json | null;
          comment: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          booking_id: string;
          rated_by: string;
          rated_user: string;
          stars: number;
          tags?: Json | null;
          comment?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          booking_id?: string;
          rated_by?: string;
          rated_user?: string;
          stars?: number;
          tags?: Json | null;
          comment?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      welfare_contributions: {
        Row: {
          id: string;
          worker_id: string;
          payment_id: string;
          amount_paise: number;
          scheme: string;
          status: Database["public"]["Enums"]["welfare_contribution_status"];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          worker_id: string;
          payment_id: string;
          amount_paise: number;
          scheme: string;
          status?: Database["public"]["Enums"]["welfare_contribution_status"];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          worker_id?: string;
          payment_id?: string;
          amount_paise?: number;
          scheme?: string;
          status?: Database["public"]["Enums"]["welfare_contribution_status"];
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      insurance_policies: {
        Row: {
          id: string;
          worker_id: string;
          scheme: string;
          policy_no: string;
          coverage_paise: number;
          valid_from: string;
          valid_to: string;
          status: Database["public"]["Enums"]["insurance_status"];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          worker_id: string;
          scheme: string;
          policy_no: string;
          coverage_paise: number;
          valid_from: string;
          valid_to: string;
          status?: Database["public"]["Enums"]["insurance_status"];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          worker_id?: string;
          scheme?: string;
          policy_no?: string;
          coverage_paise?: number;
          valid_from?: string;
          valid_to?: string;
          status?: Database["public"]["Enums"]["insurance_status"];
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      daily_demand_stats: {
        Row: {
          id: string;
          society_id: string;
          service_id: string;
          stat_date: string;
          bookings_requested: number;
          bookings_fulfilled: number;
          bookings_unfulfilled: number;
          avg_response_seconds: number | null;
          revenue_paise: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          society_id: string;
          service_id: string;
          stat_date: string;
          bookings_requested?: number;
          bookings_fulfilled?: number;
          bookings_unfulfilled?: number;
          avg_response_seconds?: number | null;
          revenue_paise?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          society_id?: string;
          service_id?: string;
          stat_date?: string;
          bookings_requested?: number;
          bookings_fulfilled?: number;
          bookings_unfulfilled?: number;
          avg_response_seconds?: number | null;
          revenue_paise?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      demand_forecasts: {
        Row: {
          id: string;
          society_id: string;
          service_id: string;
          forecast_date: string;
          predicted_bookings: number;
          lower_bound: number | null;
          upper_bound: number | null;
          workers_needed: number | null;
          model_version: string | null;
          generated_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          society_id: string;
          service_id: string;
          forecast_date: string;
          predicted_bookings: number;
          lower_bound?: number | null;
          upper_bound?: number | null;
          workers_needed?: number | null;
          model_version?: string | null;
          generated_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          society_id?: string;
          service_id?: string;
          forecast_date?: string;
          predicted_bookings?: number;
          lower_bound?: number | null;
          upper_bound?: number | null;
          workers_needed?: number | null;
          model_version?: string | null;
          generated_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: "CUSTOMER" | "WORKER" | "SOCIETY_ADMIN" | "FEDERATION_ADMIN" | "SUPER_ADMIN";
      verification_status: "PENDING" | "UNDER_REVIEW" | "VERIFIED" | "REJECTED" | "SUSPENDED";
      booking_status:
        | "REQUESTED"
        | "ASSIGNED"
        | "EN_ROUTE"
        | "ARRIVED"
        | "IN_PROGRESS"
        | "COMPLETED"
        | "PAID"
        | "CANCELLED"
        | "UNFULFILLED";
      offer_response: "PENDING" | "ACCEPTED" | "REJECTED" | "EXPIRED" | "REVOKED";
      payment_status: "CREATED" | "PENDING" | "CAPTURED" | "FAILED" | "REFUNDED";
      worker_doc_type: "ID_PROOF" | "SOCIETY_MEMBERSHIP" | "SKILL_CERTIFICATE";
      document_status: "PENDING" | "APPROVED" | "REJECTED";
      payment_method: "UPI" | "CARD";
      welfare_contribution_status: "CREDITED" | "REVERSED";
      insurance_status: "ACTIVE" | "EXPIRED" | "CANCELLED";
    };
    CompositeTypes: Record<string, never>;
  };
};
