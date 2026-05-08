import { db } from "@/db"
import { orders } from "@/db/schema"
import { desc } from "drizzle-orm"

export default async function AdminOrdersPage() {
  const allOrders = await db.query.orders.findMany({
    orderBy: [desc(orders.createdAt)],
  })

  return (
    <div>
      <h1 className="text-3xl font-bold text-zinc-900 mb-8">Pedidos Recentes</h1>
      <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
        <table className="min-w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-50 border-b border-zinc-200 text-xs uppercase tracking-wider text-zinc-500 font-medium">
              <th className="px-6 py-4">ID do Pedido</th>
              <th className="px-6 py-4">Data</th>
              <th className="px-6 py-4">Total</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            {allOrders.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-zinc-500">
                  Nenhum pedido realizado ainda.
                </td>
              </tr>
            ) : (
              allOrders.map((order) => (
                <tr key={order.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-zinc-900">
                    #{order.id.slice(0, 8)}...
                  </td>
                  <td className="px-6 py-4 text-zinc-500">
                    {order.createdAt?.toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 font-medium text-zinc-600">
                    {(order.totalAmt / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-100 text-zinc-800 uppercase">
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
