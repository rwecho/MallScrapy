import {
  Box,
  Flex,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  IconButton,
  Divider,
  useDisclosure,
  Image,
  FlexProps,
  Spacer,
  Heading,
  LinkBox,
  LinkOverlay,
  Icon,
  Button,
  Link,
} from '@chakra-ui/react'
import {
  FullScreen,
  FullScreenHandle,
  useFullScreenHandle,
} from 'react-full-screen'
import { FiMenu } from 'react-icons/fi'
import {
  AiOutlineFullscreen,
  AiOutlineFullscreenExit,
  AiOutlineHome,
} from 'react-icons/ai'
import { ReactNode } from 'react'
import { MdHome } from 'react-icons/md'

type HeaderProps = FlexProps & {
  fullScreenHandle: FullScreenHandle
}
const Header = (props: HeaderProps) => {
  const { children, fullScreenHandle, ...rest } = props
  const handleEnterFullScreen = async () => {
    await fullScreenHandle.enter()
  }
  const handleExitFullScreen = async () => {
    await fullScreenHandle.exit()
  }
  return (
    <Flex {...rest} h={'48px'} alignItems={'center'}>
      {children}

      <Spacer></Spacer>

      {!fullScreenHandle.active && (
        <IconButton
          aria-label="full screen"
          onClick={handleEnterFullScreen}
          icon={<AiOutlineFullscreen></AiOutlineFullscreen>}
        ></IconButton>
      )}

      {fullScreenHandle.active && (
        <IconButton
          aria-label="exit full screen"
          onClick={handleExitFullScreen}
          icon={<AiOutlineFullscreenExit></AiOutlineFullscreenExit>}
        ></IconButton>
      )}
    </Flex>
  )
}

const Footer = () => {
  return <></>
}

const Logo = () => {
  return (
    <LinkBox>
      <LinkOverlay href="/">
        <Flex p={4} alignItems={'center'}>
          <Image src={'/next.svg'} alt="logo" maxH={'24px'}></Image>
          <Heading size={'md'} px={2}>
            {process.env.NEXT_PUBLIC_TITLE}
          </Heading>
        </Flex>
      </LinkOverlay>
    </LinkBox>
  )
}

const Menus = () => {
  const isActive = true
  const baseStyle = {
    color: isActive ? 'white' : undefined,
    bg: isActive ? 'teal.500' : undefined,
  }

  const _hoverStyle = {
    bg: 'teal.400',
    color: 'white',
  }
  return (
    <Link href={'/'}>
      <Box
        cursor={'pointer'}
        role={'group'}
        fontWeight={'semibold'}
        transition={'.15s ease'}
        _hover={{ ..._hoverStyle }}
        sx={baseStyle}
      >
        <Flex align="center" p={4}>
          <Icon me={2} boxSize={'4'} as={AiOutlineHome}></Icon>
          <Heading as="h5" size="sm" fontWeight={'normal'}>
            首页
          </Heading>
          <Spacer></Spacer>
        </Flex>
      </Box>
    </Link>
  )
}
const Navbar = (props: FlexProps) => {
  const { ...rest } = props

  return (
    <Flex {...rest} direction={'column'}>
      <Logo></Logo>
      <Menus></Menus>
      <Spacer></Spacer>
    </Flex>
  )
}

export const DefaultLayout = (props: { children: ReactNode }) => {
  const { children } = props

  const { isOpen, onOpen, onClose } = useDisclosure()
  const handle = useFullScreenHandle()

  return (
    <Flex direction="row" w={'full'}>
      <Navbar minW={'300px'} display={{ base: 'none', md: 'flex' }}></Navbar>
      <Drawer isOpen={isOpen} onClose={onClose} placement="left">
        <DrawerOverlay />
        <DrawerContent>
          <Navbar w="full" />
        </DrawerContent>
      </Drawer>
      <Flex direction={'column'} h="100vh" flex={'auto'} mx={4}>
        <FullScreen handle={handle}>
          <Header fullScreenHandle={handle}>
            <IconButton
              aria-label="Menu"
              display={{ base: 'inline-flex', md: 'none' }}
              onClick={onOpen}
              icon={<FiMenu />}
              size="sm"
            />
          </Header>

          <Divider my={2}></Divider>
          <Box flex={'auto'}>{children}</Box>
          <Footer></Footer>
        </FullScreen>
      </Flex>
    </Flex>
  )
}
