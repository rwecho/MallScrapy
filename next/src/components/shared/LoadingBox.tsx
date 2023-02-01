import { Box, BoxProps } from '@chakra-ui/react'
import { BeatLoader } from 'react-spinners'

export type LoadingBoxProps = { isLoading: boolean } & BoxProps
export const LoadingBox = (props: LoadingBoxProps) => {
  const { children, isLoading, ...rest } = props
  return (
    <Box {...rest} pos={'relative'}>
      {/* todo: how to show with delay time and hilde immidiately */}
      {isLoading && (
        <Box
          bg="blackAlpha.100"
          //   backdropFilter="blur(1px) hue-rotate(200deg)"
          pos={'absolute'}
          display={'flex'}
          top={'0'}
          left={'0'}
          color={'white'}
          w={'full'}
          h={'full'}
          zIndex={999}
        >
          <Box mx={'auto'} mt={'200px'}>
            <BeatLoader />
          </Box>
        </Box>
      )}

      {children}
    </Box>
  )
}
