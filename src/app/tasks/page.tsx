'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { ThemeProvider } from '@mui/material/styles'
import {
  IconButton,
  Typography,
  Container,
  Paper,
  Box,
  Stack,
  CircularProgress,
  Fab,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { dayjs } from '@/lib/dayjs'
import { appTheme } from '@/lib/theme'
import AddTaskDialog from '@/components/AddTaskDialog'
import TaskItem from '@/components/TaskItem'
import MonthHeader from '@/components/MonthHeader'
import MonthGrid from '@/components/MonthGrid'
import ServiceTasks from '../api/services/taskService'
import { Task } from '@/interfaces/tasks/Tasks'
import { Dayjs } from 'dayjs'
import { ensureToken } from '../api/services/authService'

const toISODate = (d: Dayjs) => dayjs(d).format('YYYY-MM-DD')

export default function Page() {
  const theme = useMemo(() => appTheme, [])

  const [month, setMonth] = useState(dayjs())
  const [selected, setSelected] = useState<string>(toISODate(dayjs()))
  const [addOpen, setAddOpen] = useState(false)

  const [tasks, setTasks] = useState<Task[] | []>([])
  const [tasksByDate, setTasksByDate] = useState<{
    [date: string]: { mine?: boolean; partner?: boolean }
  }>({})
  const [partnerName, setPartnerName] = useState<string>('Partenaire')
  // const [tasksByDate, setTasksByDate] = useState<TasksByDate>({})

  // ...existing code...
  const [isLoading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  // type TasksByDate = { [date: string]: { mine?: boolean; partner?: boolean } }

  const load = async (dateISO: string) => {
    setLoading(true)
    setError(null)
    try {
      const data = await ServiceTasks.getTasks(dateISO)
      setTasks(data as unknown as Task[])
    } catch {
      setError('Erreur lors du chargement des tâches.')
      setLoading(false)
    } finally {
      setLoading(false)
    }
  }

  // Récupère l'userId depuis le token JWT
  type JwtPayload = {
    userId?: string
    sub?: string
    [key: string]: unknown
  }

  const getUserId = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('then_token') : null
    if (!token) return null
    try {
      const decoded: JwtPayload = JSON.parse(atob(token.split('.')[1]))
      return decoded.userId || decoded.sub || null
    } catch {
      return null
    }
  }

  const loadMonthTasks = async (month: Dayjs) => {
    setLoading(true)
    setError(null)
    try {
      const year = month.year()
      const monthNum = month.month() + 1 // JS: janvier=0, API: janvier=1
      const data = await ServiceTasks.getTasksByMonth(year, monthNum)
      console.log('[DEBUG] tasksByMonth:', data)
      const userId = getUserId()
      // Récupérer les users du couple pour trouver le vrai partenaire
      let partnerId: string | null = null
      try {
        const res = await import('../api/services/authService')
        const { getUsersByCouple } = res
        const coupleUsers: { id: string; name?: string }[] = await getUsersByCouple()
        const partner = coupleUsers.find((u) => u.id !== userId)
        partnerId = partner?.id || null
        if (partner?.name) setPartnerName(partner.name)
      } catch (err) {
        console.log(err)
        partnerId = null
      }
      const byDate: { [date: string]: { mine?: boolean; partner?: boolean } } = {}
      data.forEach((task) => {
        if (!byDate[task.date]) byDate[task.date] = {}
        if (userId && task.userId === userId) byDate[task.date].mine = true
        // DEBUG: comparer les valeurs et leur type
        if (partnerId) {
          console.log(
            '[DEBUG] task.userId:',
            task.userId,
            'partnerId:',
            partnerId,
            'equal:',
            task.userId === partnerId,
            'typeof task.userId:',
            typeof task.userId,
            'typeof partnerId:',
            typeof partnerId
          )
          if (task.userId === partnerId) byDate[task.date].partner = true
        }
      })
      setTasksByDate(byDate)
    } catch {
      setError('Impossible de charger les tâches du mois.')
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

  const handleTaskCreated = (dateISO: string, newTask: Task) => {
    if (dateISO === selected) {
      setTasks((prev) => [...prev, newTask])
    }
    setTasksByDate((prev) => ({
      ...prev,
      [dateISO]: {
        ...(prev[dateISO] || {}),
        mine: true,
      },
    }))
  }
  useEffect(() => {
    loadMonthTasks(month)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month])

  const today = dayjs()
  const isCurrentMonth = (m: dayjs.Dayjs) =>
    m.year() === today.year() && m.month() === today.month()

  const onPrev = () => {
    setMonth((m) => {
      const newMonth = m.subtract(1, 'month')
      if (isCurrentMonth(newMonth)) {
        setSelected(toISODate(today))
      } else {
        setSelected(toISODate(newMonth.startOf('month')))
      }
      return newMonth
    })
  }

  const onNext = () => {
    setMonth((m) => {
      const newMonth = m.add(1, 'month')
      if (isCurrentMonth(newMonth)) {
        setSelected(toISODate(today))
      } else {
        setSelected(toISODate(newMonth.startOf('month')))
      }
      return newMonth
    })
  }

  const onSelect = (d: dayjs.Dayjs) => {
    setSelected(toISODate(d))
    setMonth(dayjs(d))
  }

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="fr">
        <Container  className="bg-gradient-to-br from-pink-100 to-blue-100" maxWidth="sm" sx={{ pb: { xs: 13, sm: 8 } }}>
          <Paper
            elevation={0}
            sx={{ mt: 1, p: 1, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}
          >
            <MonthHeader current={month} onPrev={onPrev} onNext={onNext} />
            <MonthGrid
              month={month}
              selected={selected}
              onSelect={onSelect}
              tasksByDate={tasksByDate}
            />
          </Paper>

          {/* Légende calendrier */}
          <Box display="flex" alignItems="center" gap={2} mt={1} mb={2} justifyContent="center">
            <Box display="flex" alignItems="center" gap={0.5}>
              <Box
                sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#ff69b4', mr: 0.5 }}
              />
              <Typography variant="caption">Moi</Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={0.5}>
              <Box
                sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#4caf50', mr: 0.5 }}
              />
              <Typography variant="caption">{partnerName}</Typography>
            </Box>
          </Box>

          <Box sx={{ mt: 2 }}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{ mb: 1 }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                {(() => {
                  const today = dayjs()
                  const selectedDate = dayjs(selected)
                  if (selectedDate.isSame(today, 'day')) return 'AUJOURD’HUI'
                  if (selectedDate.isSame(today.subtract(1, 'day'), 'day')) return 'HIER'
                  if (selectedDate.isSame(today.add(1, 'day'), 'day')) return 'DEMAIN'
                  // Format: vendredi 5 septembre
                  return selectedDate.locale('fr').format('dddd D MMMM')
                })()}
              </Typography>
              <Fab
                color="primary"
                aria-label="add"
                onClick={() => setAddOpen(true)}
                size="small"
                sx={{
                  ml: 2,
                  width: { xs: 40, sm: 44 },
                  height: { xs: 40, sm: 44 },
                  minHeight: 'unset',
                  boxShadow: 2,
                }}
              >
                <AddIcon sx={{ fontSize: { xs: 22, sm: 26 } }} />
              </Fab>
            </Stack>

            {isLoading && (
              <Stack alignItems="center" sx={{ py: 3 }}>
                <CircularProgress />
              </Stack>
            )}
            {error && (
              <MonthGrid
                month={month}
                selected={selected}
                onSelect={onSelect}
                tasksByDate={tasksByDate}
              />
              //   Impossible de charger les tâches.
              // </Typography>
            )}

            <Stack spacing={1.2}>
              {!isLoading && Array.isArray(tasks) && tasks.length > 0
                ? tasks
                    // On affiche toutes les tâches, terminées ou non
                    .sort((a, b) => Number(a.done) - Number(b.done)) // optionnel : les non terminées d'abord
                    .map((t) => <TaskItem key={t.id} task={t} onChanged={() => load(selected)} />)
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

        <AddTaskDialog
          open={addOpen}
          onClose={() => setAddOpen(false)}
          defaultDate={dayjs(selected)}
          onCreated={handleTaskCreated}
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
