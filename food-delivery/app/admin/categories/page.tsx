"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import {
  Plus,
  Edit,
  Trash2,
  Package,
  TrendingUp,
  Eye,
  EyeOff,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface Category {
  id: string
  name: string
  emoji: string
  description: string
  isActive: boolean
}

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [newCategory, setNewCategory] = useState<Partial<Category>>({
    name: "",
    emoji: "🍽️",
    description: "",
    isActive: true,
  })
  const [loading, setLoading] = useState(true)

  // Загрузка категорий
  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/categories')
      if (!response.ok) {
        throw new Error('Failed to fetch categories')
      }
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error('Error fetching categories:', error)
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить категории",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddCategory = async () => {
    if (!newCategory.name || !newCategory.description) {
      toast({
        title: "Ошибка",
        description: "Заполните все обязательные поля",
        variant: "destructive",
      })
      return
    }

    try {
      const categoryData = {
        id: newCategory.name.toLowerCase().replace(/\s+/g, "-"),
        name: newCategory.name,
        emoji: newCategory.emoji,
        description: newCategory.description,
        isActive: newCategory.isActive,
      }

      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to add category')
      }

      const addedCategory = await response.json()
      setCategories([...categories, addedCategory])
      
      setNewCategory({
        name: "",
        emoji: "🍽️",
        description: "",
        isActive: true,
      })
      setIsAddDialogOpen(false)
      
      toast({
        title: "Успех",
        description: "Категория успешно добавлена",
      })
    } catch (error) {
      console.error('Error adding category:', error)
      toast({
        title: "Ошибка",
        description: error instanceof Error ? error.message : "Не удалось добавить категорию",
        variant: "destructive",
      })
    }
  }

  const handleEditCategory = async () => {
    if (!editingCategory || !editingCategory.name || !editingCategory.description) {
      toast({
        title: "Ошибка",
        description: "Заполните все обязательные поля",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch('/api/categories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingCategory),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update category')
      }

      const updatedCategory = await response.json()
      setCategories(categories.map(cat => 
        cat.id === editingCategory.id ? updatedCategory : cat
      ))
      setIsEditDialogOpen(false)
      setEditingCategory(null)
      
      toast({
        title: "Успех",
        description: "Категория успешно обновлена",
      })
    } catch (error) {
      console.error('Error updating category:', error)
      toast({
        title: "Ошибка",
        description: error instanceof Error ? error.message : "Не удалось обновить категорию",
        variant: "destructive",
      })
    }
  }

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Вы уверены, что хотите удалить эту категорию?")) {
      return
    }

    try {
      const response = await fetch(`/api/categories?id=${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete category')
      }

      setCategories(categories.filter(cat => cat.id !== id))
      toast({
        title: "Успех",
        description: "Категория удалена",
      })
    } catch (error) {
      console.error('Error deleting category:', error)
      toast({
        title: "Ошибка",
        description: error instanceof Error ? error.message : "Не удалось удалить категорию",
        variant: "destructive",
      })
    }
  }

  const toggleActive = async (id: string) => {
    const category = categories.find(cat => cat.id === id)
    if (!category) return

    try {
      const updatedCategory = { ...category, isActive: !category.isActive }
      
      const response = await fetch('/api/categories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedCategory),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update category status')
      }

      const result = await response.json()
      setCategories(categories.map(cat =>
        cat.id === id ? result : cat
      ))
      
      toast({
        title: "Успех",
        description: "Статус категории изменен",
      })
    } catch (error) {
      console.error('Error updating category status:', error)
      toast({
        title: "Ошибка",
        description: error instanceof Error ? error.message : "Не удалось изменить статус",
        variant: "destructive",
      })
    }
  }

  const popularEmojis = [
    "🍕", "🍔", "🍣", "🥗", "🍰", "🥤", "☕", "🍜", "🌮", "🥙",
    "🍗", "🍖", "🥨", "🍞", "🧀", "🥚", "🥛", "🍯", "🍫", "🍩"
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Управление категориями</h1>
          <p className="text-gray-600 mt-2">
            Создание и управление категориями товаров
          </p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-orange-600 hover:bg-orange-700">
              <Plus className="h-4 w-4 mr-2" />
              Добавить категорию
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Добавить новую категорию</DialogTitle>
              <DialogDescription>
                Создайте новую категорию для товаров
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Название категории *</Label>
                <Input
                  id="name"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  placeholder="Название категории"
                />
              </div>
              <div>
                <Label htmlFor="description">Описание *</Label>
                <Input
                  id="description"
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                  placeholder="Краткое описание категории"
                />
              </div>
              <div>
                <Label htmlFor="emoji">Эмодзи категории</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="emoji"
                    value={newCategory.emoji}
                    onChange={(e) => setNewCategory({ ...newCategory, emoji: e.target.value })}
                    placeholder="🍽️"
                    className="w-20"
                  />
                  <div className="flex gap-1 flex-wrap">
                    {popularEmojis.slice(0, 8).map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => setNewCategory({ ...newCategory, emoji })}
                        className="w-8 h-8 text-lg hover:bg-gray-100 rounded"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={newCategory.isActive}
                  onCheckedChange={(checked) => setNewCategory({ ...newCategory, isActive: checked })}
                />
                <Label htmlFor="active">Активная категория</Label>
              </div>
              <Button onClick={handleAddCategory} className="w-full">
                Добавить категорию
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всего категорий</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Активных</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {categories.filter(cat => cat.isActive).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Категорий</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {categories.length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Categories Table */}
      <Card>
        <CardHeader>
          <CardTitle>Список категорий ({categories.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Категория</TableHead>
                <TableHead>Описание</TableHead>
                <TableHead>Товары</TableHead>
                <TableHead>Заказы</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{category.emoji}</div>
                      <div>
                        <div className="font-medium">{category.name}</div>
                        <div className="text-sm text-gray-500">
                          ID: {category.id}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs">
                      <p className="text-sm text-gray-600">{category.description}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-center">
                      <div className="text-lg font-semibold">{category.itemCount}</div>
                      <div className="text-xs text-gray-500">товаров</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-center">
                      <div className="text-lg font-semibold">{category.orderCount}</div>
                      <div className="text-xs text-gray-500">заказов</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={category.isActive}
                        onCheckedChange={() => toggleActive(category.id)}
                      />
                      <span className={`text-sm ${category.isActive ? 'text-green-600' : 'text-gray-500'}`}>
                        {category.isActive ? 'Активна' : 'Неактивна'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingCategory(category)
                          setIsEditDialogOpen(true)
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleActive(category.id)}
                        className={category.isActive ? "text-orange-600" : "text-green-600"}
                      >
                        {category.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteCategory(category.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Редактировать категорию</DialogTitle>
            <DialogDescription>
              Измените информацию о категории
            </DialogDescription>
          </DialogHeader>
          {editingCategory && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Название категории *</Label>
                <Input
                  id="edit-name"
                  value={editingCategory.name}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-description">Описание *</Label>
                <Input
                  id="edit-description"
                  value={editingCategory.description}
                  onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-emoji">Эмодзи категории</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="edit-emoji"
                    value={editingCategory.emoji}
                    onChange={(e) => setEditingCategory({ ...editingCategory, emoji: e.target.value })}
                    className="w-20"
                  />
                  <div className="flex gap-1 flex-wrap">
                    {popularEmojis.slice(0, 8).map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => setEditingCategory({ ...editingCategory, emoji })}
                        className="w-8 h-8 text-lg hover:bg-gray-100 rounded"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-active"
                  checked={editingCategory.isActive}
                  onCheckedChange={(checked) => setEditingCategory({ ...editingCategory, isActive: checked })}
                />
                <Label htmlFor="edit-active">Активная категория</Label>
              </div>
              <Button onClick={handleEditCategory} className="w-full">
                Сохранить изменения
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}