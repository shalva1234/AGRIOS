import './globals.css'
import { Providers } from './providers'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'FarmLink Georgia - დაჯავშნეთ თქვენი ეკოლოგიურად სუფთა მოსავალი',
  description: 'დაუკავშირდით პირდაპირ ადგილობრივ ფერმერებს. წინასწარ შეუკვეთეთ ახალი, ორგანული, პესტიციდებისგან თავისუფალი საკვები. მხარი დაუჭირეთ მდგრად ფერმერობას.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{__html:'window.addEventListener("error",function(e){if(e.error instanceof DOMException&&e.error.name==="DataCloneError"&&e.message&&e.message.includes("PerformanceServerTiming")){e.stopImmediatePropagation();e.preventDefault()}},true);'}} />
      </head>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}