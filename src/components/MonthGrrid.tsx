'use client';
import React from 'react';
import { Grid, Typography, Button } from '@mui/material';
import { Dayjs } from 'dayjs';

const toISO = (d: Dayjs) => d.format('YYYY-MM-DD');

export default function MonthGrid({ month, selected, onSelect }: { month: Dayjs; selected: string; onSelect: (d: Dayjs) => void; }) {
  const start = month.startOf('month');
  const end = month.endOf('month');
  const firstDay = start.startOf('week');
  const days: Dayjs[] = [];
  for (let d = firstDay; d.isBefore(end.endOf('week')); d = d.add(1, 'day')) { days.push(d); }
  const isSelected = (d: Dayjs) => toISO(d) === selected;

  return (
    <Grid container columns={7} spacing={0.5} sx={{ px: 1, pb: 1 }}>
      {['LUN.', 'MAR.', 'MER.', 'JEU.', 'VEN.', 'SAM.', 'DIM.'].map((w) => (
        <Grid key={w} item xs={1}>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center' }}>{w}</Typography>
        </Grid>
      ))}
      {days.map((d) => {
        const inMonth = d.month() === month.month();
        const sel = isSelected(d);
        return (
          <Grid key={d.format('YYYY-MM-DD')} item xs={1}>
            <Button
              variant={sel ? 'contained' : 'text'}
              size="small"
              onClick={() => onSelect(d)}
              sx={{ width: '100%', minWidth: 0, borderRadius: 2, opacity: inMonth ? 1 : 0.4 }}
            >
              {d.date()}
            </Button>
          </Grid>
        );
      })}
    </Grid>
  );
}