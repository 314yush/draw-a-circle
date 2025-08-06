import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'

export const metadata: Metadata = {
  title: 'Perfect Circle Challenge',
  description: 'Test your precision by drawing the perfect circle. Challenge your friends to beat your score!',
  generator: 'Perfect Circle Challenge',
  manifest: '/manifest.json',
  openGraph: {
    title: 'Perfect Circle Challenge',
    description: 'Test your precision by drawing the perfect circle. Challenge your friends to beat your score!',
    images: [
      {
        url: '/circle-challenge-preview.svg',
        width: 1200,
        height: 800,
        alt: 'Perfect Circle Challenge Preview',
      },
    ],
  },
  other: {
    'fc:miniapp': JSON.stringify({
      version: '1',
      imageUrl: '/circle-challenge-preview.svg',
      button: {
        title: 'Perfect Circle Challenge',
        action: {
          type: 'launch',
          url: '/'
        }
      }
    }),
    // For backward compatibility
    'fc:frame': JSON.stringify({
      version: '1',
      imageUrl: '/circle-challenge-preview.svg',
      button: {
        title: 'Perfect Circle Challenge',
        action: {
          type: 'launch',
          url: '/'
        }
      }
    })
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://auth.farcaster.xyz" />
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  )
}
