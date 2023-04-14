import { Flex, HStack, VStack } from "@react-native-material/core"
import { useCallback, useContext, useEffect, useState } from "react"
import { Image, KeyboardAvoidingView, Pressable, ScrollView, useWindowDimensions } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Avatar, Button, Text, useTheme } from "react-native-paper"
import Code from "react-native-qrcode-svg"
import CreateForm from "../Shared/CreateForm"
import ApplicationContext from "../ApplicationContext"
import * as Brightness from "expo-brightness"
import { useKeepAwake } from "expo-keep-awake"

export default ShowAttendanceCode = ({ navigation, route }) => {
  const theme = useTheme()
  const { getEvent } = route.params
  const { register, user } = useContext(ApplicationContext)

  const [actualBright, setActualBright] = useState()
  useKeepAwake()

  useEffect(() => {
    const bright = async () => {
      const { status } = await Brightness.requestPermissionsAsync()

      if (status === "granted") {
        setActualBright(await Brightness.getBrightnessAsync())
        Brightness.setSystemBrightnessAsync(1)
      }
    }

    bright()
  }, [])

  const QR = useCallback(
    () => (
      <Flex
        key="QR"
        center
        w={300}
        h={300}
        style={{ borderRadius: 50, overflow: "hidden", alignSelf: "center", backgroundColor: theme.colors.onBackground }}
      >
        {user?.avatar ? (
          <Image
            source={{ uri: `data:image/png;base64,${user?.avatar}` }}
            style={{ width: "100%", height: "100%", position: "absolute" }}
            blurRadius={5}
          />
        ) : null}
        <Code
          value={register}
          size={300}
          backgroundColor={theme.colors.code}
          color={theme.colors.background}
          quietZone={50}
        />
      </Flex>
    ),
    []
  )

  const Register = () => (
    <Text
      key="Register"
      variant="headlineSmall"
      style={{ textAlign: "center" }}
    >
      {register}
    </Text>
  )

  const ExitButton = useCallback(
    () => (
      <Button
        mode="contained"
        icon="close"
        onPress={async () => {
          await Brightness.setSystemBrightnessAsync(actualBright)
          getEvent()
          navigation.pop()
        }}
      >
        Salir
      </Button>
    ),
    [actualBright]
  )

  const ProximityModeButton = useCallback(
    () => (
      <Button
        mode="outlined"
        disabled={true}
        icon="human-greeting-proximity"
      >
        Tomar por proximidad
      </Button>
    ),
    []
  )

  return (
    <Flex fill>
      <CreateForm
        title="Tomar asistencia"
        loading={false}
        children={[QR(), Register()]}
        actions={[<ExitButton key="Exit" />, <ProximityModeButton key="ProximityMode" />]}
        navigation={navigation}
      />
    </Flex>
  )
}
