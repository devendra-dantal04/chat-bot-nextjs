import Chat from '@/components/Chat'
import { Toaster } from "react-hot-toast"
import './globals.css'
import { Inter } from 'next/font/google'
import { Poppins } from 'next/font/google'
import Providers from '@/components/Providers'

const inter = Inter({ subsets: ['latin'] })
const poppins = Poppins({ subsets: ['latin'], weight: "400" })

export const metadata = {
  title: 'Bookbuddy',
  description: 'Your book store for fantasy & mystery novels',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <Providers>
        <body className={poppins.className}>
          <Toaster />
          <Chat />
          {children}
        </body>
      </Providers>
    </html>
  )
}
