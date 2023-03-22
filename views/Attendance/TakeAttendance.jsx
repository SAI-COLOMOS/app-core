import { Flex } from '@react-native-material/core'
import { useEffect } from 'react'
import { useHeaderHeight } from '@react-navigation/elements'
import { Button, Text } from 'react-native-paper'

export default TakeAttendance = ({ navigation, route }) => {
  const headerMargin = useHeaderHeight()

  useEffect(() => {
    navigation.setOptions({
      header: (props) => <Header {...props} />,
      headerTransparent: true,
      headerTitle: 'Tomar asistencia'
    })
  }, [])

  return (
    <Flex fill mt={headerMargin}>
      <Text>Hola</Text>
      <Button onPress={() => {
        navigation.navigate("ScanAttendance")
      }}>
        Scanner
      </Button>
    </Flex>
  )
}
