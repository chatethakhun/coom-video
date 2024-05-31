import StreamClientProvider from "@/providers/StreamClientProvider";
import React from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <StreamClientProvider>{children}</StreamClientProvider>
    </main>
  );
}
