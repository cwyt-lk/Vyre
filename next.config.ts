/** biome-ignore-all lint/style/noNonNullAssertion: Valid Non-Null Assertion */
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	experimental: {
		authInterrupts: true,
	},
	images: {
		remotePatterns: [
			new URL(`https://mqheazfqjgesaoyoyrqw.supabase.co/**`),
		],
	},
	reactCompiler: true,
};

export default nextConfig;
