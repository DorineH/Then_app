/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useEffect, useRef, useId } from 'react'
import { X } from 'lucide-react'
import type { Category, NewFavorite } from '@/components/AddFavoritePopup'

type DetailsSheetProps = {
  open: boolean
  onClose: () => void
  favorite: (NewFavorite & { fields?: Record<string, any> }) | null
  category: Category | null
}

const DetailsSheet: React.FC<DetailsSheetProps> = ({ open, onClose, favorite, category }) => {
  const dialogRef = useRef<HTMLDivElement | null>(null)
  const closeBtnRef = useRef<HTMLButtonElement | null>(null)
  const prevFocusRef = useRef<HTMLElement | null>(null)
  const titleId = useId()
  const subtitleId = useId()
  const contentId = useId()

  useEffect(() => {
    if (!open) return

    prevFocusRef.current = document.activeElement as HTMLElement | null
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const toFocus = closeBtnRef.current ?? dialogRef.current
    toFocus?.focus()

    const selector =
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }
      if (e.key === 'Tab') {
        const container = dialogRef.current
        if (!container) return
        const focusables = Array.from(container.querySelectorAll<HTMLElement>(selector)).filter(
          (el) => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden')
        )
        if (focusables.length === 0) return

        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        const isShift = e.shiftKey
        const active = document.activeElement as HTMLElement | null

        if (!isShift && active === last) {
          e.preventDefault()
          first.focus()
        } else if (isShift && (active === first || active === container)) {
          e.preventDefault()
          last.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = prevOverflow
      prevFocusRef.current?.focus?.()
    }
  }, [open, onClose])

  if (!open || !favorite || !category) return null

  const defs = Array.isArray(category.defs) ? category.defs : []
  const fields = favorite.fields || {}
  const getDisplayValue = (def: any) => {
    const v = fields?.[def.name]
    if (v == null || v === '') return '—'
    switch (def.type) {
      case 'date': {
        try {
          const d = new Date(v)
          if (!isNaN(d.getTime())) return d.toLocaleDateString()
          return String(v)
        } catch {
          return String(v)
        }
      }
      case 'number':
        return typeof v === 'number' ? String(v) : String(v)
      case 'url':
        return (
          <a
            href={String(v)}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 underline break-all"
          >
            {String(v)}
          </a>
        )
      default:
        return String(v)
    }
  }

  return (
    <div className="fixed inset-0 z-[70]" role="presentation">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative z-10 flex min-h-full items-end md:items-center justify-center p-4">
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={favorite.subtitle ? subtitleId : contentId}
          tabIndex={-1}
          style={{ WebkitOverflowScrolling: 'touch' }}
          className="w-full max-w-none md:max-w-2xl bg-white rounded-t-3xl md:rounded-2xl shadow-2xl p-6 max-h-[80vh] md:max-h-[85vh] overflow-y-auto overscroll-contain outline-none pb-[calc(env(safe-area-inset-bottom)+16px)]"
        >
          <div className="flex items-start justify-between mb-4 gap-2">
            <div className="min-w-0">
              <h4
                id={titleId}
                className="text-lg sm:text-xl font-semibold text-gray-900 truncate"
                title={favorite.title || 'Détails'}
              >
                {favorite.title || 'Détails'}
              </h4>
              {favorite.subtitle ? (
                <p id={subtitleId} className="text-sm text-gray-500 mt-1 break-words">
                  {favorite.subtitle}
                </p>
              ) : null}
            </div>

            <button
              ref={closeBtnRef}
              onClick={onClose}
              className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50 shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              aria-label="Fermer la fiche de détails"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>

          <div id={contentId} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {defs.length === 0 ? (
              <div className="text-gray-500">Aucun champ défini pour cette catégorie.</div>
            ) : (
              defs.map((def: any) => (
                <div key={def.name} className="rounded-2xl border border-gray-200 p-4 bg-white/80">
                  <div className="text-xs uppercase tracking-wide text-gray-500">{def.label}</div>
                  <div className="mt-1 text-gray-900 break-words">{getDisplayValue(def)}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DetailsSheet
