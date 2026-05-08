'use client'

import { useCart } from "@/lib/store"
import Link from "next/link"
import { createCheckoutSession } from "@/actions/checkout"
import { useState, useEffect } from "react"
import { ShoppingBag, ArrowRight } from "lucide-react"

export default function CartPage() {
  const { items, removeItem, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  
  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleCheckout = async () => {
    setLoading(true)
    try {
      const result = await createCheckoutSession(items)
      if (result?.url) {
        window.location.href = result.url
      }
    } catch (e) {
      console.error(e)
      alert("Erro ao iniciar o checkout")
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) return null

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-6 py-32 text-center flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="font-serif text-3xl font-medium tracking-tight text-zinc-900 mb-4">Sua sacola está vazia</h1>
        <p className="text-zinc-500 mb-12 max-w-md font-light">Explore nossa coleção e encontre as ferramentas ideais para o seu dia a dia.</p>
        <Link 
          href="/" 
          className="bg-zinc-950 text-white px-8 py-4 text-sm font-medium tracking-wide hover:bg-zinc-800 transition-colors"
        >
          EXPLORAR PRODUTOS
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-6 py-16 max-w-5xl">
      <h1 className="font-serif text-3xl font-medium tracking-tight mb-12 text-zinc-900 border-b border-zinc-200 pb-6">Sacola de Compras</h1>
      
      <div className="flex flex-col lg:flex-row gap-12">
        <div className="flex-1">
          {items.map((item) => (
            <div key={item.id} className="flex gap-6 py-6 border-b border-zinc-100 last:border-0 group">
              <div className="w-24 h-32 bg-zinc-100 bg-cover bg-center shrink-0" style={{ backgroundImage: `url(${item.imageUrl || 'https://via.placeholder.com/150'})` }} />
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-medium text-zinc-900 tracking-tight">{item.name}</h3>
                  <p className="text-sm text-zinc-500 mt-1 font-light">Qtd: <span className="font-medium text-zinc-900">{item.quantity}</span></p>
                </div>
                <button 
                  onClick={() => removeItem(item.id)} 
                  className="text-left py-2 text-xs uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-colors"
                >
                  Remover
                </button>
              </div>
              <div className="text-right">
                <p className="font-medium text-zinc-900 block">
                  {((item.price * item.quantity)/100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="lg:w-[380px]">
          <div className="bg-zinc-50 p-8">
            <h2 className="font-serif text-xl tracking-tight text-zinc-900 mb-6">Resumo</h2>
            <div className="space-y-4 mb-8 text-sm font-light text-zinc-600 border-b border-zinc-200 pb-6">
              <div className="flex justify-between">
                <span>Subtotal ({items.reduce((acc, item) => acc + item.quantity, 0)} itens)</span>
                <span className="font-medium text-zinc-900">{(total/100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
              </div>
              <div className="flex justify-between">
                <span>Frete</span>
                <span className="text-zinc-400">Calculado no checkout</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center text-lg font-medium text-zinc-900 mb-8">
              <span>Total Estimado</span>
              <span>{(total/100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
            </div>
            
            <button 
              onClick={handleCheckout} 
              disabled={loading}
              className="w-full bg-zinc-950 text-white h-14 text-sm font-medium tracking-wide hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
            >
              {loading ? 'PROCESSANDO...' : 'FINALIZAR COMPRA'}
            </button>
            <div className="mt-8 text-center">
              <button 
                onClick={clearCart} 
                className="text-xs uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-colors"
              >
                Esvaziar Sacola
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
