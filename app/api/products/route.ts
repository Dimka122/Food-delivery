import { menuItems as staticMenuItems } from "@/lib/menu-data"
import { NextRequest, NextResponse } from "next/server"

declare global {
  var __menuItems__: any[] | undefined
}

// Инициализация при первом запросе
function getMenuItems() {
  if (!global.__menuItems__) {
    global.__menuItems__ = [...staticMenuItems]
  }
  return global.__menuItems__
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    
    const menuItems = getMenuItems()
    let filteredItems = menuItems

    if (category && category !== "all") {
      filteredItems = filteredItems.filter(item => item.category === category)
    }

    if (search) {
      filteredItems = filteredItems.filter(item => 
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase())
      )
    }

    return NextResponse.json(filteredItems)
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const newItem = await request.json()
    const menuItems = getMenuItems()
    
    const itemWithId = {
      ...newItem,
      id: Math.max(...menuItems.map(item => item.id), 0) + 1,
      rating: 4.5
    }
    
    menuItems.push(itemWithId)
    
    return NextResponse.json(itemWithId, { status: 201 })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const updatedItem = await request.json()
    const { id } = updatedItem
    const menuItems = getMenuItems()
    
    const index = menuItems.findIndex(item => item.id === id)
    if (index === -1) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }
    
    menuItems[index] = { ...menuItems[index], ...updatedItem }
    
    return NextResponse.json(menuItems[index])
  } catch (error) {
    console.error("Error updating product:", error)
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = parseInt(searchParams.get("id") || "0")
    const menuItems = getMenuItems()
    
    const index = menuItems.findIndex(item => item.id === id)
    if (index === -1) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }
    
    menuItems.splice(index, 1)
    
    return NextResponse.json({ message: "Product deleted successfully" })
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
  }
}