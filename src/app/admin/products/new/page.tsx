import { createProduct } from "@/actions/products"
import Link from "next/link"

export default function NewProductPage() {
  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-zinc-900">Novo Produto</h1>
        <Link href="/admin/products" className="text-sm font-medium text-zinc-500 hover:text-zinc-900">
          Cancelar
        </Link>
      </div>

      <form action={createProduct} className="space-y-6 bg-white p-8 border border-zinc-200 rounded-xl shadow-sm">
        <div className="grid grid-cols-2 gap-6">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-zinc-700 mb-1">Nome do Produto</label>
            <input required type="text" name="name" className="w-full border border-zinc-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-black outline-none" placeholder="Ex: Broca de Diamante" />
          </div>
          
          <div className="col-span-2">
            <label className="block text-sm font-medium text-zinc-700 mb-1">Slug (URL amigável)</label>
            <input required type="text" name="slug" className="w-full border border-zinc-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-black outline-none" placeholder="Ex: broca-de-diamante" />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Preço (R$)</label>
            <input required type="number" step="0.01" min="0" name="price" className="w-full border border-zinc-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-black outline-none" placeholder="150.00" />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Estoque Inicial</label>
            <input required type="number" min="0" name="inventory" className="w-full border border-zinc-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-black outline-none" placeholder="10" />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-zinc-700 mb-1">URL da Imagem</label>
            <input type="url" name="imageUrl" className="w-full border border-zinc-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-black outline-none" placeholder="https://..." />
          </div>
        </div>

        <div className="pt-6 border-t border-zinc-200">
          <h2 className="text-lg font-medium text-zinc-900 mb-4">Dimensões p/ Frete (Melhor Envio)</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Peso (kg)</label>
              <input required type="number" step="0.001" min="0" name="weight" className="w-full border border-zinc-300 rounded-lg px-3 py-2" placeholder="0.5" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Largura (cm)</label>
              <input required type="number" step="0.1" min="0" name="width" className="w-full border border-zinc-300 rounded-lg px-3 py-2" placeholder="10" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Altura (cm)</label>
              <input required type="number" step="0.1" min="0" name="height" className="w-full border border-zinc-300 rounded-lg px-3 py-2" placeholder="5" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Compr. (cm)</label>
              <input required type="number" step="0.1" min="0" name="length" className="w-full border border-zinc-300 rounded-lg px-3 py-2" placeholder="15" />
            </div>
          </div>
        </div>

        <div className="pt-4">
          <button type="submit" className="w-full bg-zinc-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-zinc-800 transition-colors">
            Salvar Produto
          </button>
        </div>
      </form>
    </div>
  )
}
