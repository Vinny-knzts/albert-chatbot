import './globals.css'

import { Open_Sans } from 'next/font/google'

const sans = Open_Sans({
  subsets: ['latin']
})

export const metadata = {
  title: 'Albert Chatbot'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={ sans.className }>
      { children }
      </body>
    </html>
  )
}
