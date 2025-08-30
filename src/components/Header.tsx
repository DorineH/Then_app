// src/components/Header.tsx
'use client'
import { AppBar, IconButton, Toolbar, Typography } from '@mui/material'
import { Moon } from 'lucide-react'

export default function Header() {
  return (
    // <div className="flex items-center justify-between mb-6 md:mb-8 gap-3 flex-wrap">
    //   <div className="flex items-center gap-3">
    //     <h1 className="text-lg sm:text-xl font-bold">THEN .</h1>
    //   </div>
    //   <Moon className="w-6 h-6" />
    // </div>

    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: '#fff',
        background: 'rgba(255,255,255,0.97)',
        borderBottom: '1px solid #e5e7eb',
        zIndex: 1100,
      }}
    >
      <Toolbar>
        <Typography variant="h6" sx={{ flex: 1, color: '#111' }}>
          THEN<span style={{ opacity: 0.5, color: '#111' }}>.</span>
        </Typography>
        <IconButton>
          <Moon />
        </IconButton>
      </Toolbar>
    </AppBar>
  )
}
