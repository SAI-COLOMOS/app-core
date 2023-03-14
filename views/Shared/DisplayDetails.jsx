import { Flex, VStack } from '@react-native-material/core'
import { Image, useWindowDimensions } from 'react-native'
import { Avatar, Card, Text, useTheme } from 'react-native-paper'
import { LinearGradient } from 'expo-linear-gradient'

export default SchoolDetails = ({ icon, title, children, actions, photo }) => {
  const { width } = useWindowDimensions()
  const theme = useTheme()

  return (
    <Flex fill>
      {photo ? (
        <Flex w={'100%'} h={width} style={{ position: 'absolute' }}>
          <Image source={{ uri: `data:image/png;base64,${photo}` }} style={{ width: '100%', height: '100%' }} blurRadius={5} />
          <LinearGradient colors={[theme.colors.cover, theme.colors.background]} style={{ width: '100%', height: '100%', position: 'absolute' }} />
        </Flex>
      ) : null}

      <VStack spacing={20} pt={50} pb={100} ph={20}>
        <Flex fill center>
          {photo ? <Avatar.Image source={{ uri: `data:image/png;base64,${photo}` }} size={150} /> : <Avatar.Icon icon={icon} size={150} />}
        </Flex>

        <Text variant="headlineSmall" style={{ textAlign: 'center' }}>
          {title}
        </Text>

        {children?.length > 0 ? children.map((child, index) => <Card key={index.toString()} mode="outlined" children={child} />) : null}

        {actions?.length > 0 ? actions.map((action, index) => <Flex key={index.toString()} children={action} />) : null}
      </VStack>
    </Flex>
  )
}
