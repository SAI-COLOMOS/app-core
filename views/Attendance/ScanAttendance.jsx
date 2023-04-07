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
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated"

export default ScanAttendance = ({ navigation, route }) => {
  const theme = useTheme()
  const localhost = Constants.expoConfig.extra.API_LOCAL
  const insets = useSafeAreaInsets()
  const { token } = useContext(ApplicationContext)
  const { attendeeList } = route.params

  const [register, setRegister] = useState("")
  const [attendee, setAttendee] = useState(undefined)
  const [loading, setLoading] = useState(false)
  const [processStatus, setProcessStatus] = useState("ready")
  const [cameraPermissions, requestCameraPermission] = Camera.useCameraPermissions()

  const animationConfiguration = { duration: 250, easing: Easing.bezier(0.5, 0.01, 0.75, 1) }
  const heightCameraView = useSharedValue(300)
  const opacityCameraView = useSharedValue(1)

  const animatedHeightCameraViewStyle = useAnimatedStyle(() => {
    return {
      height: withTiming(heightCameraView.value, animationConfiguration),
      opacity: withTiming(opacityCameraView.value, animationConfiguration)
    }
  })

  if (!cameraPermissions) {
    console.log("first", cameraPermissions)
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

  async function checkAttendance() {
    // TO-DO
    try {
    } catch (error) {}
  }

  useEffect(() => {
    if (processStatus == "ready") {
      heightCameraView.value = 250
      opacityCameraView.value = 1
    } else {
      heightCameraView.value = 0
      opacityCameraView.value = 0
    }
  }, [processStatus])

  const ScanCamera = () => (
    <>
      <Animated.View style={[{ overflow: "hidden" }, animatedHeightCameraViewStyle]}>
        <Flex
          key="ScanCamera"
          center
          style={{ borderRadius: 50, width: 250, height: "100%", overflow: "hidden", alignSelf: "center" }}
        >
          <Camera
            ratio="4:3"
            style={{ width: 300, height: (300 * 4) / 3, position: "absolute" }}
            type={CameraType.back}
            barCodeScannerSettings={{ barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr] }}
            onBarCodeScanned={processStatus != "ready" ? undefined : onCodeScanned}
          />
        </Flex>
      </Animated.View>
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
    </>
  )

  const AskForPermissions = () => {
    if (cameraPermissions?.canAskAgain == true) {
      return (
        <InformationMessage
          key="AskForPermissions"
          title="Sin permisos"
          icon="camera-outline"
          description="La aplicación no tiene permiso para usar la cámara, otorga los permisos necesarios para continuar"
          buttonTitle="Otorgar permisos"
          buttonIcon="shape-outline"
          action={async () => await requestCameraPermission()}
        />
      )
    } else {
      return (
        <InformationMessage
          key="AskForPermissions"
          title="Sin acceso"
          icon="camera-off-outline"
          description="El acceso a la cámara está bloqueado, para poder continuar, es necesario otorgues los permisos necesarios desde la aplicación de configuraciones del dispositivo"
          buttonTitle="Volver a intentar"
          buttonIcon="reload"
          action={async () => await requestCameraPermission()}
        />
      )
    }
  }

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
    <InformationMessage
      key="Ready"
      icon="qrcode-scan"
      title="Listo para escanear"
      description="Coloca el código QR dentro del recuadro y espera a que sea detectado"
      action={() => navigation.pop()}
      buttonTitle="Finalizar escaneo"
      buttonIcon="close"
    />
  )

  const Scanned = () => (
    <VStack
      center
      spacing={20}
      p={30}
    >
      <ActivityIndicator size={50} />
      <VStack center>
        <Text
          variant="headlineSmall"
          style={{ textAlign: "center" }}
        >
          Buscando usuario
        </Text>
        <Text
          variant="bodyMedium"
          style={{ textAlign: "center" }}
        >
          Estamos verificando con la base de datos que el usuario sí esté en la lista
        </Text>
      </VStack>
      <HStack spacing={20}>
        <Button
          icon="close"
          mode="outlined"
          textColor={theme.colors.error}
          style={{ opacity: 0 }}
        >
          Cancelar
        </Button>
      </HStack>
    </VStack>
  )

  const Found = () => (
    <VStack
      center
      spacing={20}
      p={30}
    >
      <ProfileImage
        image={attendee?.avatar}
        icon="account"
      />
      <VStack center>
        <Text
          variant="headlineSmall"
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
      </VStack>
      <HStack spacing={20}>
        <Button
          icon="close"
          mode="outlined"
          onPress={() => setProcessStatus("ready")}
          textColor={theme.colors.error}
        >
          Cancelar
        </Button>

        <Button
          icon="check"
          mode="contained"
          onPress={() => null}
        >
          Registrar asistencia
        </Button>
      </HStack>
    </VStack>
  )

  const NotFound = () => (
    <InformationMessage
      key="NotFound"
      icon="account-question-outline"
      title="¡Ups!, no estás en la lista"
      description={`El registro ${register} no fue encontrado, ¿Si está registrado en la lista de participantes?`}
      action={() => setProcessStatus("ready")}
      buttonTitle="Continuar"
      buttonIcon="arrow-right"
    />
  )

  return (
    <Flex fill>
      <CreateForm
        // actions={[Close()]}
        title="Escaneo de asistencia"
        navigation={navigation}
        loading={processStatus == "ready" ? false : true}
        children={cameraPermissions?.granted == true ? [ScanCamera()] : [AskForPermissions()]}
      />
    </Flex>
  )
}
