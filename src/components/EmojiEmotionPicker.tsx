// components/EmojiEmotionPicker.tsx
"use client"

import { useState } from "react";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import {
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
} from "@mui/material";

type Props = {
  onSubmit: (emoji: string, message?: string) => void;
};

export const EmojiEmotionPicker = ({ onSubmit }: Props) => {
  const [open, setOpen] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setSelectedEmoji(emojiData.emoji);
  };

  const handleSend = () => {
    if (selectedEmoji) {
      onSubmit(selectedEmoji, message || undefined);
      setOpen(false);
      setSelectedEmoji(null);
      setMessage("");
    }
  };

  return (
    <>
      <Button variant="contained" onClick={() => setOpen(true)}>
        Partager mon humeur
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
          <Button
            variant="contained"
            disabled={!selectedEmoji}
            onClick={handleSend}
          >
            Envoyer
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
