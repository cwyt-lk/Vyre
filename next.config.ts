/** biome-ignore-all lint/style/noNonNullAssertion: Valid Non-Null Assertion */
import type { NextConfig } from "next";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;

const isLocalhost =
	supabaseUrl.includes("localhost") || supabaseUrl.includes("127.0.0.1");

const nextConfig: NextConfig = {
	experimental: {
		authInterrupts: true,
	},
	images: {
		remotePatterns: [new URL(`${supabaseUrl}/**`)],
		unoptimized: isLocalhost,
	},
	reactCompiler: true,
};

export default nextConfig;
