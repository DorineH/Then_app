// components/EmojiEmotionPicker.tsx
'use client'

import { useState } from 'react'
import EmojiPicker, { Categories, EmojiClickData, EmojiStyle } from 'emoji-picker-react'
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

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            m: { xs: 0, sm: 4 },
            width: { xs: '100vw', sm: 'auto' },
            height: { xs: '100vh', sm: 'auto' },
            maxWidth: { xs: '100vw', sm: 600 },
            maxHeight: { xs: '100vh', sm: '90vh' },
            borderRadius: { xs: 0, sm: 3 },
            p: { xs: 0, sm: 2 },
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      >
        <DialogTitle
          sx={{
            px: { xs: 2, sm: 3 },
            pt: { xs: 2, sm: 3 },
            pb: { xs: 1, sm: 2 },
            fontSize: { xs: 22, sm: 26 },
            textAlign: 'center',
          }}
        >
          Choisis ton émotion
        </DialogTitle>

        <DialogContent
          sx={{
            flex: 1,
            px: { xs: 1, sm: 3 },
            py: { xs: 1, sm: 2 },
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            overflowY: 'auto',
          }}
        >
          {selectedEmoji && (
            <Typography variant="h5" align="center" sx={{ mt: 1 }}>
              Tu es d&apos;humeur : {selectedEmoji}
            </Typography>
          )}
          <TextField
            label="Un Message pour détailler (optionnel)"
            fullWidth
            multiline
            rows={2}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Une pensée, un mot doux..."
            sx={{ mt: 1 }}
          />
          <Box sx={{ width: '100%', maxWidth: 420, mx: 'auto' }}>
            <EmojiPicker
              onEmojiClick={handleEmojiClick}
              width="100%"
              style={{ width: '100%', height: '350px' }}
              emojiStyle={EmojiStyle.NATIVE}
              categories={[
                { category: Categories.SMILEYS_PEOPLE, name: 'Personnes' },
                { category: Categories.ACTIVITIES, name: 'Activité' },
                { category: Categories.ANIMALS_NATURE, name: 'Nature' },
                { category: Categories.TRAVEL_PLACES, name: 'Lieux' },
              ]}
              reactionsDefaultOpen={true}
              lazyLoadEmojis
              emojiVersion="1.0"
              searchPlaceholder="Rechercher un emoji..."
              previewConfig={{
                showPreview: false,
              }}
            />
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            px: { xs: 2, sm: 3 },
            pb: { xs: 2, sm: 3 },
            pt: { xs: 1, sm: 2 },
            justifyContent: 'center',
          }}
        >
          <Button
            onClick={() => setOpen(false)}
            sx={{
              color: '#C8A1E0',
              fontWeight: 500,
              '&:hover': { bgcolor: '#b88ad6' },
              boxShadow: '0 2px 8px rgba(200,161,224,0.10)',
              textTransform: 'none',
            }}
          >
            Annuler
          </Button>
          <Button
            variant="contained"
            disabled={!selectedEmoji}
            onClick={handleSend}
            sx={{
              bgcolor: '#C8A1E0',
              color: '#fff',
              fontWeight: 500,
              '&:hover': { bgcolor: '#b88ad6' },
              boxShadow: '0 2px 8px rgba(200,161,224,0.10)',
              textTransform: 'none',
            }}
          >
            Envoyer
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
