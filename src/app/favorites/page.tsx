'use client'

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react'
import { Plus, Moon, ChevronRight, Info } from 'lucide-react'
import AddFavoritePopup, { Category, NewFavorite } from '@/components/AddFavoritePopup'
import ServiceFavoris from '@/app/api/services/favoritesService'
import AddCategoryDialog from '@/components/AddCategoryDialog'
import DetailsSheet from '@/components/DetailsSheet'

const FavoritesPage: React.FC = () => {
  const [showPopup, setShowPopup] = useState(false)
  const [openAddCat, setOpenAddCat] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [favorites, setFavorites] = useState<(NewFavorite & { fields?: Record<string, any> })[]>([])
  const [selectedFavorite, setSelectedFavorite] = useState<
    (NewFavorite & { fields?: Record<string, any> }) | null
  >(null)
  const [showDetails, setShowDetails] = useState(false)

  // Palette de couleurs pastel
  const FAVORITE_COLORS = [
    'bg-pink-100',
    'bg-purple-100',
    'bg-blue-100',
    'bg-green-100',
    'bg-yellow-100',
    'bg-orange-100',
    'bg-teal-100',
    'bg-red-100',
  ]

  // Fonction pour choisir une couleur aléatoire
  function getRandomColor() {
    return FAVORITE_COLORS[Math.floor(Math.random() * FAVORITE_COLORS.length)]
  }

  const IconPlaceholder = (props: any) => <span className={props?.className ?? 'w-5 h-5'} />

  // Charger les catégories au chargement
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await ServiceFavoris.getCategories()
        setCategories(
          res.map((cat: any) => ({
            id: cat.name,
            name: cat.name.charAt(0).toUpperCase() + cat.name.slice(1),
            icon: IconPlaceholder,
            color: getRandomColor(),
            // <<<<<<<<< ICI: on passe les définitions du back
            defs: Array.isArray(cat.fields)
              ? cat.fields.map((f: any) => ({
                  name: String(f.name),
                  label: String(f.label ?? f.name),
                  required: Boolean(f.required),
                  // garde un type sûr si jamais la valeur est inattendue
                  type: (['text', 'url', 'number', 'date'] as const).includes(f.type)
                    ? f.type
                    : 'text',
                }))
              : [],
          }))
        )
      } catch (error) {
        console.error('Erreur lors de la récupération des catégories:', error)
      }
    }
    fetchCategories()
  }, [])

  // Charger les favoris de la catégorie sélectionnée
  useEffect(() => {
    if (!selectedCategory) {
      setFavorites([])
      setSelectedFavorite(null)
      setShowDetails(false)
      return
    }
    const fetchFavorites = async () => {
      try {
        const res = await ServiceFavoris.getFavoritesByCategory(selectedCategory.id)
        const mapped = (res || []).map((fav: any) => ({
          id: fav._id,
          title: fav.itemName || fav.fields?.title || fav.fields?.titre || '',
          subtitle: fav.fields?.description || fav.fields?.desc || '',
          bgColor: getRandomColor(),
          // On conserve tous les champs pour l'affichage des détails
          fields: fav.fields || {},
          icon: fav.icon, // si présent côté API
        }))
        setFavorites(mapped)
      } catch (error) {
        console.error('Erreur lors de la récupération des favoris:', error)
      }
    }
    fetchFavorites()
  }, [selectedCategory])

  const handleAdd = (newFav: NewFavorite & { fields?: Record<string, any> }) => {
    setFavorites((prev) => [
      ...prev,
      { ...newFav, fields: (newFav as any)?.fields ?? {}, bgColor: getRandomColor() },
    ])
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleCategoryCreated = async (_created: any) => {
    try {
      const res = await ServiceFavoris.getCategories()
      setCategories(
        res.map((cat: any) => ({
          id: cat.name,
          name: cat.name.charAt(0).toUpperCase() + cat.name.slice(1),
          icon: IconPlaceholder,
          color: getRandomColor(),
          // <<<<<<<<< ICI: on passe les définitions du back
          defs: Array.isArray(cat.fields)
            ? cat.fields.map((f: any) => ({
                name: String(f.name),
                label: String(f.label ?? f.name),
                required: Boolean(f.required),
                // garde un type sûr si jamais la valeur est inattendue
                type: (['text', 'url', 'number', 'date'] as const).includes(f.type)
                  ? f.type
                  : 'text',
              }))
            : [],
        }))
      )
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8 pb-24 md:pb-16">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 md:mb-8 gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <h1 className="text-lg sm:text-xl font-bold">THEN .</h1>
          </div>
          <Moon className="w-6 h-6" />
        </div>

        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 md:mb-8">Favoris</h2>

        {/* Categories Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4 gap-3">
            <h3 className="text-base md:text-lg font-semibold text-gray-700">Catégories</h3>
            <button
              className="text-blue-600 font-medium text-sm md:text-base"
              onClick={() => setOpenAddCat(true)}
            >
              + Ajouter une catégorie
            </button>
          </div>

          {/* Grille de catégories responsive */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {categories.map((category, idx) => {
              const Icon = category.icon as any
              const selected = selectedCategory?.id === category.id
              return (
                <button
                  key={category.id || idx}
                  onClick={() => setSelectedCategory(category)}
                  className={`${category.color} rounded-2xl p-3 sm:p-4 flex items-center gap-3 border border-gray-200 hover:shadow-sm transition-shadow min-h-[64px] md:min-h-[72px] ${
                    selected ? 'ring-2 ring-blue-400' : ''
                  }`}
                >
                  <Icon className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-800 truncate">{category.name}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Favorites Section */}
        <div className="mb-8">
          <h3 className="text-base md:text-lg font-semibold text-gray-700 mb-4 truncate">
            {selectedCategory ? `Favoris "${selectedCategory.name}"` : 'Sélectionnez une catégorie'}
          </h3>

          {/* Liste -> grille responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {favorites.length === 0 && selectedCategory && (
              <div className="col-span-full text-gray-400 text-center">
                Aucun favori pour cette catégorie.
              </div>
            )}

            {favorites.map((favorite) => {
              const Icon = (favorite as any).icon as any
              return (
                <button
                  key={favorite.id}
                  onClick={() => {
                    setSelectedFavorite(favorite)
                    setShowDetails(true)
                  }}
                  aria-label={`Voir les détails de ${favorite.title ?? 'ce favori'}`}
                  className={`group relative w-full ${favorite.bgColor} rounded-2xl p-4 sm:p-5 flex items-center gap-4 border border-gray-200 hover:shadow-sm hover:ring-2 hover:ring-blue-300 transition-all text-left`}
                >
                  <div className="w-12 h-12 bg-white/60 rounded-xl flex items-center justify-center shrink-0">
                    {Icon ? (
                      <Icon className="w-6 h-6 text-gray-600" />
                    ) : (
                      <Info className="w-6 h-6 text-gray-500" aria-hidden="true" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4
                      className="font-semibold text-gray-900 flex items-center gap-2 truncate"
                      title={favorite.title}
                    >
                      <span className="truncate text-sm sm:text-base">{favorite.title}</span>
                      <span className="inline-flex items-center text-xs text-gray-600 bg-white/60 rounded-full px-2 py-0.5 group-hover:bg-white/80 shrink-0">
                        <Info className="w-3.5 h-3.5" aria-hidden="true" />
                        <span className="ml-1 hidden sm:inline">Détails</span>
                      </span>
                    </h4>
                    {favorite.subtitle ? (
                      <p className="text-xs sm:text-sm text-gray-600 mt-0.5 break-words">
                        {favorite.subtitle}
                      </p>
                    ) : null}
                  </div>
                  <div className="ml-2 flex items-center">
                    <ChevronRight
                      className="w-5 h-5 text-gray-700 transition-transform group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Floating Add Button (position ajustée pour mobile & desktop) */}
      {selectedCategory && (
        <button
          onClick={() => setShowPopup(true)}
          className="fixed bottom-20 right-4 md:bottom-8 md:right-8 w-14 h-14 md:w-16 md:h-16 bg-blue-500 rounded-full flex items-center justify-center shadow-lg"
          aria-label="Ajouter un favori"
        >
          <Plus className="w-6 h-6 md:w-7 md:h-7 text-white" />
        </button>
      )}

      <AddFavoritePopup
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
        onAdd={handleAdd}
        categories={categories}
      />

      <AddCategoryDialog
        open={openAddCat}
        onClose={() => setOpenAddCat(false)}
        onCreated={handleCategoryCreated}
        addCategory={ServiceFavoris.addCategory}
      />

      {/* Détails du favori sélectionné */}
      <DetailsSheet
        open={showDetails}
        onClose={() => setShowDetails(false)}
        favorite={selectedFavorite}
        category={selectedCategory}
      />
    </div>
  )
}

export default FavoritesPage
