// components/EmotionCard.tsx
'use client'

import { Box, Typography, Paper, Stack } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

type EmotionCardProps = {
  emoji: string
  userName: string
  optionalMessage?: string
  createdAt: string
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  const now = new Date()

  const yesterday = new Date()
  yesterday.setDate(now.getDate() - 1)

  const isToday = date.toDateString() === now.toDateString()
  const isYesterday = date.toDateString() === yesterday.toDateString()

  if (isToday) return `Aujourd’hui à ${format(date, 'HH:mm')}`
  if (isYesterday) return `Hier à ${format(date, 'HH:mm')}`
  return format(date, "dd/MM/yyyy 'à' HH:mm", { locale: fr })
}

export const EmotionCard = ({ emoji, userName, optionalMessage, createdAt }: EmotionCardProps) => {
  const theme = useTheme()
  const isSelf = userName.toLowerCase() === 'vous'

  return (
    <Paper
      elevation={0}
      variant="outlined"
      sx={{
        width: '100%',
        minWidth: 0,
        boxSizing: 'border-box',
        p: { xs: 0.7, sm: 2 },
        borderRadius: 3,
        borderColor: alpha(theme.palette.divider, 0.8),
        boxShadow: '0 1px 2px rgba(73, 72, 72, 0.04)',
        transition: 'transform 120ms ease, box-shadow 120ms ease, border-color 120ms ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 6px 16px rgba(0,0,0,0.12)',
          borderColor: alpha(isSelf ? theme.palette.primary.main : theme.palette.grey[600], 0.4),
        },
      }}
    >
      <Stack direction="row" spacing={{ xs: 1, sm: 2 }} alignItems="center">
        {/* Avatar emoji */}
        <Box
          sx={{
            width: { xs: 34, sm: 48 },
            height: { xs: 34, sm: 48 },
            borderRadius: '50%',
            display: 'grid',
            placeItems: 'center',
            bgcolor: alpha(isSelf ? theme.palette.primary.main : theme.palette.grey[600], 0.12),
          }}
        >
          <Typography component="span" sx={{ fontSize: { xs: 20, sm: 28 }, lineHeight: 1 }}>
            {emoji}
          </Typography>
        </Box>

        <Box flex={1} minWidth={0}>
          {/* En-tête: nom + date */}
          <Stack direction="row" alignItems="baseline" justifyContent="space-between" gap={1}>
            <Typography variant="subtitle1" fontWeight={700} noWrap sx={{ fontSize: { xs: 15, sm: 17 } }}>
              {userName}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'nowrap', fontSize: { xs: 11, sm: 13 } }}>
              {formatDate(createdAt)}
            </Typography>
          </Stack>

          {/* Message en bulle */}
          {optionalMessage && (
            <Box
              sx={{
                mt: 0.7,
                p: { xs: 0.7, sm: 1.25 },
                borderRadius: 2,
                // bgcolor: alpha(isSelf ? theme.palette.primary.main : theme.palette.grey[600], 0.06),
                // border: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
              }}
            >
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: 13, sm: 15 } }}>
                {optionalMessage}
              </Typography>
            </Box>
          )}
        </Box>
      </Stack>
    </Paper>
  )
}
