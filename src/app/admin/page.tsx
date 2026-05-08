import { redirect } from "next/navigation"

export default function AdminIndexPage() {
  // Redireciona o acesso a /admin para os pedidos (ou dashboard)
  redirect("/admin/orders")
}
