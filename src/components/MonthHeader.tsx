'use client';
import React from 'react';
import { Stack, IconButton, Typography } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Dayjs } from 'dayjs';

export default function MonthHeader({ current, onPrev, onNext }: { current: Dayjs; onPrev: () => void; onNext: () => void; }) {
  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 1 }}>
      <IconButton onClick={onPrev}><ChevronLeftIcon /></IconButton>
      <Typography variant="h6">{current.format('MMMM YYYY')}</Typography>
      <IconButton onClick={onNext}><ChevronRightIcon /></IconButton>
    </Stack>
  );
}