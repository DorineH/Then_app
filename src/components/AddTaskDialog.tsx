'use client'

import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Stack,
  Grid,
  TextField,
  MenuItem,
  Button,
  CircularProgress,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { DatePicker, TimeField, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { Dayjs } from 'dayjs'
import ServiceTasks from '@/app/api/services/taskService'
import { Category } from '@/interfaces/tasks/Tasks'

export default function AddTaskDialog({
  open,
  onClose,
  defaultDate,
  onCreated,
}: {
  open: boolean
  onClose: () => void
  defaultDate: Dayjs
  onCreated: (dateISO: string) => void
}) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState<Dayjs | null>(defaultDate)
  const [time, setTime] = useState<Dayjs | null>(null)
  const [category, setCategory] = useState<Category>('personal')
  const [loading, setLoading] = useState(false)

  const canSubmit = title.trim().length > 0 && !!date
  const submit = async () => {
    if (!canSubmit || !date) return
    setLoading(true)
    try {
      await ServiceTasks.addTask({
        title: title.trim(),
        description: description.trim() || undefined,
        date: date.format('YYYY-MM-DD'),
        time: time ? time.format('HH:mm') : undefined,
        category,
      } as any)
      onCreated(date.format('YYYY-MM-DD'))
      onClose()
      setTitle('')
      setDescription('')
      setTime(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <span>Nouvelle tâche</span>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Titre"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            autoFocus
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            minRows={2}
          />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="fr">
                <DatePicker
                  label="Date"
                  value={date}
                  onChange={setDate as any}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="fr">
                <TimeField
                  label="Heure"
                  value={time}
                  onChange={(newValue) => setTime(newValue)}
                  format="HH:mm"
                  ampm={false}
                  fullWidth
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
          <TextField
            select
            label="Catégorie"
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            fullWidth
          >
            <MenuItem value="work">Travail</MenuItem>
            <MenuItem value="personal">Personnel</MenuItem>
            <MenuItem value="appointment">Rendez-vous</MenuItem>
            <MenuItem value="other">Autre</MenuItem>
          </TextField>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} disabled={loading}>
          Annuler
        </Button>
        <Button variant="contained" onClick={submit} disabled={!canSubmit || loading}>
          {loading ? <CircularProgress size={20} /> : 'Ajouter la tâche'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
