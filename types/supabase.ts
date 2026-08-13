// Hand-authored to match supabase/migrations/*. Once the project is linked,
// regenerate with: supabase gen types typescript --linked > types/supabase.ts

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: "user" | "admin";
          display_name: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          role?: "user" | "admin";
          display_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          role?: "user" | "admin";
          display_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      artists: {
        Row: {
          id: string;
          slug: string;
          name: string;
          portrait: string | null;
          statement: string | null;
          bio: string | null;
          links: Json;
          status: "active" | "archived";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          portrait?: string | null;
          statement?: string | null;
          bio?: string | null;
          links?: Json;
          status?: "active" | "archived";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          portrait?: string | null;
          statement?: string | null;
          bio?: string | null;
          links?: Json;
          status?: "active" | "archived";
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      movements: {
        Row: {
          id: string;
          slug: string;
          name: string;
          era: string;
          summary: string;
          blurb: string;
          hero_image: string | null;
          sort: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          era: string;
          summary: string;
          blurb: string;
          hero_image?: string | null;
          sort: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          era?: string;
          summary?: string;
          blurb?: string;
          hero_image?: string | null;
          sort?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      mediums: {
        Row: {
          id: string;
          slug: string;
          name: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
        };
        Relationships: [];
      };
      artworks: {
        Row: {
          id: string;
          slug: string;
          title: string;
          artist_id: string;
          movement_id: string;
          medium_id: string;
          year: number;
          dimensions: string;
          materials: string;
          description: string;
          price: number | null;
          currency: string;
          edition: string | null;
          status: "available" | "reserved" | "sold";
          images: Json;
          featured: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          artist_id: string;
          movement_id: string;
          medium_id: string;
          year: number;
          dimensions: string;
          materials: string;
          description?: string;
          price?: number | null;
          currency?: string;
          edition?: string | null;
          status?: "available" | "reserved" | "sold";
          images?: Json;
          featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          artist_id?: string;
          movement_id?: string;
          medium_id?: string;
          year?: number;
          dimensions?: string;
          materials?: string;
          description?: string;
          price?: number | null;
          currency?: string;
          edition?: string | null;
          status?: "available" | "reserved" | "sold";
          images?: Json;
          featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "artworks_artist_id_fkey";
            columns: ["artist_id"];
            isOneToOne: false;
            referencedRelation: "artists";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "artworks_movement_id_fkey";
            columns: ["movement_id"];
            isOneToOne: false;
            referencedRelation: "movements";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "artworks_medium_id_fkey";
            columns: ["medium_id"];
            isOneToOne: false;
            referencedRelation: "mediums";
            referencedColumns: ["id"];
          }
        ];
      };
      exhibitions: {
        Row: {
          id: string;
          slug: string;
          title: string;
          curator_note: string | null;
          artwork_ids: string[];
          hero_image: string | null;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          curator_note?: string | null;
          artwork_ids?: string[];
          hero_image?: string | null;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          curator_note?: string | null;
          artwork_ids?: string[];
          hero_image?: string | null;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      enquiries: {
        Row: {
          id: string;
          type: "purchase" | "enquiry" | "sell";
          artwork_id: string | null;
          name: string;
          email: string;
          message: string | null;
          offer: number | null;
          attachments: Json;
          status: "open" | "responded" | "closed";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          type: "purchase" | "enquiry" | "sell";
          artwork_id?: string | null;
          name: string;
          email: string;
          message?: string | null;
          offer?: number | null;
          attachments?: Json;
          status?: "open" | "responded" | "closed";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          type?: "purchase" | "enquiry" | "sell";
          artwork_id?: string | null;
          name?: string;
          email?: string;
          message?: string | null;
          offer?: number | null;
          attachments?: Json;
          status?: "open" | "responded" | "closed";
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "enquiries_artwork_id_fkey";
            columns: ["artwork_id"];
            isOneToOne: false;
            referencedRelation: "artworks";
            referencedColumns: ["id"];
          }
        ];
      };
      sell_submissions: {
        Row: {
          id: string;
          artist_name: string;
          artist_email: string;
          title: string;
          movement_id: string | null;
          medium_id: string | null;
          dimensions: string;
          asking_price: number | null;
          currency: string;
          images: Json;
          message: string | null;
          status: "pending" | "accepted" | "declined";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          artist_name: string;
          artist_email: string;
          title: string;
          movement_id?: string | null;
          medium_id?: string | null;
          dimensions: string;
          asking_price?: number | null;
          currency?: string;
          images?: Json;
          message?: string | null;
          status?: "pending" | "accepted" | "declined";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          artist_name?: string;
          artist_email?: string;
          title?: string;
          movement_id?: string | null;
          medium_id?: string | null;
          dimensions?: string;
          asking_price?: number | null;
          currency?: string;
          images?: Json;
          message?: string | null;
          status?: "pending" | "accepted" | "declined";
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "sell_submissions_movement_id_fkey";
            columns: ["movement_id"];
            isOneToOne: false;
            referencedRelation: "movements";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "sell_submissions_medium_id_fkey";
            columns: ["medium_id"];
            isOneToOne: false;
            referencedRelation: "mediums";
            referencedColumns: ["id"];
          }
        ];
      };
      posts: {
        Row: {
          id: string;
          slug: string;
          title: string;
          cover: string | null;
          body: string;
          tags: string[];
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          cover?: string | null;
          body?: string;
          tags?: string[];
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          cover?: string | null;
          body?: string;
          tags?: string[];
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
    Enums: {
      artwork_status: "available" | "reserved" | "sold";
      artist_status: "active" | "archived";
      enquiry_type: "purchase" | "enquiry" | "sell";
      enquiry_status: "open" | "responded" | "closed";
      sell_submission_status: "pending" | "accepted" | "declined";
      profile_role: "user" | "admin";
    };
    CompositeTypes: Record<string, never>;
  };
};
