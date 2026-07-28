import { NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/lib/db";
import { env } from "@/lib/env";

const stripe = new Stripe(env.STRIPE_SECRET_KEY || "sk_test_mock", {
  apiVersion: "2025-02-24.acacia" as any,
});

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    if (env.STRIPE_WEBHOOK_SECRET) {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        env.STRIPE_WEBHOOK_SECRET,
      );
    } else {
      event = JSON.parse(body);
    }
  } catch (err: any) {
    console.error(
      "⚠️ Stripe Webhook signature verification failed:",
      err.message,
    );
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const stripeSessionId = session.id;
    const paymentIntentId = session.payment_intent as string;
    const customerEmail =
      session.customer_details?.email || session.customer_email;

    try {
      const order = await db.order.findUnique({
        where: { stripeSessionId },
        include: { items: true },
      });

      if (order) {
        await db.order.update({
          where: { id: order.id },
          data: {
            paymentStatus: "PAID",
            status: "PROCESSING",
            stripePaymentId: paymentIntentId,
            guestEmail: customerEmail || order.guestEmail,
            shippingAddress: ((session as any).shipping_details || session.customer_details?.address || null) as any,
          },
        });

        // Deduct inventory stock
        for (const item of order.items) {
          await db.productVariant.update({
            where: { id: item.variantId },
            data: {
              stockCount: {
                decrement: item.quantity,
              },
            },
          });
        }

        console.log(
          `✅ Order ${order.orderNumber} successfully marked as PAID!`,
        );
      }
    } catch (err) {
      console.error("Error processing Stripe order fulfillment:", err);
      return new NextResponse("Fulfillment Error", { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
