import { z } from 'zod';

export const OrderItemSchema = z.object({
  id: z.string(), // Product ID
  qty: z.number().min(1),
  price: z.number().min(0),
});

export const OrderSchema = z.object({
  customer: z.object({
    name: z.string().min(1, "Nom requis"),
    phone: z.string().min(1, "Téléphone requis"),
  }),
  totalAmount: z.number().min(0),
  paymentMethod: z.enum(['cash', 'mobile_money']).default('cash'),
  delivery: z.object({
    city: z.string().default('Ouagadougou'),
    lat: z.number().nullable().optional(),
    lng: z.number().nullable().optional(),
    description: z.string().optional(),
  }),
  items: z.array(OrderItemSchema).min(1, "Au moins un produit requis"),
});

export type OrderInput = z.infer<typeof OrderSchema>;
