import { db } from "@/db"
import { products } from "@/db/schema"
import { ProductCard } from "@/components/product/product-card"

export default async function ShopPage() {
  const storeProducts = await db.select().from(products)

  return (
    <div className="flex flex-col min-h-screen">
      {/* Editorial Hero Section */}
      <section className="bg-zinc-100 px-6 py-24 md:py-32 flex flex-col items-center justify-center text-center">
        <h1 className="font-serif text-4xl md:text-6xl text-zinc-900 tracking-tight mb-4">
          A Coleção Essencial
        </h1>
        <p className="text-zinc-500 max-w-lg mx-auto text-lg md:text-xl font-light">
          Ferramentas de alta precisão e cuidados específicos, selecionados para a máxima performance.
        </p>
      </section>

      {/* Product Grid */}
      <section className="container mx-auto px-6 py-20">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-widest">Lançamentos</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16">
          {storeProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  )
}
