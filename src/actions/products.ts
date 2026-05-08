'use server'

import { db } from "@/db"
import { products } from "@/db/schema"
import { revalidatePath } from "next/cache"
import crypto from "crypto"
import { redirect } from "next/navigation"

export async function createProduct(formData: FormData) {
  const name = formData.get('name') as string
  const slug = formData.get('slug') as string
  const price = Math.round(parseFloat(formData.get('price') as string) * 100) // Convertendo para centavos
  const inventory = parseInt(formData.get('inventory') as string, 10)
  const imageUrl = formData.get('imageUrl') as string
  const weight = formData.get('weight') as string
  const width = formData.get('width') as string
  const height = formData.get('height') as string
  const length = formData.get('length') as string

  await db.insert(products).values({
    id: crypto.randomUUID(),
    name,
    slug,
    price,
    inventory,
    imageUrl: imageUrl || null,
    weight,
    width,
    height,
    length,
  })

  revalidatePath('/')
  revalidatePath('/admin/products')
  redirect('/admin/products')
}
