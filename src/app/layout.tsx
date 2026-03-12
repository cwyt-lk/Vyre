import "./globals.css";

import type { Metadata } from "next";
import { Fira_Code, Lora, Montserrat } from "next/font/google";
import type { ReactNode } from "react";
import { Toaster } from "@/components/ui/Sonner";

export const metadata: Metadata = {
	title: "Vyre",
};

const fontSans = Montserrat({
	subsets: ["latin"],
	variable: "--font-sans",
});

const fontSerif = Lora({
	subsets: ["latin"],
	variable: "--font-serif",
});

const fontMono = Fira_Code({
	subsets: ["latin"],
	variable: "--font-mono",
});

export default function RootLayout({
	children,
}: Readonly<{
	children: ReactNode;
}>) {
	return (
		<html lang="en" className="dark">
			<body
				className={`${fontSans.variable} ${fontSerif.variable} ${fontMono.variable} antialiased`}
			>
				{children}
				<Toaster
					position="bottom-center"
					richColors
					duration={5000}
				/>
			</body>
		</html>
	);
}
