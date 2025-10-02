/* eslint-disable @typescript-eslint/no-explicit-any */
// components/AddFavoritePopup.tsx
'use client'

import React, { useMemo, useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Grid,
  Box,
  Typography,
  Stack,
  InputAdornment,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import SearchIcon from '@mui/icons-material/Search'
import LinkIcon from '@mui/icons-material/Link'
import ServiceFavoris from '@/app/api/services/favoritesService'

// ==== Types côté UI ====
export type FieldType = 'text' | 'url' | 'number' | 'date'

export interface CategoryFieldDefinition {
  name: string
  label: string
  required: boolean
  type: FieldType
}

interface FormData {
  link: string
  fields: Record<string, string>
}

export interface Category {
  id: string
  name: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  color: string
  fields?: string[]
  defs?: CategoryFieldDefinition[]
}

export interface NewFavorite {
  bgColor: any
  id: number | string
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>
  category: string
  addedAt?: string
  title: string
  subtitle?: string
  url?: string
}

interface AddFavoritePopupProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (fav: NewFavorite) => void
  categories: Category[]
}

const initialForm: FormData = { link: '', fields: {} }

const defaultLabels: Record<string, string> = {
  title: 'Titre',
  artist: 'Artiste',
  director: 'Réalisateur',
  genre: 'Genre',
  author: 'Auteur',
  location: 'Lieu',
  platform: 'Plateforme',
  url: 'Lien',
  description: 'Description',
  photo: 'Photo (URL)',
}

const normalize = (s: string) =>
  s
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
const isTitleLike = (s: string) => {
  const n = normalize(s)
  return n === 'title' || n === 'titre'
}

function normalizeDefs(cat: Category): CategoryFieldDefinition[] {
  if (cat.defs && Array.isArray(cat.defs)) {
    return cat.defs.filter((d) => !isTitleLike(d.name))
  }
  const names = (cat.fields ?? []).filter((n) => !isTitleLike(n))
  return names.map((name) => ({
    name,
    label: defaultLabels[name] ?? name,
    required: true,
    type: name.toLowerCase().includes('url') || name === 'url' ? 'url' : 'text',
  }))
}

function inputTypeFor(t: FieldType): React.HTMLInputTypeAttribute {
  switch (t) {
    case 'url':
      return 'url'
    case 'number':
      return 'number'
    case 'date':
      return 'date'
    default:
      return 'text'
  }
}

export const AddFavoritePopup: React.FC<AddFavoritePopupProps> = ({
  isOpen,
  onClose,
  onAdd,
  categories,
}) => {
  const [step, setStep] = useState<1 | 2>(1)
  const [selected, setSelected] = useState<Category | null>(null)
  const [search, setSearch] = useState<string>('')
  const [form, setForm] = useState<FormData>(initialForm)

  const defs = useMemo(() => (selected ? normalizeDefs(selected) : []), [selected])

  const filtered = categories.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))

  const selectCategory = (cat: Category) => {
    setSelected(cat)
    setStep(2)
    setForm({ link: '', fields: {} })
  }

  const handleChange = (field: string, val: string) => {
    if (field === 'link') {
      setForm((f) => ({ ...f, link: val }))
    } else {
      setForm((f) => ({ ...f, fields: { ...f.fields, [field]: val } }))
    }
  }

  const isValid = () => {
    if (!selected) return false
    for (const d of defs) {
      if (d.required && !String(form.fields[d.name] ?? '').trim()) return false
    }
    return true
  }

  const handleSubmit = async () => {
    if (!selected || !isValid()) return

    const fields: Record<string, string> = {}
    for (const d of defs) {
      const val = form.fields[d.name]
      if (val !== undefined && String(val).trim() !== '') {
        fields[d.name] = String(val)
      }
    }

    // Déterminer le "titre" à partir du premier champ obligatoire ou du premier champ tout court
    let computedTitle = ''
    const firstRequired = defs.find((d) => d.required)
    if (firstRequired && form.fields[firstRequired.name]) {
      computedTitle = form.fields[firstRequired.name]
    } else if (defs.length > 0 && form.fields[defs[0].name]) {
      computedTitle = form.fields[defs[0].name]
    }

    // Construire le payload attendu par le back : tous les champs dynamiques à la racine
    const payload: any = {
      category: selected.id,
      ...fields,
    }
    if (computedTitle) payload.title = computedTitle
    if (form.link && form.link.trim()) payload.link = form.link.trim()

    const res = await ServiceFavoris.addFavorite(payload)
    if (!res) {
      console.error('Failed to add favorite')
      return
    }

    onAdd({
      id: res?._id || Date.now(),
      category: selected.id,
      title: computedTitle,
      subtitle: defs
        .map((d) => form.fields[d.name])
        .filter(Boolean)
        .join(' • '),
      url: form.link || undefined,
      bgColor: selected.color,
    })

    setStep(1)
    setSelected(null)
    setForm(initialForm)
    onClose()
  }

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontWeight: 700,
          fontSize: 20,
          pb: 1,
        }}
      >
        {step === 1 ? 'Ajouter un favori' : `Ajout ${selected?.name}`}
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ pt: 1, pb: 2 }}>
        {step === 1 && (
          <Box>
            <TextField
              fullWidth
              placeholder="Rechercher une catégorie..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#bdbdbd' }} />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3, borderRadius: 2 }}
              size="small"
            />
            <Grid container spacing={2}>
              {filtered.map((cat) => {
                const Icon = cat.icon
                return (
                  <Grid item xs={4} sm={3} key={cat.id}>
                    <Button
                      onClick={() => selectCategory(cat)}
                      variant="outlined"
                      sx={{
                        bgcolor: cat.color,
                        borderRadius: 2,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        py: 2,
                        minWidth: 0,
                        width: '100%',
                        boxShadow: 'none',
                        border: '1px solid #e0e0e0',
                        textTransform: 'none',
                        gap: 1.5,
                      }}
                    >
                      <Icon style={{ fontSize: 24, color: '#a0a0a0ff', marginRight: 8 }} />
                      <Typography
                        variant="caption"
                        color="text.primary"
                        sx={{ fontWeight: 500, textAlign: 'left', fontSize: 16 }}
                      >
                        {cat.name}
                      </Typography>
                    </Button>
                  </Grid>
                )
              })}
            </Grid>
          </Box>
        )}
        {step === 2 && selected && (
          <Box>
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{ bgcolor: selected.color, borderRadius: 1, p: 1, mb: 3 }}
            >
              <selected.icon style={{ fontSize: 20, color: '#a0a0a0ff' }} />
              <Typography fontWeight={600}>{selected.name}</Typography>
            </Stack>
            {defs.map((d) => (
              <TextField
                key={d.name}
                label={d.label + (d.required ? ' *' : '')}
                type={inputTypeFor(d.type)}
                value={form.fields[d.name] ?? ''}
                onChange={(e) => handleChange(d.name, e.target.value)}
                fullWidth
                required={d.required}
                sx={{ mb: 2, borderRadius: 1, '& .MuiInputBase-root': { borderRadius: 1 } }}
              />
            ))}
            {/* <TextField
              label="Lien (optionnel)"
              type="url"
              placeholder="https://exemple.com"
              value={form.link}
              onChange={(e) => handleChange('link', e.target.value)}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LinkIcon sx={{ color: '#bdbdbd' }} />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 1 }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
              <LinkIcon sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5 }} /> Ajoute une URL si
              tu veux retrouver ce favori rapidement.
            </Typography> */}
          </Box>
        )}
      </DialogContent>
      {step === 2 && selected && (
        <DialogActions
          sx={{ flexDirection: 'column', alignItems: 'stretch', gap: 1, px: 3, pb: 2 }}
        >
          <Button
            onClick={handleSubmit}
            disabled={!isValid()}
            variant="contained"
            sx={{
              fontWeight: 600,
              borderRadius: 2,
              py: 1.2,
              backgroundColor: '#FEE3EC',
              color: '#011C13',
              boxShadow: 'none',
              '&:hover': {
                backgroundColor: '#dfa7b9ff',
                boxShadow: 'none',
              },
            }}
            fullWidth
          >
            Ajouter le favori
          </Button>
          <Button
            onClick={onClose}
            variant="text"
            color="inherit"
            sx={{ fontWeight: 500, borderRadius: 2 }}
            fullWidth
          >
            Annuler
          </Button>
        </DialogActions>
      )}
    </Dialog>
  )
}

export default AddFavoritePopup
