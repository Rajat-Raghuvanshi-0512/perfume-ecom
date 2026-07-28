"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { z } from "zod";

export interface AddressInput {
  fullName: string;
  phone: string;
  streetAddress: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  country?: string;
  isDefault?: boolean;
}

const addressSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  phone: z.string().min(6, "Valid phone number is required"),
  streetAddress: z.string().min(3, "Street address is required"),
  apartment: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  postalCode: z.string().min(3, "Postal code is required"),
  country: z.string().default("India"),
  isDefault: z.boolean().optional(),
});

export async function getUserAddresses() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized", addresses: [] };
    }

    const addresses = await db.address.findMany({
      where: { userId: session.user.id },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    });

    return { success: true, addresses };
  } catch (error: any) {
    console.error("Error fetching user addresses:", error);
    return { success: false, error: error.message || "Failed to fetch addresses", addresses: [] };
  }
}

export async function createAddress(data: AddressInput) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const parsed = addressSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Invalid address data" };
    }

    const userId = session.user.id;
    const existingCount = await db.address.count({ where: { userId } });
    const isFirstAddress = existingCount === 0;
    const shouldBeDefault = isFirstAddress || Boolean(parsed.data.isDefault);

    if (shouldBeDefault && !isFirstAddress) {
      await db.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    const address = await db.address.create({
      data: {
        userId,
        fullName: parsed.data.fullName,
        phone: parsed.data.phone,
        streetAddress: parsed.data.streetAddress,
        apartment: parsed.data.apartment || null,
        city: parsed.data.city,
        state: parsed.data.state,
        postalCode: parsed.data.postalCode,
        country: parsed.data.country || "India",
        isDefault: shouldBeDefault,
      },
    });

    return { success: true, address };
  } catch (error: any) {
    console.error("Error creating address:", error);
    return { success: false, error: error.message || "Failed to save address" };
  }
}

export async function updateAddress(addressId: string, data: AddressInput) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const existing = await db.address.findUnique({
      where: { id: addressId },
    });

    if (!existing || existing.userId !== session.user.id) {
      return { success: false, error: "Address not found" };
    }

    const parsed = addressSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Invalid address data" };
    }

    const userId = session.user.id;
    const shouldBeDefault = Boolean(parsed.data.isDefault);

    if (shouldBeDefault && !existing.isDefault) {
      await db.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    const updated = await db.address.update({
      where: { id: addressId },
      data: {
        fullName: parsed.data.fullName,
        phone: parsed.data.phone,
        streetAddress: parsed.data.streetAddress,
        apartment: parsed.data.apartment || null,
        city: parsed.data.city,
        state: parsed.data.state,
        postalCode: parsed.data.postalCode,
        country: parsed.data.country || "India",
        isDefault: shouldBeDefault || existing.isDefault,
      },
    });

    return { success: true, address: updated };
  } catch (error: any) {
    console.error("Error updating address:", error);
    return { success: false, error: error.message || "Failed to update address" };
  }
}

export async function deleteAddress(addressId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const existing = await db.address.findUnique({
      where: { id: addressId },
    });

    if (!existing || existing.userId !== session.user.id) {
      return { success: false, error: "Address not found" };
    }

    await db.address.delete({
      where: { id: addressId },
    });

    // If deleted address was default, set the latest remaining address as default
    if (existing.isDefault) {
      const remaining = await db.address.findFirst({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
      });

      if (remaining) {
        await db.address.update({
          where: { id: remaining.id },
          data: { isDefault: true },
        });
      }
    }

    return { success: true };
  } catch (error: any) {
    console.error("Error deleting address:", error);
    return { success: false, error: error.message || "Failed to delete address" };
  }
}

export async function setDefaultAddress(addressId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const userId = session.user.id;
    const existing = await db.address.findUnique({
      where: { id: addressId },
    });

    if (!existing || existing.userId !== userId) {
      return { success: false, error: "Address not found" };
    }

    await db.address.updateMany({
      where: { userId },
      data: { isDefault: false },
    });

    await db.address.update({
      where: { id: addressId },
      data: { isDefault: true },
    });

    return { success: true };
  } catch (error: any) {
    console.error("Error setting default address:", error);
    return { success: false, error: error.message || "Failed to set default address" };
  }
}
