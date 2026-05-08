'use client'

import { useEffect } from 'react'

// Padrão Error Boundary obrigatório do Next.js
export default function ShopErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Aqui conectaria com um Sentry ou similar
    console.error(error)
  }, [error])

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center container mx-auto p-4 text-center">
      <h2 className="text-2xl font-bold text-red-600 mb-2">Ops! Algo deu errado.</h2>
      <p className="text-gray-600 mb-6">Não foi possível carregar os dados desta página.</p>
      <button
        onClick={() => reset()}
        className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
      >
        Tentar novamente
      </button>
    </div>
  )
}
