"use server";

import { currentUser } from "@clerk/nextjs/server";
import { StreamClient } from "@stream-io/node-sdk";

const apiKey = process.env.NEXT_PUBLIC_STREAM_CLIENT_API_KEY;
const secretKey = process.env.STREAM_CLIENT_SECRET_KEY;

export const tokenProvider = async () => {
  const user = await currentUser();

  if (!user) throw new Error("User not found");

  if (!apiKey || !secretKey)
    throw new Error("Stream client API key or secret key is missing");

  const streamClient = new StreamClient(apiKey, secretKey);

  const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24;

  const issued = Math.floor(Date.now() / 1000);

  const token = streamClient.createToken(user.id, exp, issued);

  return token;
};
