"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { PlusCircle, Download, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { generatePDF } from "@/lib/pdf-generator"
import ProductItem from "@/components/product-item"
import ProductSuggestions from "@/components/product-suggestions"

// Tipo para los productos
interface Product {
  id: string
  name: string
  price: number
  date: string
}

export default function ShoppingList() {
  const [products, setProducts] = useState<Product[]>([])
  const [newProduct, setNewProduct] = useState({ name: "", price: "" })
  const [showSuggestions, setShowSuggestions] = useState(false)
  const { toast } = useToast()

  // Cargar productos del localStorage al iniciar
  useEffect(() => {
    const savedProducts = localStorage.getItem("shoppingProducts")
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts))
    }
  }, [])

  // Guardar productos en localStorage cuando cambian
  useEffect(() => {
    localStorage.setItem("shoppingProducts", JSON.stringify(products))
  }, [products])

  const handleAddProduct = () => {
    if (!newProduct.name.trim() || !newProduct.price || Number.parseFloat(newProduct.price) <= 0) {
      toast({
        title: "Error",
        description: "Por favor ingresa un nombre y precio válido",
        variant: "destructive",
      })
      return
    }

    const product: Product = {
      id: Date.now().toString(),
      name: newProduct.name.trim(),
      price: Number.parseFloat(newProduct.price),
      date: new Date().toISOString().split("T")[0],
    }

    setProducts([...products, product])
    setNewProduct({ name: "", price: "" })

    toast({
      title: "Producto agregado",
      description: `${product.name} ha sido agregado a tu lista`,
    })
  }

  const handleRemoveProduct = (id: string) => {
    setProducts(products.filter((product) => product.id !== id))
    toast({
      title: "Producto eliminado",
      description: "El producto ha sido eliminado de tu lista",
    })
  }

  const handleDownloadPDF = () => {
    if (products.length === 0) {
      toast({
        title: "Lista vacía",
        description: "Agrega productos antes de descargar el PDF",
        variant: "destructive",
      })
      return
    }

    generatePDF(products)

    toast({
      title: "PDF generado",
      description: "Tu lista de compras ha sido descargada como PDF",
    })
  }

  const handleProductNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewProduct({ ...newProduct, name: e.target.value })
    setShowSuggestions(e.target.value.length > 0)
  }

  const selectSuggestion = (suggestion: string) => {
    setNewProduct({ ...newProduct, name: suggestion })
    setShowSuggestions(false)
  }

  // Calcular el total de la compra
  const totalAmount = products.reduce((sum, product) => sum + product.price, 0).toFixed(2)

  return (
    <div className="grid md:grid-cols-[1fr_300px] gap-8">
      <div>
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid gap-4">
              <div className="relative">
                <Label htmlFor="productName">Nombre del producto</Label>
                <Input
                  id="productName"
                  placeholder="Ej: Leche, Pan, Huevos..."
                  value={newProduct.name}
                  onChange={handleProductNameChange}
                  className="mb-1"
                />
                {showSuggestions && <ProductSuggestions input={newProduct.name} onSelect={selectSuggestion} />}
              </div>

              <div>
                <Label htmlFor="productPrice">Precio</Label>
                <Input
                  id="productPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                />
              </div>

              <Button onClick={handleAddProduct} className="w-full bg-emerald-600 hover:bg-emerald-700">
                <PlusCircle className="mr-2 h-4 w-4" /> Agregar Producto
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-emerald-800">Lista de Productos ({products.length})</h2>
            <Button
              variant="outline"
              onClick={handleDownloadPDF}
              className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
            >
              <Download className="mr-2 h-4 w-4" /> Descargar PDF
            </Button>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <ShoppingCart className="mx-auto h-12 w-12 text-gray-400 mb-3" />
              <p className="text-gray-500">Tu lista de compras está vacía</p>
              <p className="text-gray-400 text-sm">Agrega productos usando el formulario</p>
            </div>
          ) : (
            <div className="space-y-3">
              {products.map((product) => (
                <ProductItem key={product.id} product={product} onRemove={handleRemoveProduct} />
              ))}
            </div>
          )}
        </div>
      </div>

      <div>
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold text-emerald-800 mb-4">Resumen</h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total de productos:</span>
                <span className="font-medium">{products.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total a pagar:</span>
                <span className="font-bold text-lg">${totalAmount}</span>
              </div>
            </div>
            <Button
              onClick={handleDownloadPDF}
              className="w-full bg-emerald-600 hover:bg-emerald-700"
              disabled={products.length === 0}
            >
              <Download className="mr-2 h-4 w-4" /> Descargar PDF
            </Button>
          </CardContent>
        </Card>
      </div>
      <Toaster />
    </div>
  )
}

