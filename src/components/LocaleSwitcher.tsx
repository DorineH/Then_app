// 'use client'

// import { usePathname, useRouter } from 'next/navigation'
// import { useLocale } from 'next-intl'
// import Image from 'next/image'

// const LocaleSwitcher = () => {
//   const router = useRouter()
//   const pathname = usePathname()
//   const locale = useLocale()

//   const switchTo = locale === 'fr' ? 'en' : 'fr'

//   const handleChange = () => {
//     const segments = pathname.split('/')
//     segments[1] = switchTo // remplace la locale dans l'URL
//     router.replace(segments.join('/'))
//   }

//   return (
//     <button
//       onClick={handleChange}
//       className="flex items-center gap-2 px-2 py-1 border border-gray-300 rounded-md shadow-sm hover:bg-gray-100 transition"
//       aria-label={`Changer la langue vers ${switchTo}`}
//     >
//       <Image
//         src={switchTo === 'fr' ? '/flags/fr.png' : '/flags/en.png'}
//         alt={switchTo === 'fr' ? 'Français' : 'English'}
//         width={20}
//         height={14}
//       />
//       <span className="text-sm font-medium uppercase">{switchTo}</span>
//     </button>
//   )
// }

// export default LocaleSwitcher
