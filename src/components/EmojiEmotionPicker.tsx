// components/EmojiEmotionPicker.tsx
'use client'

import { useState } from 'react'
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react'
import {
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
} from '@mui/material'

type Props = {
  onSubmit: (emoji: string, message?: string) => void
}

export const EmojiEmotionPicker = ({ onSubmit }: Props) => {
  const [open, setOpen] = useState(false)
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null)
  const [message, setMessage] = useState('')

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setSelectedEmoji(emojiData.emoji)
  }

  const handleSend = () => {
    if (selectedEmoji) {
      onSubmit(selectedEmoji, message || undefined)
      setOpen(false)
      setSelectedEmoji(null)
      setMessage('')
    }
  }

  return (
    <>
      <Button
        variant="contained"
        aria-label="Ajouter une émotion"
        onClick={() => setOpen(true)}
        sx={{
          minWidth: 120,
          fontWeight: 500,
          fontSize: { xs: 14, sm: 15 },
          borderRadius: 2,
          py: 0.8,
          px: 1.8,
          boxShadow: '0 2px 8px rgba(200,161,224,0.10)',
          textTransform: 'none',
          bgcolor: '#C8A1E0',
          letterSpacing: 0.2,
          transition: 'all 0.15s',
          '&:hover': { bgcolor: '#b88ad6', boxShadow: '0 4px 12px rgba(200,161,224,0.16)' },
        }}
      >
        Ajouter une émotion +
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Choisis ton émotion</DialogTitle>

        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2}>
            <EmojiPicker onEmojiClick={handleEmojiClick} />

            {selectedEmoji && (
              <Typography variant="h5" align="center">
                Emoji choisi : {selectedEmoji}
              </Typography>
            )}

            <TextField
              label="Message (optionnel)"
              fullWidth
              multiline
              rows={2}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Une pensée, un mot doux..."
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Annuler</Button>
          <Button variant="contained" disabled={!selectedEmoji} onClick={handleSend}>
            Envoyer
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
