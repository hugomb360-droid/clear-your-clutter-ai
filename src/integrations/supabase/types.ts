export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      bids: {
        Row: {
          available_date: string | null
          created_at: string
          id: string
          message: string | null
          price: number
          pro_id: string
          quote_id: string
          status: string
        }
        Insert: {
          available_date?: string | null
          created_at?: string
          id?: string
          message?: string | null
          price: number
          pro_id: string
          quote_id: string
          status?: string
        }
        Update: {
          available_date?: string | null
          created_at?: string
          id?: string
          message?: string | null
          price?: number
          pro_id?: string
          quote_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "bids_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      disputes: {
        Row: {
          admin_note: string | null
          bid_id: string
          client_id: string
          created_at: string
          id: string
          pro_id: string
          quote_id: string
          reason: string
          resolved_at: string | null
          status: string
          updated_at: string
        }
        Insert: {
          admin_note?: string | null
          bid_id: string
          client_id: string
          created_at?: string
          id?: string
          pro_id: string
          quote_id: string
          reason: string
          resolved_at?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          admin_note?: string | null
          bid_id?: string
          client_id?: string
          created_at?: string
          id?: string
          pro_id?: string
          quote_id?: string
          reason?: string
          resolved_at?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "disputes_bid_id_fkey"
            columns: ["bid_id"]
            isOneToOne: true
            referencedRelation: "bids"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "disputes_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      mission_photos: {
        Row: {
          bid_id: string
          created_at: string
          id: string
          kind: string
          quote_id: string
          storage_path: string
          uploaded_by: string
        }
        Insert: {
          bid_id: string
          created_at?: string
          id?: string
          kind: string
          quote_id: string
          storage_path: string
          uploaded_by: string
        }
        Update: {
          bid_id?: string
          created_at?: string
          id?: string
          kind?: string
          quote_id?: string
          storage_path?: string
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "mission_photos_bid_id_fkey"
            columns: ["bid_id"]
            isOneToOne: false
            referencedRelation: "bids"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mission_photos_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      mission_reports: {
        Row: {
          bid_id: string
          created_at: string
          recycling: string
          volume_m3: number
        }
        Insert: {
          bid_id: string
          created_at?: string
          recycling: string
          volume_m3: number
        }
        Update: {
          bid_id?: string
          created_at?: string
          recycling?: string
          volume_m3?: number
        }
        Relationships: [
          {
            foreignKeyName: "mission_reports_bid_id_fkey"
            columns: ["bid_id"]
            isOneToOne: true
            referencedRelation: "bids"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount_total: number
          bid_id: string
          client_id: string
          commission_amount: number
          created_at: string
          currency: string
          environment: string
          id: string
          paid_at: string | null
          pro_amount: number
          pro_id: string
          quote_id: string
          refunded_at: string | null
          released_at: string | null
          status: string
          stripe_payment_intent_id: string | null
          stripe_session_id: string | null
          stripe_transfer_id: string | null
          transfer_error: string | null
          updated_at: string
        }
        Insert: {
          amount_total: number
          bid_id: string
          client_id: string
          commission_amount: number
          created_at?: string
          currency?: string
          environment?: string
          id?: string
          paid_at?: string | null
          pro_amount: number
          pro_id: string
          quote_id: string
          refunded_at?: string | null
          released_at?: string | null
          status?: string
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          stripe_transfer_id?: string | null
          transfer_error?: string | null
          updated_at?: string
        }
        Update: {
          amount_total?: number
          bid_id?: string
          client_id?: string
          commission_amount?: number
          created_at?: string
          currency?: string
          environment?: string
          id?: string
          paid_at?: string | null
          pro_amount?: number
          pro_id?: string
          quote_id?: string
          refunded_at?: string | null
          released_at?: string | null
          status?: string
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          stripe_transfer_id?: string | null
          transfer_error?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_bid_id_fkey"
            columns: ["bid_id"]
            isOneToOne: true
            referencedRelation: "bids"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      pro_notification_preferences: {
        Row: {
          email_enabled: boolean
          pro_id: string
          push_enabled: boolean
          updated_at: string
        }
        Insert: {
          email_enabled?: boolean
          pro_id: string
          push_enabled?: boolean
          updated_at?: string
        }
        Update: {
          email_enabled?: boolean
          pro_id?: string
          push_enabled?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pro_notification_preferences_pro_id_fkey"
            columns: ["pro_id"]
            isOneToOne: true
            referencedRelation: "pro_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      pro_notifications: {
        Row: {
          attempted_at: string | null
          attempts: number
          created_at: string
          delivery_token: string
          id: string
          pro_id: string
          push_error: string | null
          push_state: string
          quote_id: string
          read_at: string | null
          summary: Json
        }
        Insert: {
          attempted_at?: string | null
          attempts?: number
          created_at?: string
          delivery_token?: string
          id?: string
          pro_id: string
          push_error?: string | null
          push_state?: string
          quote_id: string
          read_at?: string | null
          summary: Json
        }
        Update: {
          attempted_at?: string | null
          attempts?: number
          created_at?: string
          delivery_token?: string
          id?: string
          pro_id?: string
          push_error?: string | null
          push_state?: string
          quote_id?: string
          read_at?: string | null
          summary?: Json
        }
        Relationships: [
          {
            foreignKeyName: "pro_notifications_pro_id_fkey"
            columns: ["pro_id"]
            isOneToOne: false
            referencedRelation: "pro_profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "pro_notifications_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      pro_profiles: {
        Row: {
          company_name: string
          created_at: string
          description: string | null
          payouts_enabled: boolean
          payouts_ready_at: string | null
          phone: string | null
          postal_codes: string[]
          service_types: string[]
          siret: string | null
          stripe_account_id: string | null
          updated_at: string
          user_id: string
          verified: boolean
        }
        Insert: {
          company_name: string
          created_at?: string
          description?: string | null
          payouts_enabled?: boolean
          payouts_ready_at?: string | null
          phone?: string | null
          postal_codes?: string[]
          service_types?: string[]
          siret?: string | null
          stripe_account_id?: string | null
          updated_at?: string
          user_id: string
          verified?: boolean
        }
        Update: {
          company_name?: string
          created_at?: string
          description?: string | null
          payouts_enabled?: boolean
          payouts_ready_at?: string | null
          phone?: string | null
          postal_codes?: string[]
          service_types?: string[]
          siret?: string | null
          stripe_account_id?: string | null
          updated_at?: string
          user_id?: string
          verified?: boolean
        }
        Relationships: []
      }
      pro_push_devices: {
        Row: {
          created_at: string
          id: string
          pro_id: string
          token: string
        }
        Insert: {
          created_at?: string
          id?: string
          pro_id: string
          token: string
        }
        Update: {
          created_at?: string
          id?: string
          pro_id?: string
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "pro_push_devices_pro_id_fkey"
            columns: ["pro_id"]
            isOneToOne: false
            referencedRelation: "pro_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      quote_contacts: {
        Row: {
          address: string | null
          created_at: string
          email: string | null
          full_name: string | null
          phone: string | null
          quote_id: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          phone?: string | null
          quote_id: string
        }
        Update: {
          address?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          phone?: string | null
          quote_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quote_contacts_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: true
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      quote_photos: {
        Row: {
          created_at: string
          id: string
          quote_id: string
          storage_path: string
        }
        Insert: {
          created_at?: string
          id?: string
          quote_id: string
          storage_path: string
        }
        Update: {
          created_at?: string
          id?: string
          quote_id?: string
          storage_path?: string
        }
        Relationships: [
          {
            foreignKeyName: "quote_photos_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      quotes: {
        Row: {
          ai_analysis: Json | null
          city: string | null
          client_id: string
          created_at: string
          desired_date: string | null
          floor: number
          has_elevator: boolean
          id: string
          notes: string | null
          postal_code: string
          price_max: number | null
          price_min: number | null
          property_type: string
          published_at: string | null
          status: string
          surface_m2: number | null
          updated_at: string
          volume_m3: number | null
        }
        Insert: {
          ai_analysis?: Json | null
          city?: string | null
          client_id: string
          created_at?: string
          desired_date?: string | null
          floor?: number
          has_elevator?: boolean
          id?: string
          notes?: string | null
          postal_code: string
          price_max?: number | null
          price_min?: number | null
          property_type: string
          published_at?: string | null
          status?: string
          surface_m2?: number | null
          updated_at?: string
          volume_m3?: number | null
        }
        Update: {
          ai_analysis?: Json | null
          city?: string | null
          client_id?: string
          created_at?: string
          desired_date?: string | null
          floor?: number
          has_elevator?: boolean
          id?: string
          notes?: string | null
          postal_code?: string
          price_max?: number | null
          price_min?: number | null
          property_type?: string
          published_at?: string | null
          status?: string
          surface_m2?: number | null
          updated_at?: string
          volume_m3?: number | null
        }
        Relationships: []
      }
      referral_contacts: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          organization: string
          phone: string
          profession: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          organization: string
          phone?: string
          profession: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          organization?: string
          phone?: string
          profession?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          bid_id: string
          client_id: string
          comment: string | null
          created_at: string
          id: string
          pro_id: string
          quote_id: string
          rating: number
          updated_at: string
        }
        Insert: {
          bid_id: string
          client_id: string
          comment?: string | null
          created_at?: string
          id?: string
          pro_id: string
          quote_id: string
          rating: number
          updated_at?: string
        }
        Update: {
          bid_id?: string
          client_id?: string
          comment?: string | null
          created_at?: string
          id?: string
          pro_id?: string
          quote_id?: string
          rating?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_bid_id_fkey"
            columns: ["bid_id"]
            isOneToOne: true
            referencedRelation: "bids"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      succession_details: {
        Row: {
          created_at: string
          deadline: string
          deadline_reason: string
          furniture_choice: string
          heir_present: boolean
          key_instructions: string
          quote_id: string
          remote_keys: boolean
          valuables: string
        }
        Insert: {
          created_at?: string
          deadline: string
          deadline_reason: string
          furniture_choice: string
          heir_present: boolean
          key_instructions?: string
          quote_id: string
          remote_keys: boolean
          valuables?: string
        }
        Update: {
          created_at?: string
          deadline?: string
          deadline_reason?: string
          furniture_choice?: string
          heir_present?: boolean
          key_instructions?: string
          quote_id?: string
          remote_keys?: boolean
          valuables?: string
        }
        Relationships: [
          {
            foreignKeyName: "succession_details_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: true
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_succession_request: { Args: { payload: Json }; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_assigned_quote: {
        Args: { _quote_id: string; _user_id: string }
        Returns: boolean
      }
      is_bid_client: {
        Args: { _bid_id: string; _user_id: string }
        Returns: boolean
      }
      is_bid_pro: {
        Args: { _bid_id: string; _user_id: string }
        Returns: boolean
      }
      pro_covers_postal: {
        Args: { _postal: string; _user_id: string }
        Returns: boolean
      }
      sector_response_stats: { Args: { _postal: string }; Returns: Json }
    }
    Enums: {
      app_role: "client" | "pro" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["client", "pro", "admin"],
    },
  },
} as const
