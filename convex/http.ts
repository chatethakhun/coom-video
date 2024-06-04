import { httpRouter } from "convex/server";
import { handler } from "tailwindcss-animate";
import { httpAction } from "./_generated/server";
import { WebhookEvent } from "@clerk/nextjs/dist/types/server";
import { Webhook } from "svix";
import { WEBHOOK_PAYLOAD } from "@/constants";
import { internal } from "./_generated/api";

const http = httpRouter();

const validatePayload = async (
  req: Request
): Promise<WebhookEvent | undefined> => {
  const payload = await req.text();

  const svixHeaders = {
    "svix-id": req.headers.get("svix-id")!,
    "svix-signature": req.headers.get("svix-signature")!,
    "svix-timestamp": req.headers.get("svix-timestamp")!,
  };

  const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET || "");

  try {
    const event = webhook.verify(payload, svixHeaders) as WebhookEvent;

    return event;
  } catch (error) {
    console.log("Error validating webhook payload", error);
    return;
  }
};

const handleClerkWebhook = httpAction(async (ctx, req) => {
  const event = await validatePayload(req);

  console.log(`Received webhook event ${event}`);

  if (!event) {
    return new Response("Invalid webhook payload", { status: 400 });
  }

  switch (event.type) {
    case WEBHOOK_PAYLOAD.USER_CREATED: {
      const user = await ctx.runQuery(internal.user.get, {
        clerkId: event.data.id,
      });
      if (user) {
        console.log(`updating user ${event.data.id} with ${event.data}`);
      }
    }

    case WEBHOOK_PAYLOAD.USER_UPDATED: {
      console.log(`Update/Create event ${event.data.id}`);
      const { first_name, last_name, image_url } = event.data;
      await ctx.runMutation(internal.user.create, {
        username: `${first_name} ${last_name}`,
        imageUrl: image_url,
        clerkId: event.data.id,
        email: event.data.email_addresses[0].email_address,
      });

      break;
    }

    default: {
      console.log(`Unhandled event not support ${event.type}`);
    }
  }
  return new Response(null, { status: 200 });
});

http.route({
  path: "/clerk-users-webhook",
  method: "POST",
  handler: handleClerkWebhook,
});

export default http;
