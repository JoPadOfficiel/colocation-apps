import { useState, useEffect } from "react"
import {
  Search,
  ShoppingBag,
  Utensils,
  Heart,
  Clock,
  Users,
  CheckCircle,
  Trash2,
  MoreVertical,
  Pencil,
  X,
  PlusCircle,
  ChefHat,
  Info,
  Calendar,
  Sparkles
} from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  fetchRecipes,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  fetchShoppingList,
  createShoppingItem,
  updateShoppingItem,
  deleteShoppingItem,
  fetchUsers,
  updateUser
} from "@/lib/api"
import ConfirmDialog from "@/components/ConfirmDialog"

const SHOPPING_CATEGORIES = [
  "Produits laitiers",
  "Boulangerie",
  "Frais",
  "Épicerie",
  "Hygiène",
  "Ménage",
  "Autre"
]

const COMMON_DIETS = [
  "Végétarien",
  "Végétalien",
  "Sans gluten",
  "Sans lactose",
  "Sans porc",
  "Sans sel",
  "Halal",
  "Casher"
]

export default function Food() {
  const { user, setUser } = useAuth()
  const [recipes, setRecipes] = useState([])
  const [shoppingItems, setShoppingItems] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("menu")

  // Shopping form state
  const [newItemName, setNewItemName] = useState("")
  const [newItemCategory, setNewItemCategory] = useState("Épicerie")

  // Recipes state
  const [searchQuery, setSearchQuery] = useState("")
  const [recipeDialogOpen, setRecipeDialogOpen] = useState(false)
  const [editingRecipe, setEditingRecipe] = useState(null)
  const [recipeForm, setRecipeForm] = useState({
    dishName: "",
    prepTime: "",
    portions: "",
    ingredients: "",
    dietaryConstraints: [],
    isFavorite: false
  })
  const [recipeErrors, setRecipeErrors] = useState({})
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [recipeToDelete, setRecipeToDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Dietary constraints state
  const [newConstraint, setNewConstraint] = useState("")

  // Menu du jour state
  const [dailyMenu, setDailyMenu] = useState(null)

  useEffect(() => {
    Promise.all([fetchRecipes(), fetchShoppingList(), fetchUsers()])
      .then(([r, s, u]) => {
        setRecipes(r)
        setShoppingItems(s)
        setUsers(u)

        // Suggest a random favorite or random recipe for the menu du jour
        if (r.length > 0) {
          const favorites = r.filter(recipe => recipe.isFavorite)
          const pool = favorites.length > 0 ? favorites : r
          const randomRecipe = pool[Math.floor(Math.random() * pool.length)]
          setDailyMenu(randomRecipe)
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const userMap = {}
  users.forEach((u) => { userMap[u.id] = u.name })

  // Shopping Actions
  async function handleAddShoppingItem(e) {
    e.preventDefault()
    if (!newItemName.trim()) return
    try {
      const item = await createShoppingItem({
        itemName: newItemName.trim(),
        category: newItemCategory,
        isPurchased: false,
        assignedTo: user?.id
      })
      setShoppingItems((prev) => [...prev, item])
      setNewItemName("")
    } catch (err) {
      console.error("Add shopping item error:", err)
    }
  }

  async function toggleShoppingItem(item) {
    try {
      const updated = await updateShoppingItem(item.id, { isPurchased: !item.isPurchased })
      setShoppingItems((prev) => prev.map((i) => (i.id === item.id ? updated : i)))
    } catch (err) {
      console.error("Toggle shopping item error:", err)
    }
  }

  async function handleDeleteShoppingItem(id) {
    try {
      await deleteShoppingItem(id)
      setShoppingItems((prev) => prev.filter((i) => i.id !== id))
    } catch (err) {
      console.error("Delete shopping item error:", err)
    }
  }

  // Recipes Actions
  function resetRecipeForm() {
    setRecipeForm({
      dishName: "",
      prepTime: "",
      portions: "",
      ingredients: "",
      dietaryConstraints: [],
      isFavorite: false
    })
    setRecipeErrors({})
    setEditingRecipe(null)
    setRecipeDialogOpen(false)
  }

  function toggleConstraintInForm(diet) {
    setRecipeForm(prev => {
      const current = prev.dietaryConstraints || []
      if (current.includes(diet)) {
        return { ...prev, dietaryConstraints: current.filter(c => c !== diet) }
      } else {
        return { ...prev, dietaryConstraints: [...current, diet] }
      }
    })
  }

  function openCreateRecipe() {
    setEditingRecipe(null)
    setRecipeForm({
      dishName: "",
      prepTime: "",
      portions: "",
      ingredients: "",
      dietaryConstraints: [],
      isFavorite: false
    })
    setRecipeErrors({})
    setRecipeDialogOpen(true)
  }

  function startEditRecipe(recipe) {
    setEditingRecipe(recipe)
    setRecipeForm({
      dishName: recipe.dishName,
      prepTime: recipe.prepTime.toString(),
      portions: recipe.portions.toString(),
      ingredients: recipe.ingredients.join(", "),
      dietaryConstraints: recipe.dietaryConstraints || [],
      isFavorite: recipe.isFavorite || false
    })
    setRecipeErrors({})
    setRecipeDialogOpen(true)
  }

  const validateRecipeForm = () => {
    const newErrors = {};
    if (!recipeForm.dishName.trim()) newErrors.dishName = "Le nom du plat est requis";
    if (!recipeForm.prepTime || parseInt(recipeForm.prepTime) <= 0) newErrors.prepTime = "Le temps de préparation doit être > 0";
    if (!recipeForm.portions || parseInt(recipeForm.portions) <= 0) newErrors.portions = "Le nombre de portions doit être > 0";
    if (!recipeForm.ingredients.trim()) newErrors.ingredients = "Les ingrédients sont requis";
    
    setRecipeErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleRecipeSubmit(e) {
    e.preventDefault()
    if (!validateRecipeForm()) return;

    const payload = {
      ...recipeForm,
      prepTime: parseInt(recipeForm.prepTime) || 0,
      portions: parseInt(recipeForm.portions) || 0,
      ingredients: recipeForm.ingredients.split(",").map(i => i.trim()).filter(Boolean)
    }
    try {
      if (editingRecipe) {
        const updated = await updateRecipe(editingRecipe.id, payload)
        setRecipes((prev) => prev.map((r) => (r.id === editingRecipe.id ? updated : r)))
        if (dailyMenu?.id === editingRecipe.id) setDailyMenu(updated)
      } else {
        const created = await createRecipe(payload)
        setRecipes((prev) => [...prev, created])
      }
      resetRecipeForm()
    } catch (err) {
      console.error("Recipe save error:", err)
    }
  }

  async function toggleFavorite(recipe) {
    try {
      const updated = await updateRecipe(recipe.id, { isFavorite: !recipe.isFavorite })
      setRecipes((prev) => prev.map((r) => (r.id === recipe.id ? updated : r)))
      if (dailyMenu?.id === recipe.id) setDailyMenu(updated)
    } catch (err) {
      console.error("Favorite toggle error:", err)
    }
  }

  async function confirmDeleteRecipe() {
    if (!recipeToDelete) return
    setIsDeleting(true)
    try {
      await deleteRecipe(recipeToDelete)
      setRecipes((prev) => prev.filter((r) => r.id !== recipeToDelete))
      if (dailyMenu?.id === recipeToDelete) setDailyMenu(null)
    } catch (err) {
      console.error("Delete recipe error:", err)
    } finally {
      setIsDeleting(false)
      setDeleteConfirmOpen(false)
      setRecipeToDelete(null)
    }
  }

  // Dietary Constraints Actions
  async function addConstraint(constraint) {
    const trimmed = constraint.trim()
    if (!trimmed || (user.dietaryConstraints || []).includes(trimmed)) return
    try {
      const updated = await updateUser(user.id, {
        dietaryConstraints: [...(user.dietaryConstraints || []), trimmed]
      })
      setUser(updated)
      setUsers(prev => prev.map(u => u.id === user.id ? updated : u))
      setNewConstraint("")
    } catch (err) {
      console.error("Add constraint error:", err)
    }
  }

  async function removeConstraint(constraint) {
    try {
      const updated = await updateUser(user.id, {
        dietaryConstraints: (user.dietaryConstraints || []).filter(c => c !== constraint)
      })
      setUser(updated)
      setUsers(prev => prev.map(u => u.id === user.id ? updated : u))
    } catch (err) {
      console.error("Remove constraint error:", err)
    }
  }

  function shuffleMenu() {
    if (recipes.length === 0) return
    const randomRecipe = recipes[Math.floor(Math.random() * recipes.length)]
    setDailyMenu(randomRecipe)
  }

  const filteredShoppingItems = shoppingItems.filter(item =>
    item.itemName.toLowerCase().includes(newItemName.toLowerCase())
  )

  const itemsByCategory = SHOPPING_CATEGORIES.reduce((acc, cat) => {
    const items = filteredShoppingItems.filter(i => i.category === cat)
    if (items.length > 0) acc[cat] = items
    return acc
  }, {})

  const otherItems = filteredShoppingItems.filter(i => !SHOPPING_CATEGORIES.includes(i.category))
  if (otherItems.length > 0) {
    itemsByCategory["Autre"] = [...(itemsByCategory["Autre"] || []), ...otherItems]
  }

  const filteredRecipes = recipes.filter(r => {
    const query = searchQuery.toLowerCase()
    return (
      r.dishName.toLowerCase().includes(query) ||
      r.ingredients.some(i => i.toLowerCase().includes(query)) ||
      (r.dietaryConstraints && r.dietaryConstraints.some(c => c.toLowerCase().includes(query)))
    )
  })

  if (loading) {
    return <div className="p-4"><p className="text-gray-500">Chargement...</p></div>
  }

  return (
    <div className="p-4 md:p-6 space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Alimentation</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex flex-col">
        <TabsList className="flex w-full max-w-2xl">
          <TabsTrigger value="menu" className="flex-1 flex items-center gap-2">
            <Calendar className="w-4 h-4" /> Menu du jour
          </TabsTrigger>
          <TabsTrigger value="shopping" className="flex-1 flex items-center gap-2">
            <ShoppingBag className="w-4 h-4" /> Liste
          </TabsTrigger>
          <TabsTrigger value="recipes" className="flex-1 flex items-center gap-2">
            <Utensils className="w-4 h-4" /> Recettes
          </TabsTrigger>
          <TabsTrigger value="constraints" className="flex-1 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" /> Régimes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="menu" className="mt-6 space-y-6">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Aujourd&apos;hui au menu</h2>
              <Button variant="outline" size="sm" onClick={shuffleMenu} className="gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" /> Changer de suggestion
              </Button>
            </div>

            {dailyMenu ? (
              <Card className="overflow-hidden border-2 border-primary/20">
                <div className="aspect-video bg-gray-100 flex items-center justify-center relative">
                   <Utensils className="w-20 h-20 text-gray-200" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6 text-white">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-primary hover:bg-primary border-none text-[10px] uppercase tracking-wider font-bold">Suggestion</Badge>
                        {dailyMenu.isFavorite && <Badge className="bg-red-500 hover:bg-red-500 border-none text-[10px] uppercase tracking-wider font-bold flex gap-1 items-center"><Heart className="w-2 h-2 fill-current" /> Favori</Badge>}
                      </div>
                      <h3 className="text-3xl font-bold">{dailyMenu.dishName}</h3>
                   </div>
                </div>
                <CardContent className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                   <div className="space-y-4 md:col-span-2">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Ingrédients nécessaires</h4>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
                          {dailyMenu.ingredients.map((ing, i) => (
                            <li key={i} className="text-sm flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary" /> {ing}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex gap-4 pt-2">
                        <div className="bg-gray-50 p-3 rounded-xl flex flex-col items-center flex-1 border">
                           <Clock className="w-5 h-5 text-gray-400 mb-1" />
                           <span className="text-xs text-gray-500">Préparation</span>
                           <span className="font-bold text-gray-900">{dailyMenu.prepTime} min</span>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-xl flex flex-col items-center flex-1 border">
                           <Users className="w-5 h-5 text-gray-400 mb-1" />
                           <span className="text-xs text-gray-500">Portions</span>
                           <span className="font-bold text-gray-900">{dailyMenu.portions} pers.</span>
                        </div>
                      </div>
                   </div>
                   <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Compatibilité</h4>
                        <div className="flex flex-wrap gap-2">
                          {dailyMenu.dietaryConstraints && dailyMenu.dietaryConstraints.length > 0 ? (
                            dailyMenu.dietaryConstraints.map(c => (
                              <Badge key={c} variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                                {c}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-xs text-gray-400 italic">Standard</span>
                          )}
                        </div>
                      </div>
                      <div className="pt-4 border-t">
                        <Button className="w-full" onClick={() => setActiveTab("recipes")}>
                          Voir la fiche complète
                        </Button>
                      </div>
                   </div>
                </CardContent>
              </Card>
            ) : (
              <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed">
                <ChefHat className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-500">Aucune recette disponible pour proposer un menu.</p>
                <Button variant="link" onClick={() => setActiveTab("recipes")}>Ajouter une recette</Button>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="shopping" className="mt-6 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-xl flex items-center gap-2">
                Liste de courses
                <Badge variant="secondary" className="ml-2">{shoppingItems.length} articles</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleAddShoppingItem} className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1 flex gap-2">
                  <Input
                    placeholder="Ajouter un article..."
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    className="flex-1"
                  />
                  <Select value={newItemCategory} onValueChange={setNewItemCategory}>
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="Catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      {SHOPPING_CATEGORIES.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit">
                  <PlusCircle className="w-4 h-4 mr-2" /> Ajouter
                </Button>
              </form>

              <div className="space-y-6 mt-4">
                {Object.entries(itemsByCategory).map(([category, items]) => (
                  <div key={category} className="space-y-2">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{category}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                      {items.map(item => (
                        <div
                          key={item.id}
                          className={`flex items-center justify-between p-3 rounded-lg border bg-white transition-all hover:shadow-sm ${item.isPurchased ? 'opacity-60 bg-gray-50/50' : ''}`}
                        >
                          <div className="flex items-center gap-3 overflow-hidden">
                            <Checkbox
                              checked={item.isPurchased}
                              onCheckedChange={() => toggleShoppingItem(item)}
                            />
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <p className={`text-sm font-medium leading-none ${item.isPurchased ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                                  {item.itemName}
                                </p>
                                {item.isPurchased && <CheckCircle className="w-3.5 h-3.5 text-green-500" />}
                              </div>
                              {item.assignedTo && (
                                <p className="text-[10px] text-gray-500 mt-1 truncate">
                                  Assigné à : {userMap[item.assignedTo] || "Inconnu"}
                                </p>
                              )}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="text-gray-400 hover:text-red-500 h-8 w-8"
                            onClick={() => handleDeleteShoppingItem(item.id)}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                {shoppingItems.length === 0 && (
                  <div className="text-center py-10">
                    <ShoppingBag className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-500">Votre liste de courses est vide.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recipes" className="mt-6 space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Rechercher une recette ou ingrédient..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button onClick={openCreateRecipe}>
              <ChefHat className="w-4 h-4 mr-2" /> Proposer une recette
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredRecipes.map(recipe => (
              <Card key={recipe.id} className="group overflow-hidden transition-all hover:shadow-md">
                <div className="aspect-video bg-gray-100 flex items-center justify-center relative">
                   <Utensils className="w-12 h-12 text-gray-300" />
                   <Button
                    variant="ghost"
                    size="icon"
                    className={`absolute top-2 right-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white ${recipe.isFavorite ? 'text-red-500' : 'text-gray-400'}`}
                    onClick={() => toggleFavorite(recipe)}
                   >
                     <Heart className={`w-5 h-5 ${recipe.isFavorite ? 'fill-current' : ''}`} />
                   </Button>
                </div>
                <CardContent className="p-4 space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-bold text-gray-900 leading-tight">{recipe.dishName}</h3>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm" className="h-8 w-8 -mr-2">
                          <MoreVertical className="w-4 h-4 text-gray-400" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => startEditRecipe(recipe)}>
                          <Pencil className="w-3.5 h-3.5 mr-2" /> Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600 focus:text-red-600"
                          onClick={() => {
                            setRecipeToDelete(recipe.id)
                            setDeleteConfirmOpen(true)
                          }}
                        >
                          <Trash2 className="w-3.5 h-3.5 mr-2" /> Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {recipe.prepTime} min
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" /> {recipe.portions} pers.
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {recipe.dietaryConstraints && recipe.dietaryConstraints.map(c => (
                      <Badge key={c} variant="outline" className="text-[10px] bg-green-50 text-green-700 border-green-200">
                        {c}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
            {filteredRecipes.length === 0 && (
              <div className="col-span-full text-center py-20 bg-gray-50 rounded-xl border border-dashed">
                <Search className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-500">Aucune recette trouvée pour &quot;{searchQuery}&quot;</p>
                <Button variant="link" onClick={() => setSearchQuery("")}>Effacer la recherche</Button>
              </div>
            )}
          </div>

          <Dialog open={recipeDialogOpen} onOpenChange={setRecipeDialogOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{editingRecipe ? "Modifier la recette" : "Nouvelle recette"}</DialogTitle>
                <DialogDescription>
                  Partagez vos meilleures idées de repas avec la colocation.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleRecipeSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nom du plat</label>
                  <Input
                    placeholder="Ex: Pâtes Carbonara"
                    value={recipeForm.dishName}
                    onChange={(e) => setRecipeForm(f => ({ ...f, dishName: e.target.value }))}
                    required
                  />
                  {recipeErrors.dishName && <p className="text-sm text-red-500 mt-1">{recipeErrors.dishName}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Préparation (min)</label>
                    <Input
                      type="number"
                      placeholder="20"
                      value={recipeForm.prepTime}
                      onChange={(e) => setRecipeForm(f => ({ ...f, prepTime: e.target.value }))}
                      required
                    />
                    {recipeErrors.prepTime && <p className="text-sm text-red-500 mt-1">{recipeErrors.prepTime}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Portions</label>
                    <Input
                      type="number"
                      placeholder="4"
                      value={recipeForm.portions}
                      onChange={(e) => setRecipeForm(f => ({ ...f, portions: e.target.value }))}
                      required
                    />
                    {recipeErrors.portions && <p className="text-sm text-red-500 mt-1">{recipeErrors.portions}</p>}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Ingrédients (séparés par des virgules)</label>
                  <Input
                    placeholder="Lardons, oeufs, parmesan..."
                    value={recipeForm.ingredients}
                    onChange={(e) => setRecipeForm(f => ({ ...f, ingredients: e.target.value }))}
                    required
                  />
                  {recipeErrors.ingredients && <p className="text-sm text-red-500 mt-1">{recipeErrors.ingredients}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Contraintes alimentaires</label>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {COMMON_DIETS.map(diet => (
                      <Button
                        key={diet}
                        type="button"
                        variant={recipeForm.dietaryConstraints?.includes(diet) ? "default" : "outline"}
                        size="sm"
                        className="text-[10px] h-7 px-2"
                        onClick={() => toggleConstraintInForm(diet)}
                      >
                        {diet}
                      </Button>
                    ))}
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={resetRecipeForm}>Annuler</Button>
                  <Button type="submit">{editingRecipe ? "Enregistrer" : "Créer"}</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          <ConfirmDialog
            open={deleteConfirmOpen}
            onOpenChange={setDeleteConfirmOpen}
            title="Supprimer la recette"
            description="Êtes-vous sûr de vouloir supprimer cette recette ? Cette action est irréversible."
            onConfirm={confirmDeleteRecipe}
            confirmText="Supprimer"
            loadingText="Suppression..."
            variant="destructive"
            isLoading={isDeleting}
          />
        </TabsContent>

        <TabsContent value="constraints" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  Mes Régimes & Allergies
                </CardTitle>
                <CardDescription>
                  Ces informations aident vos colocataires à planifier des repas inclusifs.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {(user.dietaryConstraints || []).map(constraint => (
                    <Badge key={constraint} variant="secondary" className="px-3 py-1 gap-1 text-sm">
                      {constraint}
                      <button onClick={() => removeConstraint(constraint)} className="hover:text-red-500">
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                  {(user.dietaryConstraints || []).length === 0 && (
                    <p className="text-sm text-gray-500">Aucune contrainte définie.</p>
                  )}
                </div>

                <div className="pt-4 space-y-3">
                  <p className="text-sm font-medium text-gray-700">Ajouter une contrainte :</p>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Ex: Sans noix..."
                      value={newConstraint}
                      onChange={(e) => setNewConstraint(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addConstraint(newConstraint)}
                    />
                    <Button onClick={() => addConstraint(newConstraint)}>Ajouter</Button>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {COMMON_DIETS.map(diet => (
                      <Button
                        key={diet}
                        variant="outline"
                        size="sm"
                        className="text-[10px] h-7 px-2"
                        onClick={() => addConstraint(diet)}
                        disabled={(user.dietaryConstraints || []).includes(diet)}
                      >
                        + {diet}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Régimes de la Colocation
                </CardTitle>
                <CardDescription>
                  Consultez les besoins alimentaires de vos colocataires.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map(u => (
                    <div key={u.id} className="flex items-start gap-3 p-3 rounded-lg border bg-gray-50/50">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                        {u.name.charAt(0)}
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-gray-900">
                          {u.name} {u.id === user.id && "(Vous)"}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {(u.dietaryConstraints || []).map(c => (
                            <Badge key={c} variant="outline" className="text-[10px] bg-white">
                              {c}
                            </Badge>
                          ))}
                          {(u.dietaryConstraints || []).length === 0 && (
                            <span className="text-xs text-gray-400 italic">Aucune contrainte</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="bg-blue-50/50 border-t flex gap-3 py-3">
                <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <p className="text-[11px] text-blue-700">
                  Pensez à vérifier ces informations avant de cuisiner pour tout le monde ou de faire les courses communes.
                </p>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
