'use client'
import React from 'react'
import Grid from '@mui/material/Grid'
import { Typography, Button, Box } from '@mui/material'
import { Dayjs } from 'dayjs'

const toISO = (d: Dayjs) => d.format('YYYY-MM-DD')

type TasksByDate = {
  [dateISO: string]: { mine?: boolean; partner?: boolean }
}

export default function MonthGrid({
  month,
  selected,
  onSelect,
  tasksByDate,
}: {
  month: Dayjs
  selected: string
  onSelect: (d: Dayjs) => void
  tasksByDate?: TasksByDate
}) {
  const start = month.startOf('month')
  const end = month.endOf('month')
  const firstDay = start.startOf('week')
  const lastDay = end.endOf('week')
  const days: Dayjs[] = []
  let d = firstDay
  while (d.isBefore(lastDay) || d.isSame(lastDay, 'day')) {
    days.push(d.clone())
    d = d.add(1, 'day')
  }
  const isSelected = (d: Dayjs) => toISO(d) === selected

  return (
    <>
      {/* Header: jours de la semaine */}
      <Grid container columns={7} spacing={0} sx={{ px: { xs: 0.5, sm: 1 } }}>
        {['LUN.', 'MAR.', 'MER.', 'JEU.', 'VEN.', 'SAM.', 'DIM.'].map((w) => (
          <Grid
            key={w}
            item
            xs={1}
            sx={{
              flexBasis: { xs: '14.28%', sm: '14.28%' },
              maxWidth: { xs: '14.28%', sm: '14.28%' },
              textAlign: 'center',
            }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                display: 'block',
                textAlign: 'center',
                fontSize: { xs: 11, sm: 13 },
                letterSpacing: 0.5,
              }}
            >
              {w}
            </Typography>
          </Grid>
        ))}
      </Grid>

      {/* Jours du mois */}
      <Grid container columns={7} spacing={0} sx={{ px: { xs: 0.5, sm: 1 }, pb: 1 }}>
        {days.map((d) => {
          const inMonth = d.month() === month.month()
          if (!inMonth)
            return (
              <Grid
                key={d.format('YYYY-MM-DD')}
                item
                xs={1}
                sx={{
                  flexBasis: { xs: '14.28%', sm: '14.28%' },
                  maxWidth: { xs: '14.28%', sm: '14.28%' },
                }}
              />
            )
          const sel = isSelected(d)
          const dateISO = toISO(d)
          const indicators = tasksByDate?.[dateISO]
          return (
            <Grid
              key={d.format('YYYY-MM-DD')}
              item
              xs={1}
              sx={{
                flexBasis: { xs: '14.28%', sm: '14.28%' },
                maxWidth: { xs: '14.28%', sm: '14.28%' },
                textAlign: 'center',
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Button
                  variant={sel ? 'contained' : 'text'}
                  size="small"
                  onClick={() => onSelect(d)}
                  sx={{
                    width: '100%',
                    minWidth: 0,
                    borderRadius: 2,
                    opacity: 1,
                    fontSize: { xs: 15, sm: 17 },
                    p: { xs: '2px 0', sm: '4px 0' },
                  }}
                >
                  {d.date()}
                </Button>
                {/* Indicateur de tâche */}
                <Box sx={{ display: 'flex', gap: 0.5, mt: 0.2, minHeight: 8 }}>
                  {indicators?.mine && (
                    <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: '#ff69b4' }} />
                  )}
                  {/* Always show green dot if partner has a task, even if mine is also true */}
                  {indicators?.partner && (
                    <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: '#4caf50' }} />
                  )}
                </Box>
              </Box>
            </Grid>
          )
        })}
      </Grid>
    </>
  )
}
