'use client';

import React, { useState } from 'react';
import { Paper, Stack, Checkbox, Box, Chip, Typography, Tooltip, IconButton } from '@mui/material';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { Category, Task } from '@/interfaces/tasks/Tasks';
import ServiceTasks from '@/app/api/services/taskService';

const categoryColor: Record<Category, string> = {
  work: '#A7C7FF',
  personal: '#FFC6E0',
  appointment: '#B9E5C4',
  other: '#E6E6FA',
};

export default function TaskItem({ task, onChanged }: { task: Task; onChanged: () => void; }) {
  const [busy, setBusy] = useState(false);

  const remove = async () => {
    setBusy(true);
    try {
      await ServiceTasks.deleteTask(task.id);
      onChanged();
    } finally { setBusy(false); }
  };

  const toggleDone = async () => {
    setBusy(true);
    try {
      await ServiceTasks.updateTask(task.id, {
          done: !task.done,
          id: '',
          userId: '',
          coupleId: '',
          title: '',
          date: '',
          category: 'work',
          createdAt: '',
          updatedAt: ''
      });
      onChanged();
    } catch { /* tolerate if PUT not ready */ } finally { setBusy(false); }
  };

  return (
    <Paper elevation={0} sx={{ p: 1.5, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
      <Stack direction="row" alignItems="center" spacing={1.5}>
        <Checkbox checked={task.done} onChange={toggleDone} disabled={busy} />
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
            <Chip label={task.category} size="small" sx={{ backgroundColor: categoryColor[task.category] }} />
            {task.done && <Chip label="DONE" size="small" />}
          </Stack>
          <Typography variant="subtitle2" noWrap>{task.title}</Typography>
          {(task.description || task.time) && (
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.25 }}>
              {task.time && (
                <Stack direction="row" spacing={0.5} alignItems="center" sx={{ opacity: 0.8 }}>
                  <AccessTimeIcon fontSize="inherit" />
                  <Typography variant="caption">{task.time}</Typography>
                </Stack>
              )}
              {task.description && (
                <Typography variant="caption" color="text.secondary" noWrap>
                  {task.description}
                </Typography>
              )}
            </Stack>
          )}
        </Box>
        <Tooltip title="Notifier (à venir)">
          <span><IconButton size="small" disabled><NotificationsNoneIcon /></IconButton></span>
        </Tooltip>
        <IconButton color="error" onClick={remove} disabled={busy}><DeleteOutlineIcon /></IconButton>
      </Stack>
    </Paper>
  );
}