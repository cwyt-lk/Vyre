import type { User as SupabaseUser } from "@supabase/supabase-js";
import type { User } from "@/types/domain";

export function mapUser(user: SupabaseUser): User {
	return {
		id: user.id,
		email: user.email ?? "",
		fullName: user.user_metadata?.full_name,
		avatarUrl: user.user_metadata?.avatar_url,
		createdAt: new Date(user.created_at),
	};
}
