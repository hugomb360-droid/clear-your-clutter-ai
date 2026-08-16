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
      pro_profiles: {
        Row: {
          company_name: string
          created_at: string
          description: string | null
          phone: string | null
          postal_codes: string[]
          service_types: string[]
          siret: string | null
          updated_at: string
          user_id: string
          verified: boolean
        }
        Insert: {
          company_name: string
          created_at?: string
          description?: string | null
          phone?: string | null
          postal_codes?: string[]
          service_types?: string[]
          siret?: string | null
          updated_at?: string
          user_id: string
          verified?: boolean
        }
        Update: {
          company_name?: string
          created_at?: string
          description?: string | null
          phone?: string | null
          postal_codes?: string[]
          service_types?: string[]
          siret?: string | null
          updated_at?: string
          user_id?: string
          verified?: boolean
        }
        Relationships: []
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
          status?: string
          surface_m2?: number | null
          updated_at?: string
          volume_m3?: number | null
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
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
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
