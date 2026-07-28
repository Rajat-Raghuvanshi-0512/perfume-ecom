"use server";

import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function registerUser(formData: {
  name: string;
  email: string;
  password: string;
}) {
  try {
    const validated = registerSchema.parse(formData);

    const existingUser = await db.user.findUnique({
      where: { email: validated.email },
    });

    if (existingUser) {
      return { success: false, error: "A patron account with this email already exists." };
    }

    const hashedPassword = await bcrypt.hash(validated.password, 10);

    const user = await db.user.create({
      data: {
        name: validated.name,
        email: validated.email,
        passwordHash: hashedPassword,
        role: "CUSTOMER",
      },
    });

    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  } catch (error: any) {
    console.error("Error registering user:", error);
    if (error.errors && error.errors[0]) {
      return { success: false, error: error.errors[0].message };
    }
    return { success: false, error: error.message || "Failed to create patron account." };
  }
}
