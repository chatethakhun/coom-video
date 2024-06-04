"use client";
import { useCurrentApp } from "@/providers/SwitchAppProvider";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const MainPage = () => {
  const router = useRouter();
  const {
    action: { changeApp },
  } = useCurrentApp();
  useEffect(() => {
    console.log("MainPage");
    const pathname = window.location.pathname.split("/")[1];

    if (pathname !== "/") return;

    changeApp("coom-video");
  }, [changeApp, router]);
};

export default MainPage;
