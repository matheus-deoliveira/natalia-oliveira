# Arquitetura e Plano: E-commerce Custo Zero (Next.js App Router)

## 1. Stack Detalhada (Foco em Base Sólida Local)

- **Framework:** Next.js (App Router) - Padrão idiomático focado em Server Components para fetch de dados e Server Actions para mutações. Foco na criação de uma arquitetura limpa e robusta em localhost antes de pensar no deploy.
- **Banco de Dados:** Neon (PostgreSQL) - Desenvolvimento inicial fortemente integrado a uma instância postgresql da Neon. É sabido que no Free Tier há o "scale to zero" (dorme após inatividade) podendo causar *cold start* de 1-2s no primeiro acesso do dia, perfeitamente aceitável para o nosso contexto.
- **Hospedagem (Futuro):** Vercel - Arquitetura projetada para, quando o momento chegar, usar deploy contínuo e cache atrelado nativamente (Zero Config). O plano Hobby atende plenamente.
- **ORM:** Drizzle ORM - Simplificado, limpo, leve e perfeito para a arquitetura com Next.js.
- **Autenticação:** Auth.js (NextAuth v5) ou Supabase Auth.
- **UI & Estilos:** Tailwind CSS + Shadcn/ui - Sem custo. Componentes modulares, garantindo performance e acessibilidade.
- **Pagamentos:** Stripe ou Mercado Pago - Taxas apenas por cada venda (zero custo fixo mensal).
- **Logística/Frete:** Melhor Envio (API v2) - Precificação e cotações de forma muito vantajosa unificando várias transportadoras.
- **E-mails Transacionais:** Resend - Integração fluida via HTTP com ampla cota mensal gratuita.

## 2. Estrutura de Pastas (Colocation Padrão)

```text
src/
├── app/                  # Rotas do Next.js
│   ├── shop/           # Agrupador do site vitrine (Público)
│   │   ├── page.tsx      
│   │   └── product/
│   │       └── [slug]/page.tsx
│   ├── admin/          # Agrupador da Área Administrativa (Protegido)
│   │   ├── dashboard/page.tsx
│   │   └── orders/page.tsx
│   ├── api/
│   │   ├── auth/         # Rotas dinâmicas do Auth.js (NextAuth)
│   │   │   └── [...nextauth]/route.ts
│   │   └── webhooks/     # Listeners para Stripe/Melhor Envio webhook
│   └── layout.tsx
├── components/           # Componentização simples e coesa
│   ├── ui/               # Módulos shadcn/ui instalados
│   ├── product/          # Listagens e Cards orientados ao negócio
│   ├── layout/           # Sidebar de Cart, Navbar
│   ├── emails/           # Templates React Email p/ envio via Resend
│   │   └── order-confirmation.tsx
│   └── providers/        # Contextos Globais (Cart Provider, Theme, Auth)
├── lib/                  # Código utilitário auxiliar
│   ├── melhor-envio.ts   # Instâncias e helpers relativos a logística
│   └── utils.ts          
├── db/                   # Repositório de dados
│   ├── schema.ts         # Modelo Drizzle
│   └── index.ts          # Instância exportada de conexão (Neon)
├── actions/              # Todas Server Actions (as Controller/Services mutáveis)
│   ├── cart.ts
│   ├── checkout.ts
│   └── shipping.ts       # Cálculos de frete via cep
└── auth.ts               # Configuração base do Auth.js v5
```

## 3. Modelagem de Dados (Drizzle ORM)

```typescript
// src/db/schema.ts
import { pgTable, text, timestamp, integer, decimal } from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  price: integer("price").notNull(), // Salvo sempre em centavos (ex: R$ 50,00 vira 5000)
  imageUrl: text("image_url"),
  inventory: integer("inventory").default(0),

  // Melhor Envio: Dimensões físicas essenciais para cálculo de frete
  weight: decimal("weight", { precision: 10, scale: 2 }).notNull(), // Peso (kg)
  width: decimal("width", { precision: 10, scale: 2 }).notNull(),   // Largura (cm)
  height: decimal("height", { precision: 10, scale: 2 }).notNull(), // Altura (cm)
  length: decimal("length", { precision: 10, scale: 2 }).notNull(), // Comprimento (cm)
});

export const orders = pgTable("orders", {
  id: text("id").primaryKey(),
  userId: text("user_id"),
  totalAmt: integer("total_amt").notNull(), // Salvo em centavos
  shippingCost: integer("shipping_cost").default(0), // Salvo em centavos
  shippingMethod: text("shipping_method"), // (Ex: Correios PAC)
  status: text("status").default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});
```

## 4. Logística de Frete (Melhor Envio API v2)

```typescript
// src/actions/shipping.ts
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
      insurance_value: Number(product.price), // Seguro reflete o valor
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
      from: { postal_code: process.env.STORE_POSTAL_CODE }, // CEP Origem
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
```

> **Atenção ao Tempo de Resposta:** A API do Melhor Envio pode ter uma latência expressiva aliada ao limite de timeout da Vercel (10s no Hobby). No frontend, é **mandatório** englobar a chamada a esta Server Action com `useTransition` ou usar `useFormStatus` para mostrar um *loading state* (ex: "Calculando...") e desabilitar o botão, evitando múltiplos cliques do usuário enquanto se aguarda o retorno externo.

## 5. Controle Pragmático de Estoque e Mutações

Como não haverá alta concorrência paralela e a abstração nos ajuda a acelerar o *time-to-market*, o uso de Server Actions para manipular o carrinho e os checkouts foi definido como o padrão principal (dispensando APIs REST separadas).

Para gerir a concorrência na hora decisiva da venda sem gargalos (como *locks* via Redis), fazemos uso de uma verificação transacional direta no banco durante o checkout:

```sql
UPDATE products 
SET inventory = inventory - 1 
WHERE id = [ID_DO_PRODUTO] AND inventory > 0;
```

> Caso essa query não afete nenhuma linha, o estoque acabou no exato milissegundo de confirmação. O sistema então aborta/pausa o fluxo da Server Action e retorna a mensagem: *"Produto esgotado"*.

## 6. Estratégia de Cache (revalidatePath / revalidateTag)

No Next.js (App Router), o Cache de dados é persistente por padrão. Para manter a performance e isenção de custos computacionais desnecessários ao invés de usar apenas o SSR, geramos o estático e usamos Invalidação por Demanda.

```typescript
'use server'

import { revalidatePath, revalidateTag } from 'next/cache';
import { db } from '@/db';
import { products } from '@/db/schema';
import { eq } from 'drizzle-orm';

// Exemplo: Server Action chamada via Webhook ou Painel Administrativo 
export async function updateInventoryAndSync(productId: string, newInventory: number) {
  // Atualiza banco Subjacente
  await db.update(products).set({ inventory: newInventory }).where(eq(products.id, productId));
  
  const product = await db.query.products.findFirst({ where: eq(products.id, productId) });
  
  // 1. Invalida a rota estática específica apenas deste produto
  if (product) revalidatePath(`/product/${product.slug}`);
  
  // 2. Invalida os Server Components de listagem que dependem da tag customizada 
  // Usa-se next: { tags: ['store-catalog'] } no fetch que busca o catálogo
  revalidateTag('store-catalog'); 
}
```

## 6. Configuração de Ambiente (.env)

Lista das variáveis requeridas na raiz do projeto e configuradas no portal da Vercel:

```env
# Banco de Dados
DATABASE_URL="postgresql://[user]:[password]@[host]/[dbname]?sslmode=require"

# Autenticação
AUTH_SECRET="seu-segredo-de-criptografia-authjs"
NEXTAUTH_URL="http://localhost:3000"

# Pagamentos 
STRIPE_SECRET_KEY="sk_test_..."
# ou MERCADOPAGO_ACCESS_TOKEN="TEST-..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."

# Logística (Melhor Envio)
MELHOR_ENVIO_TOKEN="eyJ0eXAiOiJKV1QiLCJhbG... token do painel do melhor envio"
STORE_POSTAL_CODE="01001000" # Exemplo: Centro de SP

# E-mail transacional
RESEND_API_KEY="re_..."
```
