import '@/styles/globals.css'
import Head from 'next/head'
import NextNProgress from 'nextjs-progressbar'
import type { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'

import theme from 'src/theme'
import { Provider } from 'react-redux'
import store from '@/store/store'

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>关键字采集</title>
      </Head>
      <NextNProgress
        color="#0079bf"
        startPosition={0.3}
        stopDelayMs={200}
        height={4}
      />

      <Provider store={store}>
        <ChakraProvider theme={theme}>
          <Component {...pageProps} />
        </ChakraProvider>
      </Provider>
    </>
  )
}
