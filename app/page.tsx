import ShoppingList from "@/components/shopping-list"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 text-center">          
          <h1 className="text-3xl font-bold text-emerald-700 mb-2">Mis Compras</h1>
          <p className="text-emerald-600">Registra tus compras del supermercado</p>
        </header>
        <ShoppingList />
      </div>
    </main>
  )
}

