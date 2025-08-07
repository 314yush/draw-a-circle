import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
import { sdk } from '@farcaster/miniapp-sdk'

console.log('📦 [ROOT] SDK imported at root level:', typeof sdk, sdk ? 'available' : 'not available')

// Call ready() immediately at the root level - this is the key fix
console.log('🔄 [ROOT] Starting sdk.actions.ready() call at root level...')
sdk.actions.ready().then(() => {
  console.log('✅ [ROOT] sdk.actions.ready() called successfully at root level!')
}).catch((error) => {
  console.error('❌ [ROOT] Failed to call sdk.actions.ready() at root level:', error)
})

export const metadata: Metadata = {
  title: 'Perfect Circle Challenge',
  description: 'Test your precision by drawing the perfect circle. Challenge your friends to beat your score!',
  generator: 'Perfect Circle Challenge',
  manifest: '/manifest.json',
  icons: {
    icon: '/icon.jpg',
    apple: '/icon.jpg',
  },
  openGraph: {
    title: 'Perfect Circle Challenge',
    description: 'Test your precision by drawing the perfect circle. Challenge your friends to beat your score!',
    images: [
      {
        url: '/image.jpg',
        width: 1200,
        height: 800,
        alt: 'Perfect Circle Challenge Preview',
      },
    ],
  },
  other: {
    'fc:miniapp': JSON.stringify({
      version: '1',
      imageUrl: '/image.jpg',
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
      imageUrl: '/image.jpg',
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
  console.log('🏗️ [ROOT] RootLayout component rendering...')
  
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
