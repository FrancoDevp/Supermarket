"use client"

import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatDate, formatCurrency } from "@/lib/utils"

interface Product {
  id: string
  name: string
  price: number
  date: string
}

interface ProductItemProps {
  product: Product
  onRemove: (id: string) => void
}

export default function ProductItem({ product, onRemove }: ProductItemProps) {
  return (
    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex-1">
        <h3 className="font-medium text-gray-900">{product.name}</h3>
        <div className="flex items-center text-sm text-gray-500">
          <span>{formatDate(product.date)}</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="font-semibold text-emerald-700">{formatCurrency(product.price)}</span>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onRemove(product.id)}
          className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Eliminar</span>
        </Button>
      </div>
    </div>
  )
}

