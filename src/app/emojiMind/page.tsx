'use client'

import React from 'react';
import GameBoard from '../../components/GameBoard';

export default function EmojiMindPage() {
	return (
		<main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 to-blue-100">
			<GameBoard />
		</main>
	);
}
