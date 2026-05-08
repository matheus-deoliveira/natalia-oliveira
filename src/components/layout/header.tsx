'use client'

import Link from "next/link"
import { useCart } from "@/lib/store"
import { ShoppingBag } from "lucide-react"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

export function Header() {
  const items = useCart((state) => state.items)
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Omitir header na área de admin e login
  if (pathname?.startsWith('/admin') || pathname?.startsWith('/login')) {
    return null
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-xl transition-all">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="font-serif text-2xl font-medium tracking-tight text-zinc-950 uppercase">
          NATI<span className="text-zinc-500">SHOP</span>
        </Link>
        <Link href="/cart" className="relative p-2 text-zinc-600 hover:text-zinc-950 transition-colors flex items-center group">
          <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
          {mounted && totalItems > 0 && (
            <span className="absolute 1 top-1 -right-1 bg-zinc-950 text-white text-[10px] font-medium w-4 h-4 rounded-full flex items-center justify-center animate-in zoom-in-50 duration-300">
              {totalItems}
            </span>
          )}
        </Link>
      </div>
    </header>
  )
}
