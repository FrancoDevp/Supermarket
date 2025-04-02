import fs from "fs"
import path from "path"

interface ShoppingItem {
  id: string
  name: string
  price: number
  date: string
  category?: string
}

interface ShoppingData {
  items: ShoppingItem[]
}

/**
 * Filtra productos por fecha desde un archivo shopping.json
 * @param {string} dateStr - Fecha en formato ISO (YYYY-MM-DD)
 * @returns {ShoppingItem[]} - Array de productos ordenados del más reciente al más antiguo
 */
export function filterProductsByDate(dateStr?: string): ShoppingItem[] {
  try {
    // Ruta al archivo JSON
    const dataFilePath = path.join(process.cwd(), "data", "shopping.json")

    // Verificar si el archivo existe
    if (!fs.existsSync(dataFilePath)) {
      console.log("El archivo shopping.json no existe")
      return []
    }

    // Leer el archivo
    const rawData = fs.readFileSync(dataFilePath, "utf8")
    const data: ShoppingData = JSON.parse(rawData)

    // Filtrar por fecha si se proporciona
    let filteredItems = data.items
    if (dateStr) {
      filteredItems = data.items.filter((item) => item.date === dateStr)
    }

    // Ordenar del más reciente al más antiguo
    return filteredItems.sort((a, b) => {
      const dateA = new Date(a.date).getTime()
      const dateB = new Date(b.date).getTime()
      return dateB - dateA
    })
  } catch (error) {
    console.error("Error al filtrar productos por fecha:", error)
    return []
  }
}

/**
 * Obtiene productos agrupados por fecha
 * @returns {Object} - Objeto con fechas como claves y arrays de productos como valores
 */
export function getProductsByDate(): Record<string, ShoppingItem[]> {
  try {
    // Obtener todos los productos
    const allProducts = filterProductsByDate()

    // Agrupar por fecha
    const groupedByDate: Record<string, ShoppingItem[]> = {}

    allProducts.forEach((product) => {
      if (!groupedByDate[product.date]) {
        groupedByDate[product.date] = []
      }
      groupedByDate[product.date].push(product)
    })

    return groupedByDate
  } catch (error) {
    console.error("Error al agrupar productos por fecha:", error)
    return {}
  }
}

