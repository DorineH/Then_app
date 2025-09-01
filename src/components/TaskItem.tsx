'use client'

import React, { useState } from 'react'
import { Paper, Stack, Checkbox, Box, Chip, Typography, IconButton } from '@mui/material'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import { Category, Task } from '@/interfaces/tasks/Tasks'
import ServiceTasks from '@/app/api/services/taskService'

const categoryColor: Record<Category, string> = {
  work: '#A7C7FF',
  personal: '#FFC6E0',
  appointment: '#B9E5C4',
  other: '#E6E6FA',
}

const categoryLabel: Record<Category, string> = {
  work: 'Travail',
  personal: 'Personnel',
  appointment: 'Rendez-vous',
  other: 'Autre',
}

export default function TaskItem({ task, onChanged }: { task: Task; onChanged: () => void }) {
  const [busy, setBusy] = useState(false)

  const remove = async () => {
    setBusy(true)
    try {
      await ServiceTasks.deleteTask(task.id)
      onChanged()
    } finally {
      setBusy(false)
    }
  }

  const toggleDone = async () => {
    setBusy(true)
    try {
      await ServiceTasks.updateTask(task.id, {
        done: !task.done,
      })
      onChanged()
    } catch {
      /* tolerate if PUT not ready */
    } finally {
      setBusy(false)
    }
  }

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 0.7, sm: 1.5 },
        borderRadius: { xs: 2, sm: 3 },
        border: '1px solid',
        borderColor: 'divider',
        mb: 0.5,
      }}
    >
      <Stack direction="row" alignItems="center" spacing={{ xs: 1, sm: 1.5 }}>
        <Checkbox checked={task.done} onChange={toggleDone} disabled={busy} />
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: { xs: 0.2, sm: 0.5 } }}>
            <Chip
              label={categoryLabel[task.category] || task.category}
              size="small"
              sx={{
                backgroundColor: categoryColor[task.category],
                fontSize: { xs: 10, sm: 13 },
                height: { xs: 20, sm: 24 },
                px: { xs: 0.5, sm: 1.5 },
              }}
            />
            {task.done && (
              <Chip
                label="Terminé"
                size="small"
                sx={{
                  fontSize: { xs: 10, sm: 13 },
                  height: { xs: 20, sm: 24 },
                  px: { xs: 0.5, sm: 1.5 },
                }}
              />
            )}
          </Stack>
          <Typography variant="subtitle2" noWrap sx={{ fontSize: { xs: 14, sm: 16 } }}>
            {task.title}
          </Typography>
          {(task.description || task.time) && (
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ mt: { xs: 0.1, sm: 0.25 } }}
            >
              {task.time && (
                <Stack direction="row" spacing={0.5} alignItems="center" sx={{ opacity: 0.8 }}>
                  <AccessTimeIcon fontSize="inherit" />
                  <Typography variant="caption" sx={{ fontSize: { xs: 11, sm: 13 } }}>
                    {task.time}
                  </Typography>
                </Stack>
              )}
              {task.description && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  noWrap
                  sx={{ fontSize: { xs: 11, sm: 13 } }}
                >
                  {task.description}
                </Typography>
              )}
            </Stack>
          )}
        </Box>
        {/* <Tooltip title="Notifier (à venir)">
          <span>
            <IconButton size="small" disabled>
              <NotificationsNoneIcon />
            </IconButton>
          </span>
        </Tooltip> */}
        <IconButton color="error" onClick={remove} disabled={busy}>
          <DeleteOutlineIcon />
        </IconButton>
      </Stack>
    </Paper>
  )
}
