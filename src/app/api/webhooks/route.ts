import { headers } from 'next/headers'
import Stripe from 'stripe'
import { db } from '@/db'
import { orders, products } from '@/db/schema'
import { eq, sql } from 'drizzle-orm'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-04-22.dahlia',
})

export async function POST(req: Request) {
  const body = await req.text()
  const signature = (await headers()).get('stripe-signature') as string

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error: any) {
    return new Response(`Webhook Error: ${error.message}`, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const orderId = session.metadata?.orderId

    if (orderId) {
      // 1. Atualiza status do pedido
      await db.update(orders).set({ status: 'paid' }).where(eq(orders.id, orderId))
      
      // 2. Baixa de estoque seria implementada iterando pelos itens comprados
      // Para o MVP, isso demandaria armazenar os line_items por pedido
      
      // 3. Disparar e-mail de confirmação aqui usando o Resend
    }
  }

  return new Response(null, { status: 200 })
}
