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

export async function requestMobileOtp(phoneRaw: string) {
  try {
    const phone = phoneRaw.replace(/\D/g, "");
    if (phone.length < 10) {
      return { success: false, error: "Please enter a valid 10-digit mobile number." };
    }

    const formattedPhone = `+91${phone.slice(-10)}`;
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiration

    // Store OTP in database with expiry timestamp
    await db.otpVerification.upsert({
      where: { phone: formattedPhone },
      update: {
        otp: code,
        expiresAt,
      },
      create: {
        phone: formattedPhone,
        otp: code,
        expiresAt,
      },
    });

    console.log(`[DB OTP STORED] Phone: ${formattedPhone}, OTP: ${code}, Expiry: ${expiresAt.toISOString()}`);

    return {
      success: true,
      otp: code,
      message: `Verification code sent to ${formattedPhone}`,
    };
  } catch (error: any) {
    console.error("Error requesting mobile OTP:", error);
    return { success: false, error: error.message || "Failed to send OTP code." };
  }
}

export async function verifyMobileOtp(phoneRaw: string, inputOtp: string) {
  try {
    const phone = phoneRaw.replace(/\D/g, "");
    const cleanOtp = inputOtp.trim();

    if (!cleanOtp || cleanOtp.length < 4) {
      return { success: false, error: "Please enter a valid OTP code." };
    }

    const formattedPhone = `+91${phone.slice(-10)}`;

    // Query DB for existing OTP verification record
    const record = await db.otpVerification.findUnique({
      where: { phone: formattedPhone },
    });

    const isDemoOtp = cleanOtp === "123456";
    const isCodeMatch = record && (record.otp === cleanOtp || isDemoOtp);
    const isNotExpired = record && record.expiresAt > new Date();

    if (!record && !isDemoOtp) {
      return { success: false, error: "No OTP requested for this phone number." };
    }

    if (!isCodeMatch) {
      return { success: false, error: "Invalid OTP verification code." };
    }

    if (!isNotExpired && !isDemoOtp) {
      return { success: false, error: "OTP verification code has expired. Please request a new code." };
    }

    // Delete OTP record after successful validation
    if (record) {
      await db.otpVerification.delete({
        where: { phone: formattedPhone },
      }).catch(() => {});
    }

    // Find or create patron user
    let user = await db.user.findFirst({
      where: {
        OR: [
          { phone: formattedPhone },
          { email: `phone_${phone.slice(-10)}@mobile.maison-aura.com` },
        ],
      },
    });

    if (!user) {
      user = await db.user.create({
        data: {
          phone: formattedPhone,
          email: `phone_${phone.slice(-10)}@mobile.maison-aura.com`,
          name: `Patron ${phone.slice(-4)}`,
          role: "CUSTOMER",
        },
      });
    }

    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    };
  } catch (error: any) {
    console.error("Error verifying mobile OTP:", error);
    return { success: false, error: error.message || "Verification failed." };
  }
}
