import Head from 'next/head'
import { Inter } from '@next/font/google'

import { Home as HomePage } from '@/components'
const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const title = process.env.NEXT_PUBLIC_TITLE

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, user-scalable=no"
        />

        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <HomePage></HomePage>
    </>
  )
}
