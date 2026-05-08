import { db } from "@/db"
import { products } from "@/db/schema"
import { eq } from "drizzle-orm"
import { notFound } from "next/navigation"
import { AddToCartButton } from "@/components/product/add-to-cart-button"
import Link from "next/link"

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const productInfo = await db.query.products.findFirst({
    where: eq(products.slug, resolvedParams.slug),
  })

  // Padrão de Error Boundary e status 404 nativo
  if (!productInfo) {
    notFound()
  }

  return (
    <div className="container mx-auto px-6 py-12 md:py-24 max-w-6xl">
      <Link href="/" className="inline-flex items-center text-xs tracking-widest uppercase font-medium text-zinc-400 hover:text-zinc-900 mb-12 transition-colors">
        ← Voltar
      </Link>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24">
        {/* Editorial Image: Minimalist full width aspect */}
        <div className="aspect-[3/4] bg-zinc-100 bg-cover bg-center" style={{ backgroundImage: `url(${productInfo.imageUrl || 'https://via.placeholder.com/600x800'})` }} />

        {/* Details & Typography */}
        <div className="flex flex-col justify-center">
          <h1 className="font-serif text-4xl md:text-5xl text-zinc-900 tracking-tight leading-tight">{productInfo.name}</h1>
          <p className="text-2xl mt-6 font-light text-zinc-600">
            {(productInfo.price / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </p>
          
          <div className="mt-12 pt-8 border-t border-zinc-200">
            <p className="text-sm font-light text-zinc-500 mb-8">
              Estoque disponível: <span className="font-medium text-zinc-900">{productInfo.inventory}</span>
            </p>
            <AddToCartButton product={productInfo} variant="full" />
          </div>
          
          <div className="mt-12 space-y-6 text-sm text-zinc-500 font-light leading-relaxed">
            <p>Frete calculado na etapa de pagamento baseando-se nas dimensões do produto.</p>
            <p>Todas as compras acompanham código de rastreio automático.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
