const express = require("express")
const cors = require("cors")
const fs = require("fs")
const path = require("path")
const bodyParser = require("body-parser")

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(bodyParser.json())

// Ruta al archivo JSON
const dataFilePath = path.join(__dirname, "data", "shopping.json")

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
const writeData = (data) => {
  ensureDirectoryExists()
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), "utf8")
}

// GET /api/items - Obtener todos los items o filtrar por fecha
app.get("/api/items", (req, res) => {
  try {
    const { date } = req.query
    const data = readData()

    if (date) {
      // Filtrar por fecha
      const filteredItems = data.items.filter((item) => item.date === date)
      return res.json({ items: filteredItems })
    }

    return res.json(data)
  } catch (error) {
    console.error("Error al leer los datos:", error)
    return res.status(500).json({ error: "Error al obtener los productos" })
  }
})

// POST /api/items - Agregar un nuevo item
app.post("/api/items", (req, res) => {
  try {
    const body = req.body

    // Validar datos
    if (!body.name || typeof body.price !== "number" || body.price <= 0) {
      return res.status(400).json({
        error: "Datos inválidos. Se requiere nombre y precio válido.",
      })
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

    return res.json({ success: true, item: newItem })
  } catch (error) {
    console.error("Error al guardar los datos:", error)
    return res.status(500).json({ error: "Error al guardar el producto" })
  }
})

// DELETE /api/items/:id - Eliminar un item
app.delete("/api/items/:id", (req, res) => {
  try {
    const { id } = req.params

    // Leer datos actuales
    const data = readData()

    // Filtrar el item a eliminar
    const itemIndex = data.items.findIndex((item) => item.id === id)

    if (itemIndex === -1) {
      return res.status(404).json({ error: "Producto no encontrado" })
    }

    // Eliminar el item
    data.items.splice(itemIndex, 1)

    // Guardar datos actualizados
    writeData(data)

    return res.json({ success: true })
  } catch (error) {
    console.error("Error al eliminar el producto:", error)
    return res.status(500).json({ error: "Error al eliminar el producto" })
  }
})

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`)
})

