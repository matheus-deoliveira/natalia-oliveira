import Link from "next/link"
import React from "react"
import { AddToCartButton } from "./add-to-cart-button"

export interface ProductCardProps {
  product: {
    id: string
    name: string
    slug: string
    price: number
    imageUrl: string | null
    inventory: number | null
  }
}

export const ProductCard = React.memo<ProductCardProps>(({ product }) => {
  return (
    <div className="group flex flex-col relative w-full">
      <Link href={`/(shop)/product/${product.slug}`} className="absolute inset-0 z-0" aria-label={`Ver detalhes do produto ${product.name}`} />
      
      {/* Editorial Image Container - Aspect 3:4 */}
      <div className="overflow-hidden bg-zinc-100 aspect-[3/4] w-full mb-5 relative z-10 pointer-events-none">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105" 
          style={{ backgroundImage: `url(${product.imageUrl || 'https://via.placeholder.com/400x533'})` }} 
        />
      </div>
      
      {/* Typography Hierarchy */}
      <div className="flex flex-col relative z-10 pointer-events-none">
        <h2 className="text-[15px] font-medium text-zinc-900 tracking-tight">{product.name}</h2>
        <p className="text-[14px] text-zinc-500 mt-1 font-light">
          {(product.price / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </p>
      </div>
      
      {/* Minimalist Action */}
      <div className="mt-4 relative z-10 opacity-100 md:opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <AddToCartButton product={product} variant="outline" />
      </div>
    </div>
  )
})

ProductCard.displayName = "ProductCard"


