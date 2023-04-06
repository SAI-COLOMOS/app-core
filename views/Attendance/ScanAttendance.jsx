import { Flex, HStack, VStack } from "@react-native-material/core"
import { useContext, useEffect, useState } from "react"
import { KeyboardAvoidingView, Pressable, ScrollView, useWindowDimensions } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { ActivityIndicator, Button, Text, useTheme } from "react-native-paper"
import { Camera, CameraType } from "expo-camera"
import { BarCodeScanner } from "expo-barcode-scanner"
import InformationMessage from "../Shared/InformationMessage"
import CreateForm from "../Shared/CreateForm"
import ApplicationContext from "../ApplicationContext"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import Constants from "expo-constants"
import ProfileImage from "../Shared/ProfileImage"

export default ScanAttendance = ({ navigation, route }) => {
  const theme = useTheme()
  const localhost = Constants.expoConfig.extra.API_LOCAL
  const insets = useSafeAreaInsets()
  const { token } = useContext(ApplicationContext)
  const { attendeeList } = route.params

  const [register, setRegister] = useState("")
  const [attendee, setAttendee] = useState(undefined)
  const [processStatus, setProcessStatus] = useState("notFound")
  const [cameraPermissions, requestCameraPermission] = Camera.useCameraPermissions()

  if (!cameraPermissions) {
  }

  if (!cameraPermissions?.granted) {
  }

  async function onCodeScanned({ type, data }) {
    try {
      setProcessStatus("scanned")

      const resultado = attendeeList.find((elemento) => elemento.attendee_register === data)

      if (resultado != undefined) {
        const request = await fetch(`${localhost}/users/${data}`, {
          method: "GET",
          headers: {
            "Content-Type": "application-json",
            Authorization: `Bearer ${token}`,
            "Cache-control": "no-cache"
          }
        })

        if (request.ok) {
          const response = await request.json()
          setAttendee(response.user)
          setProcessStatus("found")
          return
        }

        setProcessStatus("error")
        return
      } else {
        setProcessStatus("notFound")
        return
      }
    } catch (error) {
      console.error("Scan attendance:", error)
      setProcessStatus("error")
      return
    }
  }

  useEffect(() => {
    console.log(cameraPermissions)
  }, [cameraPermissions])

  const ScanCamera = () => (
    <Flex
      key="ScanCamera"
      center
      style={{ borderRadius: 50, width: 300, height: 300, overflow: "hidden", alignSelf: "center" }}
    >
      <Camera
        ratio="4:3"
        style={{ width: 300, height: (300 * 4) / 3, position: "absolute" }}
        type={CameraType.back}
        barCodeScannerSettings={{ barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr] }}
        onBarCodeScanned={processStatus != "ready" ? undefined : onCodeScanned}
      />
    </Flex>
  )

  const StatusBar = () => (
    <>
      {
        {
          ready: <Ready />,
          scanned: <Scanned />,
          notFound: <NotFound />,
          found: <Found />
        }[processStatus]
      }
    </>
  )

  const Close = () => (
    <Button
      key="CloseButton"
      icon="close"
      mode="contained"
      onPress={() => navigation.pop()}
    >
      Cerrar
    </Button>
  )

  /* Componentes para los estados */
  const Ready = () => (
    <VStack
      key="NotFound"
      spacing={20}
    >
      <Flex center>
        <Icon
          name="qrcode-scan"
          color={theme.colors.onBackground}
          size={50}
        />
      </Flex>
      <Flex>
        <Text
          variant="titleLarge"
          style={{ textAlign: "center" }}
        >
          Todo listo para escanear
        </Text>
        <Text
          variant="bodyMedium"
          style={{ textAlign: "center" }}
        >
          Coloca el código QR dentro del recuadro y espera a que sea detectado
        </Text>
      </Flex>
    </VStack>
  )

  const Scanned = () => (
    <VStack key="Scanned">
      <Flex center>
        <ActivityIndicator size={50} />
      </Flex>
      <Text
        variant="titleLarge"
        style={{ textAlign: "center" }}
      >
        Comprobando usuario...
      </Text>
    </VStack>
  )

  const Found = () => (
    <VStack
      key="Found"
      spacing={20}
    >
      <Flex center>
        <ProfileImage image={attendee?.avatar} />
      </Flex>
      <Flex>
        <Text
          variant="titleLarge"
          style={{ textAlign: "center" }}
        >
          {attendee?.first_name} {attendee?.first_last_name} {attendee?.second_last_name ?? null}
        </Text>
        <Text
          variant="bodyMedium"
          style={{ textAlign: "center" }}
        >
          Usuario encontrado
        </Text>
      </Flex>
      <HStack justify="evenly">
        <Button
          mode="outlined"
          icon="close"
          onPress={() => setProcessStatus("ready")}
        >
          Cancelar
        </Button>
      </HStack>
    </VStack>
  )

  const NotFound = () => (
    <VStack
      key="NotFound"
      spacing={20}
    >
      <Flex center>
        <Icon
          name="account-question-outline"
          color={theme.colors.onBackground}
          size={50}
        />
      </Flex>
      <Flex>
        <Text
          variant="titleLarge"
          style={{ textAlign: "center" }}
        >
          ¡Ups!, no estás en la lista
        </Text>
        <Text
          variant="bodyMedium"
          style={{ textAlign: "center" }}
        >
          El registro {register} no fue encontrado, ¿Si está registrado en la lista de participantes?
        </Text>
      </Flex>
      <HStack justify="evenly">
        <Button
          mode="contained"
          onPress={() => setProcessStatus("ready")}
        >
          Continuar escaneando
        </Button>
      </HStack>
    </VStack>
  )

  return (
    <Flex fill>
      <CreateForm
        actions={[Close()]}
        title="Escaneo de asistencia"
        navigation={navigation}
        loading={false}
        children={[ScanCamera(), StatusBar()]}
      />
    </Flex>
  )
}
