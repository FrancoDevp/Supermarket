import { type NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

// Ruta al archivo JSON
const dataFilePath = path.join(process.cwd(), "data", "shopping.json")

// Asegurarse de que el directorio existe
const ensureDirectoryExists = () => {
  const dir = path.dirname(dataFilePath)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }

  // Crear el archivo si no existe
  if (!fs.existsSync(dataFilePath)) {
    fs.writeFileSync(dataFilePath, JSON.stringify({ items: [] }), "utf8")
  }
}

// Leer datos del archivo
const readData = () => {
  ensureDirectoryExists()
  const data = fs.readFileSync(dataFilePath, "utf8")
  return JSON.parse(data)
}

// Escribir datos al archivo
const writeData = (data: any) => {
  ensureDirectoryExists()
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), "utf8")
}

// GET /api/items - Obtener todos los items o filtrar por fecha
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get("date")

    const data = readData()

    if (date) {
      // Filtrar por fecha
      const filteredItems = data.items.filter((item: any) => item.date === date)
      return NextResponse.json({ items: filteredItems })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error al leer los datos:", error)
    return NextResponse.json({ error: "Error al obtener los productos" }, { status: 500 })
  }
}

// POST /api/items - Agregar un nuevo item
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validar datos
    if (!body.name || typeof body.price !== "number" || body.price <= 0) {
      return NextResponse.json({ error: "Datos inválidos. Se requiere nombre y precio válido." }, { status: 400 })
    }

    // Preparar el nuevo item
    const newItem = {
      id: Date.now().toString(),
      name: body.name,
      price: body.price,
      date: body.date || new Date().toISOString().split("T")[0],
      category: body.category || "general",
    }

    // Leer datos actuales
    const data = readData()

    // Agregar el nuevo item
    data.items.push(newItem)

    // Guardar datos actualizados
    writeData(data)

    return NextResponse.json({ success: true, item: newItem })
  } catch (error) {
    console.error("Error al guardar los datos:", error)
    return NextResponse.json({ error: "Error al guardar el producto" }, { status: 500 })
  }
}

