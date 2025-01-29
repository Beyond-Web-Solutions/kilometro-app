export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      organization_members: {
        Row: {
          created_at: string
          id: string
          is_default: boolean
          organization_id: string | null
          role: Database["public"]["Enums"]["organization_roles"]
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_default?: boolean
          organization_id?: string | null
          role?: Database["public"]["Enums"]["organization_roles"]
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_default?: boolean
          organization_id?: string | null
          role?: Database["public"]["Enums"]["organization_roles"]
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "organization_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          code: string
          created_at: string
          email: string
          id: string
          name: string
          stripe_customer_id: string
        }
        Insert: {
          code: string
          created_at?: string
          email: string
          id?: string
          name: string
          stripe_customer_id: string
        }
        Update: {
          code?: string
          created_at?: string
          email?: string
          id?: string
          name?: string
          stripe_customer_id?: string
        }
        Relationships: []
      }
      trips: {
        Row: {
          avg_speed: number | null
          codec: string | null
          distance: number | null
          end_address: string | null
          end_odometer: number | null
          end_place_id: string | null
          end_point: Json | null
          ended_at: string | null
          id: string
          is_private: boolean | null
          max_speed: number | null
          start_address: string | null
          start_odometer: number
          start_place_id: string | null
          start_point: Json
          started_at: string | null
          status: Database["public"]["Enums"]["trip_status"]
          user_id: string | null
          vehicle_id: string | null
        }
        Insert: {
          avg_speed?: number | null
          codec?: string | null
          distance?: number | null
          end_address?: string | null
          end_odometer?: number | null
          end_place_id?: string | null
          end_point?: Json | null
          ended_at?: string | null
          id?: string
          is_private?: boolean | null
          max_speed?: number | null
          start_address?: string | null
          start_odometer: number
          start_place_id?: string | null
          start_point: Json
          started_at?: string | null
          status?: Database["public"]["Enums"]["trip_status"]
          user_id?: string | null
          vehicle_id?: string | null
        }
        Update: {
          avg_speed?: number | null
          codec?: string | null
          distance?: number | null
          end_address?: string | null
          end_odometer?: number | null
          end_place_id?: string | null
          end_point?: Json | null
          ended_at?: string | null
          id?: string
          is_private?: boolean | null
          max_speed?: number | null
          start_address?: string | null
          start_odometer?: number
          start_place_id?: string | null
          start_point?: Json
          started_at?: string | null
          status?: Database["public"]["Enums"]["trip_status"]
          user_id?: string | null
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trips_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicles: {
        Row: {
          created_at: string
          id: string
          licence_plate: string
          name: string
          odometer: number
          organization_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          licence_plate: string
          name: string
          odometer?: number
          organization_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          licence_plate?: string
          name?: string
          odometer?: number
          organization_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vehicles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_default_org: {
        Args: Record<PropertyKey, never>
        Returns: Record<string, unknown>
      }
      get_org_ids_for_user: {
        Args: Record<PropertyKey, never>
        Returns: string[]
      }
      get_orgs_for_user: {
        Args: Record<PropertyKey, never>
        Returns: Record<string, unknown>[]
      }
    }
    Enums: {
      organization_roles: "driver" | "admin"
      trip_status: "done" | "ongoing"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

