'use server'

import { db } from "@/db";
import { products } from "@/db/schema";
import { inArray } from "drizzle-orm";

interface CartItem {
  productId: string;
  quantity: number;
}

export async function calculateShipping(postalCode: string, cartItems: CartItem[]) {
  // 1. Buscar produtos do banco
  const productIds = cartItems.map(i => i.productId);
  const dbProducts = await db.query.products.findMany({
    where: inArray(products.id, productIds)
  });

  // 2. Mapear dados dimensionais para o payload da API
  const productsPayload = cartItems.map(item => {
    const product = dbProducts.find(p => p.id === item.productId);
    if (!product) throw new Error(`Produto não encontrado: ${item.productId}`);
    
    return {
      id: product.id,
      width: Number(product.width),
      height: Number(product.height),
      length: Number(product.length),
      weight: Number(product.weight),
      insurance_value: Number(product.price) / 100, // Melhor envie pede valor real (original em centavos)
      quantity: item.quantity,
    };
  });

  // 3. Consultar Frete via Melhor Envio (Calculador v2)
  const response = await fetch("https://sandbox.melhorenvio.com.br/api/v2/me/shipment/calculate", {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.MELHOR_ENVIO_TOKEN}`,
      "User-Agent": "MeuEcommerce App (suporte@meudominio.com)"
    },
    body: JSON.stringify({
      from: { postal_code: process.env.STORE_POSTAL_CODE || "01001000" }, // CEP Origem Padrão (Fallback)
      to: { postal_code: postalCode },                      // CEP Destino
      products: productsPayload,
    })
  });

  if (!response.ok) {
    throw new Error("Erro ao cotar frete no Melhor Envio");
  }

  // Retorna array de transportadoras disponíveis, valores e prazos
  const shippingOptions = await response.json();
  return shippingOptions;
}
