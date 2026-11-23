import { z } from "zod";

export const CreateOrderSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(80, "Name must be at most 80 characters"),
  email: z.string().trim().email("Invalid email address"),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Phone must start with 6-9 and be 10 digits"),
  address_line1: z
    .string()
    .trim()
    .min(5, "Address must be at least 5 characters")
    .max(120, "Address must be at most 120 characters"),
  city: z.string().trim().min(2, "City must be at least 2 characters").max(60, "City must be at most 60 characters"),
  state: z.string().trim().min(2, "State must be at least 2 characters").max(60, "State must be at most 60 characters"),
  pincode: z
    .string()
    .regex(/^[1-9]\d{5}$/, "Pincode must be 6 digits starting with 1-9"),
  items: z
    .array(
      z.object({
        productId: z.string().min(1, "Product ID is required"),
        qty: z.number().int().min(1).max(10, "Quantity must be at most 10"),
      })
    )
    .min(1, "Must have at least 1 item")
    .max(20, "Maximum 20 items allowed"),
  idempotencyKey: z.uuid("Idempotency key must be a valid UUID"),
});

export type CreateOrderInput = z.infer<typeof CreateOrderSchema>;