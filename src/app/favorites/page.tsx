'use client'
import React, { useState, useEffect } from 'react'
import { Box, Typography, Button, Grid, Card, CardActionArea, Stack } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import FavoriteIcon from '@mui/icons-material/Favorite'
import MovieIcon from '@mui/icons-material/Movie'
import BookIcon from '@mui/icons-material/Book'
import MusicNoteIcon from '@mui/icons-material/MusicNote'
import RestaurantIcon from '@mui/icons-material/Restaurant'
import PlaceIcon from '@mui/icons-material/Place'
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import AddFavoritePopup, {
  Category,
  NewFavorite,
  CategoryFieldDefinition,
} from '@/components/AddFavoritePopup'
import ServiceFavoris from '@/app/api/services/favoritesService'
import AddCategoryDialog from '@/components/AddCategoryDialog'
import DetailsSheet from '@/components/DetailsSheet'
import { useAuth } from '../providers/auth-provider'

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

  // Palette de couleurs pastel MUI (restaure la logique d'origine)
  const FAVORITE_COLORS = [
    '#FEE3EC', // rose
    '#E0E7FF', // violet
    '#C2E2F5', // bleu
    '#D1FADF', // vert
    '#FEF9C3', // jaune
    '#FFE5B4', // orange
    '#B2F5EA', // teal
    '#FFD6D6', // rouge pâle
  ]
  // Pour garder la même couleur pour chaque catégorie/favori, on utilise un mapping par nom/id
  const colorMap = React.useRef<{ [key: string]: string }>({})
  function getColorForKey(key: string) {
    if (!colorMap.current[key]) {
      // On prend la prochaine couleur dispo, ou aléatoire si toutes utilisées
      const used = Object.values(colorMap.current)
      const available = FAVORITE_COLORS.filter((c) => !used.includes(c))
      colorMap.current[key] =
        available.length > 0
          ? available[0]
          : FAVORITE_COLORS[Math.floor(Math.random() * FAVORITE_COLORS.length)]
    }
    return colorMap.current[key]
  }

  const iconMap: Record<string, React.ElementType> = {
    favorite: FavoriteIcon,
    movie: MovieIcon,
    book: BookIcon,
    music: MusicNoteIcon,
    restaurant: RestaurantIcon,
    place: PlaceIcon,
    sport: SportsSoccerIcon,
    trophy: EmojiEventsIcon,
  }
  const IconPlaceholder = (props: { sx?: object }) => (
    <InfoOutlinedIcon sx={{ fontSize: 22, color: '#bdbdbd', ...props?.sx }} />
  )

  // Charger les catégories au chargement, filtrées par coupleId
  const { user } = useAuth()
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await ServiceFavoris.getCategories()
        // Filtrer par coupleId si présent dans la catégorie
        const filtered = user?.coupleId
          ? res.filter(
              (cat: { coupleId?: string }) => !cat.coupleId || cat.coupleId === user.coupleId
            )
          : res
        setCategories(
          filtered.map(
            (cat: {
              name: string
              icon?: string
              fields?: CategoryFieldDefinition[]
              coupleId?: string
            }) => {
              const iconKey = cat.icon || 'favorite'
              const Icon = iconMap[iconKey] || IconPlaceholder
              return {
                id: cat.name,
                name: cat.name.charAt(0).toUpperCase() + cat.name.slice(1),
                icon: Icon,
                color: getColorForKey(cat.name),
                defs: Array.isArray(cat.fields)
                  ? cat.fields.map((f: CategoryFieldDefinition) => ({
                      name: String(f.name),
                      label: String(f.label ?? f.name),
                      required: Boolean(f.required),
                      type: (['text', 'url', 'number', 'date'] as const).includes(f.type)
                        ? f.type
                        : 'text',
                    }))
                  : [],
              }
            }
          )
        )
      } catch (error) {
        console.error('Erreur lors de la récupération des catégories:', error)
      }
    }
    fetchCategories()
  }, [user])

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
        type Favorite = {
          _id: string
          itemName?: string
          fields?: Record<string, unknown>
          icon?: React.ElementType
        }
        const mapped = (res || []).map((fav: Favorite) => ({
          id: fav._id,
          title: fav.itemName || fav.fields?.title || fav.fields?.titre || '',
          subtitle: fav.fields?.description || fav.fields?.desc || '',
          bgColor: getColorForKey(fav._id),
          fields: fav.fields || {},
          icon: fav.icon,
        }))
        setFavorites(mapped)
      } catch (error) {
        console.error('Erreur lors de la récupération des favoris:', error)
      }
    }
    fetchFavorites()
  }, [selectedCategory])

  const handleAdd = (newFav: NewFavorite & { fields?: Record<string, unknown> }) => {
    setFavorites((prev) => [
      ...prev,
      {
        ...newFav,
        fields: newFav.fields ?? {},
        bgColor: getColorForKey(
          (typeof newFav.id === 'number' ? newFav.id.toString() : newFav.id) ||
            newFav.title ||
            Math.random().toString()
        ),
      },
    ])
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleCategoryCreated = async (_created: unknown) => {
    try {
      const res = await ServiceFavoris.getCategories()
      const filtered = user?.coupleId
        ? res.filter(
            (cat: { coupleId?: string }) => !cat.coupleId || cat.coupleId === user.coupleId
          )
        : res
      setCategories(
        filtered.map(
          (cat: {
            name: string
            icon?: string
            fields?: CategoryFieldDefinition[]
            coupleId?: string
          }) => {
            const iconKey = cat.icon || 'favorite'
            const Icon = iconMap[iconKey] || IconPlaceholder
            return {
              id: cat.name,
              name: cat.name.charAt(0).toUpperCase() + cat.name.slice(1),
              icon: Icon,
              color: getColorForKey(cat.name),
              defs: Array.isArray(cat.fields)
                ? cat.fields.map((f: CategoryFieldDefinition) => ({
                    name: String(f.name),
                    label: String(f.label ?? f.name),
                    required: Boolean(f.required),
                    type: (['text', 'url', 'number', 'date'] as const).includes(f.type)
                      ? f.type
                      : 'text',
                  }))
                : [],
            }
          }
        )
      )
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#f8fafc',
        p: { xs: 2, md: 4, lg: 6 },
        pb: { xs: 8, md: 4 },
      }}
    >
      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
        {/* Categories Section */}
        <Box mb={6}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2} gap={2}>
            <Typography variant="h6" fontWeight={600} color="text.secondary">
              Catégories
            </Typography>
            <Button
              variant="text"
              startIcon={<AddIcon sx={{ color: '#dfa7b9ff' }} />}
              onClick={() => setOpenAddCat(true)}
              sx={{
                fontWeight: 500,
                fontSize: { xs: 14, md: 16 },
                color: '#dfa7b9ff',
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: 'rgba(223,167,185,0.08)',
                  color: '#dfa7b9ff',
                },
              }}
            >
              Ajouter une catégorie
            </Button>
          </Stack>
          <Grid container spacing={2}>
            {categories.map((category, idx) => {
              const Icon = category.icon as any
              const selected = selectedCategory?.id === category.id
              return (
                <Grid item xs={6} sm={4} md={3} lg={2} key={category.id || idx}>
                  <Card
                    onClick={() => setSelectedCategory(category)}
                    sx={{
                      bgcolor: category.color,
                      borderRadius: 3,
                      p: 1.5,
                      minHeight: 72,
                      border: selected ? '2px solid #d0dee9ff' : '1px solid #e0e0e0',
                      boxShadow: selected ? 3 : 0,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      transition: 'box-shadow 0.2s',
                    }}
                  >
                    <Icon sx={{ fontSize: 22, color: '#a0a0a0ff' }} />
                    <Typography fontWeight={500} color="text.primary" noWrap>
                      {category.name}
                    </Typography>
                  </Card>
                </Grid>
              )
            })}
          </Grid>
        </Box>

        {/* Favorites Section */}
        <Box mb={6}>
          <Stack direction="column" alignItems="flex-start" spacing={0} mb={2}>
            <Typography variant="h6" fontWeight={600} color="text.secondary" noWrap>
              {selectedCategory
                ? `Favoris "${selectedCategory.name}"`
                : 'Sélectionnez une catégorie'}
            </Typography>
            <Button
              variant="text"
              startIcon={<AddIcon sx={{ color: '#dfa7b9ff' }} />}
              onClick={() => setShowPopup(true)}
              sx={{
                fontWeight: 500,
                fontSize: { xs: 15, md: 17 },
                color: '#dfa7b9ff',
                textTransform: 'none',
                alignSelf: 'flex-end',
                '&:hover': {
                  backgroundColor: 'rgba(223,167,185,0.08)',
                  color: '#dfa7b9ff',
                },
              }}
            >
              Ajouter un favoris
            </Button>
          </Stack>

          <Grid container spacing={2}>
            {favorites.length === 0 && selectedCategory && (
              <Grid item xs={12}>
                <Typography color="text.disabled" align="center">
                  Aucun favori pour cette catégorie.
                </Typography>
              </Grid>
            )}
            {favorites.map((favorite) => {
              const Icon = (favorite as any).icon as any
              return (
                <Grid item xs={12} sm={6} md={4} key={favorite.id}>
                  <CardActionArea
                    onClick={() => {
                      setSelectedFavorite(favorite)
                      setShowDetails(true)
                    }}
                    sx={{
                      borderRadius: 3,
                      bgcolor: favorite.bgColor,
                      p: 2,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      border: '1px solid #e0e0e0',
                      boxShadow: 0,
                      minHeight: 90,
                    }}
                  >
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        bgcolor: 'rgba(255,255,255,0.7)',
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2,
                      }}
                    >
                      {Icon ? (
                        <Icon sx={{ fontSize: 28, color: '#90caf9' }} />
                      ) : (
                        <InfoOutlinedIcon sx={{ fontSize: 28, color: '#bdbdbd' }} />
                      )}
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Stack direction="row" alignItems="center" gap={1}>
                        <Typography fontWeight={600} color="text.primary" noWrap sx={{ flex: 1 }}>
                          {favorite.title}
                        </Typography>
                        {/* <Chip
                          icon={<InfoOutlinedIcon sx={{ fontSize: 16 }} />}
                          label="Détails"
                          size="small"
                          sx={{
                            bgcolor: 'white',
                            color: '#6b7280',
                            fontWeight: 500,
                            px: 1,
                            borderRadius: 1,
                          }}
                        /> */}
                      </Stack>
                      {favorite.subtitle ? (
                        <Typography variant="body2" color="text.secondary" mt={0.5} noWrap>
                          {favorite.subtitle}
                        </Typography>
                      ) : null}
                    </Box>
                    <ChevronRightIcon sx={{ color: '#757575', ml: 2 }} />
                  </CardActionArea>
                </Grid>
              )
            })}
          </Grid>
        </Box>
      </Box>

      {/* Plus de bouton flottant, le bouton d'ajout est toujours visible sous le titre */}

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

      <DetailsSheet
        open={showDetails}
        onClose={() => setShowDetails(false)}
        favorite={selectedFavorite}
        category={selectedCategory}
      />
    </Box>
  )
}

export default FavoritesPage
