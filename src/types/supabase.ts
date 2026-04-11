export type Json =
	| string
	| number
	| boolean
	| null
	| { [key: string]: Json | undefined }
	| Json[];

export type Database = {
	// Allows to automatically instantiate createClient with right options
	// instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
	__InternalSupabase: {
		PostgrestVersion: "14.4";
	};
	public: {
		Tables: {
			album_tracks: {
				Row: {
					album_id: string;
					track_id: string;
					track_number: number;
				};
				Insert: {
					album_id: string;
					track_id: string;
					track_number: number;
				};
				Update: {
					album_id?: string;
					track_id?: string;
					track_number?: number;
				};
				Relationships: [
					{
						foreignKeyName: "album_tracks_album_id_fkey";
						columns: ["album_id"];
						isOneToOne: false;
						referencedRelation: "albums";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "album_tracks_track_id_fkey";
						columns: ["track_id"];
						isOneToOne: false;
						referencedRelation: "tracks";
						referencedColumns: ["id"];
					},
				];
			};
			albums: {
				Row: {
					cover_path: string | null;
					created_at: string;
					description: string | null;
					id: string;
					release_date: string;
					title: string;
					updated_at: string;
				};
				Insert: {
					cover_path?: string | null;
					created_at?: string;
					description?: string | null;
					id?: string;
					release_date?: string;
					title: string;
					updated_at?: string;
				};
				Update: {
					cover_path?: string | null;
					created_at?: string;
					description?: string | null;
					id?: string;
					release_date?: string;
					title?: string;
					updated_at?: string;
				};
				Relationships: [];
			};
			artists: {
				Row: {
					bio: string | null;
					created_at: string;
					id: string;
					name: string;
					updated_at: string;
				};
				Insert: {
					bio?: string | null;
					created_at?: string;
					id?: string;
					name: string;
					updated_at?: string;
				};
				Update: {
					bio?: string | null;
					created_at?: string;
					id?: string;
					name?: string;
					updated_at?: string;
				};
				Relationships: [];
			};
			genres: {
				Row: {
					created_at: string;
					id: string;
					key: string;
					label: string;
				};
				Insert: {
					created_at?: string;
					id?: string;
					key: string;
					label: string;
				};
				Update: {
					created_at?: string;
					id?: string;
					key?: string;
					label?: string;
				};
				Relationships: [];
			};
			track_artists: {
				Row: {
					artist_id: string;
					artist_order: number;
					track_id: string;
				};
				Insert: {
					artist_id: string;
					artist_order?: number;
					track_id: string;
				};
				Update: {
					artist_id?: string;
					artist_order?: number;
					track_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "track_artists_artist_id_fkey";
						columns: ["artist_id"];
						isOneToOne: false;
						referencedRelation: "artists";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "track_artists_track_id_fkey";
						columns: ["track_id"];
						isOneToOne: false;
						referencedRelation: "tracks";
						referencedColumns: ["id"];
					},
				];
			};
			tracks: {
				Row: {
					audio_path: string;
					created_at: string;
					genre_id: string;
					id: string;
					title: string;
					updated_at: string;
				};
				Insert: {
					audio_path: string;
					created_at?: string;
					genre_id: string;
					id?: string;
					title: string;
					updated_at?: string;
				};
				Update: {
					audio_path?: string;
					created_at?: string;
					genre_id?: string;
					id?: string;
					title?: string;
					updated_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: "tracks_genre_id_fkey";
						columns: ["genre_id"];
						isOneToOne: false;
						referencedRelation: "genres";
						referencedColumns: ["id"];
					},
				];
			};
			user_roles: {
				Row: {
					id: number;
					role: Database["public"]["Enums"]["app_role"];
					user_id: string;
				};
				Insert: {
					id?: number;
					role: Database["public"]["Enums"]["app_role"];
					user_id: string;
				};
				Update: {
					id?: number;
					role?: Database["public"]["Enums"]["app_role"];
					user_id?: string;
				};
				Relationships: [];
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			_sync_album_tracks: {
				Args: { p_album_id: string; p_track_ids: string[] };
				Returns: undefined;
			};
			_sync_track_artists: {
				Args: { p_artist_ids: string[]; p_track_id: string };
				Returns: undefined;
			};
			check_role: {
				Args: {
					target_role: Database["public"]["Enums"]["app_role"];
				};
				Returns: boolean;
			};
			create_album_with_tracks: {
				Args: {
					p_cover_path?: string;
					p_description?: string;
					p_release_date?: string;
					p_title: string;
					p_track_ids?: string[];
				};
				Returns: Json;
			};
			create_track_with_artists: {
				Args: {
					p_artist_ids: string[];
					p_audio_path: string;
					p_genre_id: string;
					p_title: string;
				};
				Returns: Json;
			};
			custom_access_token_hook: {
				Args: { event: Json };
				Returns: Json;
			};
			show_limit: { Args: never; Returns: number };
			show_trgm: { Args: { "": string }; Returns: string[] };
			update_album_with_tracks: {
				Args: {
					p_cover_path?: string;
					p_description?: string;
					p_id: string;
					p_release_date?: string;
					p_title?: string;
					p_track_ids?: string[];
				};
				Returns: Json;
			};
			update_track_with_artists: {
				Args: {
					p_artist_ids?: string[];
					p_audio_path?: string;
					p_genre_id?: string;
					p_id: string;
					p_title?: string;
				};
				Returns: Json;
			};
			upsert_album_with_tracks: {
				Args: {
					p_cover_path: string;
					p_description: string;
					p_id: string;
					p_release_date: string;
					p_title: string;
					p_track_ids: string[];
				};
				Returns: Json;
			};
			upsert_tracks_with_artists: {
				Args: {
					p_artist_ids: string[];
					p_audio_path: string;
					p_genre_id: string;
					p_id: string;
					p_title: string;
				};
				Returns: Json;
			};
		};
		Enums: {
			app_role: "admin" | "user";
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
	keyof Database,
	"public"
>];

export type Tables<
	DefaultSchemaTableNameOrOptions extends
		| keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
		| { schema: keyof DatabaseWithoutInternals },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
				DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
		: never = never,
> = DefaultSchemaTableNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
			DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
			Row: infer R;
		}
		? R
		: never
	: DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
				DefaultSchema["Views"])
		? (DefaultSchema["Tables"] &
				DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
				Row: infer R;
			}
			? R
			: never
		: never;

export type TablesInsert<
	DefaultSchemaTableNameOrOptions extends
		| keyof DefaultSchema["Tables"]
		| { schema: keyof DatabaseWithoutInternals },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
		: never = never,
> = DefaultSchemaTableNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
			Insert: infer I;
		}
		? I
		: never
	: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
		? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
				Insert: infer I;
			}
			? I
			: never
		: never;

export type TablesUpdate<
	DefaultSchemaTableNameOrOptions extends
		| keyof DefaultSchema["Tables"]
		| { schema: keyof DatabaseWithoutInternals },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
		: never = never,
> = DefaultSchemaTableNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
			Update: infer U;
		}
		? U
		: never
	: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
		? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
				Update: infer U;
			}
			? U
			: never
		: never;

export type Enums<
	DefaultSchemaEnumNameOrOptions extends
		| keyof DefaultSchema["Enums"]
		| { schema: keyof DatabaseWithoutInternals },
	EnumName extends DefaultSchemaEnumNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
		: never = never,
> = DefaultSchemaEnumNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
	: DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
		? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
		: never;

export type CompositeTypes<
	PublicCompositeTypeNameOrOptions extends
		| keyof DefaultSchema["CompositeTypes"]
		| { schema: keyof DatabaseWithoutInternals },
	CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
		: never = never,
> = PublicCompositeTypeNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
	: PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
		? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
		: never;

export const Constants = {
	public: {
		Enums: {
			app_role: ["admin", "user"],
		},
	},
} as const;
