'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { ThemeProvider } from '@mui/material/styles'
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Container,
  Paper,
  Box,
  Stack,
  CircularProgress,
  Fab,
  useMediaQuery,
} from '@mui/material'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import AddIcon from '@mui/icons-material/Add'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { dayjs } from '@/lib/dayjs'
import { appTheme } from '@/lib/theme'
import AddTaskDialog from '@/components/AddTaskDialog'
import TaskItem from '@/components/TaskItem'
import MonthHeader from '@/components/MonthHeader'
import MonthGrid from '@/components/MonthGrrid'
import ServiceTasks from '../api/services/taskService'
import { Task } from '@/interfaces/tasks/Tasks'
import { Dayjs } from 'dayjs'
import { ensureToken } from '../api/services/authService'

const toISODate = (d: Dayjs) => dayjs(d).format('YYYY-MM-DD')

export default function Page() {
  const theme = useMemo(() => appTheme, [])
  const isSmall = useMediaQuery('(max-width:480px)')

  const [month, setMonth] = useState(dayjs())
  const [selected, setSelected] = useState<string>(toISODate(dayjs()))
  const [addOpen, setAddOpen] = useState(false)

  const [tasks, setTasks] = useState<Task[] | []>([])
  console.log('Tasks state:', tasks)
  const [isLoading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const load = async (dateISO: string) => {
    setLoading(true)
    setError(null)
    try {
      console.log('Loading tasks for', dateISO)
      const data = await ServiceTasks.getTasks(dateISO)
      console.log('Tasks loaded for', dateISO, ':', data)
      setTasks(data as unknown as Task[])
    } catch (e) {
      console.error('Error loading tasks:', e)
      setError('Impossible de charger les tâches.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let cancelled = false
    const boot = async () => {
      setLoading(true)
      setError(null)
      try {
        await ensureToken()
        if (!cancelled) await load(selected)
      } catch (e) {
        console.error(e)
        if (!cancelled) setError('Authentification requise.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    boot()
    return () => {
      cancelled = true
    }
  }, [selected])

  const onPrev = () => setMonth((m) => m.subtract(1, 'month'))
  const onNext = () => setMonth((m) => m.add(1, 'month'))
  const onSelect = (d: dayjs.Dayjs) => {
    setSelected(toISODate(d))
    setMonth(dayjs(d))
  }

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="fr">
        <AppBar position="sticky" elevation={0} color="transparent">
          <Toolbar>
            <Typography variant="h6" sx={{ flex: 1 }}>
              THEN<span style={{ opacity: 0.5 }}>.</span>
            </Typography>
            <IconButton>
              <CalendarMonthIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        <Container maxWidth="sm" sx={{ pb: 8 }}>
          <Paper
            elevation={0}
            sx={{ mt: 1, p: 1, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}
          >
            <MonthHeader current={month} onPrev={onPrev} onNext={onNext} />
            <MonthGrid month={month} selected={selected} onSelect={onSelect} />
          </Paper>

          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
              AUJOURD’HUI
            </Typography>

            {isLoading && (
              <Stack alignItems="center" sx={{ py: 3 }}>
                <CircularProgress />
              </Stack>
            )}
            {error && (
              <Typography color="error" variant="body2">
                Impossible de charger les tâches.
              </Typography>
            )}

            <Stack spacing={1.2}>
              {!isLoading && Array.isArray(tasks) && tasks?.length > 0
                ? tasks.map((t) => (
                    <TaskItem key={t.id} task={t} onChanged={() => load(selected)} />
                  ))
                : !isLoading &&
                  !error && (
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: 3,
                        border: '1px dashed',
                        borderColor: 'divider',
                        textAlign: 'center',
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Aucune tâche pour ce jour. Ajoute ta première tâche !
                      </Typography>
                    </Paper>
                  )}
            </Stack>
          </Box>
        </Container>

        <Fab
          color="primary"
          aria-label="add"
          onClick={() => setAddOpen(true)}
          sx={{ position: 'fixed', bottom: isSmall ? 72 : 32, right: 24 }}
        >
          <AddIcon />
        </Fab>

        <AddTaskDialog
          open={addOpen}
          onClose={() => setAddOpen(false)}
          defaultDate={dayjs(selected)}
          onCreated={(d) => load(d)}
        />

        {/* Bottom nav placeholder to mimic the mockup */}
        <Paper elevation={3} sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}>
          <Container maxWidth="sm">
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{ py: 1 }}
            >
              <IconButton size="large">🏠</IconButton>
              <IconButton size="large">🐾</IconButton>
              <IconButton size="large">📷</IconButton>
              <IconButton size="large">💬</IconButton>
            </Stack>
          </Container>
        </Paper>
      </LocalizationProvider>
    </ThemeProvider>
  )
}
