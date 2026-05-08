'use client'

import { useCart } from "@/lib/store"
import { useState, useCallback } from "react"

interface AddToCartProps {
  product: {
    id: string
    name: string
    price: number
    imageUrl: string | null
    inventory: number | null
  }
  variant?: 'solid' | 'outline' | 'full'
}

export function AddToCartButton({ product, variant = 'solid' }: AddToCartProps) {
  const addItem = useCart((state) => state.addItem)
  const isOutOfStock = (product.inventory || 0) <= 0
  const [isAdded, setIsAdded] = useState(false)

  const handleAddToCart = useCallback(() => {
    if (isOutOfStock) return

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      imageUrl: product.imageUrl || undefined
    })

    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }, [product, addItem, isOutOfStock])

  // System Design: Base styles for different intent contexts
  const baseStyles = "w-full py-3 px-6 text-sm font-medium tracking-wide flex items-center justify-center transition-all duration-300 focus:outline-none"
  
  const variants = {
    outline: `border ${isAdded ? 'border-zinc-900 bg-zinc-900 text-white' : 'border-zinc-200 bg-white text-zinc-900 hover:border-zinc-900'}`,
    solid: `bg-zinc-900 text-white hover:bg-zinc-800`,
    full: `bg-zinc-900 text-white h-14 hover:bg-zinc-800`
  }

  const disabledStyles = "bg-zinc-100 text-zinc-400 border-zinc-100 cursor-not-allowed"

  return (
    <button
      onClick={handleAddToCart}
      disabled={isOutOfStock}
      aria-live="polite"
      className={`${baseStyles} ${isOutOfStock ? disabledStyles : variants[variant]}`}
    >
      {isOutOfStock ? 'Esgotado' : isAdded ? 'Adicionado' : 'Adicionar ao carrinho'}
    </button>
  )
}
