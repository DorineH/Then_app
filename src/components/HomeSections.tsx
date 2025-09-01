import React from 'react'
import {
  Box,
  Typography,
  Card,
  IconButton,
  Stack,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material'
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import FormatQuoteIcon from '@mui/icons-material/FormatQuote'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import YouTubeIcon from '@mui/icons-material/YouTube'

export function MusicMoment({ onPlay, partnerName }: { onPlay: () => void; partnerName?: string }) {
  return (
    <Box mb={2}>
      <Typography fontWeight={700} fontSize={18} mb={1}>
        Musique du moment {partnerName ? `de ${partnerName}` : ''}
      </Typography>
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: 0,
          mb: 1,
          p: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          border: '1.5px solid #e0e0e0',
        }}
      >
        <Box>
          <Typography fontWeight={700} fontSize={16}>
            TIMELESS
          </Typography>
          <Typography fontSize={14} color="text.secondary">
            THE WEEKND
          </Typography>
        </Box>
        <Stack direction="row" alignItems="center" gap={1}>
          <IconButton>
            <FavoriteBorderIcon sx={{ color: '#bdbdbd' }} />
          </IconButton>
          <IconButton onClick={onPlay}>
            <PlayCircleOutlineIcon sx={{ color: '#a084e8', fontSize: 32 }} />
          </IconButton>
        </Stack>
      </Card>
    </Box>
  )
}

export function QuoteOfTheDay({ quote, author }: { quote: string; author: string }) {
  return (
    <Box mb={2}>
      <Typography fontWeight={700} fontSize={18} mb={1}>
        Citation du jour
      </Typography>
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: 0,
          p: 2,
          display: 'flex',
          alignItems: 'start',
          border: '1.5px solid #e0e0e0',
        }}
      >
        <FormatQuoteIcon sx={{ color: '#a084e8', fontSize: 36, mr: 2 }} />
        <Box>
          <Typography fontSize={15} fontStyle="italic" mb={0.5}>
            &quot;{quote}&quot;
          </Typography>
          <Typography fontSize={13} color="text.secondary" align="right">
            — {author}
          </Typography>
        </Box>
      </Card>
    </Box>
  )
}

import { useRouter } from 'next/navigation'
const moodEmojiMap: Record<string, string> = {
  happy: '😊',
  neutral: '😐',
  sad: '😔',
  veryhappy: '😄',
}
export function MoodSection({ mood, partnerName }: { mood: 'happy' | 'neutral' | 'sad' | 'veryhappy'; partnerName?: string }) {
  const router = useRouter()
  return (
    <Box mb={2}>
      <Typography fontWeight={700} fontSize={18} mb={1}>
        Aller voir l&apos;humeur de {partnerName || 'votre partenaire'} et partagez la vôtre
      </Typography>
      <Box display="flex" justifyContent="center" alignItems="center" mb={1}>
        <Box
          component="button"
          onClick={() => router.push('/emotions')}
          sx={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            p: 0,
            m: 0,
            outline: 'none',
            fontSize: 60,
            lineHeight: 1,
            transition: 'transform 0.1s',
            '&:active': { transform: 'scale(0.95)' },
          }}
          aria-label="Ajouter une émotion"
        >
          {moodEmojiMap[mood]}
        </Box>
      </Box>
    </Box>
  )
}

export function DayProgram({
  events,
  partnerName
}: {
  events: { color: string; title: string; subtitle: string }[];
  partnerName?: string;
}) {
  return (
    <Box mb={2}>
      <Typography fontWeight={700} fontSize={18} mb={1}>
        Programme du jour de {partnerName || 'votre partenaire'}
      </Typography>
      {events.length === 0 ? (
        <Typography fontSize={15} color="text.secondary" align="center" sx={{ mt: 2 }}>
          Rien à faire aujourd&apos;hui
        </Typography>
      ) : (
        <Stack spacing={1}>
          {events.map((ev, i) => (
            <Card
              key={i}
              sx={{
                borderRadius: 3,
                boxShadow: 0,
                p: 1.5,
                border: '1.5px solid #e0e0e0',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: ev.color, mr: 1 }} />
              <Box>
                <Typography fontWeight={700} fontSize={15}>
                  {ev.title}
                </Typography>
                <Typography fontSize={13} color="text.secondary">
                  {ev.subtitle}
                </Typography>
              </Box>
            </Card>
          ))}
        </Stack>
      )}
    </Box>
  )
}

export function NotificationsSection({ notifications }: { notifications: string[] }) {
  return (
    <Box mb={2}>
      <Typography fontWeight={700} fontSize={18} mb={1}>
        Notifications
      </Typography>
      <Stack spacing={1}>
        {notifications.map((notif, i) => (
          <Card
            key={i}
            sx={{
              borderRadius: 3,
              boxShadow: 0,
              p: 1,
              border: '1.5px solid #e0e0e0',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <NotificationsNoneIcon sx={{ color: '#a084e8', mr: 1 }} />
            <Typography fontSize={14}>{notif}</Typography>
          </Card>
        ))}
      </Stack>
    </Box>
  )
}

export function MusicDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ textAlign: 'center', fontWeight: 700, fontSize: 18 }}>
        ALLEZ ÉCOUTER LA MUSIQUE SUR :
      </DialogTitle>
      <DialogContent sx={{ display: 'flex', justifyContent: 'center', gap: 3, py: 2 }}>
        <IconButton href="https://open.spotify.com/" target="_blank" rel="noopener">
          <SpotifyIcon width={48} height={48} />
        </IconButton>
        <IconButton href="https://youtube.com/" target="_blank" rel="noopener">
          <YouTubeIcon sx={{ fontSize: 48, color: '#e53935' }} />
        </IconButton>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
        <Button onClick={onClose} variant="outlined">
          Fermer
        </Button>
      </DialogActions>
    </Dialog>
  )
}

// Icône Spotify SVG (simple)
import { SVGProps } from 'react'
export function SpotifyIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="12" fill="#1ED760" />
      <path
        d="M17.5 16.5c-.2.3-.6.4-.9.2-2.5-1.5-5.7-1.8-9.4-.9-.4.1-.7-.1-.8-.5-.1-.4.1-.7.5-.8 4-1 7.5-.7 10.3 1 .3.2.4.6.3 1zM18.2 14.1c-.2.3-.5.4-.8.2-2.9-1.7-7.3-2.2-10.7-1-.4.1-.8-.1-.9-.5-.1-.4.1-.8.5-.9 3.8-1.3 8.7-.7 11.9 1.1.3.2.4.6.2.9zM18.3 11.6c-3.4-2-9-2.2-12.2-1.1-.5.2-1-.1-1.1-.5-.2-.5.1-1 .5-1.1 3.7-1.2 10-1 13.8 1.2.5.3.6.9.3 1.3-.2.3-.7.4-1.1.2z"
        fill="#fff"
      />
    </svg>
  )
}
