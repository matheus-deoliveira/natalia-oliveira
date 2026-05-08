import { signIn } from "@/auth"
import { redirect } from "next/navigation"

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-sm border border-zinc-200">
        <div>
          <h2 className="mt-6 text-center font-serif text-3xl text-zinc-900 uppercase tracking-tight">
            NATI<span className="text-zinc-500">ADMIN</span>
          </h2>
          <p className="mt-2 text-center text-sm text-zinc-600">
            Acesse o painel administrativo
          </p>
        </div>
        <form 
          className="mt-8 space-y-6" 
          action={async (formData) => {
            "use server"
            await signIn("credentials", Object.fromEntries(formData), { redirectTo: "/admin/dashboard" })
          }}
        >
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-zinc-700 mb-1">
                E-mail
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-zinc-300 placeholder-zinc-500 text-zinc-900 rounded-md focus:outline-none focus:ring-zinc-500 focus:border-zinc-500 focus:z-10 sm:text-sm"
                placeholder="admin@loja.local"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-zinc-700 mb-1">
                Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-zinc-300 placeholder-zinc-500 text-zinc-900 rounded-md focus:outline-none focus:ring-zinc-500 focus:border-zinc-500 focus:z-10 sm:text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-zinc-900 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-900 transition-colors"
            >
              Entrar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
