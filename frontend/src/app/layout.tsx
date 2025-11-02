import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { Toaster } from 'react-hot-toast'
import { Analytics } from '@vercel/analytics/react'
import AuthProvider from '@/components/auth-provider'
import ChatbotWidget from '@/components/ui/chatbot-widget'
import GlobalErrorHandler from '@/components/GlobalErrorHandler'
import { LoadingWrapper } from '@/components/loading-wrapper'
import { InstallPWAPrompt } from '@/components/install-pwa-prompt'


const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CareerCraft AI - Your Personalized Career Navigator',
  description: 'AI-powered career guidance platform for Indian students. Get personalized career recommendations, skill gap analysis, and mentorship.',
  keywords: 'career guidance, AI career counseling, skill development, Indian students, career planning',
  authors: [{ name: 'CareerCraft AI Team' }],
  applicationName: 'CareerCraft AI',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'CareerCraft AI',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: 'CareerCraft AI - Your Personalized Career Navigator',
    description: 'Transform your career journey with AI-powered guidance',
    url: 'https://careercraft.ai',
    siteName: 'CareerCraft AI',
    images: [
      {
        url: 'https://careercraft.ai/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CareerCraft AI',
    description: 'AI-powered career guidance for Indian students',
    images: ['https://careercraft.ai/twitter-image.png'],
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/icon-152x152.png', sizes: '152x152', type: 'image/png' },
      { url: '/icons/icon-180x180.png', sizes: '180x180', type: 'image/png' },
    ],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <script src="https://checkout.razorpay.com/v1/checkout.js" defer />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#8b5cf6" />
        <meta name="msapplication-tap-highlight" content="no" />
      </head>
      <body className={inter.className}>
        <Providers>
          <AuthProvider>
            <LoadingWrapper>
              {children}
            </LoadingWrapper>
            <ChatbotWidget />
            <GlobalErrorHandler />
            <InstallPWAPrompt />
            <Toaster
              position="bottom-left"
              toastOptions={{
                className: '',
                style: {
                  background: '#18181b',
                  color: '#fff',
                  border: '1px solid #27272a',
                },
              }}
            />
          </AuthProvider>
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}