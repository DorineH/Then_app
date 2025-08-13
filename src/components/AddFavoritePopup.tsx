/* eslint-disable @typescript-eslint/no-explicit-any */
// components/AddFavoritePopup.tsx
'use client'

import React, { useMemo, useState } from 'react'
import { Search, ExternalLink, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog'
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
  title: string
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

const initialForm: FormData = { title: '', link: '', fields: {} }

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
    setForm({ title: '', link: '', fields: {} })
  }

  const handleChange = (field: keyof FormData | string, val: string) => {
    if (field === 'title' || field === 'link') {
      setForm((f) => ({ ...f, [field]: val }))
    } else {
      setForm((f) => ({ ...f, fields: { ...f.fields, [field]: val } }))
    }
  }

  const isValid = () => {
    if (!selected || !form.title.trim()) return false
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

    const titleDef = (selected.defs ?? []).find((d) => isTitleLike(d.name))
    if (titleDef) {
      fields[titleDef.name] = form.title.trim()
    }

    const payload: any = {
      category: selected.id,
      title: form.title.trim(),
      fields,
    }
    if (form.link.trim()) payload.link = form.link.trim()

    const res = await ServiceFavoris.addFavorite(payload)
    if (!res) {
      console.error('Failed to add favorite')
      return
    }

    onAdd({
      id: res?._id || Date.now(),
      category: selected.id,
      title: form.title,
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
    <Dialog open={isOpen} onOpenChange={(o) => !o && onClose()}>
      {/* DialogContent inclut aussi l'overlay via shadcn → on monte le z-index ici */}
      <DialogContent
        className="
          z-[70] max-w-md p-0 overflow-hidden
          sm:rounded-2xl
        "
      >
        {/* Header sticky pour garder le close visible */}
        <DialogHeader
          className="
            sticky top-0 z-10 bg-white/90
            supports-[backdrop-filter]:bg-white/80
            backdrop-blur border-b px-4 py-3
          "
        >
          <DialogTitle className="text-base sm:text-lg">
            {step === 1 ? 'AJOUTER UN FAVORI' : `AJOUT ${selected?.name.toUpperCase()}`}
          </DialogTitle>
          <DialogClose asChild>
            <Button variant="ghost" size="icon" aria-label="Fermer la fenêtre">
              <X />
            </Button>
          </DialogClose>
        </DialogHeader>

        {/* Corps scrollable avec safe-area bottom */}
        <div
          className="
            px-4 py-4
            max-h-[70vh] overflow-y-auto overscroll-contain
            pb-[calc(env(safe-area-inset-bottom)+16px)]
          "
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {step === 1 && (
            <div>
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher une catégorie..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {filtered.map((cat) => {
                  const Icon = cat.icon
                  return (
                    <button
                      key={cat.id}
                      onClick={() => selectCategory(cat)}
                      className={`${cat.color} p-3 rounded-xl flex flex-col items-center`}
                    >
                      <Icon className="w-6 h-6 mb-1" />
                      <span className="text-xs text-center">{cat.name}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {step === 2 && selected && (
            <div>
              <div className={`${selected.color} p-2 rounded-lg flex items-center gap-2 mb-6`}>
                <selected.icon className="w-5 h-5" />
                <span>{selected.name}</span>
              </div>

              {/* Titre requis */}
              <div className="mb-4">
                <label className="block text-sm mb-1">Titre</label>
                <input
                  type="text"
                  placeholder="Titre du favori"
                  value={form.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>

              {/* Champs dynamiques */}
              {defs.map((d) => (
                <div key={d.name} className="mb-4">
                  <label className="block text-sm mb-1">
                    {d.label} {d.required && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type={inputTypeFor(d.type)}
                    placeholder={d.label}
                    value={form.fields[d.name] ?? ''}
                    onChange={(e) => handleChange(d.name, e.target.value)}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
              ))}

              {/* Lien optionnel */}
              <div className="mb-6">
                <label className="block text-sm mb-1">Lien (optionnel)</label>
                <input
                  type="url"
                  placeholder="https://exemple.com"
                  value={form.link}
                  onChange={(e) => handleChange('link', e.target.value)}
                  className="w-full border rounded-lg px-3 py-2"
                />
                <p className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                  <ExternalLink className="w-4 h-4" /> Ajoute une URL si tu veux retrouver ce favori
                  rapidement.
                </p>
              </div>

              {/* CTA sticky en bas de la popup */}
              <div
                className="
                  sticky bottom-0 -mx-4 px-4 py-3
                  bg-white/90 supports-[backdrop-filter]:bg-white/80 backdrop-blur
                  border-t
                "
              >
                <button
                  onClick={handleSubmit}
                  disabled={!isValid()}
                  className={`w-full py-3 rounded-lg font-medium ${
                    isValid()
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Ajouter le favori
                </button>
                <button onClick={onClose} className="mt-2 w-full py-3 text-gray-600">
                  Annuler
                </button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AddFavoritePopup
