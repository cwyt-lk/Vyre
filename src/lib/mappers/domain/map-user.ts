import type { User as SupabaseUser } from "@supabase/supabase-js";
import { parseSupabaseDate } from "@/lib/utils/time";
import type { User } from "@/types/domain";

/**
 * Map a Supabase User object to domain User type.
 * @param user - The Supabase User object.
 * @returns The mapped User object.
 */
export function mapUser(user: SupabaseUser): User {
	return {
		id: user.id,
		email: user.email ?? "",
		fullName: user.user_metadata?.full_name,
		avatarUrl: user.user_metadata?.avatar_url,
		createdAt: parseSupabaseDate(user.created_at),
	};
}
