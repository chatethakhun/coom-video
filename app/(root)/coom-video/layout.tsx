"use client";
import StreamClientProvider from "@/providers/StreamClientProvider";
import React, { useEffect } from "react";

export default function CoomLayout({
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
