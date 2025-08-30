'use client'

import { useEffect, useState } from 'react'
import { Box, Typography, Grid, CircularProgress } from '@mui/material'
import { EmojiEmotionPicker } from '@/components/EmojiEmotionPicker'
import { EmotionCard } from '@/components/EmotionCard'
import ServiceEmotions from '../api/services/emotionService'
import { ensureToken } from '../api/services/authService'

type Emotion = {
  emoji: string
  optionalMessage?: string
  userId: string
  createdAt: string
}

const DashboardCouple = () => {
  const [emotions, setEmotions] = useState<Emotion[]>([])
  const [lastUserEmotion, setLastUserEmotion] = useState<Emotion | null>(null)
  console.log('Last user emotion:', lastUserEmotion)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        await ensureToken()
        const [current, last] = await Promise.all([
          ServiceEmotions.getCurrentEmotions(),
          ServiceEmotions.getLastEmotionPerUser(),
        ])

        if (!mounted) return

        setEmotions(current || [])

        // Pour l’instant un seul user dynamique : on prend le premier élément
        // (quand on aura deux utilisateurs associés à un coupleId, => on choisira via userId du token)
        setLastUserEmotion((last && last[0]) || null)
      } catch (e) {
        console.error('Erreur load émotions:', e)
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  const handleSubmitEmotion = async (emoji: string, message?: string) => {
    // try {
    //   await ServiceEmotions.addEmotion({ emoji, optionalMessage: message });
    //   fetchData();
    // } catch (err) {
    //   console.error(err);
    // }
    try {
      await ServiceEmotions.addEmotion({ emoji, optionalMessage: message })
      // Recharger après envoi
      setLoading(true)
      const [current, last] = await Promise.all([
        ServiceEmotions.getCurrentEmotions(),
        ServiceEmotions.getLastEmotionPerUser(),
      ])
      setEmotions(current || [])
      setLastUserEmotion((last || []) as any)
    } catch (e) {
      console.error('Erreur add émotion:', e)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Box p={2} display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box p={{ xs: 1, sm: 2 }} maxWidth="sm" mx="auto" pb={{ xs: 10, sm: 4 }}>
      {/* Bandeau “en ce moment” */}
      <Typography variant="h5" align="center" mb={2} fontWeight="bold" color="primary">
        Partage d’émotion
      </Typography>

      <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-around"
        alignItems="center"
        bgcolor="white"
        borderRadius={2}
        p={2}
        mb={4}
        boxShadow={2}
        gap={2}
      >
        <Box textAlign="center">
          <Typography fontSize={{ xs: 32, sm: 40 }}>{lastUserEmotion?.emoji || '🙂'}</Typography>
          <Typography fontWeight="bold">Vous</Typography>
        </Box>

        <Typography fontSize={{ xs: 22, sm: 24 }} textAlign="center">
          ❤️
        </Typography>

        {/* partenaire statique pour l’instant */}
        <Box textAlign="center">
          <Typography fontSize={{ xs: 32, sm: 40 }}>😊</Typography>
          <Typography fontWeight="bold">Partenaire</Typography>
        </Box>
      </Box>

      {/* Bouton d'ajout juste sous la carte, aligné à gauche, petit espace */}
      <Box display="flex" justifyContent="flex-start" mt={1} mb={2}>
        <EmojiEmotionPicker onSubmit={handleSubmitEmotion} />
      </Box>

      {/* Historique */}
      <Typography variant="h6" mb={1} fontWeight="bold">
        Historique
      </Typography>
      <Grid container spacing={2}>
        {[...emotions]
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .map((e, idx) => (
            <Grid item xs={12} key={idx} sx={{ width: '100%' }}>
              <EmotionCard
                emoji={e.emoji}
                userName={
                  lastUserEmotion && e.userId === lastUserEmotion.userId ? 'Vous' : 'Partenaire'
                }
                optionalMessage={e.optionalMessage}
                createdAt={e.createdAt}
              />
            </Grid>
          ))}
      </Grid>
    </Box>
  )
}

export default DashboardCouple
