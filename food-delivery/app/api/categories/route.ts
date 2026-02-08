import { categories } from "@/components/categories"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Фильтруем категорию "Все" для админки
    const adminCategories = categories.filter(cat => cat.id !== "all")
    
    return NextResponse.json(adminCategories)
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const newCategory = await request.json()
    
    // Проверяем уникальность ID
    const exists = categories.find(cat => cat.id === newCategory.id)
    if (exists) {
      return NextResponse.json({ error: "Category ID already exists" }, { status: 400 })
    }
    
    categories.push(newCategory)
    
    return NextResponse.json(newCategory, { status: 201 })
  } catch (error) {
    console.error("Error creating category:", error)
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const updatedCategory = await request.json()
    const { id } = updatedCategory
    
    const index = categories.findIndex(cat => cat.id === id)
    if (index === -1) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }
    
    categories[index] = { ...categories[index], ...updatedCategory }
    
    return NextResponse.json(categories[index])
  } catch (error) {
    console.error("Error updating category:", error)
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    
    if (id === "all") {
      return NextResponse.json({ error: "Cannot delete 'all' category" }, { status: 400 })
    }
    
    const index = categories.findIndex(cat => cat.id === id)
    if (index === -1) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }
    
    categories.splice(index, 1)
    
    return NextResponse.json({ message: "Category deleted successfully" })
  } catch (error) {
    console.error("Error deleting category:", error)
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 })
  }
}