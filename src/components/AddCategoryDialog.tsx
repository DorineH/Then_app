'use client'
import * as React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  FormControlLabel,
  Checkbox,
  MenuItem,
  Stack,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
} from '@mui/material'
import FavoriteIcon from '@mui/icons-material/Favorite'
import MovieIcon from '@mui/icons-material/Movie'
import BookIcon from '@mui/icons-material/Book'
import MusicNoteIcon from '@mui/icons-material/MusicNote'
import RestaurantIcon from '@mui/icons-material/Restaurant'
import PlaceIcon from '@mui/icons-material/Place'
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import CloseIcon from '@mui/icons-material/Close'

type FieldType = 'text' | 'url' | 'number' | 'date'

export interface CategoryFieldDefinition {
  name: string
  label: string
  required: boolean
  type: FieldType
}

export interface NewCategoryPayload {
  name: string
  icon?: string
  fields: CategoryFieldDefinition[]
  coupleId?: string
}

export interface AddCategoryDialogProps {
  open: boolean
  onClose: () => void
  onCreated?: (created: unknown) => void
  addCategory: (payload: NewCategoryPayload) => Promise<unknown>
}

interface FieldRow extends CategoryFieldDefinition {
  _id: string
  touchedName?: boolean
}

const uid = () =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any)?.crypto?.randomUUID?.() ||
  `f_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`

const emptyField = (): FieldRow => ({
  _id: uid(),
  name: '',
  label: '',
  required: false,
  type: 'text',
})

const slugify = (s: string) =>
  s
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')

import { useAuth } from '../app/providers/auth-provider';
export default function AddCategoryDialog(props: AddCategoryDialogProps) {
  const { open, onClose, onCreated, addCategory } = props;
  const { user } = useAuth();

  const [name, setName] = React.useState('');
  const [icon, setIcon] = React.useState<string>('favorite');
  const [fields, setFields] = React.useState<FieldRow[]>([{ ...emptyField(), required: true }]);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const reset = () => {
    setName('')
    setIcon('favorite')
    setFields([{ ...emptyField(), required: true }])
    setError(null)
  }

  const handleClose = () => {
    if (!submitting) {
      reset()
      onClose()
    }
  }

  const updateField = (id: string, patch: Partial<FieldRow>) => {
    setFields((prev) =>
      prev.map((f) => {
        if (f._id !== id) return f
        const next = { ...f, ...patch }
        if ('label' in patch && !f.touchedName) {
          next.name = slugify(patch.label ?? '')
        }
        return next
      })
    )
  }

  const addRow = () => setFields((prev) => [...prev, emptyField()])
  const removeRow = (id: string) =>
    setFields((prev) => (prev.length <= 1 ? prev : prev.filter((f) => f._id !== id)))

  const canSubmit = React.useMemo(() => {
    const n = name.trim()
    if (!n) return false
    // Au moins un label non vide
    const usable = fields.filter((f) => f.label.trim() !== '')
    if (usable.length === 0) return false
    if (usable.some((f) => !f.name.trim())) return false

    const keys = usable.map((f) => f.name.trim().toLowerCase())
    if (new Set(keys).size !== keys.length) return false

    return true
  }, [name, fields])

  const onSubmit = async () => {
    if (!canSubmit) return
    setSubmitting(true)
    setError(null)
    try {
      const payload: NewCategoryPayload = {
        name: name.trim().toLowerCase(),
        icon,
        fields: fields
          .filter((f) => f.label.trim() !== '')
          .map(({ name, label, required, type }) => ({
            name: name.trim() || slugify(label),
            label: label.trim(),
            required: !!required,
            type,
          })),
        coupleId: user?.coupleId,
      };
      const created = await addCategory(payload);
      onCreated?.(created);
      reset();
      onClose();
    } catch (e: any) {
      setError(e?.message || 'Échec de la création de la catégorie.');
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="xs"
      PaperProps={{
        sx: {
          m: { xs: 1, sm: 2 },
          width: { xs: '98vw', sm: 400 },
          maxWidth: '100vw',
        },
      }}
    >
      <DialogTitle sx={{ px: { xs: 2, sm: 3 }, py: { xs: 1.5, sm: 2 } }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h6" sx={{ fontSize: { xs: 18, sm: 22 } }}>
            Nouvelle catégorie
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent dividers sx={{ px: { xs: 2, sm: 3 }, py: { xs: 1.5, sm: 2 } }}>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Nom de la catégorie"
            placeholder='ex. "musique", "film", "livre", "restaurant"...'
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            autoFocus
            size="medium"
            sx={{
              fontSize: { xs: 15, sm: 17 },
              borderRadius: 1,
              '& .MuiInputBase-root': { borderRadius: 1 },
            }}
          />
          <Stack spacing={1} direction="column">
            <Typography variant="subtitle2" color="text.secondary">
              Icône de la catégorie
            </Typography>
            <ToggleButtonGroup
              value={icon}
              exclusive
              onChange={(_e, val) => val && setIcon(val)}
              size="small"
              sx={{ flexWrap: 'wrap', gap: 1 }}
            >
              <Tooltip title="Favori"><ToggleButton value="favorite"><FavoriteIcon /></ToggleButton></Tooltip>
              <Tooltip title="Film"><ToggleButton value="movie"><MovieIcon /></ToggleButton></Tooltip>
              <Tooltip title="Livre"><ToggleButton value="book"><BookIcon /></ToggleButton></Tooltip>
              <Tooltip title="Musique"><ToggleButton value="music"><MusicNoteIcon /></ToggleButton></Tooltip>
              <Tooltip title="Restaurant"><ToggleButton value="restaurant"><RestaurantIcon /></ToggleButton></Tooltip>
              <Tooltip title="Lieu"><ToggleButton value="place"><PlaceIcon /></ToggleButton></Tooltip>
              <Tooltip title="Sport"><ToggleButton value="sport"><SportsSoccerIcon /></ToggleButton></Tooltip>
              <Tooltip title="Trophée"><ToggleButton value="trophy"><EmojiEventsIcon /></ToggleButton></Tooltip>
            </ToggleButtonGroup>
          </Stack>
          <Stack spacing={1.5}>
            {fields.map((f, idx) => (
              <Stack
                key={f._id}
                spacing={1.5}
                sx={{
                  background: '#fafbfc',
                  borderRadius: 1,
                  p: 1.2,
                  boxShadow: '0 0 0 1px #ececec',
                }}
              >
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems="center">
                  <TextField
                    label="Libellé"
                    placeholder='ex. "Titre", "Artiste", "Description"...'
                    value={f.label}
                    onChange={(e) => updateField(f._id, { label: e.target.value })}
                    fullWidth
                    size="medium"
                    sx={{
                      fontSize: { xs: 15, sm: 17 },
                      borderRadius: 1,
                      '& .MuiInputBase-root': { borderRadius: 1 },
                    }}
                  />
                  <TextField
                    label="Clé technique"
                    placeholder='ex. "title", "artist", "description"...'
                    value={f.name}
                    onChange={(e) =>
                      updateField(f._id, { name: e.target.value, touchedName: true })
                    }
                    fullWidth
                    size="medium"
                    sx={{
                      fontSize: { xs: 15, sm: 17 },
                      borderRadius: 1,
                      '& .MuiInputBase-root': { borderRadius: 1 },
                    }}
                  />
                  <TextField
                    select
                    label="Type"
                    value={f.type}
                    onChange={(e) => updateField(f._id, { type: e.target.value as FieldType })}
                    fullWidth
                    size="medium"
                    sx={{
                      fontSize: { xs: 15, sm: 17 },
                      borderRadius: 1,
                      '& .MuiInputBase-root': { borderRadius: 1 },
                    }}
                  >
                    <MenuItem value="text">Texte</MenuItem>
                    <MenuItem value="url">URL</MenuItem>
                    <MenuItem value="number">Nombre</MenuItem>
                    <MenuItem value="date">Date</MenuItem>
                  </TextField>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mt: 1 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={f.required}
                        onChange={(e) => updateField(f._id, { required: e.target.checked })}
                        color="default"
                        sx={{
                          color: '#dfa7b9ff',
                          '&.Mui-checked': {
                            color: '#dfa7b9ff',
                          },
                        }}
                      />
                    }
                    label="Obligatoire"
                    sx={{ ml: 0, mr: 0 }}
                  />
                  <IconButton
                    aria-label="supprimer"
                    onClick={() => removeRow(f._id)}
                    disabled={fields.length === 1 && idx === 0}
                    size="small"
                    sx={{ ml: 1 }}
                  >
                    <DeleteIcon
                      sx={{ color: fields.length === 1 && idx === 0 ? '#bdbdbd' : '#f8573aff' }}
                      fontSize="small"
                    />
                  </IconButton>
                </Stack>
              </Stack>
            ))}
            <Button
              startIcon={<AddIcon sx={{ color: '#dfa7b9ff' }} />}
              onClick={addRow}
              variant="contained"
              sx={{
                backgroundColor: '#faf7f8ff',
                color: '#dfa7b9ff',
                borderRadius: 2,
                fontWeight: 600,
                fontSize: { xs: 15, sm: 16 },
                boxShadow: 'none',
                '&:hover': {
                  backgroundColor: '#f8d3e2',
                  boxShadow: 'none',
                },
              }}
            >
              Ajouter un label
            </Button>
          </Stack>
          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: { xs: 2, sm: 3 }, py: { xs: 1.5, sm: 2 } }}>
        <Button
          onClick={handleClose}
          disabled={submitting}
          sx={{
            fontWeight: 700,
            color: '#dfa7b9ff',
            borderRadius: 3,
            minWidth: 120,
            fontSize: { xs: 15, sm: 17 },
            '&:hover': {
              backgroundColor: '#FEE3EC',
              boxShadow: 'none',
            },
          }}
        >
          Annuler
        </Button>
        <Button
          onClick={onSubmit}
          disabled={!canSubmit || submitting}
          variant="contained"
          sx={{
            borderRadius: 3,
            minWidth: 120,
            fontWeight: 700,
            fontSize: { xs: 15, sm: 17 },
            backgroundColor: '#FEE3EC',
            color: '#011C13',
            boxShadow: 'none',
            '&:hover': {
              backgroundColor: '#dfa7b9ff',
              boxShadow: 'none',
            },
          }}
        >
          Créer la catégorie
        </Button>
      </DialogActions>
    </Dialog>
  )
}
