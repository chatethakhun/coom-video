"use client";
import { useUser } from "@clerk/nextjs";
import { StreamVideo, StreamVideoClient } from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";
import { tokenProvider } from "@/actions/stream.actions";
import Loader from "@/components/Loader";
const apiKey = process.env.NEXT_PUBLIC_STREAM_CLIENT_API_KEY;

interface StreamClientProviderProps {
  children: React.ReactNode;
}
const StreamClientProvider = ({ children }: StreamClientProviderProps) => {
  const [videoClient, setVideoClient] = useState<StreamVideoClient | null>(
    null
  );

  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (!user || !isLoaded) return;

    if (!apiKey)
      throw new Error("Stream client API key or secret key is missing");

    const client = new StreamVideoClient({
      apiKey,
      user: {
        id: user?.id,
        name: user?.username || user?.id,
        image: user?.imageUrl,
      },

      tokenProvider,
    });

    setVideoClient(client);
  }, [user, isLoaded]);

  if (!videoClient) return <Loader />;

  return <StreamVideo client={videoClient}>{children}</StreamVideo>;
};

export default StreamClientProvider;
