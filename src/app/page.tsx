'use client'
import React, { useState } from 'react'
import { Box } from '@mui/material'
import {
  MusicMoment,
  QuoteOfTheDay,
  MoodSection,
  DayProgram,
  NotificationsSection,
  MusicDialog,
} from '@/components/HomeSections'

export default function Home() {
  const [musicDialogOpen, setMusicDialogOpen] = useState(false)

  // Données en dur pour la maquette
  const quote = "L'amour n'est pas ce qu'on attend, mais ce qu'on construit ensemble chaque jour."
  const author = 'Antoine de Saint-Exupéry'
  const mood: 'happy' | 'neutral' | 'sad' | 'veryhappy' = 'happy'
  const events = [
    { color: '#fde68a', title: 'ALLER AU SPORT', subtitle: '8H00 - SÉANCE HAUT DU CORP' },
    { color: '#bbf7d0', title: 'FAIRE DES COURSES', subtitle: '14H00 - AU SUPER MARCHÉ' },
    { color: '#e9d5ff', title: 'APPEL DU SOIR', subtitle: '20H00 - APPEL VIDÉO QUOTIDIEN' },
  ]
  const notifications = ['Sarah a jouté une photo', 'Sarah a donné mangé à Snoop']

  return (
    <Box
      sx={{ bgcolor: '#fff', minHeight: '100vh', px: 2, pt: 2, pb: 8, maxWidth: 480, mx: 'auto' }}
    >
      <MusicMoment onPlay={() => setMusicDialogOpen(true)} />
      <QuoteOfTheDay quote={quote} author={author} />
      <MoodSection mood={mood} />
      <DayProgram events={events} />
      <NotificationsSection notifications={notifications} />
      <MusicDialog open={musicDialogOpen} onClose={() => setMusicDialogOpen(false)} />
    </Box>
  )
}
