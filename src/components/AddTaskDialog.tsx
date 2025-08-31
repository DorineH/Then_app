'use client'

import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Stack,
  TextField,
  MenuItem,
  Button,
  CircularProgress,
  Typography,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { DatePicker, TimeField, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { Dayjs } from 'dayjs'
import ServiceTasks from '@/app/api/services/taskService'
import { Category, Task } from '@/interfaces/tasks/Tasks'

import { useEffect } from 'react'

export default function AddTaskDialog({
  open,
  onClose,
  defaultDate,
  onCreated,
}: {
  open: boolean
  onClose: () => void
  defaultDate: Dayjs
  onCreated: (dateISO: string, newTask: Task) => void
}) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState<Dayjs | null>(defaultDate)
  const [time, setTime] = useState<Dayjs | null>(null)
  const [category, setCategory] = useState<Category>('personal')
  const [loading, setLoading] = useState(false)

  // Synchronize date with defaultDate when dialog opens or defaultDate changes
  useEffect(() => {
    if (open && defaultDate) {
      setDate(defaultDate)
    }
  }, [open, defaultDate])

  const canSubmit = title.trim().length > 0 && !!date
  const submit = async () => {
    if (!canSubmit || !date) return
    setLoading(true)
    try {
      const taskResponse = await ServiceTasks.addTask({
        title: title.trim(),
        description: description.trim() || undefined,
        date: date.format('YYYY-MM-DD'),
        time: time ? time.format('HH:mm') : undefined,
        category,
        done: false,
      })
      // Map TaskResponse to Task
      const newTask: Task = {
        id: taskResponse.id,
        userId: taskResponse.userId,
        coupleId: taskResponse.coupleId,
        title: taskResponse.title,
        description: taskResponse.description,
        date: taskResponse.date,
        time: taskResponse.time,
        category: category,
        done: taskResponse.done,
        createdAt: taskResponse.createdAt ? new Date(taskResponse.createdAt) : new Date(),
        updatedAt: taskResponse.updatedAt ? new Date(taskResponse.updatedAt) : new Date(),
      }
      onCreated(date.format('YYYY-MM-DD'), newTask)
      onClose()
      setTitle('')
      setDescription('')
      setTime(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      PaperProps={{
        sx: {
          // borderRadius: { xs: 4, sm: 5 },
          m: { xs: 1, sm: 2 },
          width: { xs: '98vw', sm: 400 },
          maxWidth: '100vw',
        },
      }}
    >
      <DialogTitle sx={{ px: { xs: 2, sm: 3 }, py: { xs: 1.5, sm: 2 } }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h6" sx={{ fontSize: { xs: 18, sm: 22 } }}>
            Nouvelle tâche
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent dividers sx={{ px: { xs: 2, sm: 3 }, py: { xs: 1.5, sm: 2 } }}>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Titre"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            autoFocus
            size="medium"
            sx={{
              fontSize: { xs: 15, sm: 17 },
              borderRadius: 1,
              '& .MuiInputBase-root': { borderRadius: 1 },
            }}
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            minRows={2}
            size="medium"
            sx={{
              fontSize: { xs: 15, sm: 17 },
              borderRadius: 1,
              '& .MuiInputBase-root': { borderRadius: 1 },
            }}
          />
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="fr">
              <DatePicker
                label="Date"
                value={date}
                onChange={(newValue: Dayjs | null) => setDate(newValue)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: 'medium',
                    sx: {
                      borderRadius: 1,
                      '& .MuiInputBase-root': { borderRadius: 1 },
                      p: 0,
                    },
                  },
                }}
              />
            </LocalizationProvider>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="fr">
              <TimeField
                label="Heure"
                value={time}
                onChange={(newValue) => setTime(newValue)}
                format="HH:mm"
                ampm={false}
                fullWidth
                slotProps={{
                  textField: {
                    size: 'medium',
                    sx: {
                      borderRadius: 1,
                      '& .MuiInputBase-root': { borderRadius: 1 },
                      p: 0,
                    },
                  },
                }}
              />
            </LocalizationProvider>
          </Stack>
          <TextField
            select
            label="Catégorie"
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            fullWidth
            size="medium"
            sx={{
              fontSize: { xs: 15, sm: 17 },
              borderRadius: 1,
              '& .MuiInputBase-root': { borderRadius: 1 },
            }}
          >
            <MenuItem value="work">Travail</MenuItem>
            <MenuItem value="personal">Personnel</MenuItem>
            <MenuItem value="appointment">Rendez-vous</MenuItem>
            <MenuItem value="other">Autre</MenuItem>
          </TextField>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: { xs: 2, sm: 3 }, py: { xs: 1.5, sm: 2 } }}>
        <Button
          onClick={onClose}
          disabled={loading}
          sx={{ fontWeight: 700, color: 'primary.main' }}
        >
          Annuler
        </Button>
        <Button
          variant="contained"
          onClick={submit}
          disabled={!canSubmit || loading}
          sx={{
            borderRadius: 3,
            minWidth: 120,
            fontWeight: 700,
            fontSize: { xs: 15, sm: 17 },
          }}
        >
          {loading ? <CircularProgress size={20} /> : 'Ajouter la tâche'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
