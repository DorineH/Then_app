import Link from "next/link";

export default function Animal() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-6">
  <h1 className="text-3xl font-bold" style={{ color: '#C8A1E0' }}>🐾 Oups, l&apos;animal virtuel fait sa sieste !</h1>
      <p className="text-lg max-w-md">
  Désolé, notre animal virtuel est encore en train d&apos;apprendre à faire des roulades et à ne pas manger vos chaussons.<br/>
        <span className="font-semibold">Mais pas de panique&nbsp;!</span> En attendant, venez défier votre cerveau sur <span className="font-bold">Emoji Mind</span> :<br/>
  Un jeu inspiré de Mastermind où il faut deviner la combinaison secrète d&apos;emojis.<br/>
  <span className="italic">(Promis, aucun emoji n&apos;a été maltraité pendant la création du jeu 🐶🐱)</span>
      </p>
      <Link href="/emojiMind">
        <button
          className="text-white font-bold py-2 px-4 rounded shadow"
          style={{ backgroundColor: '#C8A1E0' }}
        >
          Jouer à Emoji Mind 🎮
        </button>
      </Link>
    </div>
  );
}
