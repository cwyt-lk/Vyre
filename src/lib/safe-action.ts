import { createSafeActionClient } from "next-safe-action";
import type { UserRole } from "@/types/domain";
import { createRepositories } from "./factories/repository/server";

export const actionClient = createSafeActionClient().use(
	async ({ next, metadata }) => {
		const start = Date.now();
		const result = await next();

		console.log(
			`Action ${JSON.stringify(metadata)} took ${Date.now() - start}ms`,
		);

		return result;
	},
);

export const authClient = (requiredRole: UserRole = "user") =>
	actionClient.use(async ({ next }) => {
		const { auth } = await createRepositories();

		const [userResult, roleResult] = await Promise.all([
			auth.getCurrentUser(),
			auth.getCurrentRole(),
		]);

		if (!userResult.success) {
			throw new Error("Unable to retrieve current user.");
		}

		if (!roleResult.success) {
			throw new Error("Unable to retrieve user role.");
		}

		const user = userResult.data;
		const role = roleResult.data;

		if (role !== requiredRole) {
			throw new Error("Unauthorized: insufficient role.");
		}

		return next({
			ctx: { user, role },
		});
	});
