import Link from "next/link"
import { Package, ShoppingCart, LayoutDashboard } from "lucide-react"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  
  // Muito básico MVP auth admin: Se não tem sessão ou não é a role admin (ajustada via credentials do auth.ts) redireciona
  if (!session || (session.user as any)?.role !== "admin") {
    redirect("/login")
  }

  return (
    <div className="flex min-h-screen bg-zinc-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-zinc-200 flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-zinc-200">
          <Link href="/" className="font-serif text-xl font-medium tracking-tight text-zinc-950 uppercase">
            NATI<span className="text-zinc-500">ADMIN</span>
          </Link>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-1">
          <Link 
            href="/admin/dashboard" 
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 transition-colors"
          >
            <LayoutDashboard className="w-5 h-5 flex-shrink-0" />
            Dashboard
          </Link>
          <Link 
            href="/admin/orders" 
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 transition-colors"
          >
            <ShoppingCart className="w-5 h-5 flex-shrink-0" />
            Pedidos
          </Link>
          <Link 
            href="/admin/products" 
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 transition-colors"
          >
            <Package className="w-5 h-5 flex-shrink-0" />
            Catálogo
          </Link>
        </nav>
        
        <div className="p-4 border-t border-zinc-200">
          <Link 
            href="/" 
            className="flex w-full items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-zinc-600 bg-zinc-100 rounded-md hover:bg-zinc-200 transition-colors"
          >
            Ver a loja
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Mobile header fake para manter espaço qnd não há sidebar real lá no layout root - 
            Idealmente você usaria 'group-routes' (admin) separados para não chocar com o Header da loja */}
        <div className="p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
