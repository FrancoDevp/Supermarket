"use client"

import { useState, useEffect } from "react"

// Lista de productos comunes para autocompletado
const commonProducts = [
  "Leche",
  "Pan",
  "Huevos",
  "Arroz",
  "Pasta",
  "Aceite",
  "Azúcar",
  "Sal",
  "Café",
  "Té",
  "Yogurt",
  "Queso",
  "Mantequilla",
  "Pollo",
  "Carne molida",
  "Pescado",
  "Manzanas",
  "Plátanos",
  "Naranjas",
  "Tomates",
  "Cebollas",
  "Papas",
  "Zanahorias",
  "Lechuga",
  "Papel higiénico",
  "Jabón",
  "Champú",
  "Detergente",
  "Agua",
  "Refresco",
  "Cerveza",
  "Vino",
  "Galletas",
  "Chocolate",
]

interface ProductSuggestionsProps {
  input: string
  onSelect: (suggestion: string) => void
}

export default function ProductSuggestions({ input, onSelect }: ProductSuggestionsProps) {
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([])

  useEffect(() => {
    if (!input) {
      setFilteredSuggestions([])
      return
    }

    const filtered = commonProducts.filter((product) => product.toLowerCase().includes(input.toLowerCase())).slice(0, 5) // Limitar a 5 sugerencias

    setFilteredSuggestions(filtered)
  }, [input])

  if (filteredSuggestions.length === 0) return null

  return (
    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
      <ul className="py-1">
        {filteredSuggestions.map((suggestion, index) => (
          <li
            key={index}
            className="px-3 py-2 cursor-pointer hover:bg-emerald-50 text-sm"
            onClick={() => onSelect(suggestion)}
          >
            {suggestion}
          </li>
        ))}
      </ul>
    </div>
  )
}

