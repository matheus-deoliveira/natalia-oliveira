import { db } from "@/db"
import { products } from "@/db/schema"
import Link from "next/link"
import { Package, Plus } from "lucide-react"
import { desc } from "drizzle-orm"

export default async function AdminProductsPage() {
  // O Drizzle ainda não tem createdAt em products no seu schema, então vamos ordenar por name
  const allProducts = await db.query.products.findMany()

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-zinc-900">Produtos</h1>
        <Link 
          href="/admin/products/new" 
          className="flex items-center gap-2 bg-zinc-900 text-white px-4 py-2 text-sm font-medium rounded-lg hover:bg-zinc-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Adicionar Produto
        </Link>
      </div>

      {allProducts.length === 0 ? (
        <div className="bg-white border border-zinc-200 rounded-xl p-12 text-center flex flex-col items-center">
          <div className="bg-zinc-100 p-4 rounded-full mb-4">
            <Package className="w-8 h-8 text-zinc-400" />
          </div>
          <h3 className="text-lg font-medium text-zinc-900 mb-1">Nenhum produto cadastrado</h3>
          <p className="text-zinc-500 mb-6">Comece adicionando itens ao seu catálogo de vendas.</p>
          <Link href="/admin/products/new" className="text-zinc-900 font-medium hover:underline">
            Criar primeiro produto
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200 text-xs uppercase tracking-wider text-zinc-500 font-medium">
                <th className="px-6 py-4">Produto</th>
                <th className="px-6 py-4">Preço</th>
                <th className="px-6 py-4">Estoque</th>
                <th className="px-6 py-4">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {allProducts.map((product) => (
                <tr key={product.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-10 h-10 rounded bg-zinc-200 bg-cover bg-center shrink-0" 
                        style={{ backgroundImage: `url(${product.imageUrl || 'https://via.placeholder.com/150'})` }} 
                      />
                      <div>
                        <p className="font-medium text-zinc-900">{product.name}</p>
                        <p className="text-xs text-zinc-500">/{product.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-zinc-600 font-medium">
                    {(product.price / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      product.inventory && product.inventory > 5 
                        ? 'bg-green-100 text-green-800' 
                        : product.inventory && product.inventory > 0 
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                    }`}>
                      {product.inventory} un
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <Link href={`/(shop)/product/${product.slug}`} target="_blank" className="text-blue-600 hover:text-blue-800 font-medium">
                      Ver na loja
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
