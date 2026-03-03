// website for testvaliant
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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      about_content: {
        Row: {
          created_at: string
          heading_highlight: string
          heading_line1: string
          heading_line2: string
          id: string
          paragraph1: string
          paragraph2: string
          paragraph3: string
          paragraph4: string | null
          paragraph5: string | null
          updated_at: string
          youtube_url: string
        }
        Insert: {
          created_at?: string
          heading_highlight?: string
          heading_line1?: string
          heading_line2?: string
          id?: string
          paragraph1: string
          paragraph2: string
          paragraph3: string
          paragraph4?: string | null
          paragraph5?: string | null
          updated_at?: string
          youtube_url?: string
        }
        Update: {
          created_at?: string
          heading_highlight?: string
          heading_line1?: string
          heading_line2?: string
          id?: string
          paragraph1?: string
          paragraph2?: string
          paragraph3?: string
          paragraph4?: string | null
          paragraph5?: string | null
          updated_at?: string
          youtube_url?: string
        }
        Relationships: []
      }
      about_stats: {
        Row: {
          created_at: string
          id: string
          label: string
          sort_order: number
          value: string
        }
        Insert: {
          created_at?: string
          id?: string
          label: string
          sort_order?: number
          value: string
        }
        Update: {
          created_at?: string
          id?: string
          label?: string
          sort_order?: number
          value?: string
        }
        Relationships: []
      }
      blogs: {
        Row: {
          author: string
          category: string
          content: string | null
          created_at: string
          date: string
          excerpt: string
          id: string
          image_url: string
          read_time: string
          slug: string | null
          sort_order: number
          title: string
        }
        Insert: {
          author: string
          category: string
          content?: string | null
          created_at?: string
          date: string
          excerpt: string
          id?: string
          image_url: string
          read_time: string
          slug?: string | null
          sort_order?: number
          title: string
        }
        Update: {
          author?: string
          category?: string
          content?: string | null
          created_at?: string
          date?: string
          excerpt?: string
          id?: string
          image_url?: string
          read_time?: string
          slug?: string | null
          sort_order?: number
          title?: string
        }
        Relationships: []
      }
      cta_content: {
        Row: {
          created_at: string
          description: string
          heading_highlight: string
          heading_line1: string
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          heading_highlight?: string
          heading_line1?: string
          id?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          heading_highlight?: string
          heading_line1?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      differentiators: {
        Row: {
          created_at: string
          description: string
          id: string
          sort_order: number
          title: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          sort_order?: number
          title: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          sort_order?: number
          title?: string
        }
        Relationships: []
      }
      faqs: {
        Row: {
          answer: string
          created_at: string
          id: string
          question: string
          sort_order: number
        }
        Insert: {
          answer: string
          created_at?: string
          id?: string
          question: string
          sort_order?: number
        }
        Update: {
          answer?: string
          created_at?: string
          id?: string
          question?: string
          sort_order?: number
        }
        Relationships: []
      }
      footer_content: {
        Row: {
          address: string
          copyright_text: string
          created_at: string
          email: string
          id: string
          phone: string
          tagline: string
          updated_at: string
        }
        Insert: {
          address?: string
          copyright_text?: string
          created_at?: string
          email?: string
          id?: string
          phone?: string
          tagline?: string
          updated_at?: string
        }
        Update: {
          address?: string
          copyright_text?: string
          created_at?: string
          email?: string
          id?: string
          phone?: string
          tagline?: string
          updated_at?: string
        }
        Relationships: []
      }
      founder_content: {
        Row: {
          bio_paragraph1: string
          bio_paragraph2: string
          created_at: string
          id: string
          image_url: string
          name: string
          quote: string
          title: string
          updated_at: string
        }
        Insert: {
          bio_paragraph1: string
          bio_paragraph2: string
          created_at?: string
          id?: string
          image_url: string
          name?: string
          quote: string
          title?: string
          updated_at?: string
        }
        Update: {
          bio_paragraph1?: string
          bio_paragraph2?: string
          created_at?: string
          id?: string
          image_url?: string
          name?: string
          quote?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      gallery_images: {
        Row: {
          alt_text: string | null
          created_at: string
          id: string
          image_url: string
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          id?: string
          image_url: string
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          id?: string
          image_url?: string
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      google_reviews: {
        Row: {
          created_at: string
          id: string
          is_visible: boolean
          rating: number
          review_date: string
          review_text: string
          reviewer_image_url: string | null
          reviewer_name: string
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_visible?: boolean
          rating: number
          review_date: string
          review_text: string
          reviewer_image_url?: string | null
          reviewer_name: string
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_visible?: boolean
          rating?: number
          review_date?: string
          review_text?: string
          reviewer_image_url?: string | null
          reviewer_name?: string
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      google_reviews_settings: {
        Row: {
          created_at: string
          embed_code: string | null
          google_place_id: string | null
          id: string
          section_title: string
          total_reviews_count: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          embed_code?: string | null
          google_place_id?: string | null
          id?: string
          section_title?: string
          total_reviews_count?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          embed_code?: string | null
          google_place_id?: string | null
          id?: string
          section_title?: string
          total_reviews_count?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      hero_content: {
        Row: {
          badge_text: string
          created_at: string
          description: string
          explainer_line: string
          heading_highlight: string
          heading_line1: string
          heading_line2: string
          id: string
          micro_text: string
          subline: string
          updated_at: string
        }
        Insert: {
          badge_text?: string
          created_at?: string
          description: string
          explainer_line?: string
          heading_highlight?: string
          heading_line1?: string
          heading_line2?: string
          id?: string
          micro_text?: string
          subline?: string
          updated_at?: string
        }
        Update: {
          badge_text?: string
          created_at?: string
          description?: string
          explainer_line?: string
          heading_highlight?: string
          heading_line1?: string
          heading_line2?: string
          id?: string
          micro_text?: string
          subline?: string
          updated_at?: string
        }
        Relationships: []
      }
      hero_images: {
        Row: {
          alt: string
          created_at: string
          id: string
          sort_order: number
          src: string
        }
        Insert: {
          alt: string
          created_at?: string
          id?: string
          sort_order?: number
          src: string
        }
        Update: {
          alt?: string
          created_at?: string
          id?: string
          sort_order?: number
          src?: string
        }
        Relationships: []
      }
      inquiries: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          phone: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          phone: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string
        }
        Relationships: []
      }
      learner_tracks: {
        Row: {
          created_at: string
          id: string
          sort_order: number
          title: string
          youtube_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          sort_order?: number
          title: string
          youtube_id: string
        }
        Update: {
          created_at?: string
          id?: string
          sort_order?: number
          title?: string
          youtube_id?: string
        }
        Relationships: []
      }
      open_learning_tracks: {
        Row: {
          bottom_text: string | null
          channel_name: string | null
          channel_url: string | null
          content: string | null
          created_at: string
          cta_link: string | null
          cta_text: string | null
          how_we_learn_content: string
          how_we_learn_title: string
          id: string
          image_url: string | null
          intro_text: string
          slug: string | null
          sort_order: number
          title: string
          updated_at: string
          why_matters_content: string
          why_matters_title: string
          youtube_id: string
        }
        Insert: {
          bottom_text?: string | null
          channel_name?: string | null
          channel_url?: string | null
          content?: string | null
          created_at?: string
          cta_link?: string | null
          cta_text?: string | null
          how_we_learn_content: string
          how_we_learn_title?: string
          id?: string
          image_url?: string | null
          intro_text: string
          slug?: string | null
          sort_order?: number
          title: string
          updated_at?: string
          why_matters_content: string
          why_matters_title?: string
          youtube_id: string
        }
        Update: {
          bottom_text?: string | null
          channel_name?: string | null
          channel_url?: string | null
          content?: string | null
          created_at?: string
          cta_link?: string | null
          cta_text?: string | null
          how_we_learn_content?: string
          how_we_learn_title?: string
          id?: string
          image_url?: string | null
          intro_text?: string
          slug?: string | null
          sort_order?: number
          title?: string
          updated_at?: string
          why_matters_content?: string
          why_matters_title?: string
          youtube_id?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          created_at: string
          id: string
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          updated_at?: string
          value: Json
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      social_links: {
        Row: {
          created_at: string
          id: string
          platform: string
          sort_order: number
          url: string
        }
        Insert: {
          created_at?: string
          id?: string
          platform: string
          sort_order?: number
          url: string
        }
        Update: {
          created_at?: string
          id?: string
          platform?: string
          sort_order?: number
          url?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          created_at: string
          id: string
          image_url: string
          name: string
          role: string
          role_color: string | null
          sort_order: number
          story: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_url: string
          name: string
          role: string
          role_color?: string | null
          sort_order?: number
          story: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string
          name?: string
          role?: string
          role_color?: string | null
          sort_order?: number
          story?: string
        }
        Relationships: []
      }
      testimonials_settings: {
        Row: {
          created_at: string
          id: string
          updated_at: string
          youtube_url: string
        }
        Insert: {
          created_at?: string
          id?: string
          updated_at?: string
          youtube_url?: string
        }
        Update: {
          created_at?: string
          id?: string
          updated_at?: string
          youtube_url?: string
        }
        Relationships: []
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
      youtube_channels: {
        Row: {
          color_from: string
          color_to: string
          created_at: string
          description: string
          id: string
          name: string
          sort_order: number
          thumbnail: string
          url: string
        }
        Insert: {
          color_from?: string
          color_to?: string
          created_at?: string
          description: string
          id?: string
          name: string
          sort_order?: number
          thumbnail: string
          url: string
        }
        Update: {
          color_from?: string
          color_to?: string
          created_at?: string
          description?: string
          id?: string
          name?: string
          sort_order?: number
          thumbnail?: string
          url?: string
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
    }
    Enums: {
      app_role: "admin" | "user"
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
      app_role: ["admin", "user"],
    },
  },
} as const

