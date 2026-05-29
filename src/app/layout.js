import './globals.css'

export const metadata = {
  title: 'LifeOS — AI Operating System for Your Future Life',
  description: 'Simulate your financial future. Scan listings for hidden costs. Compare life decisions with 20-year data.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;600;700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  )
}
