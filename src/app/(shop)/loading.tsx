// Esqueleto otimizado de layout carregando
export default function ShopLoading() {
  return (
    <div className="container mx-auto p-4">
      <div className="h-10 w-48 bg-gray-200 rounded animate-pulse mb-6"></div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="border p-5 rounded-xl shadow-sm bg-white">
            <div className="aspect-square bg-gray-200 rounded-md mb-4 animate-pulse" />
            <div className="h-6 bg-gray-200 rounded animate-pulse mb-2 w-3/4"></div>
            <div className="h-5 bg-gray-200 rounded animate-pulse w-1/3"></div>
            <div className="h-10 bg-gray-200 rounded animate-pulse mt-4 w-full"></div>
          </div>
        ))}
      </div>
    </div>
  )
}