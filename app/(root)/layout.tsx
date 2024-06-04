"use client";
import { useCurrentApp } from "@/providers/SwitchAppProvider";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const RootLayout = () => {
  const router = useRouter();
  const {
    action: { changeApp },
  } = useCurrentApp();
  useEffect(() => {
    const pathname = window.location.pathname.split("/")[1];
    console.log({ pathname });
    if (pathname !== "") return;

    changeApp("coom-video");
  }, [changeApp, router]);
};

export default RootLayout;
