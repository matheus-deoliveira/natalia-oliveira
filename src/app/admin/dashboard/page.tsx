export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-zinc-900 mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 border border-zinc-200 rounded-xl shadow-sm">
          <h3 className="text-zinc-500 font-medium whitespace-nowrap mb-2">Total de Vendas</h3>
          <p className="text-3xl font-bold text-zinc-900 line-clamp-1 truncate text-ellipsis">R$ 0,00</p>
        </div>
        <div className="bg-white p-6 border border-zinc-200 rounded-xl shadow-sm">
          <h3 className="text-zinc-500 font-medium mb-2">Pedidos Realizados</h3>
          <p className="text-3xl font-bold text-zinc-900">0</p>
        </div>
        <div className="bg-white p-6 border border-zinc-200 rounded-xl shadow-sm">
          <h3 className="text-zinc-500 font-medium mb-2">Aguardando Envio</h3>
          <p className="text-3xl font-bold text-zinc-900">0</p>
        </div>
      </div>
    </div>
  )
}
