import "./globals.css";

import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Toaster } from "@/components/ui/Sonner";

export const metadata: Metadata = {
    title: "Vyre",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: ReactNode;
}>) {
    return (
        <html lang="en" className="dark">
        <head>
            <script
                async
                crossOrigin="anonymous"
                src="https://tweakcn.com/live-preview.min.js"
            />
        </head>
        <body>
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
