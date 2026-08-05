"use server";

import Stripe from "stripe";
import { db } from "@/lib/db";
import { env } from "@/lib/env";
import { auth } from "@/auth";

const stripe = new Stripe(env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia" as any,
});

export interface CheckoutItemInput {
  productId: string;
  volumeMl: number;
  productName: string;
  unitPrice: number; // in currency units
  quantity: number;
  addSampleVial?: boolean;
}

export interface CheckoutAddress {
  fullName: string;
  phone: string;
  streetAddress: string;
  apartment?: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export async function createCheckoutSession(
  items: CheckoutItemInput[],
  guestEmail?: string,
  shippingAddress?: CheckoutAddress,
) {
  try {
    if (!items || items.length === 0) {
      return { success: false, error: "Cart is empty" };
    }

    const sessionUser = await auth();
    if (!sessionUser || !sessionUser.user?.id) {
      return { success: false, error: "Authentication required. Please log in to checkout." };
    }
    if (!shippingAddress) {
      return { success: false, error: "Shipping address is required for checkout." };
    }
    
    const userEmail = sessionUser.user.email || guestEmail || undefined;
    const userId = sessionUser.user.id;

    const domain = process.env.NEXTAUTH_URL || "http://localhost:3000";

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map(
      (item) => ({
        price_data: {
          currency: "inr",
          product_data: {
            name: `${item.productName} (${item.volumeMl}ml)`,
            description: item.addSampleVial
              ? "Includes complimentary 2ml luxury sample vial"
              : undefined,
          },
          unit_amount: Math.round(item.unitPrice * 100), // convert to smallest currency unit (paise)
        },
        quantity: item.quantity,
      }),
    );

    const metadata: Record<string, string> = {};
    if (shippingAddress) {
      metadata.shippingAddress = JSON.stringify(shippingAddress);
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: userEmail,
      line_items: lineItems,
      metadata,
      success_url: `${domain}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${domain}/checkout/cancel`,
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "GB", "IN", "AE"],
      },
      billing_address_collection: "required",
    });

    // Generate unique luxury order number
    const count = await db.order.count();
    const orderNumber = `ORD-${String(count + 1001).padStart(5, "0")}`;

    // Total amount in main currency units
    const totalAmount = items.reduce(
      (acc, item) => acc + item.unitPrice * item.quantity,
      0,
    );

    // Build order items mapped to ProductVariants in DB
    const orderItemsData = [];
    for (const item of items) {
      let variant = await db.productVariant.findFirst({
        where: {
          OR: [
            { productId: item.productId, volumeMl: item.volumeMl },
            { product: { slug: item.productId }, volumeMl: item.volumeMl },
          ],
        },
      });

      if (!variant) {
        variant = await db.productVariant.findFirst({
          where: {
            OR: [
              { productId: item.productId },
              { product: { slug: item.productId } },
            ],
          },
        });
      }

      if (variant) {
        orderItemsData.push({
          variantId: variant.id,
          productName: item.productName,
          volumeMl: item.volumeMl,
          unitPrice: Math.round(item.unitPrice),
          quantity: item.quantity,
          addSampleVial: !!item.addSampleVial,
        });
      }
    }

    // Persist order in database
    await db.order.create({
      data: {
        orderNumber,
        userId,
        guestEmail: userEmail,
        status: "PENDING",
        paymentStatus: "UNPAID",
        stripeSessionId: session.id,
        totalAmount: Math.round(totalAmount),
        shippingAddress: shippingAddress ? (shippingAddress as any) : undefined,
        items: {
          create: orderItemsData,
        },
      },
    });

    return { success: true, url: session.url };
  } catch (error: any) {
    console.error("Error creating Stripe checkout session:", error);
    return {
      success: false,
      error: error.message || "Failed to initialize checkout",
    };
  }
}

export async function createExpressBuyNowSession(
  productId: string,
  productName: string,
  volumeMl: number,
  unitPrice: number,
  addSampleVial: boolean = false,
  shippingAddress?: CheckoutAddress,
) {
  return createCheckoutSession(
    [
      {
        productId,
        productName,
        volumeMl,
        unitPrice,
        quantity: 1,
        addSampleVial,
      },
    ],
    undefined,
    shippingAddress,
  );
}
