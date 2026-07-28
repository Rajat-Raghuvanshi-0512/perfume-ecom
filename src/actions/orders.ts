"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function getUserOrders() {
  try {
    const session = await auth();
    if (!session?.user?.id && !session?.user?.email) {
      return { success: false, error: "Unauthorized", orders: [] };
    }

    const userId = session.user.id;
    const userEmail = session.user.email;

    const rawOrders = await db.order.findMany({
      where: {
        OR: [
          ...(userId ? [{ userId }] : []),
          ...(userEmail ? [{ guestEmail: userEmail }] : []),
        ],
      },
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: {
                  include: {
                    images: {
                      orderBy: { displayOrder: "asc" },
                      take: 1,
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    const orders = rawOrders.map((ord) => ({
      id: ord.id,
      orderNumber: ord.orderNumber,
      status: ord.status,
      paymentStatus: ord.paymentStatus,
      createdAt: ord.createdAt.toISOString(),
      updatedAt: ord.updatedAt.toISOString(),
      // Handle amount conversion if stored in paise/cents vs whole currency
      totalAmount: ord.totalAmount > 100000 ? Math.round(ord.totalAmount / 100) : ord.totalAmount,
      shippingAddress: ord.shippingAddress,
      items: ord.items.map((item) => {
        const primaryImg = item.variant?.product?.images[0]?.url;
        return {
          id: item.id,
          variantId: item.variantId,
          productId: item.variant?.productId,
          productSlug: item.variant?.product?.slug,
          productName: item.productName || item.variant?.product?.name || "Luxury Perfume",
          subtitle: item.variant?.product?.subtitle,
          volumeMl: item.volumeMl,
          unitPrice: item.unitPrice,
          quantity: item.quantity,
          addSampleVial: item.addSampleVial,
          image: primaryImg || "/images/perfume-placeholder.png",
        };
      }),
    }));

    return { success: true, orders };
  } catch (error: any) {
    console.error("Error fetching user orders:", error);
    return {
      success: false,
      error: error.message || "Failed to fetch order history",
      orders: [],
    };
  }
}

export async function getOrderDetails(orderId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id && !session?.user?.email) {
      return { success: false, error: "Unauthorized", order: null };
    }

    const order = await db.order.findFirst({
      where: {
        OR: [{ id: orderId }, { orderNumber: orderId }],
        AND: {
          OR: [
            ...(session.user.id ? [{ userId: session.user.id }] : []),
            ...(session.user.email ? [{ guestEmail: session.user.email }] : []),
          ],
        },
      },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: {
                  include: {
                    images: {
                      orderBy: { displayOrder: "asc" },
                      take: 1,
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!order) {
      return { success: false, error: "Order not found", order: null };
    }

    const formattedOrder = {
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      paymentStatus: order.paymentStatus,
      stripePaymentId: order.stripePaymentId,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
      totalAmount: order.totalAmount > 100000 ? Math.round(order.totalAmount / 100) : order.totalAmount,
      shippingAddress: order.shippingAddress,
      items: order.items.map((item) => ({
        id: item.id,
        variantId: item.variantId,
        productId: item.variant?.productId,
        productSlug: item.variant?.product?.slug,
        productName: item.productName || item.variant?.product?.name || "Luxury Perfume",
        subtitle: item.variant?.product?.subtitle,
        volumeMl: item.volumeMl,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
        addSampleVial: item.addSampleVial,
        image: item.variant?.product?.images[0]?.url || "/images/perfume-placeholder.png",
      })),
    };

    return { success: true, order: formattedOrder };
  } catch (error: any) {
    console.error("Error fetching order details:", error);
    return { success: false, error: error.message || "Failed to fetch order", order: null };
  }
}
