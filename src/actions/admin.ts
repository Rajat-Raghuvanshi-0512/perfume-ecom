"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getAdminOrders() {
  try {
    const rawOrders = await db.order.findMany({
      take: 50,
      orderBy: { createdAt: "desc" },
      include: {
        items: true,
        user: { select: { name: true, email: true } },
      },
    });

    const orders = rawOrders.map((ord: any) => ({
      id: ord.orderNumber || ord.id,
      customerName: ord.user?.name || "Patron Guest",
      customerEmail: ord.user?.email || ord.guestEmail || "patron@maison.com",
      date: new Date(ord.createdAt).toISOString().split("T")[0],
      total: ord.totalAmount > 100000 ? Math.round(ord.totalAmount / 100) : ord.totalAmount,
      status: ord.status,
      itemsCount: ord.items ? ord.items.length : 1,
    }));

    return { success: true, orders };
  } catch (error: any) {
    console.error("Error fetching admin orders:", error);
    return { success: false, orders: [], error: error.message };
  }
}

export async function updateOrderStatus(orderId: string, status: string) {
  try {
    const order = await db.order.findFirst({
      where: { OR: [{ id: orderId }, { orderNumber: orderId }] },
    });

    if (order) {
      await db.order.update({
        where: { id: order.id },
        data: { status: status as any },
      });
    }

    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    console.error(`Error updating order status for ${orderId}:`, error);
    return { success: false, error: error.message };
  }
}
