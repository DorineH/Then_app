// components/EmotionCard.tsx
"use client";

import { Box, Typography, Paper } from "@mui/material";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

type EmotionCardProps = {
  emoji: string;
  userName: string;
  optionalMessage?: string;
  createdAt: string;
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();

  const isToday = date.toDateString() === now.toDateString();
  const isYesterday = new Date(now.setDate(now.getDate() - 1)).toDateString() === date.toDateString();

  if (isToday) return `Aujourd’hui à ${format(date, "HH:mm")}`;
  if (isYesterday) return `Hier à ${format(date, "HH:mm")}`;
  return format(date, "dd/MM/yyyy 'à' HH:mm", { locale: fr });
};

export const EmotionCard = ({ emoji, userName, optionalMessage, createdAt }: EmotionCardProps) => (
  <Paper elevation={2} sx={{ p: 2, display: "flex", flexDirection: "column", gap: 0.5 }}>
    <Box display="flex" alignItems="center" gap={1}>
      <Typography variant="h5">{emoji}</Typography>
      <Typography variant="subtitle1" fontWeight="bold">
        {userName}
      </Typography>
    </Box>
    {optionalMessage && (
      <Typography variant="body2" color="text.secondary">
        {optionalMessage}
      </Typography>
    )}
    <Typography variant="caption" color="text.secondary">
      {formatDate(createdAt)}
    </Typography>
  </Paper>
);
