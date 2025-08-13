'use client';
import * as React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, IconButton, FormControlLabel, Checkbox,
  MenuItem, Stack, Typography, Divider, Box
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';

type FieldType = 'text' | 'url' | 'number' | 'date';

export interface CategoryFieldDefinition {
  name: string;
  label: string;
  required: boolean;
  type: FieldType;
}

export interface NewCategoryPayload {
  name: string;
  fields: CategoryFieldDefinition[];
}

export interface AddCategoryDialogProps {
  open: boolean;
  onClose: () => void;
  onCreated?: (created: unknown) => void;
  addCategory: (payload: NewCategoryPayload) => Promise<unknown>;
}

interface FieldRow extends CategoryFieldDefinition {
  _id: string;
  touchedName?: boolean;
}

const uid = () =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any)?.crypto?.randomUUID?.() ||
  `f_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;

const emptyField = (): FieldRow => ({
  _id: uid(),
  name: '',
  label: '',
  required: false,
  type: 'text',
});

const slugify = (s: string) =>
  s
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');

export default function AddCategoryDialog(props: AddCategoryDialogProps) {
  const { open, onClose, onCreated, addCategory } = props;

  const [name, setName] = React.useState('');
  const [fields, setFields] = React.useState<FieldRow[]>([ { ...emptyField(), required: true } ]);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const reset = () => {
    setName('');
    setFields([ { ...emptyField(), required: true } ]);
    setError(null);
  };

  const handleClose = () => {
    if (!submitting) {
      reset();
      onClose();
    }
  };

  const updateField = (id: string, patch: Partial<FieldRow>) => {
    setFields(prev =>
      prev.map(f => {
        if (f._id !== id) return f;
        const next = { ...f, ...patch };
        if ('label' in patch && !f.touchedName) {
          next.name = slugify(patch.label ?? '');
        }
        return next;
      })
    );
  };

  const addRow = () => setFields(prev => [...prev, emptyField()]);
  const removeRow = (id: string) => setFields(prev => (prev.length <= 1 ? prev : prev.filter(f => f._id !== id)));

  const canSubmit = React.useMemo(() => {
    const n = name.trim();
    if (!n) return false;
    // Au moins un label non vide
    const usable = fields.filter(f => f.label.trim() !== '');
    if (usable.length === 0) return false;
    if (usable.some(f => !f.name.trim())) return false;

    const keys = usable.map(f => f.name.trim().toLowerCase());
    if (new Set(keys).size !== keys.length) return false;
    
    return true;
  }, [name, fields]);

  const onSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    try {
      const payload: NewCategoryPayload = {
        name: name.trim().toLowerCase(),
        fields: fields
          .filter(f => f.label.trim() !== '')
          .map(({ name, label, required, type }) => ({
            name: name.trim() || slugify(label),
            label: label.trim(),
            required: !!required,
            type,
          })),
      };
      const created = await addCategory(payload);
      onCreated?.(created);
      reset();
      onClose();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      setError(e?.message || "Échec de la création de la catégorie.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>
        Ajouter une catégorie
        <IconButton
          aria-label="fermer"
          onClick={handleClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
          size="small"
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={2}>
          <TextField
            label="Nom de la catégorie"
            placeholder='ex. "musique", "film", "livre", "restaurant"...'
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            autoFocus
          />

          <Divider />

          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Labels / Champs (au moins un)
            </Typography>

            <Stack spacing={1.5}>
              {fields.map((f, idx) => (
                <Box
                  key={f._id}
                  sx={{ border: '1px solid #e5e7eb', borderRadius: 1.5, p: 1.5 }}
                >
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems="center">
                    <TextField
                      label="Libellé"
                      placeholder='ex. "Titre", "Artiste", "Description"...'
                      value={f.label}
                      onChange={(e) => updateField(f._id, { label: e.target.value })}
                      fullWidth
                    />
                    <TextField
                      label="Clé technique"
                      placeholder='ex. "title", "artist", "description"...'
                      value={f.name}
                      onChange={(e) => updateField(f._id, { name: e.target.value, touchedName: true })}
                      fullWidth
                    />
                  </Stack>

                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems="center" sx={{ mt: 1 }}>
                    <TextField
                      select
                      label="Type"
                      value={f.type}
                      onChange={(e) => updateField(f._id, { type: e.target.value as FieldType })}
                      fullWidth
                    >
                      <MenuItem value="text">Texte</MenuItem>
                      <MenuItem value="url">URL</MenuItem>
                      <MenuItem value="number">Nombre</MenuItem>
                      <MenuItem value="date">Date</MenuItem>
                    </TextField>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={f.required}
                          onChange={(e) => updateField(f._id, { required: e.target.checked })}
                        />
                      }
                      label="Obligatoire"
                    />
                    <IconButton
                      aria-label="supprimer"
                      onClick={() => removeRow(f._id)}
                      disabled={fields.length === 1 && idx === 0}
                      sx={{ ml: 'auto' }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                </Box>
              ))}

              <Button startIcon={<AddIcon />} onClick={addRow} variant="outlined">
                Ajouter un label
              </Button>
            </Stack>
          </Box>

          {error && (
            <Typography color="error" variant="body2">{error}</Typography>
          )}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={submitting}>Annuler</Button>
        <Button onClick={onSubmit} disabled={!canSubmit || submitting} variant="contained">
          Créer la catégorie
        </Button>
      </DialogActions>
    </Dialog>
  );
}
