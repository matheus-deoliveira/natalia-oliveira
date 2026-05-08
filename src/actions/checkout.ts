'use server'

import Stripe from 'stripe'
import { db } from '@/db'
import { orders } from '@/db/schema'
import crypto from 'crypto'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-04-22.dahlia',
})

export async function createCheckoutSession(items: any[]) {
  const orderId = crypto.randomUUID()
  
  // Criar pedido pendente no banco
  // Calcular total, etc. (simplificado para o MVP)
  
  await db.insert(orders).values({
    id: orderId,
    totalAmt: items.reduce((acc, item) => acc + item.price * item.quantity, 0),
    status: 'pending',
  })

  // Criar sessão do Stripe
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card', 'boleto', 'pix'],
    line_items: items.map(item => ({
      price_data: {
        currency: 'brl',
        product_data: {
          name: item.name,
        },
        unit_amount: item.price,
      },
      quantity: item.quantity,
    })),
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/cart`,
    metadata: {
      orderId,
    },
  })

  return { url: session.url }
}
