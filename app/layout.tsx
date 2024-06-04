import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import "./globals.css";
import "react-datepicker/dist/react-datepicker.css";

import { Toaster } from "@/components/ui/toaster";
import SwitchAppProvider from "@/providers/SwitchAppProvider";
import ConvexProvider from "@/providers/ConvexProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Coom App",
  description: "Video call chat app",
  icons: {
    icon: "/icons/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ConvexProvider>
        <body className={`${inter.className} bg-dark-2`}>
          <SwitchAppProvider>{children}</SwitchAppProvider>
          <Toaster />
        </body>
      </ConvexProvider>
    </html>
  );
}
