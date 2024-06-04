"use client";
import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import React from "react";

type Props = {
  children: React.ReactNode;
};

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL || "";

const convexClient = new ConvexReactClient(CONVEX_URL);

const ConvexProvider = (props: Props) => {
  return (
    <ClerkProvider
      appearance={{
        layout: {
          logoImageUrl: "icons/yoom-logo.svg",
          socialButtonsVariant: "iconButton",
        },
        variables: {
          colorText: "#fff",
          colorPrimary: "#0e78f9",
          colorBackground: "#1c1f2e",
          colorInputBackground: "#252a41",
          colorInputText: "#fff",
        },
      }}
    >
      <ConvexProviderWithClerk useAuth={useAuth} client={convexClient}>
        {props.children}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
};

export default ConvexProvider;
