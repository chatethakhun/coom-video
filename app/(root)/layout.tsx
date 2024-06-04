"use client";
import Navbar from "@/components/Navbar";
import { useCurrentApp } from "@/providers/SwitchAppProvider";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const {
    action: { changeApp },
  } = useCurrentApp();
  useEffect(() => {
    const pathname = window.location.pathname.split("/")[1];
    if (pathname !== "") return;

    changeApp("coom-video");
  }, [changeApp, router]);

  return (
    <section>
      <Navbar />
      {children}
    </section>
  );
};

export default RootLayout;
