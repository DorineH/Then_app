'use client'
import React, { useState, useEffect } from 'react'
import { Box } from '@mui/material'
import {
  MusicMoment,
  QuoteOfTheDay,
  DayProgram,
  NotificationsSection,
  MusicDialog,
} from '@/components/HomeSections'
import ServiceEmotions from './api/services/emotionService'
import ServiceTasks from './api/services/taskService'
import { useAuth } from './providers/auth-provider'
import { getUsers, getUsersByCouple, UserApi } from './api/services/authService'

export default function HomePage() {
  const [musicDialogOpen, setMusicDialogOpen] = useState(false)
  const [otherEmoji, setOtherEmoji] = useState<string | null>(null)
  const [userEmoji, setUserEmoji] = useState<string | null>(null)
  const [partnerName, setPartnerName] = useState<string>('Partenaire')
  const [userName, setUserName] = useState<string>('')
  const [events, setEvents] = useState<{ color: string; title: string; subtitle: string }[]>([])
  const { user } = useAuth()
  const notifications: string[] = []

  const quote = "L'amour n'est pas ce qu'on attend, mais ce qu'on construit ensemble chaque jour."
  const author = 'Antoine de Saint-Exupéry'

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.userId || !user?.coupleId) return
      try {
        // Récupère tous les users
        const users: UserApi[] = await getUsers()
        // Trouve l'utilisateur courant
        const current = users.find((u) => u.id === user.userId)
        if (current) setUserName(current.name)
        // Trouve le partenaire (même coupleId, userId différent)
        // const partner = users.find(u =>
        //   u.coupleId === user.coupleId &&
        //   u.id !== user.userId &&
        //   u.email !== user.email
        // );
        const coupleUsers = await getUsersByCouple()
        const partner = coupleUsers.find((u) => u.id !== user.userId)
        if (partner) setPartnerName(partner.name)
        // Récupère les emojis d'humeur
        const lastEmotions = await ServiceEmotions.getLastEmotionPerUser()
        // lastEmotions est un tableau, on cherche l'émotion du user et du partenaire
        let userEmotion = null
        let partnerEmotion = null
        if (Array.isArray(lastEmotions)) {
          userEmotion = lastEmotions.find((e) => e.userId === user.userId)
          if (partner) {
            partnerEmotion = lastEmotions.find((e) => e.userId === partner.id)
          }
        }
        if (userEmotion) {
          setUserEmoji(userEmotion.emoji)
        } else {
          setUserEmoji(null)
        }
        if (partnerEmotion) {
          setOtherEmoji(partnerEmotion.emoji)
        } else {
          setOtherEmoji(null)
        }
        // Récupère les tâches du partenaire pour aujourd'hui
        if (partner) {
          const today = new Date()
          const yyyy = today.getFullYear()
          const mm = String(today.getMonth() + 1).padStart(2, '0')
          const dd = String(today.getDate()).padStart(2, '0')
          const dateStr = `${yyyy}-${mm}-${dd}`
          const allTasks = await ServiceTasks.getTasks(dateStr)
          const partnerTasks = allTasks.filter((t) => t.userId === partner.id)
          setEvents(
            partnerTasks.map((t) => ({
              color: '#fde68a',
              title: t.title,
              subtitle: t.time ? `${t.time} - ${t.description || ''}` : t.description || '',
            }))
          )
        } else {
          setEvents([])
        }
      } catch (e) {
        setOtherEmoji(null)
        setUserEmoji(null)
        setPartnerName('Partenaire')
        setEvents([])
      }
    }
    fetchData()
  }, [user])

  return (
    <Box
      className="bg-gradient-to-br from-pink-100 to-blue-100"
    >
      <MusicMoment onPlay={() => setMusicDialogOpen(true)} partnerName={partnerName} />
      <QuoteOfTheDay quote={quote} author={author} />
      {/* enlever quand se sera fini */}
      {userName && (
        <Box mb={2}>
          <strong>Bienvenue {userName} !</strong>
          {userEmoji ? (
            <span style={{ fontSize: 40, marginLeft: 8 }}>{userEmoji}</span>
          ) : (
            <span style={{ fontSize: 16, marginLeft: 8, color: '#888' }}>
              (Aucune émotion aujourd&apos;hui)
            </span>
          )}
        </Box>
      )}
      <Box mb={2}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <strong style={{ textAlign: 'center' }}>Pour le moment {partnerName} ce sent :</strong>
          {otherEmoji ? (
            <span style={{ fontSize: 40, marginTop: 8, display: 'block', textAlign: 'center' }}>
              {otherEmoji}
            </span>
          ) : (
            <span
              style={{
                fontSize: 16,
                marginTop: 8,
                color: '#888',
                display: 'block',
                textAlign: 'center',
              }}
            >
              (Aucune émotion aujourd&apos;hui)
            </span>
          )}
          <a
            href="/emotions"
            style={{
              fontSize: 12,
              color: '#C8A1E0',
              textDecoration: 'none',
              marginTop: 4,
              display: 'inline-block',
            }}
          >
            Allez voir ---&gt;
          </a>
        </Box>
      </Box>
      <DayProgram events={events} partnerName={partnerName} />
      <NotificationsSection notifications={notifications} />
      <MusicDialog open={musicDialogOpen} onClose={() => setMusicDialogOpen(false)} />
    </Box>
  )
}
